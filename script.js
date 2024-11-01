
const LIABILITY_STATEMENT = `This document has not been created by a medical doctor or healing practitioner. Therefore, please perform all practices mentioned in this document at your own discretion. 

If you have or have had an injury or acute illness, or if you have doubts about whether yoga practices are appropriate for you, you are responsible for contacting your physician as needed to inquire about your fitness level.

The instructions and advice given in yoga sessions are no substitute for professional medical or psychological care. The instructions and advice given in the following document is not a substitute for professional medical or psychological care. 

If you are pregnant or experiencing menopausal transition, you are responsible for taking special care of yourself and consulting your doctor as needed.

If you are menstruating, do not exceed your comfort levels.

In order for yoga practice to be beneficial for you and your all-round health, please let us know if you are suffering from physical illness or have any other health restrictions that would prevent you from participating in yoga practice or in individual yoga exercises. 

In case of severe health issues or chronic illness(es) please check with your doctor whether you are allowed to participate in the yoga related activities. Participation is at your own risk.

The use of any suggested devices or equipment such as the indoor bike, resistance bands, chairs, pillows or any other props is at the yoga participant's own risk.

Any cardio training suggested is to be practiced at your own discretion.`;



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
    { id: 'meditativeDiv', title: 'Meditative Asanas', type: 'asanas', category: 'Meditative Asana' },
    { id: 'breathingDiv', title: 'Breathing Asanas', type: 'asanas', category: 'Breathing' },
    { id: 'pranayamaDiv', title: 'Pranayama', type: 'asanas', category: 'Pranayana' },
    { id: 'meditationDiv', title: 'Meditation', type: 'asanas', category: 'Meditation' },
    { id: 'routineText', title: 'Routine', type: 'text' },
    { id: 'advisoryText', title: 'Advisory', type: 'text' },
    { id: 'dietAndAdditionalNotes', title: 'Diet and Additional Notes', type: 'text' }
  ];

  async function saveSadhakaReportAsPdf() {
    const asanasMap = await loadAsanasForPdf();
    var pdf = new jsPDF();
    var sadhakaName = document.getElementById('sadhakaName').value;
    
    const pdfConfig = {
      y: 20,
      pageWidth: pdf.internal.pageSize.width,
      pageHeight: pdf.internal.pageSize.height,
      styles: {
        title: {
          fontSize: 24,
          fontStyle: 'bold',
          textColor: [41, 128, 185],
          marginBottom: 15
        },
        sectionHeader: {
          fontSize: 16,
          fontStyle: 'bold',
          textColor: [52, 73, 94],
          marginTop: 10,
          marginBottom: 8
        },
        normal: {
          fontSize: 12,
          fontStyle: 'normal',
          textColor: [0, 0, 0],
          marginBottom: 5
        },
        asanaName: {
          fontSize: 14,
          fontStyle: 'bold',
          textColor: [41, 128, 185],
          marginBottom: 6
        }
      }
    };
  
    const helpers = {
      applyStyle: function(style) {
        pdf.setFontSize(style.fontSize);
        pdf.setFont("helvetica", style.fontStyle);
        pdf.setTextColor(...style.textColor);
      },
  
      drawSeparator: function() {
        pdf.setDrawColor(189, 195, 199);
        pdf.setLineWidth(0.5);
        pdf.line(10, pdfConfig.y, pdfConfig.pageWidth - 10, pdfConfig.y);
        pdfConfig.y += 5;
      },
  
      addContent: async function(content, height, style) {
        if (pdfConfig.y + height > pdfConfig.pageHeight - 20) {
          pdf.addPage();
          pdfConfig.y = 20;
        }
        this.applyStyle(style);
        pdf.text(content, 10, pdfConfig.y);
        pdfConfig.y += height + (style.marginBottom || 0);
      },
  
      addAsanaToPdfInternal: async function(asanaDiv, asanasMap) {
        var asanaNameSelect = asanaDiv.querySelector('.asanaNameSelect');
        if (!asanaNameSelect || !asanaNameSelect.value) {
          console.log("No asana name found, skipping...");
          return;
        }
  
        var repetitionsInput = asanaDiv.querySelector('#repetitionsInput');
        var specialNotesTextarea = asanaDiv.querySelector('#specialNotesTextarea');
  
        const asanaDoc = await db.collection('asanas')
          .where("name", "==", asanaNameSelect.value)
          .get();
          
        if (asanaDoc.empty) {
          console.log("No such asana found:", asanaNameSelect.value);
          return;
        }
        
        const asanaData = asanaDoc.docs[0].data();
        let imageUrl = asanaData.imageUrl;
        let displayName = asanaData.displayName || asanaData.name;
  
        try {
          let response = await fetch(imageUrl);
          let blob = await response.blob();
  
          return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onloadend = () => {
              let base64data = reader.result;
              let imgWidth = 45;
              let imgHeight = 45;
  
              if (pdfConfig.y + imgHeight + 40 > pdfConfig.pageHeight) {
                pdf.addPage();
                pdfConfig.y = 20;
              }
  
              // Add asana name with styling
              this.applyStyle(pdfConfig.styles.asanaName);
              pdf.text(displayName, 15, pdfConfig.y);
              pdfConfig.y += 8;
  
              // Add image with a border
              pdf.setDrawColor(189, 195, 199);
              pdf.setLineWidth(0.3);
              pdf.rect(15, pdfConfig.y, imgWidth, imgHeight);
              pdf.addImage(base64data, 'PNG', 15, pdfConfig.y, imgWidth, imgHeight);
              pdfConfig.y += imgHeight + 5;
  
              // Add description and details with proper styling
              this.applyStyle(pdfConfig.styles.normal);
              let description = asanasMap.get(asanaNameSelect.value);
              if (description) {
                let splitDescription = pdf.splitTextToSize(`Description: ${description}`, pdfConfig.pageWidth - 30);
                pdf.text(splitDescription, 15, pdfConfig.y);
                pdfConfig.y += splitDescription.length * 7 + 3;
              }
  
              // Add repetitions and notes with subtle highlighting
              if (repetitionsInput && repetitionsInput.value) {
                pdf.setFillColor(247, 247, 247);
                pdf.rect(15, pdfConfig.y - 4, pdfConfig.pageWidth - 30, 12, 'F');
                pdf.text(`Repetitions: ${repetitionsInput.value}`, 15, pdfConfig.y);
                pdfConfig.y += 8;
              }
  
              if (specialNotesTextarea && specialNotesTextarea.value) {
                let notesText = `Special notes: ${specialNotesTextarea.value}`;
                let splitNotes = pdf.splitTextToSize(notesText, pdfConfig.pageWidth - 30);
                pdf.text(splitNotes, 15, pdfConfig.y);
                pdfConfig.y += splitNotes.length * 7 + 10;
              }
  
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error processing asana:", error);
          return Promise.resolve();
        }
      }
    };
  
    // Add title
    await helpers.addContent(`Sadhaka Report - ${sadhakaName}`, 10, pdfConfig.styles.title);
    helpers.drawSeparator();
  
    // Process each category
    for (let category of categories) {
      // Add section header
      await helpers.addContent(category.title, 8, pdfConfig.styles.sectionHeader);
  
      if (category.type === 'text') {
        // Handle text content
        var content = document.getElementById(category.id).value;
        if (content && content.trim() !== '') {
          var splitContent = pdf.splitTextToSize(content, pdfConfig.pageWidth - 20);
          helpers.applyStyle(pdfConfig.styles.normal);
          await helpers.addContent(splitContent, splitContent.length * 7, pdfConfig.styles.normal);
        }
        helpers.drawSeparator();
      } 
      else if (category.type === 'asanas') {
        var containerDiv = document.getElementById(category.id);
        if (containerDiv && containerDiv.children.length > 0) {
          for (let i = 0; i < containerDiv.children.length; i++) {
            await helpers.addAsanaToPdfInternal(containerDiv.children[i], asanasMap);
            if (i < containerDiv.children.length - 1) {
              pdf.setDrawColor(224, 224, 224);
              pdf.setLineWidth(0.3);
              pdf.line(20, pdfConfig.y, pdfConfig.pageWidth - 20, pdfConfig.y);
              pdfConfig.y += 3;
            }
          }
        }
        helpers.drawSeparator();
      }
    }
  
    // Add footer
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated on ${date}`, 10, pdfConfig.pageHeight - 10);
  
    // Add a new page for liability statement
    pdf.addPage();
    pdfConfig.y = 20;
  
    // Add Liability Statement header
    helpers.applyStyle(pdfConfig.styles.sectionHeader);
    await helpers.addContent("Liability Statement", 8, pdfConfig.styles.sectionHeader);
    helpers.drawSeparator();
  
    // Add liability text with special styling
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(51, 51, 51);
    
    const splitLiability = pdf.splitTextToSize(LIABILITY_STATEMENT, pdfConfig.pageWidth - 20);
    pdf.text(splitLiability, 10, pdfConfig.y);
    
    // Add footer after liability
    pdfConfig.y = pdfConfig.pageHeight - 10;
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated on ${date}`, 10, pdfConfig.y);
  
    pdf.save('Sadhaka_report.pdf');
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
      throw error; // Re-throw to be caught by the calling function
    }
  }

  function getAsanasFromDiv(div) {
    var asanas = [];
    if (!div) return asanas;
  
    for (let i = 0; i < div.children.length; i++) {
      let asanaDiv = div.children[i];
      let asana = {
        asanaName: asanaDiv.querySelector('.asanaNameSelect')?.value || '',
        repetitions: asanaDiv.querySelector('#repetitionsInput')?.value || '',
        specialNotes: asanaDiv.querySelector('#specialNotesTextarea')?.value || ''
      };
      if (asana.asanaName) {
        asanas.push(asana);
      }
    }
    return asanas;
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


  async function saveSadhakaWithCategory() {
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
