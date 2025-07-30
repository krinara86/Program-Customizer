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

const DEFAULT_PRAYER_TEXT = `In the Samaya Tradition we are taught to pray in our own words. So instead of repeating prayers in dead languages out of scriptures or translations of the same, you can have a conversation with the Divine in your mother tongue or your primary language. This Samaya prayer is a form of internal dialogue. You can use internal dialogue to converse with the Divine in your own language, in your own words. Since the Divinity within is subtler than the subtlest, it is hard for most of us to have a conversation with it. Therefore, you can relate to the Divinity in yourself as your mother, father, master, friend or lover. Some prefer to relate to the Divinity within as a teacher or guiding light.
While there may be many different kinds of prayers asking for fulfillment of worldly desires, the following prayers described here are those recommended by the Samaya tradition.
A prayer of petition: This is the most important prayer for those who start systematic meditation. You are praying for sankalpa shakti, that is, for the determination and will power to continue on this path. Pray four times daily before practice asking for internal strength and guidance on this inner journey. Ask the Divinity within you for courage to continue on the path of Truth. Remember, when you practice with full commitment you are always protected. Even if you do not do any systematic meditation practice, you can still pray four times a day.
A prayer of thanksgiving: The second kind of prayer is an expression of gratitude for all the good and beautiful gifts you have, including your body. To have a human body and live out desires on this plane of existence is a privilege. We all tend to get gloomy in the face of troubles and problems, but instead of becoming negative you learn to focus on the good and beautiful in your life by counting your blessings. Express your gratitude for the good and beautiful in your life before or after your systematic meditation practice four times daily. If you do not practice, you can still express gratitude to the Divinity within at least once a day.
How to pray
When should I pray? Most of us only pray when we are anxious and in trouble. However, best practice is to pray daily, even four times a day, as many religions prescribe. The timings of prayer should not conflict with your general routine. Meal times are anchors in everyone's day, so you can pray in the morning before breakfast, at midday before lunch, at dusk before an early evening meal and a fourth time before bedtime. Those who practice systematic meditation four times a day, can add a short prayer before and after the meditation practice.
To whom shall I pray? If you are unable to develop a relationship with the Divinity within you, then you can pray to a deity that you are drawn to, keeping in mind that deities are auspicious symbols. You can also pray to saints and sages. In the Samaya tradition, internal prayer is preferred. The Divinity within is God without attributes (nirguna brahman). Sages, saints and deities are God with attributes (saguna brahman). The choice between the two depends on the nature of your mind and what you feel drawn to. 
Where shall I pray? While it is common to pray in a house of worship or in front of an altar at home, you can pray anywhere. According to the Samaya tradition there is no inauspicious place and if you believe a place to be inauspicious, prayer will surely purify it and make it auspicious. It is recommended to have a fixed area or space at home for prayer. An altar is not necessary.
What is the best posture for prayer? You can pray in any posture you like, standing, seated or even lying down. While the supine position is only recommended if you are unwell or have a physical disability, the standing and seated positions are a matter of preference. If you chose to have a seated position you can sit on a chair with your back straight or on a meditation mat.`;

const DEFAULT_DIET_TEXT = `Do not eat raw foods like salad early in the morning or in the evening. 
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

const DEFAULT_ROUTINE_TEXT = `A structured routine is very important for you:
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

const CATEGORIES = [
  { id: 'prayerSection', elementId: 'prayerText', title: 'Prayer', type: 'text', order: 1 },
  { id: 'jointsAndGlandsSection', elementId: 'jointsAndGlandsDiv', title: 'Joints and Glands', type: 'asanas', category: 'Joints and Glands', notesId: 'jointsAndGlandsNotes', order: 2 },
  { id: 'cardioSection', elementId: 'cardioDiv', title: 'Cardio Day Asanas', type: 'asanas', category: 'Physical Asana', notesId: 'cardioNotes', order: 3 },
  { id: 'nonCardioSection', elementId: 'nonCardioDiv', title: 'Non-Cardio Day Asanas', type: 'asanas', category: 'Physical Asana', notesId: 'nonCardioNotes', order: 4 },
  { id: 'relaxationSection', elementId: 'relaxationDiv', title: 'Relaxation Asanas', type: 'asanas', category: 'Relaxation', order: 5 },
  { id: 'meditativeSection', elementId: 'meditativeDiv', title: 'Meditative Asanas', type: 'asanas', category: 'Meditative Asana', order: 6 },
  { id: 'breathingSection', elementId: 'breathingDiv', title: 'Breathing exercises', type: 'asanas', category: 'Breathing', order: 7 },
  { id: 'pranayamaSection', elementId: 'pranayamaDiv', title: 'Pranayama', type: 'asanas', category: 'Pranayana', order: 8 },
  { id: 'meditationSection', elementId: 'meditationDiv', title: 'Meditation', type: 'asanas', category: 'Meditation', order: 9 },
  { id: 'routineSection', elementId: 'routineText', title: 'Routine', type: 'text', order: 10 },
  { id: 'dietAndAdditionalNotesSection', elementId: 'dietAndAdditionalNotes', title: 'Dietary recommendations', type: 'text', order: 11 },
  { id: 'advisorySection', elementId: 'advisoryText', title: 'Advisory', type: 'text', order: 12 }
];

// ===========================
// Global State
// ===========================

let db;
let asanas = [];
let sadhakaNames = [];
let currentUser = null;

// ===========================
// Initialization
// ===========================

firebase.initializeApp(firebaseConfig);
db = firebase.firestore();

window.onload = initialize;

async function initialize() {
  document.querySelector('.login-container').style.display = 'block';
  document.querySelector('#overlay').style.display = 'block';

  const sadhakaNameInput = document.getElementById('sadhakaName');

  // Display current date
  const currentDateSpan = document.getElementById('currentDate');
  const today = new Date();
  currentDateSpan.textContent = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  try {
    const [fetchedAsanas, fetchedNames] = await Promise.all([
      loadAsanas(),
      loadSadhakaNames(),
      loadDefaultTexts()
    ]);

    asanas = fetchedAsanas;
    sadhakaNames = fetchedNames;
    populateSadhakaNameList();

    if (sadhakaNameInput.value.trim() !== '') {
      sadhakaNameSelected(sadhakaNameInput.value);
    } else {
      clearSadhakaDiv();
      sadhakaNameInput.removeAttribute('data-loaded-name');
    }

    setupDragAndDrop();
    console.log("Initialization complete. Asanas:", asanas);
  } catch (error) {
    console.error("Error initializing:", error);
    alert("Failed to initialize application data. Please check console for details.");
  }
}

// ===========================
// Authentication Functions
// ===========================

async function login() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginButton = document.querySelector('.login-button');

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // Show loading state
  loginButton.textContent = 'Logging in...';
  loginButton.disabled = true;

  try {
    const querySnapshot = await db.collection("login")
      .where("id", "==", username)
      .get();

    if (querySnapshot.empty) {
      alert("Invalid username or password. Please try again.");
      passwordInput.value = '';
      passwordInput.focus();
      return;
    }

    const loginData = querySnapshot.docs[0].data();
    if (password === loginData.password) {
      currentUser = loginData;

      // Success animation
      loginButton.textContent = '✓ Success!';
      loginButton.style.backgroundColor = '#4CAF50';

      setTimeout(() => {
        // Hide login UI with fade out
        const loginContainer = document.querySelector('.login-container');
        const overlay = document.querySelector('#overlay');

        loginContainer.style.animation = 'fadeOut 0.3s ease-out';
        overlay.style.animation = 'fadeOutOverlay 0.3s ease-out';

        setTimeout(() => {
          loginContainer.style.display = 'none';
          overlay.style.display = 'none';
        }, 300);

        // Show logged in user info
        document.getElementById('loginStatus').style.display = 'block';
        document.getElementById('loggedInUser').textContent = loginData.id;

        // Show/hide admin controls
        const adminControls = document.getElementById('adminControls');
        adminControls.style.display = loginData.isAdmin ? 'block' : 'none';

        // Show save buttons
        document.querySelector('button[onclick="saveSadhakaWithCategory()"]').style.display = 'inline-block';
        document.querySelector('button[onclick="saveSadhakaReportAsPdf()"]').style.display = 'inline-block';
      }, 500);

      await initializeDefaultUsers();
    } else {
      alert("Invalid username or password. Please try again.");
      passwordInput.value = '';
      passwordInput.focus();
    }
  } catch (error) {
    console.log("Error checking login credentials:", error);
    alert("An error occurred during login. Please try again.");
  } finally {
    // Reset button state if login failed
    if (loginButton.textContent !== '✓ Success!') {
      loginButton.textContent = 'Login';
      loginButton.disabled = false;
      loginButton.style.backgroundColor = '';
    }
  }
}

async function initializeDefaultUsers() {
  const defaultUsers = [
    { id: 'radhikama', password: 'samaya', isAdmin: true }
  ];

  for (const user of defaultUsers) {
    const userDoc = await db.collection('login').doc(user.id).get();
    if (!userDoc.exists) {
      await db.collection('login').doc(user.id).set(user);
    }
  }
}

// ===========================
// Data Loading Functions
// ===========================

async function loadAsanas() {
  try {
    const querySnapshot = await db.collection('asanas').get();
    const returnAsanas = [];

    querySnapshot.forEach((doc) => {
      const asana = doc.data();
      const asanaTuple = [asana.name, asana.description, asana.displayName, asana.category];
      returnAsanas.push(asanaTuple);
    });

    console.log("Fetched Asanas:", returnAsanas);
    return returnAsanas;
  } catch (error) {
    console.error("Error fetching Asanas:", error);
    throw error;
  }
}

async function loadSadhakaNames() {
  try {
    const querySnapshot = await db.collection('sadhakas').get();
    const names = [];

    querySnapshot.forEach((doc) => {
      names.push(doc.id);
    });

    return names;
  } catch (error) {
    console.log("Error fetching Sadhaka names:", error);
    throw error;
  }
}

async function loadDefaultTexts() {
  try {
    const dietTextArea = document.getElementById('dietAndAdditionalNotes');
    const routineTextArea = document.getElementById('routineText');
    const prayerTextArea = document.getElementById('prayerText');

    if (!dietTextArea.value || dietTextArea.value.trim() === '') {
      dietTextArea.value = DEFAULT_DIET_TEXT;
    }
    if (!routineTextArea.value || routineTextArea.value.trim() === '') {
      routineTextArea.value = DEFAULT_ROUTINE_TEXT;
    }
    if (!prayerTextArea.value || prayerTextArea.value.trim() === '') {
      prayerTextArea.value = DEFAULT_PRAYER_TEXT;
    }

    console.log('Default texts loaded successfully');
  } catch (error) {
    console.error('Error setting default texts:', error);
  }
}

// ===========================
// Sadhaka Management Functions
// ===========================

function populateSadhakaNameList() {
  const sadhakaNameList = document.getElementById('sadhakaNameList');
  sadhakaNameList.innerHTML = '';

  sadhakaNames.forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    sadhakaNameList.appendChild(option);
  });
}

function sadhakaNameTyping(name) {
  const sadhakaNameInput = document.getElementById('sadhakaName');
  const suggestionsDiv = document.getElementById('sadhakaNameSuggestions');

  if (suggestionsDiv) {
    suggestionsDiv.innerHTML = '';
    suggestionsDiv.style.display = 'none';
  }

  if (name.trim().length === 0) {
    clearSadhakaDiv();
    sadhakaNameInput.removeAttribute('data-loaded-name');
    return;
  }

  const matchingNames = sadhakaNames.filter(sadhaka =>
    sadhaka.toLowerCase().startsWith(name.toLowerCase())
  );

  if (matchingNames.length > 0 && suggestionsDiv) {
    suggestionsDiv.style.display = 'block';
    matchingNames.forEach(sadhaka => {
      const suggestionDiv = document.createElement('div');
      suggestionDiv.textContent = sadhaka;
      suggestionDiv.onclick = function () {
        sadhakaNameInput.value = sadhaka;
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
        sadhakaNameSelected(sadhaka);
      };
      suggestionsDiv.appendChild(suggestionDiv);
    });
  }
}

function sadhakaNameSelected(name) {
  const sadhakaNameInput = document.getElementById('sadhakaName');

  if (name.trim() !== '' && sadhakaNames.includes(name) &&
    sadhakaNameInput.getAttribute('data-loaded-name') !== name) {
    clearSadhakaDiv();
    sadhakaNameInput.value = name;
    loadSadhaka(name);
  } else if (name.trim() === '') {
    clearSadhakaDiv();
    sadhakaNameInput.removeAttribute('data-loaded-name');
  } else if (!sadhakaNames.includes(name) && name.trim() !== '') {
    clearSadhakaDiv();
    sadhakaNameInput.value = name;
    sadhakaNameInput.removeAttribute('data-loaded-name');
  }
}

async function loadSadhaka(name) {
  console.log("Loading sadhaka:", name);
  const sadhakaNameInput = document.getElementById('sadhakaName');
  sadhakaNameInput.setAttribute('data-loaded-name', name);

  try {
    const doc = await db.collection('sadhakas').doc(name).get();

    if (doc.exists) {
      console.log("Sadhaka data found:", doc.data());
      displaySadhaka(doc.data());
    } else {
      console.log("No sadhaka found with name:", name + ". Initializing for new sadhaka.");
      const newSadhaka = createNewSadhaka(name);
      clearSadhakaDiv();
      document.getElementById('sadhakaName').value = name;
      displaySadhaka(newSadhaka);
    }

    document.querySelector('button[onclick="saveSadhakaWithCategory()"]').style.display = 'inline-block';
    document.querySelector('button[onclick="saveSadhakaReportAsPdf()"]').style.display = 'inline-block';
  } catch (error) {
    console.error("Error getting document:", error);
    const tempName = document.getElementById('sadhakaName').value;
    clearSadhakaDiv();
    document.getElementById('sadhakaName').value = tempName;
    alert("Error loading sadhaka data. Please try again.");
  }
}

function createNewSadhaka(name) {
  const newSadhaka = {
    name: name,
    prayerText: DEFAULT_PRAYER_TEXT,
    dietAndAdditionalNotes: DEFAULT_DIET_TEXT,
    routineText: DEFAULT_ROUTINE_TEXT,
    advisoryText: '',
    jointsAndGlandsNotes: '',
    cardioNotes: '',
    nonCardioNotes: ''
  };

  CATEGORIES.forEach(category => {
    if (category.type === 'asanas') {
      newSadhaka[category.elementId] = [];
    }
  });

  return newSadhaka;
}

function displaySadhaka(sadhaka) {
  console.log("Displaying sadhaka data:", sadhaka);

  // Load category notes
  document.getElementById('jointsAndGlandsNotes').value = sadhaka.jointsAndGlandsNotes || '';
  document.getElementById('cardioNotes').value = sadhaka.cardioNotes || '';
  document.getElementById('nonCardioNotes').value = sadhaka.nonCardioNotes || '';

  // Handle section ordering
  const mainContainer = document.body;
  const allCategoryIds = CATEGORIES.map(cat => cat.id);
  let currentCategoryOrder = sadhaka.categoryOrder || allCategoryIds;

  currentCategoryOrder = currentCategoryOrder.filter(id => allCategoryIds.includes(id));
  const newCategories = allCategoryIds.filter(id => !currentCategoryOrder.includes(id));
  currentCategoryOrder = currentCategoryOrder.concat(newCategories);

  const fragment = document.createDocumentFragment();
  currentCategoryOrder.forEach(sectionId => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      fragment.appendChild(sectionElement);
    }
  });
  mainContainer.append(fragment);

  // Populate content
  CATEGORIES.forEach(category => {
    if (category.type === 'text') {
      const element = document.getElementById(category.elementId);
      if (element) {
        if (category.elementId === 'dietAndAdditionalNotes' &&
          (!sadhaka[category.elementId] || sadhaka[category.elementId].trim() === '')) {
          element.value = DEFAULT_DIET_TEXT;
        } else if (category.elementId === 'routineText' &&
          (!sadhaka[category.elementId] || sadhaka[category.elementId].trim() === '')) {
          element.value = DEFAULT_ROUTINE_TEXT;
        } else if (category.elementId === 'prayerText' &&
          (!sadhaka[category.elementId] || sadhaka[category.elementId].trim() === '')) {
          element.value = DEFAULT_PRAYER_TEXT;
        } else {
          element.value = sadhaka[category.elementId] || '';
        }
      }
    } else if (category.type === 'asanas') {
      const containerDiv = document.getElementById(category.elementId);
      if (containerDiv) {
        containerDiv.innerHTML = '';
        if (Array.isArray(sadhaka[category.elementId])) {
          sadhaka[category.elementId].forEach(asana => {
            const asanaDiv = createAsanaDivWithCategory(asana, category.category);
            containerDiv.appendChild(asanaDiv);
          });
        }
      }
    }
  });

  console.log("Sadhaka data displayed successfully.");
  setupDragAndDrop();
}

function clearSadhakaDiv() {
  console.log("Clearing Sadhaka UI...");

  CATEGORIES.forEach(category => {
    if (category.type === 'text') {
      const element = document.getElementById(category.elementId);
      if (element) {
        if (category.elementId === 'prayerText') {
          element.value = DEFAULT_PRAYER_TEXT;
        } else if (category.elementId === 'dietAndAdditionalNotes') {
          element.value = DEFAULT_DIET_TEXT;
        } else if (category.elementId === 'routineText') {
          element.value = DEFAULT_ROUTINE_TEXT;
        } else {
          element.value = '';
        }
      }
    } else if (category.type === 'asanas') {
      const containerDiv = document.getElementById(category.elementId);
      if (containerDiv) {
        containerDiv.innerHTML = '';
      }
    }
  });

  document.getElementById('jointsAndGlandsNotes').value = '';
  document.getElementById('cardioNotes').value = '';
  document.getElementById('nonCardioNotes').value = '';

  console.log("Sadhaka UI cleared.");
}

async function saveSadhakaWithCategory() {
  const sadhakaNameInput = document.getElementById('sadhakaName');
  const sadhakaName = sadhakaNameInput.value;

  if (!sadhakaName) {
    alert('Please enter a Sadhaka name to save.');
    return;
  }

  const sadhaka = {
    name: sadhakaName,
    jointsAndGlandsNotes: document.getElementById('jointsAndGlandsNotes').value,
    cardioNotes: document.getElementById('cardioNotes').value,
    nonCardioNotes: document.getElementById('nonCardioNotes').value
  };

  CATEGORIES.forEach(category => {
    if (category.type === 'text') {
      sadhaka[category.elementId] = document.getElementById(category.elementId).value;
    } else if (category.type === 'asanas') {
      sadhaka[category.elementId] = getAsanasFromDiv(document.getElementById(category.elementId));
    }
  });

  const sectionElements = document.querySelectorAll('.section');
  sadhaka.categoryOrder = Array.from(sectionElements).map(section => section.id);

  try {
    await saveSadhakaToDB(sadhaka);
    alert('Saved successfully!');

    if (!sadhakaNames.includes(sadhakaName)) {
      sadhakaNames.push(sadhakaName);
      populateSadhakaNameList();
    }
  } catch (error) {
    console.log("Error saving sadhaka:", error);
    alert('Error saving Sadhaka. Please check the console for details.');
  }
}

async function saveSadhakaToDB(sadhaka) {
  if (!sadhaka.name) {
    console.error('Error: sadhaka.name is not defined or is an empty string.');
    return;
  }

  try {
    await db.collection('sadhakas').doc(sadhaka.name).set(sadhaka, { merge: true });
    console.log('Sadhaka data has been saved with ID: ', sadhaka.name);
  } catch (error) {
    console.error('Error saving sadhaka: ', error);
    throw error;
  }
}

async function deleteSadhaka() {
  const sadhakaName = document.getElementById('sadhakaName').value;

  if (!sadhakaName) {
    alert('Please select a sadhaka to delete');
    return;
  }

  if (confirm(`Are you sure you want to delete ${sadhakaName}?`)) {
    try {
      await db.collection('sadhakas').doc(sadhakaName).delete();
      alert('Sadhaka deleted successfully');

      sadhakaNames = sadhakaNames.filter(name => name !== sadhakaName);
      populateSadhakaNameList();

      document.getElementById('sadhakaName').value = '';
      clearSadhakaDiv();
    } catch (error) {
      console.error('Error deleting sadhaka:', error);
      alert('Error deleting sadhaka');
    }
  }
}

// ===========================
// Asana Management Functions
// ===========================

function getAsanasFromDiv(div) {
  const asanasArray = [];
  if (!div) return asanasArray;

  for (let i = 0; i < div.children.length; i++) {
    const asanaDiv = div.children[i];
    const asanaName = asanaDiv.querySelector('.asanaNameSelect')?.value || '';
    const isSectionWithNotes = ['jointsAndGlandsDiv', 'cardioDiv', 'nonCardioDiv'].includes(div.id);

    const asana = {
      asanaName: asanaName
    };

    if (!isSectionWithNotes) {
      asana.repetitions = asanaDiv.querySelector('#repetitionsInput')?.value || '';
    }

    const specialNotesTextarea = asanaDiv.querySelector('#specialNotesTextarea');
    if (specialNotesTextarea) {
      asana.specialNotes = specialNotesTextarea.value || '';
    }

    if (asana.asanaName) {
      asanasArray.push(asana);
    }
  }
  return asanasArray;
}

function addAsana(divId, category) {
  console.log("Adding asana. Category:", category, "Asanas:", asanas);

  if (!Array.isArray(asanas) || asanas.length === 0) {
    console.error("Asanas not loaded properly. Attempting to reload...");
    loadAsanas().then((fetchedAsanas) => {
      asanas = fetchedAsanas;
      addAsanaToDiv(divId, category);
    }).catch((error) => {
      console.error("Error reloading asanas:", error);
    });
  } else {
    addAsanaToDiv(divId, category);
  }
}

function addAsanaToDiv(divId, category) {
  const categoryDiv = document.getElementById(divId);
  const asanaDiv = createAsanaDiv();
  const asanaNameSelect = createAsanaNameSelect(category);
  asanaDiv.appendChild(asanaNameSelect);

  $(asanaNameSelect).select2({
    width: 'resolve',
    minimumResultsForSearch: 1
  });

  const infoButton = createInfoButton(asanaNameSelect);
  infoButton.style.flexShrink = '0';
  infoButton.style.marginLeft = '10px';
  infoButton.style.marginRight = '10px';
  asanaDiv.appendChild(infoButton);

  const excludeRepetitions = ['Joints and Glands', 'Physical Asana', 'Relaxation', 'Meditative Asana', 'Meditation'];

  if (!excludeRepetitions.includes(category)) {
    const repetitionsInput = createRepetitionsInput();
    repetitionsInput.style.flex = '1';
    repetitionsInput.style.maxWidth = '80px';
    repetitionsInput.style.marginRight = '10px';
    asanaDiv.appendChild(repetitionsInput);
  } else {
    $(asanaNameSelect).next('.select2-container').css('flex', '5');
  }

  if (category !== 'Joints and Glands' && category !== 'Physical Asana') {
    const specialNotesTextarea = createSpecialNotesTextarea();
    specialNotesTextarea.style.flex = '2';
    specialNotesTextarea.style.marginRight = '10px';
    asanaDiv.appendChild(specialNotesTextarea);
  }

  const deleteButton = createDeleteButton(asanaDiv);
  deleteButton.style.flexShrink = '0';
  deleteButton.style.marginLeft = 'auto';
  asanaDiv.appendChild(deleteButton);

  categoryDiv.appendChild(asanaDiv);
}

function createAsanaDiv() {
  const asanaDiv = document.createElement('div');
  asanaDiv.style.display = 'flex';
  asanaDiv.style.flexWrap = 'no-wrap';
  asanaDiv.style.alignItems = 'center';
  asanaDiv.style.justifyContent = 'space-between';
  asanaDiv.style.marginBottom = '10px';
  return asanaDiv;
}

function createAsanaDivWithCategory(asana, category) {
  const excludeIndividualNotes = ['Joints and Glands', 'Physical Asana'];
  const excludeRepetitions = ['Joints and Glands', 'Physical Asana', 'Relaxation', 'Meditative Asana', 'Meditation'];

  const asanaDiv = createAsanaDiv();
  const asanaNameSelect = createAsanaNameSelect(category);
  asanaDiv.appendChild(asanaNameSelect);

  $(asanaNameSelect).select2({
    width: 'resolve',
    minimumResultsForSearch: 1
  });

  if (asana && asana.asanaName) {
    if ($(asanaNameSelect).find(`option[value='${asana.asanaName}']`).length) {
      $(asanaNameSelect).val(asana.asanaName).trigger('change');
    } else {
      console.warn(`Asana '${asana.asanaName}' not found in the dropdown for category '${category}'.`);
    }
  }

  const infoButton = createInfoButton(asanaNameSelect);
  infoButton.style.flexShrink = '0';
  infoButton.style.marginLeft = '10px';
  infoButton.style.marginRight = '10px';
  asanaDiv.appendChild(infoButton);

  if (!excludeRepetitions.includes(category)) {
    const repetitionsInput = createRepetitionsInput(asana);
    repetitionsInput.style.flex = '1';
    repetitionsInput.style.maxWidth = '80px';
    repetitionsInput.style.marginRight = '10px';
    asanaDiv.appendChild(repetitionsInput);
  } else {
    $(asanaNameSelect).next('.select2-container').css('flex', '5');
  }

  if (!excludeIndividualNotes.includes(category)) {
    const specialNotesTextarea = createSpecialNotesTextarea(asana);
    specialNotesTextarea.style.flex = '2';
    specialNotesTextarea.style.marginRight = '10px';
    asanaDiv.appendChild(specialNotesTextarea);
  }

  const deleteButton = createDeleteButton(asanaDiv);
  deleteButton.style.flexShrink = '0';
  deleteButton.style.marginLeft = 'auto';
  asanaDiv.appendChild(deleteButton);

  return asanaDiv;
}

function createAsanaNameSelect(category) {
  const asanaNameSelect = document.createElement('select');
  asanaNameSelect.classList.add('asanaNameSelect');

  const filteredAsanas = asanas.filter(asana => asana[3] === category);

  filteredAsanas.forEach((asanaOption) => {
    const option = document.createElement('option');
    option.value = asanaOption[0];
    option.text = asanaOption[2] || asanaOption[0];
    asanaNameSelect.appendChild(option);
  });

  return asanaNameSelect;
}

function createInfoButton(asanaNameSelect) {
  const infoButton = document.createElement('button');
  infoButton.textContent = '?';
  infoButton.className = 'info-button';

  infoButton.addEventListener('click', function (event) {
    event.stopPropagation();
    const asanaName = asanaNameSelect.value;
    const asana = asanas.find(asana => asana[0] === asanaName);

    if (asana) {
      displayAsanaDescription(asana[1], infoButton);
    }
  });

  return infoButton;
}

function createRepetitionsInput(asana) {
  const repetitionsInput = document.createElement('input');
  repetitionsInput.id = 'repetitionsInput';
  repetitionsInput.value = asana && asana.repetitions ? asana.repetitions : '';
  repetitionsInput.placeholder = 'Repetitions';
  return repetitionsInput;
}

function createSpecialNotesTextarea(asana) {
  const specialNotesTextarea = document.createElement('textarea');
  specialNotesTextarea.id = 'specialNotesTextarea';
  specialNotesTextarea.value = asana && asana.specialNotes ? asana.specialNotes : '';
  specialNotesTextarea.placeholder = 'Special notes';
  specialNotesTextarea.className = 'special-notes';
  return specialNotesTextarea;
}

function createDeleteButton(asanaDiv) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '-';
  deleteButton.className = 'delete-button';
  deleteButton.onclick = function () {
    asanaDiv.remove();
  };
  return deleteButton;
}

function displayAsanaDescription(description, infoButton) {
  const asanaDescriptionDiv = document.getElementById('asanaDescription');
  asanaDescriptionDiv.textContent = description;
  asanaDescriptionDiv.style.display = 'block';

  const infoButtonRect = infoButton.getBoundingClientRect();
  const infoButtonTop = infoButtonRect.top + window.pageYOffset;
  const infoButtonLeft = infoButtonRect.left + window.pageXOffset;

  asanaDescriptionDiv.style.top = infoButtonTop + 'px';
  asanaDescriptionDiv.style.left = (infoButtonLeft + infoButton.offsetWidth) + 'px';

  document.addEventListener('click', function hideDescription(e) {
    if (!asanaDescriptionDiv.contains(e.target) && !infoButton.contains(e.target)) {
      asanaDescriptionDiv.style.display = 'none';
      document.removeEventListener('click', hideDescription);
    }
  });
}

// ===========================
// Multi-Select Functions
// ===========================

function showMultiAsanaModal(category, asanaCategory) {
  console.log("Showing multi asana modal. Category:", category, "Asana Category:", asanaCategory);
  const modal = document.getElementById('multiAsanaModal');
  modal.style.display = "block";
  modal.setAttribute('data-category', category);
  modal.setAttribute('data-asana-category', asanaCategory);
  populateAsanaCheckboxList(asanaCategory);
}

function closeMultiAsanaModal() {
  const modal = document.getElementById('multiAsanaModal');
  modal.style.display = "none";
}

function populateAsanaCheckboxList(category) {
  console.log("Populating asana checkbox list. Category:", category, "Asanas:", asanas);
  const tableBody = document.getElementById('asanaCheckboxTableBody');
  tableBody.innerHTML = '';

  const filteredAsanas = asanas.filter(asana => asana[3] === category);

  if (filteredAsanas.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="2">No asanas found for this category.</td></tr>';
    return;
  }

  filteredAsanas.forEach(asana => {
    const row = tableBody.insertRow();

    const checkboxCell = row.insertCell(0);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = asana[0];
    checkbox.id = "asana_" + asana[0].replace(/\s+/g, '_');
    checkboxCell.appendChild(checkbox);

    const nameCell = row.insertCell(1);
    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = checkbox.id;
    nameLabel.textContent = asana[2] || asana[0];
    nameCell.appendChild(nameLabel);
  });
}

function addMultipleAsanas() {
  const modal = document.getElementById('multiAsanaModal');
  const category = modal.getAttribute('data-category');
  const asanaCategory = modal.getAttribute('data-asana-category');
  const rows = document.querySelectorAll('#asanaCheckboxTableBody tr');

  rows.forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      const asanaName = checkbox.value;
      const asana = {
        asanaName: asanaName,
        repetitions: '',
        specialNotes: ''
      };
      addAsanaToCategory(asana, category, asanaCategory);
    }
  });

  closeMultiAsanaModal();
}

function addAsanaToCategory(asana, containerDivId, categoryType) {
  const categoryDiv = document.getElementById(containerDivId);
  if (!categoryDiv) {
    console.error("Container div not found:", containerDivId);
    return;
  }

  const asanaDiv = createAsanaDiv();
  const asanaNameSelect = createAsanaNameSelect(categoryType);
  asanaDiv.appendChild(asanaNameSelect);

  $(asanaNameSelect).select2({
    width: 'resolve',
    minimumResultsForSearch: 1
  });

  if (asana && asana.asanaName) {
    if ($(asanaNameSelect).find(`option[value='${asana.asanaName}']`).length) {
      $(asanaNameSelect).val(asana.asanaName).trigger('change');
    }
  }

  const infoButton = createInfoButton(asanaNameSelect);
  infoButton.style.flexShrink = '0';
  infoButton.style.marginLeft = '10px';
  infoButton.style.marginRight = '10px';
  asanaDiv.appendChild(infoButton);

  const excludeRepetitions = ['Joints and Glands', 'Physical Asana', 'Relaxation', 'Meditative Asana', 'Meditation'];
  const excludeIndividualNotes = ['Joints and Glands', 'Physical Asana'];

  if (!excludeRepetitions.includes(categoryType)) {
    const repetitionsInput = createRepetitionsInput(asana);
    repetitionsInput.style.flex = '1';
    repetitionsInput.style.maxWidth = '80px';
    repetitionsInput.style.marginRight = '10px';
    asanaDiv.appendChild(repetitionsInput);
  } else {
    $(asanaNameSelect).next('.select2-container').css('flex', '5');
  }

  if (!excludeIndividualNotes.includes(categoryType)) {
    const specialNotesTextarea = createSpecialNotesTextarea(asana);
    specialNotesTextarea.style.flex = '2';
    specialNotesTextarea.style.marginRight = '10px';
    asanaDiv.appendChild(specialNotesTextarea);
  }

  const deleteButton = createDeleteButton(asanaDiv);
  deleteButton.style.flexShrink = '0';
  deleteButton.style.marginLeft = 'auto';
  asanaDiv.appendChild(deleteButton);

  categoryDiv.appendChild(asanaDiv);
}

function filterAsanas() {
  const searchValue = document.getElementById('asanaSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#asanaCheckboxTableBody tr');

  rows.forEach(row => {
    const label = row.querySelector('label');
    if (label) {
      const asanaName = label.textContent.toLowerCase();
      row.style.display = asanaName.includes(searchValue) ? "" : "none";
    }
  });
}

// ===========================
// Multi-Delete Functions
// ===========================

function showMultiDeleteModal() {
  const modal = document.getElementById('multiDeleteModal');
  modal.style.display = 'block';
  populateSadhakaCheckboxes();
}

function closeMultiDeleteModal() {
  const modal = document.getElementById('multiDeleteModal');
  modal.style.display = 'none';
}

function populateSadhakaCheckboxes() {
  const container = document.getElementById('sadhakaCheckboxList');
  container.innerHTML = '';

  if (sadhakaNames.length === 0) {
    loadSadhakaNames().then(names => {
      sadhakaNames = names;
      renderSadhakaCheckboxes(container);
    }).catch(error => {
      console.error("Error loading sadhaka names for multi-delete:", error);
      container.textContent = "Error loading sadhakas.";
    });
  } else {
    renderSadhakaCheckboxes(container);
  }
}

function renderSadhakaCheckboxes(container) {
  sadhakaNames.forEach(name => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.padding = '4px 0';
    div.style.width = '100%';

    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.style.width = '24px';
    checkboxWrapper.style.display = 'flex';
    checkboxWrapper.style.justifyContent = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = name;
    checkbox.id = `sadhaka-${name}`;
    checkboxWrapper.appendChild(checkbox);

    const label = document.createElement('label');
    label.htmlFor = `sadhaka-${name}`;
    label.textContent = name;
    label.style.marginLeft = '8px';
    label.style.flex = '1';

    div.appendChild(checkboxWrapper);
    div.appendChild(label);
    container.appendChild(div);
  });

  document.getElementById('sadhakaSearchInput').addEventListener('input', function (e) {
    const searchText = e.target.value.toLowerCase();
    const checkboxDivs = container.children;

    Array.from(checkboxDivs).forEach(div => {
      const label = div.querySelector('label');
      const shouldShow = label.textContent.toLowerCase().includes(searchText);
      div.style.display = shouldShow ? 'flex' : 'none';
    });
  });
}

async function deleteSelectedSadhakas() {
  const selected = Array.from(document.querySelectorAll('#sadhakaCheckboxList input:checked'))
    .map(cb => cb.value);

  if (selected.length === 0) {
    alert('Please select at least one sadhaka to delete');
    return;
  }

  if (confirm(`Are you sure you want to delete ${selected.length} sadhaka(s)?`)) {
    try {
      const batch = db.batch();
      selected.forEach(name => {
        const ref = db.collection('sadhakas').doc(name);
        batch.delete(ref);
      });

      await batch.commit();
      alert('Selected sadhakas deleted successfully');

      sadhakaNames = sadhakaNames.filter(name => !selected.includes(name));
      populateSadhakaNameList();

      document.getElementById('sadhakaName').value = '';
      clearSadhakaDiv();
      closeMultiDeleteModal();
    } catch (error) {
      console.error('Error deleting sadhakas:', error);
      alert('Error deleting sadhakas');
    }
  }
}

// ===========================
// User Management Functions
// ===========================

function showUserManagement() {
  if (!currentUser?.isAdmin) {
    alert("You don't have permission to access user management.");
    return;
  }

  const modal = document.getElementById('userManagementModal');
  modal.style.display = 'block';
  loadUsers();
}

function closeUserManagementModal() {
  const modal = document.getElementById('userManagementModal');
  modal.style.display = 'none';
}

async function loadUsers() {
  const usersTableBody = document.getElementById('usersTableBody');
  usersTableBody.innerHTML = '';

  try {
    const snapshot = await db.collection('login').get();
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const row = createUserRow(userData);
      usersTableBody.appendChild(row);
    });
  } catch (error) {
    showUserMessage('Error loading users: ' + error.message, true);
  }
}

function createUserRow(userData) {
  const row = document.createElement('tr');
  row.style.borderBottom = '1px solid #ddd';

  const nameCell = document.createElement('td');
  nameCell.textContent = userData.id;
  nameCell.style.padding = '12px';
  nameCell.style.border = '1px solid #ddd';

  const adminCell = document.createElement('td');
  adminCell.textContent = userData.isAdmin ? 'Admin' : 'User';
  adminCell.style.padding = '12px';
  adminCell.style.border = '1px solid #ddd';

  const actionCell = document.createElement('td');
  actionCell.style.padding = '12px';
  actionCell.style.border = '1px solid #ddd';

  if (userData.id !== 'radhikama' && userData.id !== 'samaya') {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.padding = '6px 12px';
    deleteButton.style.backgroundColor = '#ff4444';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '4px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.onmouseover = function () {
      this.style.backgroundColor = '#cc0000';
    };
    deleteButton.onmouseout = function () {
      this.style.backgroundColor = '#ff4444';
    };
    deleteButton.onclick = () => deleteUser(userData.id);
    actionCell.appendChild(deleteButton);
  }

  row.appendChild(nameCell);
  row.appendChild(adminCell);
  row.appendChild(actionCell);

  return row;
}

async function addUser() {
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const isAdmin = document.getElementById('isAdmin').checked;

  if (!username || !password) {
    showUserMessage('Please enter both username and password', true);
    return;
  }

  try {
    await db.collection('login').doc(username).set({
      id: username,
      password: password,
      isAdmin: isAdmin
    });

    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('isAdmin').checked = false;
    showUserMessage('User added successfully');
    loadUsers();
  } catch (error) {
    showUserMessage('Error adding user: ' + error.message, true);
  }
}

async function deleteUser(userId) {
  if (userId === 'radhikama' || userId === 'samaya') {
    showUserMessage('Cannot delete default users', true);
    return;
  }

  try {
    await db.collection('login').doc(userId).delete();
    showUserMessage('User deleted successfully');
    loadUsers();
  } catch (error) {
    showUserMessage('Error deleting user: ' + error.message, true);
  }
}

function showUserMessage(message, isError = false) {
  const messageDiv = document.getElementById('userMessage');
  messageDiv.textContent = message;
  messageDiv.style.padding = '10px';
  messageDiv.style.marginTop = '10px';
  messageDiv.style.marginBottom = '10px';
  messageDiv.style.borderRadius = '4px';
  messageDiv.style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6';
  messageDiv.style.color = isError ? '#cc0000' : '#006600';
  messageDiv.style.border = `1px solid ${isError ? '#ffcccc' : '#ccffcc'}`;

  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.style.padding = '0';
    messageDiv.style.border = 'none';
    messageDiv.style.backgroundColor = 'transparent';
  }, 3000);
}

// ===========================
// Password Change Functions
// ===========================

function showChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  modal.style.display = 'block';
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
}

function closeChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  modal.style.display = 'none';
}

async function changePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('Please fill in all fields');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('New passwords do not match');
    return;
  }

  try {
    const userDoc = await db.collection('login')
      .where("id", "==", currentUser.id)
      .get();

    if (userDoc.empty || userDoc.docs[0].data().password !== currentPassword) {
      alert('Current password is incorrect');
      return;
    }

    await db.collection('login').doc(userDoc.docs[0].id).update({
      password: newPassword
    });

    alert('Password changed successfully');
    closeChangePasswordModal();
  } catch (error) {
    console.error('Error changing password:', error);
    alert('Error changing password');
  }
}

// ===========================
// Database Backup/Restore Functions
// ===========================

function showDatabaseBackupModal() {
  if (!currentUser?.isAdmin) {
    alert("You don't have permission to access database backup.");
    return;
  }

  const modal = document.getElementById('databaseBackupModal');
  modal.style.display = 'block';
}

function closeDatabaseBackupModal() {
  const modal = document.getElementById('databaseBackupModal');
  modal.style.display = 'none';
}

async function backupDatabase() {
  try {
    showBackupMessage('Creating backup...', false);

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {
        sadhakas: [],
        asanas: [],
        users: []
      }
    };

    // Backup sadhakas
    const sadhakasSnapshot = await db.collection('sadhakas').get();
    sadhakasSnapshot.forEach(doc => {
      backup.data.sadhakas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Backup asanas
    const asanasSnapshot = await db.collection('asanas').get();
    asanasSnapshot.forEach(doc => {
      backup.data.asanas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Backup users (excluding passwords for security)
    const usersSnapshot = await db.collection('login').get();
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      backup.data.users.push({
        id: userData.id,
        isAdmin: userData.isAdmin,
        // Note: We're not including passwords in the backup for security
      });
    });

    // Create and download the backup file
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sadhaka_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showBackupMessage('Backup created successfully!', false);
  } catch (error) {
    console.error('Error creating backup:', error);
    showBackupMessage('Error creating backup: ' + error.message, true);
  }
}

async function restoreDatabase() {
  const fileInput = document.getElementById('backupFile');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a backup file');
    return;
  }

  if (!confirm('Are you absolutely sure you want to restore from this backup? This will DELETE ALL current data and replace it with the backup data!')) {
    return;
  }

  try {
    showBackupMessage('Reading backup file...', false);

    const fileContent = await readFileAsText(file);
    const backup = JSON.parse(fileContent);

    // Validate backup structure
    if (!backup.data || !backup.data.sadhakas || !backup.data.asanas) {
      throw new Error('Invalid backup file format');
    }

    showBackupMessage('Restoring data... This may take a few minutes.', false);

    // Use batch operations for efficiency
    const batch = db.batch();
    let operationCount = 0;

    // Delete existing sadhakas
    const existingSadhakas = await db.collection('sadhakas').get();
    existingSadhakas.forEach(doc => {
      batch.delete(doc.ref);
      operationCount++;
    });

    // Delete existing asanas
    const existingAsanas = await db.collection('asanas').get();
    existingAsanas.forEach(doc => {
      batch.delete(doc.ref);
      operationCount++;
    });

    // Commit deletions if we're approaching the batch limit
    if (operationCount > 400) {
      await batch.commit();
      operationCount = 0;
    }

    // Restore sadhakas
    for (const sadhaka of backup.data.sadhakas) {
      const { id, ...data } = sadhaka;
      const ref = db.collection('sadhakas').doc(id);
      batch.set(ref, data);
      operationCount++;

      if (operationCount > 400) {
        await batch.commit();
        operationCount = 0;
      }
    }

    // Restore asanas
    for (const asana of backup.data.asanas) {
      const { id, ...data } = asana;
      const ref = id ? db.collection('asanas').doc(id) : db.collection('asanas').doc();
      batch.set(ref, data);
      operationCount++;

      if (operationCount > 400) {
        await batch.commit();
        operationCount = 0;
      }
    }

    // Commit any remaining operations
    if (operationCount > 0) {
      await batch.commit();
    }

    // Reload data
    await Promise.all([loadAsanas(), loadSadhakaNames()]);
    populateSadhakaNameList();
    clearSadhakaDiv();

    showBackupMessage('Database restored successfully!', false);
    fileInput.value = ''; // Clear the file input
  } catch (error) {
    console.error('Error restoring backup:', error);
    showBackupMessage('Error restoring backup: ' + error.message, true);
  }
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function showBackupMessage(message, isError = false) {
  const messageDiv = document.getElementById('backupMessage');
  messageDiv.textContent = message;
  messageDiv.style.padding = '10px';
  messageDiv.style.marginTop = '10px';
  messageDiv.style.borderRadius = '4px';
  messageDiv.style.backgroundColor = isError ? '#ffe6e6' : '#e6ffe6';
  messageDiv.style.color = isError ? '#cc0000' : '#006600';
  messageDiv.style.border = `1px solid ${isError ? '#ffcccc' : '#ccffcc'}`;

  if (!message.includes('...')) {
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.style.padding = '0';
      messageDiv.style.border = 'none';
      messageDiv.style.backgroundColor = 'transparent';
    }, 5000);
  }
}

// ===========================
// Drag and Drop Functions
// ===========================

function setupDragAndDrop() {
  const sections = document.querySelectorAll('.section');
  let draggedItem = null;

  const handleDragStart = (e) => {
    draggedItem = e.currentTarget.closest('.section');
    setTimeout(() => {
      draggedItem.classList.add('dragging');
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedItem.id);
  };

  const handleDragEnd = () => {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
      draggedItem = null;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const targetSection = e.currentTarget;

    if (draggedItem && draggedItem !== targetSection) {
      const rect = targetSection.getBoundingClientRect();
      const isAfter = (e.clientY - rect.top) / (rect.height) > 0.5;

      const parent = targetSection.parentNode;
      if (isAfter && targetSection.nextSibling) {
        parent.insertBefore(draggedItem, targetSection.nextSibling);
      } else if (!isAfter) {
        parent.insertBefore(draggedItem, targetSection);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
  };

  sections.forEach(section => {
    const h2Handle = section.querySelector('h2');

    if (h2Handle) {
      h2Handle.removeEventListener('dragstart', handleDragStart);
      h2Handle.removeEventListener('dragend', handleDragEnd);
    }
    section.removeEventListener('dragover', handleDragOver);
    section.removeEventListener('drop', handleDrop);

    if (h2Handle) {
      h2Handle.setAttribute('draggable', 'true');
      h2Handle.addEventListener('dragstart', handleDragStart);
      h2Handle.addEventListener('dragend', handleDragEnd);
    }
    section.addEventListener('dragover', handleDragOver);
    section.addEventListener('drop', handleDrop);
  });
}

// ===========================
// PDF Generation Functions
// ===========================

async function saveSadhakaReportAsPdf() {
  const asanasMap = await loadAsanasForPdf();
  const pdf = new jsPDF('p', 'pt', 'a4');
  const sadhakaName = document.getElementById('sadhakaName').value;

  const colors = {
    primaryText: '#333333',
    headerBlue: '#005A9C',
    lightGrey: '#CCCCCC',
    subtleText: '#777777',
    darkBrown: '#483a3a'
  };

  const pdfConfig = {
    pageWidth: pdf.internal.pageSize.width,
    pageHeight: pdf.internal.pageSize.height,
    margin: 50,
  };
  const contentWidth = pdfConfig.pageWidth - (2 * pdfConfig.margin);
  const centerX = pdfConfig.pageWidth / 2;

  // Simple Title Page
  pdf.setFont("helvetica", "normal");

  // Add simple border
  pdf.setDrawColor(colors.darkBrown);
  pdf.setLineWidth(2);
  pdf.rect(40, 40, pdfConfig.pageWidth - 80, pdfConfig.pageHeight - 80);

  // Add logo - centered and larger
  const logoUrl = 'https://images.squarespace-cdn.com/content/v1/62f11860fb33eb592879527c/73af335a-bc0d-4450-a4c0-32ad86ceb033/neue+weisse+blumen+logo.png';
  try {
    const logoWidth = 120;
    const logoHeight = 120;
    const logoDataUri = await urlToDataUri(logoUrl);
    if (logoDataUri) {
      pdf.addImage(logoDataUri, 'PNG', (pdfConfig.pageWidth - logoWidth) / 2, 120, logoWidth, logoHeight);
    }
  } catch (e) {
    console.error("Could not add logo to PDF:", e);
    // If logo fails, continue without it
  }

  // Title - properly centered with "PERSONAL" added
  pdf.setFontSize(26);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(colors.darkBrown);


  pdf.text("Personal Practice plan", centerX - 150, 300, { align: 'center' });


  // Decorative line under title
  pdf.setDrawColor(colors.darkBrown);
  pdf.setLineWidth(1);
  const lineWidth = 250;
  pdf.line(centerX - lineWidth / 2, 315, centerX + lineWidth / 2, 315);

  // "Prepared for" text
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(colors.subtleText);
  pdf.text("Prepared for", centerX, 380, { align: 'center' });

  // Student name
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(colors.primaryText);
  pdf.text(sadhakaName, centerX, 415, { align: 'center' });

  // Date section - single date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(colors.subtleText);
  pdf.text("Date", centerX, 480, { align: 'center' });

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(colors.primaryText);
  pdf.text(currentDate, centerX, 505, { align: 'center' });

  // Organization info at bottom
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(colors.darkBrown);
  pdf.text("Self Realization with Radhikaji", centerX, pdfConfig.pageHeight - 120, { align: 'center' });

  // Add liability statement page
  pdf.addPage();
  let y = pdfConfig.margin;

  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(colors.headerBlue);
  pdf.text("Important Notice", pdfConfig.margin, y);
  y += 30;

  pdf.setDrawColor(colors.lightGrey);
  pdf.setLineWidth(1);
  pdf.line(pdfConfig.margin, y, pdfConfig.pageWidth - pdfConfig.margin, y);
  y += 20;

  // Add liability statement
  const LIABILITY_STATEMENT = `This document has not been created by a medical doctor or healing practitioner. Therefore, please perform all practices mentioned in this document at your own discretion. 

If you have or have had an injury or acute illness, or if you have doubts about whether yoga practices are appropriate for you, you are responsible for contacting your physician as needed to inquire about your fitness level.

The instructions and advice given in yoga sessions are no substitute for professional medical or psychological care. The instructions and advice given in the following document is not a substitute for professional medical or psychological care. 

If you are pregnant or experiencing menopausal transition, you are responsible for taking special care of yourself and consulting your doctor as needed.

If you are menstruating, do not exceed your comfort levels.

In order for yoga practice to be beneficial for you and your all-round health, please let us know if you are suffering from physical illness or have any other health restrictions that would prevent you from participating in yoga practice or in individual yoga exercises. 

In case of severe health issues or chronic illness(es) please check with your doctor whether you are allowed to participate in the yoga related activities. Participation is at your own risk.

The use of any suggested devices or equipment such as the indoor bike, resistance bands, chairs, pillows or any other props is at the yoga participant's own risk.

Any cardio training suggested is to be practiced at your own discretion.`;

  pdf.setTextColor(colors.primaryText);
  pdf.setFontSize(11);
  y = addText(pdf, LIABILITY_STATEMENT, pdfConfig.margin, y, {
    ...pdfConfig,
    size: 11,
    font: 'helvetica',
    style: 'normal',
    maxWidth: contentWidth,
    currentY: y
  });

  // Main Content starts on new page
  pdf.addPage();
  y = pdfConfig.margin;

  const sectionElementsInOrder = Array.from(document.querySelectorAll('.section'));
  const sortedCategories = sectionElementsInOrder.map(sectionEl => {
    return CATEGORIES.find(cat => cat.id === sectionEl.id);
  }).filter(Boolean);

  for (const category of sortedCategories) {
    let categoryHasContent = false;
    let notes = '';

    const notesElementId = {
      'jointsAndGlandsDiv': 'jointsAndGlandsNotes',
      'cardioDiv': 'cardioNotes',
      'nonCardioDiv': 'nonCardioNotes'
    }[category.elementId];

    if (notesElementId) {
      notes = normalizeText(document.getElementById(notesElementId).value);
      if (notes) categoryHasContent = true;
    }

    if (category.type === 'text') {
      const content = normalizeText(document.getElementById(category.elementId).value);
      if (content && content.trim() !== '' &&
        content !== normalizeText(DEFAULT_PRAYER_TEXT) &&
        content !== normalizeText(DEFAULT_DIET_TEXT) &&
        content !== normalizeText(DEFAULT_ROUTINE_TEXT)) {
        categoryHasContent = true;
      }
    } else if (category.type === 'asanas') {
      const containerDiv = document.getElementById(category.elementId);
      if (containerDiv && containerDiv.children.length > 0) {
        categoryHasContent = true;
      }
    }

    if (!categoryHasContent) continue;

    let sectionIntroHeightEstimate = 48;
    if (notes) {
      const splitNotes = pdf.splitTextToSize(`Notes: ${notes}`, contentWidth);
      sectionIntroHeightEstimate += splitNotes.length * 14 + 10;
    }

    if (y + sectionIntroHeightEstimate > pdfConfig.pageHeight - pdfConfig.margin) {
      pdf.addPage();
      y = pdfConfig.margin;
    }

    // Section header
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(colors.headerBlue);
    pdf.text(category.title, pdfConfig.margin, y);
    y += 10;

    pdf.setDrawColor(colors.lightGrey);
    pdf.setLineWidth(1);
    pdf.line(pdfConfig.margin, y, pdfConfig.pageWidth - pdfConfig.margin, y);
    y += 20;

    if (notes) {
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(colors.primaryText);
      y = addText(pdf, `Notes: ${notes}`, pdfConfig.margin, y, {
        ...pdfConfig,
        size: 12,
        font: 'helvetica',
        style: 'italic',
        maxWidth: contentWidth,
        currentY: y
      });
      y += 10;
    }

    if (category.type === 'text') {
      const content = normalizeText(document.getElementById(category.elementId).value);
      if (content) {
        pdf.setTextColor(colors.primaryText);
        y = addText(pdf, content, pdfConfig.margin, y, {
          ...pdfConfig,
          size: 12,
          font: 'helvetica',
          style: 'normal',
          maxWidth: contentWidth,
          currentY: y
        });
      }
    } else if (category.type === 'asanas') {
      const containerDiv = document.getElementById(category.elementId);
      if (containerDiv && containerDiv.children.length > 0) {
        for (let i = 0; i < containerDiv.children.length; i++) {
          y = await addAsanaContent(pdf, containerDiv.children[i], {
            ...pdfConfig,
            y: y
          }, asanasMap, colors);
        }
      }
    }
    y += 20;
  }

  // Add page numbers and borders to all pages except title page
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    if (i === 1) {
      // Title page already has its special border
      continue;
    }

    // Standard border for other pages
    pdf.setDrawColor(colors.lightGrey);
    pdf.setLineWidth(0.5);
    pdf.rect(20, 20, pdfConfig.pageWidth - 40, pdfConfig.pageHeight - 40);

    // Add page number (skip title and liability pages)
    if (i > 2) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.subtleText);

      // Add student name in header - with more margin from edge
      const headerY = 35;
      pdf.text(sadhakaName, 40, headerY);

      // Add date with proper right alignment and margin
      const shortDate = new Date().toLocaleDateString('en-GB');
      const dateWidth = pdf.getStringUnitWidth(shortDate) * 10 / pdf.internal.scaleFactor;
      pdf.text(shortDate, pdfConfig.pageWidth - 40 - dateWidth, headerY);

      // Page number in footer
      pdf.text(`Page ${i - 2} of ${totalPages - 2}`, pdfConfig.pageWidth / 2, pdfConfig.pageHeight - 30, {
        align: 'center'
      });
    }
  }

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  pdf.save(`${sadhakaName}_sadhana_plan_${dateStr}.pdf`);
}

async function loadAsanasForPdf() {
  const returnAsanas = new Map();

  try {
    const querySnapshot = await db.collection('asanas').get();
    querySnapshot.forEach((doc) => {
      const asana = doc.data();
      returnAsanas.set(asana.name, asana.description);
    });

    console.log("Fetched Asana descriptions for PDF generation.");
    return returnAsanas;
  } catch (error) {
    console.log("Error fetching Asanas:", error);
    throw error;
  }
}

async function addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors) {
  const asanaNameSelect = asanaDiv.querySelector('.asanaNameSelect');
  if (!asanaNameSelect || !asanaNameSelect.value) {
    return pdfConfig.y;
  }

  let y = pdfConfig.y;
  const asanaName = asanaNameSelect.value;
  const repetitionsInput = asanaDiv.querySelector('#repetitionsInput');
  const specialNotesTextarea = asanaDiv.querySelector('#specialNotesTextarea');
  const contentWidth = pdfConfig.pageWidth - (2 * pdfConfig.margin);

  try {
    const asanaDoc = await db.collection('asanas').where("name", "==", asanaName).get();
    if (asanaDoc.empty) return y;

    const asanaData = asanaDoc.docs[0].data();

    const displayName = normalizeText(asanaData.displayName || asanaData.name);
    const repetitions = repetitionsInput ? normalizeText(repetitionsInput.value) : '';
    const specialNotes = specialNotesTextarea ? normalizeText(specialNotesTextarea.value) : '';
    const description = normalizeText(asanasMap.get(asanaName));

    // Calculate required height
    let requiredHeight = 0;
    requiredHeight += pdf.splitTextToSize(displayName, contentWidth).length * 14;
    requiredHeight += 10;

    if (asanaData.imageUrl) {
      requiredHeight += 200;
    }

    if (repetitions) {
      requiredHeight += 20;
    }
    if (specialNotes) {
      requiredHeight += pdf.splitTextToSize(specialNotes, contentWidth).length * 14;
      if (repetitions) requiredHeight += 5;
    }
    if (description) {
      requiredHeight += pdf.splitTextToSize(description, contentWidth).length * 14;
      if (repetitions || specialNotes) requiredHeight += 5;
    }
    requiredHeight += 25;

    if (y + requiredHeight > pdfConfig.pageHeight - pdfConfig.margin) {
      pdf.addPage();
      y = pdfConfig.margin;
    }

    // Add Image
    if (asanaData.imageUrl) {
      try {
        const base64data = await urlToDataUri(asanaData.imageUrl);
        const imageWidth = 180;
        const imageHeight = 180;
        const imageX = (pdfConfig.pageWidth - imageWidth) / 2;

        pdf.setDrawColor(colors.lightGrey);
        pdf.setLineWidth(1);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(imageX + 3, y + 3, imageWidth, imageHeight, 'F');
        pdf.addImage(base64data, 'PNG', imageX, y, imageWidth, imageHeight);
        pdf.rect(imageX, y, imageWidth, imageHeight, 'S');

        y += imageHeight + 20;
      } catch (e) {
        console.error("Error adding image:", e);
      }
    }

    // Asana Display Name
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(colors.primaryText);
    y = addText(pdf, displayName, pdfConfig.margin, y, {
      ...pdfConfig,
      size: 14,
      style: 'bold',
      maxWidth: contentWidth,
      currentY: y
    });
    y += 10;

    // Repetitions and Special Notes
    pdf.setFontSize(12);
    pdf.setTextColor(colors.primaryText);

    if (repetitions) {
      pdf.setFont("helvetica", "bold");
      pdf.text("Repetitions:", pdfConfig.margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.text(repetitions, pdfConfig.margin + 70, y);
      y += 20;
    }

    if (specialNotes) {
      pdf.setFont("helvetica", "bold");
      pdf.text("Special Notes:", pdfConfig.margin, y);
      pdf.setFont("helvetica", "italic");
      y = addText(pdf, specialNotes, pdfConfig.margin + 85, y, {
        ...pdfConfig,
        size: 12,
        style: 'italic',
        maxWidth: contentWidth - 85,
        currentY: y
      });
      y += 10;
    }

    // Description
    if (description) {
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(colors.primaryText);
      y = addText(pdf, description, pdfConfig.margin, y, {
        ...pdfConfig,
        size: 12,
        style: 'normal',
        maxWidth: contentWidth,
        currentY: y
      });
    }

    return y + 25;
  } catch (error) {
    console.error("Error in addAsanaContent:", error);
    return y;
  }
}

function normalizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let processedText = text.trim().replace(/\r\n/g, '\n').replace(/(\n\s*){2,}/g, '\n\n');
  const paragraphs = processedText.split('\n\n');
  const cleanedParagraphs = paragraphs.map(paragraph => {
    return paragraph.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  });

  return cleanedParagraphs.join('\n');
}

function addText(pdf, text, x, y, options) {
  const { maxWidth, font, size, style } = options;
  const lineHeight = size * 1.2;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 40;

  pdf.setFont(font, style);
  pdf.setFontSize(size);

  const lines = pdf.splitTextToSize(text, maxWidth);
  const blockHeight = lines.length * lineHeight;

  if (y + blockHeight > pageHeight - margin) {
    pdf.addPage();
    y = margin;
  }

  pdf.text(lines, x, y);
  return y + blockHeight;
}

function urlToDataUri(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
    .catch(error => {
      console.error('Error fetching image:', error);
      return null;
    });
}

// ===========================
// Event Listeners
// ===========================

window.onclick = function (event) {
  const multiAsanaModal = document.getElementById('multiAsanaModal');
  const multiDeleteModal = document.getElementById('multiDeleteModal');
  const changePasswordModal = document.getElementById('changePasswordModal');
  const userManagementModal = document.getElementById('userManagementModal');
  const databaseBackupModal = document.getElementById('databaseBackupModal');

  if (event.target == multiAsanaModal) {
    closeMultiAsanaModal();
  }
  if (event.target == multiDeleteModal) {
    closeMultiDeleteModal();
  }
  if (event.target == changePasswordModal) {
    closeChangePasswordModal();
  }
  if (event.target == userManagementModal) {
    closeUserManagementModal();
  }
  if (event.target == databaseBackupModal) {
    closeDatabaseBackupModal();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDefaultUsers();
});