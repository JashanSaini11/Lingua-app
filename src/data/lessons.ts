import { getPlaceholderImage } from "@/lib/placeholder";
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
    image: getPlaceholderImage("es-1-1"),
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
    image: getPlaceholderImage("es-1-2"),
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
    image: getPlaceholderImage("es-2-1"),
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
    image: getPlaceholderImage("es-2-2"),
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
    image: getPlaceholderImage("fr-1-1"),
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
    image: getPlaceholderImage("fr-1-2"),
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
    image: getPlaceholderImage("ja-1-1"),
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
    image: getPlaceholderImage("ja-1-2"),
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

  // ───────────── English · Unit 1: Hello, English! ─────────────
  // For English, `translation` is a simple meaning in plain English.
  {
    id: "en-1-1",
    unitId: "en-unit-1",
    languageCode: "en",
    order: 1,
    title: "Greetings & Introductions",
    emoji: "👋",
    image: getPlaceholderImage("en-1-1"),
    description: "Say hello and tell people your name.",
    type: "video",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and goodbye",
      "Tell someone your name",
      "Say you are happy to meet them",
    ],
    vocabulary: [
      { id: "en-1-1-v1", emoji: "👋", word: "hello", translation: "a friendly greeting", pronunciation: "heh-LOH" },
      { id: "en-1-1-v2", emoji: "🚶", word: "goodbye", translation: "said when you leave", pronunciation: "good-BY" },
      { id: "en-1-1-v3", emoji: "🤝", word: "nice to meet you", translation: "said when you meet someone new", pronunciation: "nyss too MEET yoo" },
    ],
    phrases: [
      { id: "en-1-1-p1", text: "My name is Sam.", translation: "Tell someone your name.", pronunciation: "my NAYM iz sam" },
    ],
    activities: [
      {
        id: "en-1-1-a1",
        type: "multiple-choice",
        prompt: "Which word do you say when you meet someone?",
        options: ["goodbye", "hello", "sorry", "please"],
        correctAnswer: "hello",
      },
      {
        id: "en-1-1-a2",
        type: "translation",
        prompt: "Say your name: Sam",
        answer: "My name is Sam.",
      },
      {
        id: "en-1-1-a3",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "Nice to meet you.",
        translation: "Said when you meet someone new.",
      },
    ],
    aiTeacher: {
      openingLine: "Hi! I'm Emma, your English teacher. Ready to learn greetings?",
      instructions:
        "You are Emma, a warm and patient English teacher on a live video call with a complete beginner. " +
        "Teach hello, goodbye and nice to meet you, then practice 'My name is ...'. " +
        "Speak slowly, ask the learner to repeat each phrase, and keep every reply under two sentences. Celebrate small wins.",
    },
  },
  {
    id: "en-1-2",
    unitId: "en-unit-1",
    languageCode: "en",
    order: 2,
    title: "Daily Life",
    emoji: "🏠",
    image: getPlaceholderImage("en-1-2"),
    description: "Talk about your day at home and at work.",
    type: "audio",
    xpReward: 15,
    estimatedMinutes: 6,
    goals: [
      "Name common daily activities",
      "Say what you do in the morning",
      "Ask someone about their day",
    ],
    vocabulary: [
      { id: "en-1-2-v1", emoji: "⏰", word: "wake up", translation: "stop sleeping", pronunciation: "wayk UP" },
      { id: "en-1-2-v2", emoji: "🍳", word: "breakfast", translation: "the first meal of the day", pronunciation: "BREK-fust" },
      { id: "en-1-2-v3", emoji: "💼", word: "work", translation: "the job you do", pronunciation: "wurk" },
    ],
    phrases: [
      { id: "en-1-2-p1", text: "I wake up at seven.", translation: "Say when your day starts.", pronunciation: "eye wayk UP at SEV-un" },
      { id: "en-1-2-p2", text: "How was your day?", translation: "Ask about someone's day.", pronunciation: "how wuz yor DAY" },
    ],
    activities: [
      {
        id: "en-1-2-a1",
        type: "multiple-choice",
        prompt: "What is the first meal of the day?",
        options: ["dinner", "lunch", "breakfast", "snack"],
        correctAnswer: "breakfast",
      },
      {
        id: "en-1-2-a2",
        type: "translation",
        prompt: "Say when you wake up: 7:00",
        answer: "I wake up at seven.",
      },
      {
        id: "en-1-2-a3",
        type: "speaking",
        prompt: "Ask about someone's day:",
        targetText: "How was your day?",
        translation: "Ask about someone's day.",
      },
    ],
    aiTeacher: {
      openingLine: "Hello again! Today we will talk about our daily routine. Listen first, then repeat after me.",
      instructions:
        "You are Emma, a friendly English teacher in an audio-only lesson with a beginner. " +
        "Teach 'wake up', 'breakfast' and 'work', then ask the learner what they do in the morning. " +
        "Describe nothing visual. Speak slowly, repeat key phrases twice, and keep replies to one or two sentences.",
    },
  },
  {
    id: "en-1-3",
    unitId: "en-unit-1",
    languageCode: "en",
    order: 3,
    title: "At the Café",
    emoji: "☕",
    image: getPlaceholderImage("en-1-3"),
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
      { id: "en-1-3-v1", emoji: "☕", word: "coffee", translation: "a hot brown drink", pronunciation: "KOF-ee" },
      { id: "en-1-3-v2", emoji: "🥪", word: "sandwich", translation: "food between two slices of bread", pronunciation: "SAND-wich" },
      { id: "en-1-3-v3", emoji: "🙏", word: "please", translation: "a polite word when you ask", pronunciation: "pleez" },
    ],
    phrases: [
      { id: "en-1-3-p1", text: "Can I have a coffee, please?", translation: "Order a drink politely.", pronunciation: "kan eye hav a KOF-ee pleez" },
      { id: "en-1-3-p2", text: "The bill, please.", translation: "Ask to pay.", pronunciation: "thuh BIL pleez" },
    ],
    activities: [
      {
        id: "en-1-3-a1",
        type: "multiple-choice",
        prompt: "Which word makes your order polite?",
        options: ["now", "please", "give", "fast"],
        correctAnswer: "please",
      },
      {
        id: "en-1-3-a2",
        type: "translation",
        prompt: "Order a coffee politely.",
        answer: "Can I have a coffee, please?",
      },
      {
        id: "en-1-3-a3",
        type: "speaking",
        prompt: "Ask to pay:",
        targetText: "The bill, please.",
        translation: "Ask to pay.",
      },
    ],
    aiTeacher: {
      openingLine: "Welcome to the café! I'm the waiter today. What would you like to order?",
      instructions:
        "You are Emma, playing a friendly café waiter in a chat with an English beginner. " +
        "Practice 'Can I have a coffee, please?' and 'The bill, please.' Keep replies short, correct mistakes kindly, and give one new word per turn.",
    },
  },
  {
    id: "en-1-4",
    unitId: "en-unit-1",
    languageCode: "en",
    order: 4,
    title: "Travel & Directions",
    emoji: "🧭",
    image: getPlaceholderImage("en-1-4"),
    description: "Ask where things are and understand the answer.",
    type: "video",
    xpReward: 15,
    estimatedMinutes: 7,
    goals: [
      "Ask where a place is",
      "Understand left, right and straight",
      "Thank someone for their help",
    ],
    vocabulary: [
      { id: "en-1-4-v1", emoji: "⬅️", word: "left", translation: "the opposite of right", pronunciation: "left" },
      { id: "en-1-4-v2", emoji: "➡️", word: "right", translation: "the opposite of left", pronunciation: "ryt" },
      { id: "en-1-4-v3", emoji: "🚉", word: "station", translation: "where trains and buses stop", pronunciation: "STAY-shun" },
    ],
    phrases: [
      { id: "en-1-4-p1", text: "Where is the station?", translation: "Ask for a place.", pronunciation: "wair iz thuh STAY-shun" },
      { id: "en-1-4-p2", text: "Turn left, then go straight.", translation: "Directions you can hear.", pronunciation: "turn LEFT then goh STRAYT" },
    ],
    activities: [
      {
        id: "en-1-4-a1",
        type: "multiple-choice",
        prompt: "Which word is the opposite of “left”?",
        options: ["up", "down", "right", "near"],
        correctAnswer: "right",
      },
      {
        id: "en-1-4-a2",
        type: "translation",
        prompt: "Ask where the station is.",
        answer: "Where is the station?",
      },
      {
        id: "en-1-4-a3",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "Turn left, then go straight.",
        translation: "Directions you can hear.",
      },
    ],
    aiTeacher: {
      openingLine: "Hi! Let's learn how to ask for directions. Where would you like to go?",
      instructions:
        "You are Emma, a cheerful English teacher on a live video call with a beginner. " +
        "Teach left, right, station and 'Where is ...?'. Give simple directions and ask the learner to repeat them. Keep every reply under two sentences.",
    },
  },
  {
    id: "en-1-5",
    unitId: "en-unit-1",
    languageCode: "en",
    order: 5,
    title: "Shopping",
    emoji: "🛍️",
    image: getPlaceholderImage("en-1-5"),
    description: "Ask for prices and buy what you need.",
    type: "audio",
    xpReward: 15,
    estimatedMinutes: 6,
    goals: [
      "Ask how much something costs",
      "Say what you want to buy",
      "Pay and say thank you",
    ],
    vocabulary: [
      { id: "en-1-5-v1", emoji: "💵", word: "price", translation: "how much something costs", pronunciation: "pryss" },
      { id: "en-1-5-v2", emoji: "👕", word: "shirt", translation: "clothes for your upper body", pronunciation: "shurt" },
      { id: "en-1-5-v3", emoji: "💳", word: "pay", translation: "give money for something", pronunciation: "pay" },
    ],
    phrases: [
      { id: "en-1-5-p1", text: "How much is this shirt?", translation: "Ask for a price.", pronunciation: "how MUCH iz this SHURT" },
      { id: "en-1-5-p2", text: "I would like to pay by card.", translation: "Say how you will pay.", pronunciation: "eye wood lyk too pay by KARD" },
    ],
    activities: [
      {
        id: "en-1-5-a1",
        type: "multiple-choice",
        prompt: "What does “price” mean?",
        options: ["how much something costs", "a type of shop", "a color", "a gift"],
        correctAnswer: "how much something costs",
      },
      {
        id: "en-1-5-a2",
        type: "translation",
        prompt: "Ask the price of a shirt.",
        answer: "How much is this shirt?",
      },
      {
        id: "en-1-5-a3",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "I would like to pay by card.",
        translation: "Say how you will pay.",
      },
    ],
    aiTeacher: {
      openingLine: "Welcome to the shop! Today we will practice asking for prices.",
      instructions:
        "You are Emma, a friendly English teacher in an audio-only lesson with a beginner. " +
        "Role-play a shop assistant. Teach 'price', 'shirt' and 'pay'. Speak slowly, repeat key phrases twice, and keep replies to one or two sentences.",
    },
  },
  {
    id: "en-1-6",
    unitId: "en-unit-1",
    languageCode: "en",
    order: 6,
    title: "Family & Friends",
    emoji: "👨‍👩‍👧",
    image: getPlaceholderImage("en-1-6"),
    description: "Talk about the people who matter to you.",
    type: "chat",
    xpReward: 15,
    estimatedMinutes: 6,
    goals: [
      "Name family members",
      "Say how many people are in your family",
      "Talk about a friend",
    ],
    vocabulary: [
      { id: "en-1-6-v1", emoji: "👩", word: "mother", translation: "your female parent", pronunciation: "MUTH-er" },
      { id: "en-1-6-v2", emoji: "👨", word: "father", translation: "your male parent", pronunciation: "FAH-ther" },
      { id: "en-1-6-v3", emoji: "🧑‍🤝‍🧑", word: "friend", translation: "someone you like and trust", pronunciation: "frend" },
    ],
    phrases: [
      { id: "en-1-6-p1", text: "I have two brothers.", translation: "Say how many brothers you have.", pronunciation: "eye hav too BRUTH-erz" },
      { id: "en-1-6-p2", text: "She is my best friend.", translation: "Talk about a friend.", pronunciation: "shee iz my best FREND" },
    ],
    activities: [
      {
        id: "en-1-6-a1",
        type: "multiple-choice",
        prompt: "Who is your “mother”?",
        options: ["your female parent", "your male parent", "your teacher", "your neighbor"],
        correctAnswer: "your female parent",
      },
      {
        id: "en-1-6-a2",
        type: "translation",
        prompt: "Say you have two brothers.",
        answer: "I have two brothers.",
      },
      {
        id: "en-1-6-a3",
        type: "speaking",
        prompt: "Say this out loud:",
        targetText: "She is my best friend.",
        translation: "Talk about a friend.",
      },
    ],
    aiTeacher: {
      openingLine: "Hi! Tell me about your family. Who lives with you?",
      instructions:
        "You are Emma, a friendly English tutor chatting with a beginner. " +
        "Teach mother, father and friend, then ask the learner short questions about their family. Correct mistakes kindly and keep replies under two sentences.",
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
