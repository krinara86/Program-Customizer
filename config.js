// ===========================
// Configuration and Constants
// ===========================

const firebaseConfig = {
  apiKey: "AIzaSyD2Qv-8dC9atWBU_IFWXmxsGSp5T-_FOtM",
  authDomain: "sadhakacustomizer.firebaseapp.com",
  projectId: "sadhakacustomizer",
  storageBucket: "sadhakacustomizer.appspot.com",
  messagingSenderId: "401905258509",
  appId: "1:401905258509:web:cd9661bbe700b04fa00544"
};

// Default texts - these will be overridden by database values if available
let DEFAULT_PRAYER_TEXT = `In the Samaya Tradition we are taught to pray in our own words. So instead of repeating prayers in dead languages out of scriptures or translations of the same, you can have a conversation with the Divine in your mother tongue or your primary language. This Samaya prayer is a form of internal dialogue. You can use internal dialogue to converse with the Divine in your own language, in your own words. Since the Divinity within is subtler than the subtlest, it is hard for most of us to have a conversation with it. Therefore, you can relate to the Divinity in yourself as your mother, father, master, friend or lover. Some prefer to relate to the Divinity within as a teacher or guiding light.
While there may be many different kinds of prayers asking for fulfillment of worldly desires, the following prayers described here are those recommended by the Samaya tradition.
A prayer of petition: This is the most important prayer for those who start systematic meditation. You are praying for sankalpa shakti, that is, for the determination and will power to continue on this path. Pray four times daily before practice asking for internal strength and guidance on this inner journey. Ask the Divinity within you for courage to continue on the path of Truth. Remember, when you practice with full commitment you are always protected. Even if you do not do any systematic meditation practice, you can still pray four times a day.
A prayer of thanksgiving: The second kind of prayer is an expression of gratitude for all the good and beautiful gifts you have, including your body. To have a human body and live out desires on this plane of existence is a privilege. We all tend to get gloomy in the face of troubles and problems, but instead of becoming negative you learn to focus on the good and beautiful in your life by counting your blessings. Express your gratitude for the good and beautiful in your life before or after your systematic meditation practice four times daily. If you do not practice, you can still express gratitude to the Divinity within at least once a day.
How to pray
When should I pray? Most of us only pray when we are anxious and in trouble. However, best practice is to pray daily, even four times a day, as many religions prescribe. The timings of prayer should not conflict with your general routine. Meal times are anchors in everyone's day, so you can pray in the morning before breakfast, at midday before lunch, at dusk before an early evening meal and a fourth time before bedtime. Those who practice systematic meditation four times a day, can add a short prayer before and after the meditation practice.
To whom shall I pray? If you are unable to develop a relationship with the Divinity within you, then you can pray to a deity that you are drawn to, keeping in mind that deities are auspicious symbols. You can also pray to saints and sages. In the Samaya tradition, internal prayer is preferred. The Divinity within is God without attributes (nirguna brahman). Sages, saints and deities are God with attributes (saguna brahman). The choice between the two depends on the nature of your mind and what you feel drawn to. 
Where shall I pray? While it is common to pray in a house of worship or in front of an altar at home, you can pray anywhere. According to the Samaya tradition there is no inauspicious place and if you believe a place to be inauspicious, prayer will surely purify it and make it auspicious. It is recommended to have a fixed area or space at home for prayer. An altar is not necessary.
What is the best posture for prayer? You can pray in any posture you like, standing, seated or even lying down. While the supine position is only recommended if you are unwell or have a physical disability, the standing and seated positions are a matter of preference. If you chose to have a seated position you can sit on a chair with your back straight or on a meditation mat.`;

let DEFAULT_DIET_TEXT = `Do not eat raw foods like salad early in the morning or in the evening. 
Keep a gap of 2-3 hours between meals. Always eat warm meals. As far as possible eat organic foods.

Always eat a warm porridge with dried fruit and nuts for breakfast. You can also grate sweet apples into the porridge and cook it. You can make porridge out of oats, amaranth, quinoa and bulgur. You can add bananas on top. Berries are excellent, if you cook them along with the porridge.

Avoid mushrooms, paprika, garlic, onions, heavy lentils, eggs, fried foods, cold food, frozen foods, industrialized food like ready made breads, alcohol, white refined sugar, refined breads, refined oils as these are tamasic or rajasic.

Drink 2-3 liters of plain water everyday without gas. Do not drink water 30 minutes before and after meals. If you have digestive problems such as gases, acidity or constipation always drink warm water.

Drink mild herbal teas like mixed herbs, fennel/anis/cumin, fasting teas, alkaline teas, chamomile tea, tulsi tea. Avoid teas with added sugar, colors and flavoring agents.

Avoid coffee and black tea . Alternatives: moringa leaves, tulsi, rooi busch,

Lunch is the most important meal of the day between 11 am and 2 pm. During lunch if you wish, you can have a little raw salad since the digestive fire is the strongest at this time of the day. If you want to have something sweet, this is the time you can have a small dessert, candy, biscuit or mithai. Dairy products such as yoghurt, lassi, cheese are best consumed at this time.

Dinner is a good time for simple one pot meals like khichidi. You can always have rice, vegetables and lentils if you prefer. Do not have bread, salad, dairy products or any cold food or drinks in the evening. Best for you is light food, steamed or lightly sautéed in little oil or ghee.

A variety of grains is preferred. Make sure you do not only have wheat products. Also enjoy oats, parboiled rice, spelt, amaranth, bulgur, quinoa, couscous, barley, maize and millet. 
There is a huge variety of vegetables. Eat at least 25 different plants in a week: Pumpkin, beetroot, carrots, sweet potatoes, potatoes, zucchini, spinach, tomatoes, avocado, Many Indian vegetables are highly nutrient dense and therefore extremely healthy like drumsticks (moringa).
Herbs: fenugreek leaves, fresh coriander and other herbs
Lentils: red lentils, moong lentils, moong beans 
Fruit: sweet fruit like bananas, coconut, apples, figs, dates, grapes, mangoes, papaya, berries (cooked)
Seeds and Nuts: sunflower, pumpkin, almonds

Milk products: ghee, paneer, cow's milk (warm with cardamom) Butter, sheep or goat cheese like feta. Yoghurt only in afternoon. Avoid yoghurt in the morning or evening.
Sweetners: Jaggery, (light colored) honey, maple syrup, agave 
Oils and fat: Ghee, olive oil, coconut oil, butter
Spices: coriander, cumin, cardamom, turmeric, fennel, oregano, rosemary, anise, thyme, ginger`;

let DEFAULT_ROUTINE_TEXT = `A structured routine is very important for you:
Go to bed by 10:00 pm
Wake up by 6 am

Morning Routine on waking up:
- Wash face, splash cold water on eyes
- Brush teeth first
- Then do Oil pulling with coconut oil for 5-10 minutes, spit out in garbage (not in washbasin)
- Tongue cleaning with metal tongue cleaner
- Drink at least 2 glasses of warm water 
- Wash yourself. Daily shower is not necessary. 
- Do yoga sadhana
- Go for at least 3 kms brisk walk
- Drink warm lemon with salt and honey before breakfast`;

let DEFAULT_MEDITATION_TEXT = `Meditation Practice (Atma Vichara - Self-Inquiry)

Atma Vichara, or self-inquiry, is a profound meditation practice that leads to self-realization. This practice involves turning the mind inward to investigate the nature of the self.

How to Practice:
1. Find a comfortable seated position with your spine straight
2. Close your eyes and take a few deep breaths to settle the mind
3. Begin by asking yourself "Who am I?" or "What is the nature of my true self?"
4. Observe thoughts, feelings, and sensations without attachment
5. Let go of identification with the body, mind, and personality
6. Rest in pure awareness, in the silence between thoughts

Key Principles:
- Practice with patience and consistency - results come gradually
- There is no need to force or strain; meditation should be effortless
- If the mind wanders, gently bring it back to self-inquiry
- Practice daily, preferably at the same time and place
- Start with 10-15 minutes and gradually increase duration
- The goal is not to achieve something, but to recognize what already is

Remember: You are not the thoughts, emotions, or body. You are the pure consciousness that witnesses all of these. Through regular practice, this understanding deepens from intellectual knowledge to direct experience.`;

let DEFAULT_LIABILITY_TEXT = `This personal practice plan has been created specifically for you based on your individual needs and capabilities. Please note the following important information:

1. This practice plan is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

2. Before beginning any exercise program, including the practices outlined in this plan, you should consult with a healthcare professional to ensure it is appropriate for your current health status.

3. Listen to your body and never force any posture or practice. If you experience pain, dizziness, or discomfort, stop immediately and consult a healthcare professional if symptoms persist.

4. The practices included in this plan should be performed mindfully and within your comfortable range of motion. Progress gradually and respect your body's limitations.

5. By following this practice plan, you acknowledge that you are participating at your own risk and assume full responsibility for any risks, injuries, or damages, known or unknown, which might occur as a result of participating in these practices.

Remember, yoga is a practice of self-awareness and self-care. Honor your body and practice with compassion.`;

let DEFAULT_REFERENCE_BOOKS_TEXT = `Recommended Reading:

1. "Light on Yoga" by B.K.S. Iyengar
2. "The Yoga Sutras of Patanjali" - Translation and Commentary by Sri Swami Satchidananda
3. "The Heart of Yoga: Developing a Personal Practice" by T.K.V. Desikachar
4. "Anatomy of Hatha Yoga" by David Coulter
5. "The Breathing Book" by Donna Farhi

These texts provide deeper insights into the philosophy, practice, and anatomy of yoga to support your journey.`;

const CATEGORIES = [
  { id: 'prayerSection', elementId: 'prayerText', title: 'Prayer', type: 'text', order: 1, defaultText: 'DEFAULT_PRAYER_TEXT' },
  { id: 'jointsAndGlandsSection', elementId: 'jointsAndGlandsDiv', title: 'Joints and Glands', type: 'asanas', category: 'Joints and Glands', notesId: 'jointsAndGlandsNotes', order: 2 },
  { id: 'cardioTrainingSection', elementId: 'cardioTrainingText', title: 'Cardio Training', type: 'text', order: 3 },
  { id: 'cardioSection', elementId: 'cardioDiv', title: 'Cardio Day Asanas', type: 'asanas', category: 'Physical Asana', notesId: 'cardioNotes', order: 4 },
  { id: 'nonCardioSection', elementId: 'nonCardioDiv', title: 'Non-Cardio Day Asanas', type: 'asanas', category: 'Physical Asana', notesId: 'nonCardioNotes', order: 5 },
  { id: 'relaxationSection', elementId: 'relaxationDiv', title: 'Relaxation Asanas', type: 'asanas', category: 'Relaxation', notesId: 'relaxationNotes', order: 6 },
  { id: 'meditativeSection', elementId: 'meditativeDiv', title: 'Meditative Asanas', type: 'asanas', category: 'Meditative Asana', notesId: 'meditativeNotes', order: 7 },
  { id: 'breathingSection', elementId: 'breathingDiv', title: 'Breathing exercises', type: 'asanas', category: 'Breathing', notesId: 'breathingNotes', order: 8 },
  { id: 'pranayamaSection', elementId: 'pranayamaDiv', title: 'Pranayama', type: 'asanas', category: 'Pranayana', notesId: 'pranayamaNotes', order: 9 },
  { id: 'meditationTextSection', elementId: 'meditationText', title: 'Meditation Practice', type: 'text', order: 10, defaultText: 'DEFAULT_MEDITATION_TEXT' },
  { id: 'meditationSection', elementId: 'meditationDiv', title: 'Meditation Exercises', type: 'asanas', category: 'Meditation', notesId: 'meditationNotes', order: 11 },
  { id: 'mantraPracticeSection', elementId: 'mantraPracticeText', title: 'Mantra Practice', type: 'text', order: 12 },
  { id: 'routineSection', elementId: 'routineText', title: 'Routine', type: 'text', order: 13 },
  { id: 'dietAndAdditionalNotesSection', elementId: 'dietAndAdditionalNotes', title: 'Dietary recommendations', type: 'text', order: 14 },
  { id: 'advisorySection', elementId: 'advisoryText', title: 'Advisory', type: 'text', order: 15 },
  { id: 'liabilityClauseSection', elementId: 'liabilityClauseText', title: 'Liability Clause', type: 'text', order: 16 },
  { id: 'referenceBooksSection', elementId: 'referenceBooksText', title: 'Recommended Reading', type: 'text', order: 17, defaultText: 'DEFAULT_REFERENCE_BOOKS_TEXT' }
];

// ===========================
// Global State
// ===========================

let db;
let asanas = [];
let sadhakaNames = [];
let currentUser = null;

// Helper to get current default text values
function getDefaultTexts() {
  return {
    prayer: DEFAULT_PRAYER_TEXT,
    diet: DEFAULT_DIET_TEXT,
    routine: DEFAULT_ROUTINE_TEXT,
    meditation: DEFAULT_MEDITATION_TEXT,
    liability: DEFAULT_LIABILITY_TEXT,
    referenceBooks: DEFAULT_REFERENCE_BOOKS_TEXT
  };
}

// Helper to update default texts from database values
function updateDefaultTexts(texts) {
  if (texts.prayer) DEFAULT_PRAYER_TEXT = texts.prayer;
  if (texts.diet) DEFAULT_DIET_TEXT = texts.diet;
  if (texts.routine) DEFAULT_ROUTINE_TEXT = texts.routine;
  if (texts.meditation) DEFAULT_MEDITATION_TEXT = texts.meditation;
  if (texts.liability) DEFAULT_LIABILITY_TEXT = texts.liability;
  if (texts.referenceBooks) DEFAULT_REFERENCE_BOOKS_TEXT = texts.referenceBooks;
}
