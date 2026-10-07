import type { Lesson, LanguageCode } from "@/types/learning";

// Small beginner sample. To add a lesson, copy one below, give it a new id,
// and point `unitId` at a unit in `data/units.ts`.
export const lessons: Lesson[] = [
  // ───────────── Spanish · Unit 1: Hello, Spanish! ─────────────
  {
    id: "es-1-1",
    unitId: "es-unit-1",
    languageCode: "es",
    order: 1,
    title: "Greetings",
    emoji: "👋",
    description: "Say hello and goodbye like a local.",
    type: "video",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and goodbye",
      "Greet someone by time of day",
      "Ask how someone is doing",
    ],
    vocabulary: [
      { id: "es-1-1-v1", emoji: "👋", word: "hola", translation: "hello", pronunciation: "OH-lah" },
      { id: "es-1-1-v2", emoji: "🚶", word: "adiós", translation: "goodbye", pronunciation: "ah-dee-OHS" },
      { id: "es-1-1-v3", emoji: "🌅", word: "buenos días", translation: "good morning", pronunciation: "BWEH-nohs DEE-ahs" },
      { id: "es-1-1-v4", emoji: "🌙", word: "buenas noches", translation: "good night", pronunciation: "BWEH-nahs NOH-chehs" },
    ],
    phrases: [
      { id: "es-1-1-p1", text: "¿Cómo estás?", translation: "How are you?", pronunciation: "KOH-moh ehs-TAHS" },
      { id: "es-1-1-p2", text: "Muy bien, gracias.", translation: "Very well, thank you.", pronunciation: "mooy bee-EHN GRAH-see-ahs" },
    ],
    activities: [
      {
        id: "es-1-1-a1",
        type: "multiple-choice",
        prompt: 'What does "hola" mean?',
        options: ["hello", "goodbye", "please", "thank you"],
        correctAnswer: "hello",
      },
      {
        id: "es-1-1-a2",
        type: "multiple-choice",
        prompt: "How do you say “good morning”?",
        options: ["buenas noches", "buenos días", "adiós", "hola"],
        correctAnswer: "buenos días",
      },
      {
        id: "es-1-1-a3",
        type: "translation",
        prompt: "How are you?",
        answer: "¿Cómo estás?",
      },
      {
        id: "es-1-1-a4",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "Muy bien, gracias.",
        translation: "Very well, thank you.",
      },
    ],
    aiTeacher: {
      openingLine: "¡Hola! Soy Sofía, tu profesora de español. Hello! I'm Sofía, your Spanish teacher. Ready to learn greetings?",
      instructions:
        "You are Sofía, a warm and patient Spanish teacher on a live video call with a complete beginner who speaks English. " +
        "Teach these words one at a time: hola, adiós, buenos días, buenas noches. Then practice the phrases '¿Cómo estás?' and 'Muy bien, gracias.' " +
        "Speak mostly English with short Spanish phrases. Say each Spanish word slowly, ask the learner to repeat it, and give gentle feedback on pronunciation. " +
        "Keep every reply under two sentences. Celebrate small wins. Finish by asking the learner to greet you in Spanish.",
    },
  },
  {
    id: "es-1-2",
    unitId: "es-unit-1",
    languageCode: "es",
    order: 2,
    title: "Introduce Yourself",
    emoji: "🙋",
    description: "Tell people your name and ask theirs.",
    type: "audio",
    xpReward: 15,
    estimatedMinutes: 6,
    goals: [
      "Say your name",
      "Ask someone's name",
      "Say you are happy to meet them",
    ],
    vocabulary: [
      { id: "es-1-2-v1", emoji: "🏷️", word: "me llamo", translation: "my name is", pronunciation: "meh YAH-moh" },
      { id: "es-1-2-v2", emoji: "👉", word: "tú", translation: "you", pronunciation: "too" },
      { id: "es-1-2-v3", emoji: "🤝", word: "mucho gusto", translation: "nice to meet you", pronunciation: "MOO-choh GOOS-toh" },
    ],
    phrases: [
      { id: "es-1-2-p1", text: "Me llamo Ana.", translation: "My name is Ana.", pronunciation: "meh YAH-moh AH-nah" },
      { id: "es-1-2-p2", text: "¿Cómo te llamas?", translation: "What is your name?", pronunciation: "KOH-moh teh YAH-mahs" },
    ],
    activities: [
      {
        id: "es-1-2-a1",
        type: "multiple-choice",
        prompt: 'What does "mucho gusto" mean?',
        options: ["see you later", "nice to meet you", "good night", "how are you"],
        correctAnswer: "nice to meet you",
      },
      {
        id: "es-1-2-a2",
        type: "translation",
        prompt: "My name is Ana.",
        answer: "Me llamo Ana.",
      },
      {
        id: "es-1-2-a3",
        type: "speaking",
        prompt: "Ask for the teacher's name:",
        targetText: "¿Cómo te llamas?",
        translation: "What is your name?",
      },
    ],
    aiTeacher: {
      openingLine: "¡Hola de nuevo! Today we will learn to say our names. Listen first, then repeat after me.",
      instructions:
        "You are Sofía, a friendly Spanish teacher in an audio-only lesson with an English-speaking beginner. " +
        "Teach 'me llamo', '¿Cómo te llamas?' and 'mucho gusto'. Model a short role-play: you introduce yourself, then ask the learner to do the same with their own name. " +
        "Because there is no video, describe nothing visual. Speak slowly, repeat key phrases twice, and keep replies to one or two sentences. " +
        "If the learner makes a mistake, repeat the correct version once and move on.",
    },
  },

  // ───────────── Spanish · Unit 2: Food & Drinks ─────────────
  {
    id: "es-2-1",
    unitId: "es-unit-2",
    languageCode: "es",
    order: 1,
    title: "At the Café",
    emoji: "☕",
    description: "Order a drink and a snack politely.",
    type: "chat",
    xpReward: 15,
    estimatedMinutes: 7,
    goals: [
      "Name common foods and drinks",
      "Order something politely",
      "Ask for the bill",
    ],
    vocabulary: [
      { id: "es-2-1-v1", emoji: "💧", word: "el agua", translation: "water", pronunciation: "ehl AH-gwah" },
      { id: "es-2-1-v2", emoji: "☕", word: "el café", translation: "coffee", pronunciation: "ehl kah-FEH" },
      { id: "es-2-1-v3", emoji: "🍞", word: "el pan", translation: "bread", pronunciation: "ehl pahn" },
      { id: "es-2-1-v4", emoji: "🙏", word: "por favor", translation: "please", pronunciation: "pohr fah-VOHR" },
    ],
    phrases: [
      { id: "es-2-1-p1", text: "Quiero un café, por favor.", translation: "I want a coffee, please.", pronunciation: "kee-EH-roh oon kah-FEH pohr fah-VOHR" },
      { id: "es-2-1-p2", text: "La cuenta, por favor.", translation: "The bill, please.", pronunciation: "lah KWEHN-tah pohr fah-VOHR" },
    ],
    activities: [
      {
        id: "es-2-1-a1",
        type: "multiple-choice",
        prompt: 'What does "el pan" mean?',
        options: ["water", "coffee", "bread", "milk"],
        correctAnswer: "bread",
      },
      {
        id: "es-2-1-a2",
        type: "translation",
        prompt: "I want a coffee, please.",
        answer: "Quiero un café, por favor.",
      },
      {
        id: "es-2-1-a3",
        type: "multiple-choice",
        prompt: "How do you ask for the bill?",
        options: ["La cuenta, por favor.", "Quiero agua.", "Mucho gusto.", "Buenas noches."],
        correctAnswer: "La cuenta, por favor.",
      },
    ],
    aiTeacher: {
      openingLine: "¡Bienvenido al café! I'm your waiter today. Try ordering something in Spanish!",
      instructions:
        "You are Sofía, playing a friendly waiter in a café while teaching a beginner through text chat. " +
        "Start the role-play and offer water, coffee, and bread. Encourage the learner to order in Spanish using 'Quiero ... , por favor.' " +
        "After each learner message, reply in character with one short Spanish line, then a brief English tip or correction in parentheses. " +
        "Use only vocabulary from this lesson: el agua, el café, el pan, por favor, la cuenta. End by helping them ask for the bill.",
    },
  },
  {
    id: "es-2-2",
    unitId: "es-unit-2",
    languageCode: "es",
    order: 2,
    title: "Food Review",
    emoji: "🍎",
    description: "Practice the food words you have learned.",
    type: "review",
    xpReward: 10,
    estimatedMinutes: 4,
    goals: [
      "Remember food and drink words",
      "Use 'por favor' naturally",
    ],
    vocabulary: [
      { id: "es-2-2-v1", emoji: "🍎", word: "la manzana", translation: "apple", pronunciation: "lah mahn-SAH-nah" },
      { id: "es-2-2-v2", emoji: "🥛", word: "la leche", translation: "milk", pronunciation: "lah LEH-cheh" },
      { id: "es-2-2-v3", emoji: "💧", word: "el agua", translation: "water", pronunciation: "ehl AH-gwah" },
    ],
    phrases: [
      { id: "es-2-2-p1", text: "Me gusta la manzana.", translation: "I like the apple.", pronunciation: "meh GOOS-tah lah mahn-SAH-nah" },
    ],
    activities: [
      {
        id: "es-2-2-a1",
        type: "multiple-choice",
        prompt: 'What does "la leche" mean?',
        options: ["milk", "apple", "bread", "coffee"],
        correctAnswer: "milk",
      },
      {
        id: "es-2-2-a2",
        type: "translation",
        prompt: "I like the apple.",
        answer: "Me gusta la manzana.",
      },
      {
        id: "es-2-2-a3",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "Me gusta la manzana.",
        translation: "I like the apple.",
      },
    ],
    aiTeacher: {
      openingLine: "¡Vamos a repasar! Let's review the food words you know.",
      instructions:
        "You are Sofía running a quick vocabulary review with an English-speaking beginner. " +
        "Quiz the learner on: la manzana, la leche, el agua, and the words from the café lesson (el café, el pan). " +
        "Ask one question at a time, such as 'How do you say milk in Spanish?'. Confirm correct answers briefly and repeat the right answer after mistakes. " +
        "Keep replies to one or two sentences.",
    },
  },

  // ───────────── French · Unit 1: Bonjour, France! ─────────────
  {
    id: "fr-1-1",
    unitId: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Saying Hello",
    emoji: "🥐",
    description: "Greet people in French.",
    type: "video",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and goodbye",
      "Greet someone in the evening",
      "Ask how someone is",
    ],
    vocabulary: [
      { id: "fr-1-1-v1", emoji: "👋", word: "bonjour", translation: "hello / good day", pronunciation: "bohn-ZHOOR" },
      { id: "fr-1-1-v2", emoji: "🌆", word: "bonsoir", translation: "good evening", pronunciation: "bohn-SWAHR" },
      { id: "fr-1-1-v3", emoji: "🚶", word: "au revoir", translation: "goodbye", pronunciation: "oh ruh-VWAHR" },
    ],
    phrases: [
      { id: "fr-1-1-p1", text: "Comment ça va ?", translation: "How are you?", pronunciation: "koh-mahn sah VAH" },
      { id: "fr-1-1-p2", text: "Ça va bien, merci.", translation: "I'm fine, thank you.", pronunciation: "sah vah bee-AN mehr-SEE" },
    ],
    activities: [
      {
        id: "fr-1-1-a1",
        type: "multiple-choice",
        prompt: 'What does "bonjour" mean?',
        options: ["hello", "goodbye", "thank you", "please"],
        correctAnswer: "hello",
      },
      {
        id: "fr-1-1-a2",
        type: "translation",
        prompt: "How are you?",
        answer: "Comment ça va ?",
      },
      {
        id: "fr-1-1-a3",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "Ça va bien, merci.",
        translation: "I'm fine, thank you.",
      },
    ],
    aiTeacher: {
      openingLine: "Bonjour ! Je m'appelle Camille. Hello! I'm Camille, your French teacher.",
      instructions:
        "You are Camille, a cheerful French teacher on a live video call with an English-speaking beginner. " +
        "Teach bonjour, bonsoir, au revoir, then practice 'Comment ça va ?' and 'Ça va bien, merci.' " +
        "Speak mostly English with short French phrases. Say each word slowly, ask the learner to repeat, and gently correct pronunciation, especially the French 'r'. " +
        "Keep replies under two sentences and finish by asking the learner to greet you in French.",
    },
  },
  {
    id: "fr-1-2",
    unitId: "fr-unit-1",
    languageCode: "fr",
    order: 2,
    title: "Being Polite",
    emoji: "🙏",
    description: "Say please, thank you, and excuse me.",
    type: "audio",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say please and thank you",
      "Apologize politely",
    ],
    vocabulary: [
      { id: "fr-1-2-v1", emoji: "🙏", word: "s'il vous plaît", translation: "please", pronunciation: "seel voo PLEH" },
      { id: "fr-1-2-v2", emoji: "💐", word: "merci", translation: "thank you", pronunciation: "mehr-SEE" },
      { id: "fr-1-2-v3", emoji: "🙇", word: "excusez-moi", translation: "excuse me", pronunciation: "ehk-skew-zay MWAH" },
    ],
    phrases: [
      { id: "fr-1-2-p1", text: "Merci beaucoup.", translation: "Thank you very much.", pronunciation: "mehr-SEE boh-KOO" },
    ],
    activities: [
      {
        id: "fr-1-2-a1",
        type: "multiple-choice",
        prompt: 'What does "merci" mean?',
        options: ["please", "thank you", "excuse me", "goodbye"],
        correctAnswer: "thank you",
      },
      {
        id: "fr-1-2-a2",
        type: "translation",
        prompt: "Thank you very much.",
        answer: "Merci beaucoup.",
      },
    ],
    aiTeacher: {
      openingLine: "Bonjour ! Today we'll learn how to be polite in French. Listen, then repeat.",
      instructions:
        "You are Camille, a friendly French teacher in an audio-only lesson with an English-speaking beginner. " +
        "Teach 's'il vous plaît', 'merci', 'excusez-moi' and 'merci beaucoup'. Run a mini role-play where the learner asks for something politely. " +
        "Speak slowly, repeat key phrases twice, and keep replies to one or two sentences. Correct mistakes once, then move on.",
    },
  },

  // ───────────── Japanese · Unit 1: Konnichiwa! ─────────────
  {
    id: "ja-1-1",
    unitId: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Greetings",
    emoji: "🎌",
    description: "Say hello and goodbye in Japanese.",
    type: "video",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and good morning",
      "Say goodbye",
      "Bow and greet politely",
    ],
    vocabulary: [
      { id: "ja-1-1-v1", emoji: "☀️", word: "こんにちは", translation: "hello", pronunciation: "kon-ni-chi-wa" },
      { id: "ja-1-1-v2", emoji: "🌅", word: "おはよう", translation: "good morning", pronunciation: "o-ha-yo-u" },
      { id: "ja-1-1-v3", emoji: "👋", word: "さようなら", translation: "goodbye", pronunciation: "sa-yo-u-na-ra" },
    ],
    phrases: [
      { id: "ja-1-1-p1", text: "お元気ですか？", translation: "How are you?", pronunciation: "o-gen-ki de-su ka" },
      { id: "ja-1-1-p2", text: "元気です。", translation: "I'm fine.", pronunciation: "gen-ki de-su" },
    ],
    activities: [
      {
        id: "ja-1-1-a1",
        type: "multiple-choice",
        prompt: 'What does "こんにちは" mean?',
        options: ["hello", "goodbye", "thank you", "good night"],
        correctAnswer: "hello",
      },
      {
        id: "ja-1-1-a2",
        type: "multiple-choice",
        prompt: "How do you say “good morning”?",
        options: ["さようなら", "こんにちは", "おはよう", "ありがとう"],
        correctAnswer: "おはよう",
      },
      {
        id: "ja-1-1-a3",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "こんにちは",
        translation: "Hello",
      },
    ],
    aiTeacher: {
      openingLine: "こんにちは！ I'm Yuki, your Japanese teacher. Let's learn how to say hello!",
      instructions:
        "You are Yuki, an encouraging Japanese teacher on a live video call with an English-speaking beginner. " +
        "Teach こんにちは, おはよう, さようなら, then practice 'お元気ですか？' and '元気です。' " +
        "Always give the romaji next to Japanese words (for example: konnichiwa). Speak mostly English, say each word slowly, and ask the learner to repeat. " +
        "Mention that a small bow is a polite way to greet someone. Keep replies under two sentences.",
    },
  },
  {
    id: "ja-1-2",
    unitId: "ja-unit-1",
    languageCode: "ja",
    order: 2,
    title: "Thank You",
    emoji: "💐",
    description: "Learn to say thanks and you're welcome.",
    type: "audio",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say thank you",
      "Reply with you're welcome",
    ],
    vocabulary: [
      { id: "ja-1-2-v1", emoji: "🙏", word: "ありがとう", translation: "thank you", pronunciation: "a-ri-ga-to-u" },
      { id: "ja-1-2-v2", emoji: "😊", word: "どういたしまして", translation: "you're welcome", pronunciation: "do-u-i-ta-shi-ma-shi-te" },
      { id: "ja-1-2-v3", emoji: "🙇", word: "すみません", translation: "excuse me / sorry", pronunciation: "su-mi-ma-sen" },
    ],
    phrases: [
      { id: "ja-1-2-p1", text: "ありがとうございます。", translation: "Thank you very much.", pronunciation: "a-ri-ga-to-u go-za-i-ma-su" },
    ],
    activities: [
      {
        id: "ja-1-2-a1",
        type: "multiple-choice",
        prompt: 'What does "ありがとう" mean?',
        options: ["thank you", "hello", "goodbye", "excuse me"],
        correctAnswer: "thank you",
      },
      {
        id: "ja-1-2-a2",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "ありがとうございます。",
        translation: "Thank you very much.",
      },
    ],
    aiTeacher: {
      openingLine: "こんにちは！ Today we'll learn how to say thank you. Listen, then repeat after me.",
      instructions:
        "You are Yuki, a kind Japanese teacher in an audio-only lesson with an English-speaking beginner. " +
        "Teach ありがとう, どういたしまして, すみません and ありがとうございます. Always say the romaji too. " +
        "Run a short role-play: you hand the learner something and they thank you, then you reply どういたしまして. " +
        "Speak slowly, repeat key words twice, and keep replies to one or two sentences.",
    },
  },
];

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsByLanguage(languageCode: LanguageCode): Lesson[] {
  return lessons.filter((lesson) => lesson.languageCode === languageCode);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}
