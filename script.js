

const defaultDietText = `Do not eat raw foods like salad early in the morning or in the evening. 
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

const defaultRoutineText = `A structured routine is very important for you:
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

async function loadDefaultTexts() {
  try {
    // Set the default texts to the textareas if they're empty
    const dietTextArea = document.getElementById('dietAndAdditionalNotes');
    const routineTextArea = document.getElementById('routineText');
    
    if (!dietTextArea.value || dietTextArea.value.trim() === '') {
      dietTextArea.value = defaultDietText;
    }
    if (!routineTextArea.value || routineTextArea.value.trim() === '') {
      routineTextArea.value = defaultRoutineText;
    }
    
    console.log('Default texts loaded successfully');
  } catch (error) {
    console.error('Error setting default texts:', error);
  }
}


  // Initialize Firebase
  // TODO: replace with your own Firebase config
  var firebaseConfig = {
    apiKey: "AIzaSyD2Qv-8dC9atWBU_IFWXmxsGSp5T-_FOtM",
    authDomain: "sadhakacustomizer.firebaseapp.com",
    projectId: "sadhakacustomizer",
    storageBucket: "sadhakacustomizer.appspot.com",
    messagingSenderId: "401905258509",
    appId: "1:401905258509:web:cd9661bbe700b04fa00544"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

  var asanas = [];
  var sadhakaNames = [];
  var sadhakaNameInput = document.getElementById('sadhakaName');
  var sadhakaNameList = document.getElementById('sadhakaNameList');
  var sadhakaNameSuggestions = document.getElementById('sadhakaNameSuggestions');

 var categories = [
  { id: 'prayerText', title: 'Prayer', type: 'text' },
  { id: 'jointsAndGlandsDiv', title: 'Joints and Glands Asanas', type: 'asanas', category: 'Joints and Glands' },
  { id: 'relaxationDiv', title: 'Relaxation Asanas', type: 'asanas', category: 'Relaxation' },
  { id: 'cardioDiv', title: 'Cardio Day Asanas', type: 'asanas', category: 'Physical Asana' },
  { id: 'nonCardioDiv', title: 'Non-Cardio Day Asanas', type: 'asanas', category: 'Physical Asana' },
  { id: 'meditativeDiv', title: 'Meditative Asanas', type: 'asanas', category: 'Meditative' },
  { id: 'breathingDiv', title: 'Breathing Asanas', type: 'asanas', category: 'Breathing' },
  { id: 'pranayamaDiv', title: 'Pranayama', type: 'asanas', category: 'Pranayana' },
  { id: 'meditationDiv', title: 'Meditation', type: 'asanas', category: 'Meditation' },
  { id: 'dietAndAdditionalNotes', title: 'Diet and Additional Notes', type: 'text' }
];

  async function addContent(content, contentHeight) {
    if (y + contentHeight > 280) {
      pdf.addPage();
      y = 20; // reset y to top of the new page
    }
    pdf.text(content, 10, y);
    y += contentHeight;
  }

  async function saveSadhakaReportAsPdf() {
    const asanasMap = await loadAsanasForPdf();
    var pdf = new jsPDF();
    var sadhakaName = document.getElementById('sadhakaName').value;
    var state = { y: 20 };

    async function addContent(content, contentHeight) {
      if (state.y + contentHeight > 280) {
        pdf.addPage();
        state.y = 20;
      }
      pdf.text(content, 10, state.y);
      state.y += contentHeight;
    }

    pdf.setFontSize(16);
    pdf.setFontStyle("bold");
    await addContent(`Sadhaka report for ${sadhakaName}`, 10);

    for (let category of categories) {
      pdf.setFontSize(14);
      pdf.setFontStyle("bold");
      await addContent(category.title, 10);

      pdf.setFontSize(12);
      pdf.setFontStyle("normal");

      if (category.type === 'text') {
        var content = document.getElementById(category.id).value;
        var splitContent = pdf.splitTextToSize(content, 180);
        await addContent(splitContent, splitContent.length * 8);
      } else if (category.type === 'asanas') {
        var containerDiv = document.getElementById(category.id);
        for (let i = 0; i < containerDiv.children.length; i++) {
          await addAsanaToPdf(containerDiv.children[i], asanasMap, pdf, state);
        }
      }

      state.y += 10;
    }

    pdf.save('Sadhaka_report.pdf');
  }

  async function addAsanaToPdf(asanaDiv, asanasMap, pdf, state) {
    var asanaNameSelect = asanaDiv.querySelector('.asanaNameSelect');
    var repetitionsInput = asanaDiv.querySelector('#repetitionsInput');
    var specialNotesTextarea = asanaDiv.querySelector('#specialNotesTextarea');

    // Fetch the asana details including the imageURL from Firestore
    const asanaDoc = await db.collection('asanas').where("name", "==", asanaNameSelect.value).get();
    if (asanaDoc.empty) {
      console.log("No such asana found!");
      return; // Exit if the asana isn't found
    }
    const asanaData = asanaDoc.docs[0].data();

    // Use imageURL from Firestore
    let imageUrl = asanaData.imageUrl;
    // Use displayName from Firestore, fallback to name if not available
    let displayName = asanaData.displayName || asanaData.name;

    let response = await fetch(imageUrl);
    let blob = await response.blob();

    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onloadend = function () {
        let base64data = reader.result;
        let imgWidth = 50;
        let imgHeight = 50;

        if (state.y + imgHeight + 20 > 280) { // Add extra space for the name
          pdf.addPage();
          state.y = 20;
        }

        // Add asana display name in bold and underlined
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(displayName, 15, state.y);
        pdf.setLineWidth(0.5);
        var underlineWidth = pdf.getStringUnitWidth(displayName) * 14 / pdf.internal.scaleFactor;
        pdf.line(15, state.y + 1, 15 + underlineWidth, state.y + 1);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);

        // Move down after adding the name
        state.y += 10;

        // Add the image below the name
        pdf.addImage(base64data, 'PNG', 15, state.y, imgWidth, imgHeight);
        state.y += imgHeight + 10;

        resolve();
      }
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })
      .then(async () => {
        // Helper function to add content
        async function addContent(content, contentHeight) {
          if (state.y + contentHeight > 280) {
            pdf.addPage();
            state.y = 20; // reset y to top of the new page
          }
          pdf.text(content, 10, state.y);
          state.y += contentHeight;
        }

        // Description
        var asanaDescription = asanasMap.get(asanaNameSelect.value);
        var splitDescription = pdf.splitTextToSize(`Description: ${asanaDescription}`, 180);
        await addContent(splitDescription, splitDescription.length * 8);

        // Repetitions
        await addContent(`Repetitions: ${repetitionsInput.value}`, 8);

        // Special notes
        var specialNotesText = `Special notes: ${specialNotesTextarea.value}`;
        var splitNotes = pdf.splitTextToSize(specialNotesText, 180);
        await addContent(splitNotes, splitNotes.length * 8);

        state.y += 15;
      });
  }

  function urlToDataUri(url) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }


  async function loadAsanasForPdf() {
    let returnAsanas = new Map();
    try {
      const querySnapshot = await db.collection('asanas').get();

      querySnapshot.forEach((doc) => {
        let asana = doc.data();
        returnAsanas.set(asana.name, asana.description);
      });

      console.log("Fetched Asanas:");
      console.log(Array.from(returnAsanas.entries()));

      return returnAsanas;

    } catch (error) {
      console.log("Error fetching Asanas:", error);
      throw error;
    }
  }

  function loadAsanas() {
    return new Promise((resolve, reject) => {
      db.collection('asanas').get().then((querySnapshot) => {
        var returnAsanas = [];
        querySnapshot.forEach((doc) => {
          var asana = doc.data();
          var asanaTuple = [asana.name, asana.description, asana.displayName, asana.category];
          returnAsanas.push(asanaTuple);
        });
        console.log("Fetched Asanas:", returnAsanas);
        resolve(returnAsanas);
      }).catch((error) => {
        console.error("Error fetching Asanas:", error);
        reject(error);
      });
    });
  }


  function loadSadhakaNames() {
    return new Promise((resolve, reject) => {
      db.collection('sadhakas').get().then((querySnapshot) => {
        var names = [];
        querySnapshot.forEach((doc) => {
          names.push(doc.id);
        });
        resolve(names);
      }).catch((error) => {
        console.log("Error fetching Sadhaka names:", error);
        reject(error);
      });
    });
  }

  function initialize() {
    document.querySelector('.login-container').style.display = 'block';
    document.querySelector('#overlay').style.display = 'block';
    Promise.all([loadAsanas(), loadSadhakaNames(), loadDefaultTexts()])
      .then(([fetchedAsanas, fetchedNames]) => {
        asanas = fetchedAsanas;  // Assign fetched asanas to global asanas array
        sadhakaNames = fetchedNames;
        populateSadhakaNameList();
        console.log("Initialization complete. Asanas:", asanas);
      }).catch((error) => {
        console.error("Error initializing:", error);
      });
  }

  function populateSadhakaNameList() {
    sadhakaNameList.innerHTML = ''; // Clear previous options

    sadhakaNames.forEach((name) => {
      var option = document.createElement('option');
      option.value = name;
      sadhakaNameList.appendChild(option);
    });
  }

  function sadhakaNameChanged(name) {
    //var suggestionsDiv = document.getElementById('sadhakaNameSuggestions');
    //suggestionsDiv.innerHTML = ''; // clear previous suggestions
    //suggestionsDiv.style.display = 'none';

    var matchingNames = sadhakaNames.filter(sadhakaName => sadhakaName.startsWith(name));
    if (matchingNames.length > 0) {
      //suggestionsDiv.style.display = 'block';
    }
    matchingNames.forEach(sadhakaName => {
      var suggestionDiv = document.createElement('div');
      suggestionDiv.textContent = sadhakaName;
      suggestionDiv.onclick = function () {
        sadhakaNameInput.value = sadhakaName;
        //suggestionsDiv.innerHTML = ''; // clear suggestions
        //suggestionsDiv.style.display = 'none';
        loadSadhaka(sadhakaName);
      };
      //suggestionsDiv.appendChild(suggestionDiv);
    });

    // load Sadhaka details
    if (!sadhakaNames.includes(name)) {
      clearSadhakaDiv(); // Clear the div if the entered name is not found
    } else {
      loadSadhaka(name);
    }
  }

// Modify the clearSadhakaDiv function to include new sections
function clearSadhakaDiv() {
  var cardiosadhakaDiv = document.getElementById('cardioDiv');
  cardiosadhakaDiv.innerHTML = '';
  var noncardiosadhakaDiv = document.getElementById('nonCardioDiv');
  noncardiosadhakaDiv.innerHTML = '';
  var meditativeDiv = document.getElementById('meditativeDiv');
  meditativeDiv.innerHTML = '';
  var breathingDiv = document.getElementById('breathingDiv');
  breathingDiv.innerHTML = '';
  var pranayamaDiv = document.getElementById('pranayamaDiv');
  pranayamaDiv.innerHTML = '';
  var meditationDiv = document.getElementById('meditationDiv');
  meditationDiv.innerHTML = '';
  
  // Set default texts for diet and routine
  document.getElementById('dietAndAdditionalNotes').value = defaultDietText;
  document.getElementById('routineText').value = defaultRoutineText;
  document.getElementById('advisoryText').value = '';
}



  function createAsanaDivWithCategory(asana, category) {
    console.log("Creating asana div. Asana:", asana, "Category:", category);
    var asanaDiv = document.createElement('div');
    asanaDiv.style.display = 'flex';
    asanaDiv.style.flexWrap = 'no-wrap';
    asanaDiv.style.alignItems = 'center';
    asanaDiv.style.justifyContent = 'space-between';
    asanaDiv.style.marginBottom = '10px';

    var asanaNameSelect = createAsanaNameSelect(category);
    asanaDiv.appendChild(asanaNameSelect);
    $(asanaNameSelect).select2({
      width: '10%',
      minimumResultsForSearch: 1
    });

    var infoButton = createInfoButton(asanaNameSelect);
    asanaDiv.appendChild(infoButton);

    if (asana && asana.asanaName) {
      var matchingAsana = asanas.find(asanaOption => asanaOption[0].toLowerCase() === asana.asanaName.toLowerCase());
      if (!matchingAsana) {
        console.warn("No matching asana found for:", asana.asanaName);
        asanaNameSelect.style.border = '1px solid red';
      } else {
        $(asanaNameSelect).val(matchingAsana[0]).trigger('change');
      }
    } else {
      console.warn("Invalid asana object:", asana);
    }

    asanaNameSelect.addEventListener('change', function () {
      validateAsanaName(this.value, asanaNameSelect);
    });

    var repetitionsInput = createRepetitionsInput(asana);
    asanaDiv.appendChild(repetitionsInput);

    var specialNotesTextarea = createSpecialNotesTextarea(asana);
    asanaDiv.appendChild(specialNotesTextarea);

    var deleteButton = createDeleteButton(asanaDiv);
    asanaDiv.appendChild(deleteButton);

    return asanaDiv;
  }


  function createAsanaNameSelect(category) {
    console.log("Creating asana select. Category:", category, "Asanas:", asanas);
    var asanaNameSelect = document.createElement('select');
    asanaNameSelect.style.padding = '10px';
    asanaNameSelect.style.borderRadius = '5px';
    asanaNameSelect.style.border = '1px solid #cccccc';
    asanaNameSelect.style.backgroundColor = '#ffffff';
    asanaNameSelect.style.color = '#333333';
    asanaNameSelect.style.width = 'auto';

    // Filter asanas by category
    var filteredAsanas = asanas.filter(asana => asana[3] === category);
    console.log("Filtered asanas:", filteredAsanas);

    // Populate the dropdown options
    filteredAsanas.forEach((asanaOption) => {
      var option = document.createElement('option');
      option.value = asanaOption[0];
      option.text = asanaOption[2] || asanaOption[0]; // Use displayName if available, otherwise use name
      asanaNameSelect.appendChild(option);
    });

    asanaNameSelect.classList.add('asanaNameSelect');
    return asanaNameSelect;
  }

  function createInfoButton(asanaNameSelect) {
    var infoButton = document.createElement('button');
    infoButton.textContent = '?';
    infoButton.className = 'info-button';

    infoButton.addEventListener('click', function (event) {
      event.stopPropagation();

      var asanaName = asanaNameSelect.value;
      var asana = asanas.find(asana => asana[0] === asanaName);

      if (asana) {
        displayAsanaDescription(asana[1], infoButton);
      }
    });

    return infoButton;
  }

  function createRepetitionsInput(asana) {
    var repetitionsInput = document.createElement('input');
    repetitionsInput.id = 'repetitionsInput';
    repetitionsInput.value = asana && asana.repetitions ? asana.repetitions : '';
    repetitionsInput.placeholder = 'Repetitions';
    repetitionsInput.style.flex = '2';
    repetitionsInput.style.margin = '0 10px';
    return repetitionsInput;
  }

  function createSpecialNotesTextarea(asana) {
    var specialNotesTextarea = document.createElement('textarea');
    specialNotesTextarea.id = 'specialNotesTextarea';
    specialNotesTextarea.value = asana && asana.specialNotes ? asana.specialNotes : '';
    specialNotesTextarea.style.flex = '0.8';
    specialNotesTextarea.placeholder = 'Special notes';
    specialNotesTextarea.className = 'special-notes';
    specialNotesTextarea.style.margin = '0 10px';
    return specialNotesTextarea;
  }

  function createDeleteButton(asanaDiv) {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = '-';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function () {
      asanaDiv.remove();
    }
    deleteButton.style.margin = '0 10px'; // Added margins to leave gaps

    return deleteButton;
  }


  function displaySadhaka(sadhaka) {
  console.log("Displaying sadhaka:", sadhaka);

  categories.forEach(category => {
    if (category.type === 'text') {
      const element = document.getElementById(category.id);
      if (category.id === 'dietAndAdditionalNotes' && (!sadhaka[category.id] || sadhaka[category.id].trim() === '')) {
        element.value = defaultDietText;
      } else if (category.id === 'routineText' && (!sadhaka[category.id] || sadhaka[category.id].trim() === '')) {
        element.value = defaultRoutineText;
      } else {
        element.value = sadhaka[category.id] || '';
      }
    } else if (category.type === 'asanas') {
      var containerDiv = document.getElementById(category.id);
      containerDiv.innerHTML = '';
      if (Array.isArray(sadhaka[category.id])) {
        sadhaka[category.id].forEach(asana => {
          var asanaDiv = createAsanaDivWithCategory(asana, category.category);
          containerDiv.appendChild(asanaDiv);
        });
      }
    }
  });
}

  function displayAsanasForCategory(asanaList, containerDiv, category) {
    if (Array.isArray(asanaList)) {
      asanaList.forEach((asana) => {
        var asanaDiv = createAsanaDivWithCategory(asana, category);
        containerDiv.appendChild(asanaDiv);
      });
    } else {
      console.warn(`Asana list for category ${category} is not an array:`, asanaList);
    }
  }

  function createAsanaDiv() {
    var asanaDiv = document.createElement('div');
    asanaDiv.style.display = 'flex';
    asanaDiv.style.flexWrap = 'no-wrap';
    asanaDiv.style.alignItems = 'center'; // This will vertically align items
    asanaDiv.style.justifyContent = 'space-between';
    asanaDiv.style.marginBottom = '10px';

    return asanaDiv;
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
    var categoryDiv = document.getElementById(divId);
    var asanaDiv = createAsanaDiv();
    var asanaNameSelect = createAsanaNameSelect(category);
    asanaDiv.appendChild(asanaNameSelect);

    $(asanaNameSelect).select2({
      width: '10%',
      minimumResultsForSearch: 1
    });

    var infoButton = createInfoButton(asanaNameSelect);
    asanaDiv.appendChild(infoButton);

    var repetitionsInput = createRepetitionsInput();
    asanaDiv.appendChild(repetitionsInput);

    var specialNotesTextarea = createSpecialNotesTextarea();
    asanaDiv.appendChild(specialNotesTextarea);

    var deleteButton = createDeleteButton(asanaDiv);
    asanaDiv.appendChild(deleteButton);

    categoryDiv.appendChild(asanaDiv);
  }

  function validateAsanaName(name, asanaNameSelect) {
    var matchingAsana = asanas.find(asana => asana[0].toLowerCase() === name.toLowerCase());
    if (matchingAsana) {
      asanaNameSelect.style.border = '1px solid green';
    } else {
      asanaNameSelect.style.border = '1px solid red';
    }
  }

  function displayAsanaDescription(description, infoButton) {
    var asanaDescriptionDiv = document.getElementById('asanaDescription');
    asanaDescriptionDiv.textContent = description;
    asanaDescriptionDiv.style.display = 'block';

    // Calculate the position of the infoButton
    var infoButtonRect = infoButton.getBoundingClientRect();
    var infoButtonTop = infoButtonRect.top + window.pageYOffset;
    var infoButtonLeft = infoButtonRect.left + window.pageXOffset;

    // Position the description next to the infoButton
    asanaDescriptionDiv.style.top = infoButtonTop + 'px';
    asanaDescriptionDiv.style.left = (infoButtonLeft + infoButton.offsetWidth) + 'px';
  }

  function hideAsanaDescription() {
    var asanaDescriptionDiv = document.getElementById('asanaDescription');
    asanaDescriptionDiv.style.display = 'none';
  }

  function loadSadhaka(name) {
    console.log("Loading sadhaka:", name);
    if (!Array.isArray(asanas) || asanas.length === 0) {
      console.log("Asanas not loaded, loading them first...");
      loadAsanas()
        .then((fetchedAsanas) => {
          asanas = fetchedAsanas;
          fetchAndDisplaySadhaka(name);
        })
        .catch((error) => {
          console.error("Error loading asanas:", error);
        });
    } else {
      fetchAndDisplaySadhaka(name);
    }
  }

  function fetchAndDisplaySadhaka(name) {
    db.collection('sadhakas').doc(name).get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Sadhaka data found:", doc.data());
          displaySadhaka(doc.data());
        } else {
          console.log("No sadhaka found with name:", name);
          var newSadhaka = {
            name: name,
            prayerText: '',
            dietAndAdditionalNotes: ''
          };
          categories.forEach(category => {
            if (category.type === 'asanas') {
              newSadhaka[category.id] = [];
            }
          });
          displaySadhaka(newSadhaka);
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }


  // Modified saveSadhakaWithCategory function
  function saveSadhakaWithCategory() {
    var sadhakaName = sadhakaNameInput.value;
    var sadhaka = {
      name: sadhakaName
    };

    categories.forEach(category => {
      if (category.type === 'text') {
        sadhaka[category.id] = document.getElementById(category.id).value;
      } else if (category.type === 'asanas') {
        sadhaka[category.id] = getAsanasFromDiv(document.getElementById(category.id));
      }
    });

    saveSadhakaToDB(sadhaka).then(() => {
      alert('Saved successfully!');
    }).catch((error) => {
      console.log("Error saving sadhaka:", error);
    });
  }

  function getAsanasFromDiv(div) {
    var asanas = [];
    for (let i = 0; i < div.children.length; i++) {
      let asana = getAsanaFromDiv(div.children[i]);
      asanas.push(asana);
    }
    return asanas;
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
    }
  }


  function getAsanaFromDiv(div) {
    //var div = document.getElementById(div.id);
    var asanaNameSelect = div.querySelector('.asanaNameSelect');
    var repetitionsInput = div.querySelector('#repetitionsInput');
    var specialNotesTextarea = div.querySelector('#specialNotesTextarea');


    return {
      asanaName: asanaNameSelect.value,
      repetitions: repetitionsInput.value,
      specialNotes: specialNotesTextarea.value
    };
  }

  // Function to perform login
  function login() {
    // Get the input values from the login form
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    // Fetch the login credentials from Firestore
    const db = firebase.firestore();
    db.collection("login").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const loginData = doc.data();
        const hardcodedUsername = loginData.id;
        const hardcodedPassword = loginData.password;

        // Check if the input matches the fetched credentials
        if (usernameInput === hardcodedUsername && passwordInput === hardcodedPassword) {
          alert("Login successful!");

          // Hide the login container and the overlay
          const loginContainer = document.querySelector('.login-container');
          const overlay = document.querySelector('#overlay');
          loginContainer.style.visibility = 'hidden';
          overlay.style.visibility = 'hidden';

          // Remove the 'blocked' class from the body to enable interaction
          document.body.classList.remove('blocked');

          // Load the main content after successful login
          initialize();
        } else {
          // Show a popup or modal for incorrect credentials (optional)
          alert("Invalid username or password. Please try again.");
        }
      });
    }).catch((error) => {
      console.log("Error fetching login credentials:", error);
    });
  }



  function showMultiAsanaModal(category, asanaCategory) {
    console.log("Showing multi asana modal. Category:", category, "Asana Category:", asanaCategory);
    var modal = document.getElementById('multiAsanaModal');
    modal.style.display = "block";
    modal.setAttribute('data-category', category);
    modal.setAttribute('data-asana-category', asanaCategory);
    populateAsanaCheckboxList(asanaCategory);
  }


  function closeMultiAsanaModal() {
    var modal = document.getElementById('multiAsanaModal');
    modal.style.display = "none";
  }

  // Modified populateAsanaCheckboxList function to use displayName
  function populateAsanaCheckboxList(category) {
    console.log("Populating asana checkbox list. Category:", category, "Asanas:", asanas);
    var tableBody = document.getElementById('asanaCheckboxTableBody');
    tableBody.innerHTML = '';

    var filteredAsanas = asanas.filter(asana => asana[3] === category);
    console.log("Filtered asanas for checkboxes:", filteredAsanas);

    filteredAsanas.forEach(asana => {
      var row = tableBody.insertRow();

      var checkboxCell = row.insertCell(0);
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = asana[0];
      checkbox.id = "asana_" + asana[0];
      checkboxCell.appendChild(checkbox);

      var nameCell = row.insertCell(1);
      var nameLabel = document.createElement('label');
      nameLabel.htmlFor = "asana_" + asana[0];
      nameLabel.textContent = asana[2] || asana[0]; // Use displayName if available, otherwise use name
      nameCell.appendChild(nameLabel);
    });
  }

  // Modified addMultipleAsanas function to use the correct category
  function addMultipleAsanas() {
    var modal = document.getElementById('multiAsanaModal');
    var category = modal.getAttribute('data-category');
    var asanaCategory = modal.getAttribute('data-asana-category');
    var rows = document.querySelectorAll('#asanaCheckboxTableBody tr');

    rows.forEach(row => {
      var checkbox = row.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        var asanaName = checkbox.value;
        var asana = {
          asanaName: asanaName,
          repetitions: '',
          specialNotes: ''
        };
        addAsanaToCategory(asana, category, asanaCategory);
      }
    });

    closeMultiAsanaModal();
  }


  function addAsanaToCategory(asana, category, asanaCategory) {
    var categoryDiv = document.getElementById(category);
    var asanaDiv = createAsanaDivWithCategory(asana, asanaCategory);
    categoryDiv.appendChild(asanaDiv);
  }

  function filterAsanas() {
    var searchValue = document.getElementById('asanaSearch').value.toLowerCase();
    var rows = document.querySelectorAll('#asanaCheckboxTableBody tr');

    rows.forEach(row => {
      var asanaName = row.querySelector('label').textContent.toLowerCase();
      var displayName = row.querySelector('.display-name-input').value.toLowerCase();
      if (asanaName.includes(searchValue) || displayName.includes(searchValue)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  // When the user clicks outside of the modal, close it
  window.onclick = function (event) {
    var modal = document.getElementById('multiAsanaModal');
    if (event.target == modal) {
      closeMultiAsanaModal();
    }
  }


  window.onload = initialize;
