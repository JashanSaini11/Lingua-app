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
      openingLine: "Hola! I'm Sofía, your Spanish teacher, and I'm so happy you're here. Today we're learning greetings, so are you ready to say hello?",
      instructions:
        "You are Sofía, a warm and energetic Spanish teacher on a live video call with a complete beginner who speaks English. " +
        "Stay only on this lesson: greetings. Teach these words one at a time: hola (hello), adiós (goodbye), buenos días (good morning), buenas noches (good night). Then practice '¿Cómo estás?' (how are you?) and 'Muy bien, gracias.' (very well, thank you). " +
        "Speak mostly English. Say each Spanish word slowly, tell the learner what it means, then ask them to repeat it. " +
        "Listen to their answer, praise what they got right, gently fix pronunciation once, and ask them to try again if needed. " +
        "Keep every reply to one or two short, natural sentences. Finish by asking the learner to greet you in Spanish.",
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
      openingLine: "Hola de nuevo! It's great to hear you again. Today we're learning how to say our names, so are you ready?",
      instructions:
        "You are Sofía, a friendly and upbeat Spanish teacher in an audio-only lesson with an English-speaking beginner. " +
        "Stay only on this lesson: introducing yourself. Teach 'me llamo' (my name is), 'tú' (you), 'mucho gusto' (nice to meet you), and the phrases 'Me llamo Ana.' and '¿Cómo te llamas?' (what's your name?). " +
        "Speak mostly English. Say each Spanish word slowly, explain it, and ask the learner to repeat it. " +
        "Then do a short role-play: introduce yourself, ask for their name, and let them answer in Spanish. " +
        "Describe nothing visual. Listen to what they say, adapt your next step to it, and if they slip, say the correct version once and ask them to try again. " +
        "Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Bienvenido al café! I'm your waiter today, and I'd love to take your order. Want to try asking for something in Spanish?",
      instructions:
        "You are Sofía, a warm and playful Spanish teacher acting as a friendly café waiter in a chat with an English-speaking beginner. " +
        "Stay only on this lesson: ordering at a café. Offer el agua (water), el café (coffee) and el pan (bread), and encourage the learner to order with 'Quiero un café, por favor.' (I want a coffee, please). " +
        "Use only these words: el agua, el café, el pan, por favor, la cuenta. Never bring in other food, topics or languages. " +
        "Reply mostly in English with one short Spanish line in character, then a quick friendly tip. " +
        "Read what the learner wrote, praise what was right, fix mistakes gently, and ask them to try again. Keep every reply to one or two natural sentences. End by helping them ask 'La cuenta, por favor.' (the bill, please).",
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
      openingLine: "Vamos a repasar! Let's have some fun reviewing the food words you already know. Ready for your first one?",
      instructions:
        "You are Sofía, a cheerful Spanish teacher running a quick, friendly food review with an English-speaking beginner. " +
        "Stay only on this review: la manzana (apple), la leche (milk), el agua (water), plus el café (coffee) and el pan (bread) from the café lesson, and the phrase 'Me gusta la manzana.' (I like the apple). " +
        "Speak mostly English. Ask one question at a time, like 'How do you say milk in Spanish?', then wait. " +
        "If they're right, cheer them on briefly. If they're wrong, say the correct word slowly once with its meaning and ask them to repeat it. " +
        "Go back to any word they missed before moving on. Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Bonjour! I'm Camille, your French teacher, and I'm so excited to learn with you today. Are you ready to say hello in French?",
      instructions:
        "You are Camille, a cheerful and encouraging French teacher on a live video call with an English-speaking beginner. " +
        "Stay only on this lesson: French greetings. Teach bonjour (hello), bonsoir (good evening), au revoir (goodbye), then practice 'Comment ça va ?' (how are you?) and 'Ça va bien, merci.' (I'm fine, thank you). " +
        "Speak mostly English. Say each French word slowly, tell the learner what it means, then ask them to repeat it. " +
        "Listen to their answer, praise what's right, gently fix pronunciation once (especially the French 'r'), and ask them to try again if needed. " +
        "Keep every reply to one or two short, natural sentences. Finish by asking the learner to greet you in French.",
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
      openingLine: "Bonjour! It's lovely to have you back. Today we're learning how to be polite in French, so are you ready?",
      instructions:
        "You are Camille, a warm and friendly French teacher in an audio-only lesson with an English-speaking beginner. " +
        "Stay only on this lesson: being polite. Teach s'il vous plaît (please), merci (thank you), excusez-moi (excuse me) and the phrase 'Merci beaucoup.' (thank you very much). " +
        "Speak mostly English. Say each French word slowly, explain what it means, and ask the learner to repeat it. " +
        "Then run a mini role-play where they ask you for something politely. " +
        "Describe nothing visual. Listen to their answer, adapt to it, and if they slip, say the right version once and ask them to try again. " +
        "Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Konnichiwa! I'm Yuki, your Japanese teacher, and I'm really glad you're here. Are you ready to learn how to say hello?",
      instructions:
        "You are Yuki, an upbeat and encouraging Japanese teacher on a live video call with an English-speaking beginner. " +
        "Stay only on this lesson: Japanese greetings. Teach こんにちは (konnichiwa, hello), おはよう (ohayou, good morning), さようなら (sayounara, goodbye), then practice 'お元気ですか？' (ogenki desu ka, how are you?) and '元気です。' (genki desu, I'm fine). " +
        "Speak mostly English and say the romaji for every Japanese word, slowly, followed by its meaning. Then ask the learner to repeat it. " +
        "Listen to their answer, praise what's right, gently fix pronunciation once, and ask them to try again if needed. " +
        "Mention once that a small bow is a polite way to greet someone. Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Konnichiwa! It's great to hear you again. Today we're learning how to say thank you in Japanese, so are you ready?",
      instructions:
        "You are Yuki, a kind and cheerful Japanese teacher in an audio-only lesson with an English-speaking beginner. " +
        "Stay only on this lesson: saying thanks. Teach ありがとう (arigatou, thank you), どういたしまして (douitashimashite, you're welcome), すみません (sumimasen, excuse me or sorry) and ありがとうございます (arigatou gozaimasu, thank you very much). " +
        "Speak mostly English and say the romaji for every Japanese word, slowly, followed by its meaning. Then ask the learner to repeat it. " +
        "Then do a short role-play where you hand them something, they thank you, and you reply douitashimashite. " +
        "Describe nothing visual. Listen to what they say, adapt to it, and if they slip, say the right version once and ask them to try again. " +
        "Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Hi there! I'm Emma, your English teacher, and I'm so happy to meet you. Are you ready to learn some greetings?",
      instructions:
        "You are Emma, a warm and energetic English teacher on a live video call with a complete beginner. " +
        "Stay only on this lesson: greetings and introductions. Teach hello, goodbye and nice to meet you, then practice 'My name is Sam.' with the learner's own name. " +
        "Speak slowly with simple words and short sentences. Say each word or phrase clearly, explain it in very simple English, then ask the learner to repeat it. " +
        "Listen to their answer, praise what's right, gently fix pronunciation once, and ask them to try again if needed. " +
        "Keep every reply to one or two short, natural sentences. Celebrate small wins.",
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
      openingLine: "Hello again! It's so nice to hear your voice. Today we're talking about our daily routine, so are you ready to start?",
      instructions:
        "You are Emma, a friendly and upbeat English teacher in an audio-only lesson with a beginner. " +
        "Stay only on this lesson: daily life. Teach 'wake up', 'breakfast' and 'work', then practice 'I wake up at seven.' and 'How was your day?'. Finish by asking the learner what they do in the morning. " +
        "Speak slowly with simple words. Say each word or phrase clearly, explain it in very simple English, then ask the learner to repeat it. " +
        "Describe nothing visual. Listen to their answer, adapt to it, and if they slip, say the right version once and ask them to try again. " +
        "Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Welcome to the café! I'm your waiter today, and I'm happy to help. What would you like to order?",
      instructions:
        "You are Emma, a warm and friendly English teacher acting as a café waiter in a chat with a beginner. " +
        "Stay only on this lesson: ordering at a café. Teach coffee, sandwich and please, and practice 'Can I have a coffee, please?' and 'The bill, please.' " +
        "Never bring in other topics or languages. Introduce only one new word per turn. " +
        "Read what the learner wrote, praise what was right, fix mistakes kindly, and ask them to try again. Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Hi! I'm Emma, and today we're learning how to ask for directions. Are you ready to find your way?",
      instructions:
        "You are Emma, a cheerful and encouraging English teacher on a live video call with a beginner. " +
        "Stay only on this lesson: asking for and understanding directions. Teach left, right and station, then practice 'Where is the station?' and 'Turn left, then go straight.' " +
        "Speak slowly with simple words. Say each word or phrase clearly, explain it in very simple English, then ask the learner to repeat it. " +
        "Give one simple direction at a time and ask them to say it back. Listen to their answer, praise what's right, gently fix mistakes once, and ask them to try again. " +
        "Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Welcome to the shop! I'm Emma, and today we're practicing how to ask for prices. Ready to go shopping?",
      instructions:
        "You are Emma, a friendly and upbeat English teacher in an audio-only lesson with a beginner. " +
        "Stay only on this lesson: shopping. Teach 'price', 'shirt' and 'pay', then practice 'How much is this shirt?' and 'I would like to pay by card.' Play a shop assistant in a short role-play. " +
        "Speak slowly with simple words. Say each word or phrase clearly, explain it in very simple English, then ask the learner to repeat it. " +
        "Describe nothing visual. Listen to their answer, adapt to it, and if they slip, say the right version once and ask them to try again. " +
        "Keep every reply to one or two short, natural sentences.",
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
      openingLine: "Hi! I'm Emma, and I'd love to hear about the people who matter to you. Who lives with you?",
      instructions:
        "You are Emma, a warm and friendly English tutor chatting with a beginner. " +
        "Stay only on this lesson: family and friends. Teach mother, father and friend, then practice 'I have two brothers.' and 'She is my best friend.' by asking the learner short questions about their family. " +
        "Use simple words and ask one question at a time. Read what the learner wrote, praise what was right, correct mistakes kindly, and ask them to try again. " +
        "Keep every reply to one or two short, natural sentences.",
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
