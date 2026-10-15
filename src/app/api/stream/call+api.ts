import { getLanguageByCode } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { getClerkUserId } from "@/lib/server/clerkAuth";
import { getStreamServerClient } from "@/lib/server/stream";

type CallRequestBody = {
  lessonId?: string;
  userName?: string;
  userImage?: string;
};

// POST /api/stream/call
// Creates an audio-only Stream call for one lesson and one signed-in user.
// The app then joins the call with the returned `callId`.
export async function POST(request: Request) {
  const userId = await getClerkUserId(request);
  if (!userId) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as CallRequestBody;

  // The lesson and its language come from our own data, not from the app.
  const lesson = body.lessonId ? getLessonById(body.lessonId) : undefined;
  const language = lesson ? getLanguageByCode(lesson.languageCode) : undefined;
  if (!lesson || !language) {
    return Response.json({ error: "Lesson not found." }, { status: 404 });
  }

  try {
    const streamClient = getStreamServerClient();

    // Make sure the user exists in Stream before adding them to a call.
    await streamClient.upsertUsers([
      { id: userId, name: body.userName, image: body.userImage },
    ]);

    // A new id for every start, so one lesson can be practiced many times.
    const callId = `lesson-${lesson.id}-${crypto.randomUUID().slice(0, 8)}`;

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: userId,
        video: false,
        members: [{ user_id: userId }],
        custom: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          languageCode: language.code,
          languageName: language.name,
          teacherName: language.teacherName,
        },
        // Audio only: the app never turns the camera on, and it turns the
        // microphone on itself after joining so it can handle a denied permission.
        settings_override: {
          audio: { default_device: "speaker", mic_default_on: false },
        },
      },
    });

    return Response.json({ callId, callType: "default" });
  } catch (error) {
    console.error("Stream call failed", error);
    return Response.json(
      { error: "Could not start the call." },
      { status: 500 },
    );
  }
}
