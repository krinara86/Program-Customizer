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
    nonCardioNotes: '',
    relaxationNotes: '',
    meditativeNotes: '',
    breathingNotes: '',
    pranayamaNotes: '',
    meditationNotes: '',
    cardioTrainingText: '',
    mantraPracticeText: '',
    liabilityClauseText: DEFAULT_LIABILITY_TEXT,
    referenceBooksText: DEFAULT_REFERENCE_BOOKS_TEXT
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

  // Load all category notes
  const notesMapping = {
    'jointsAndGlandsNotes': 'jointsAndGlandsNotes',
    'cardioNotes': 'cardioNotes',
    'nonCardioNotes': 'nonCardioNotes',
    'relaxationNotes': 'relaxationNotes',
    'meditativeNotes': 'meditativeNotes',
    'breathingNotes': 'breathingNotes',
    'pranayamaNotes': 'pranayamaNotes',
    'meditationNotes': 'meditationNotes'
  };

  Object.keys(notesMapping).forEach(noteId => {
    const element = document.getElementById(noteId);
    if (element) {
      element.value = sadhaka[notesMapping[noteId]] || '';
    }
  });

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
        } else if (category.elementId === 'liabilityClauseText' &&
          (!sadhaka[category.elementId] || sadhaka[category.elementId].trim() === '')) {
          element.value = DEFAULT_LIABILITY_TEXT;
        } else if (category.elementId === 'referenceBooksText' &&
          (!sadhaka[category.elementId] || sadhaka[category.elementId].trim() === '')) {
          element.value = DEFAULT_REFERENCE_BOOKS_TEXT;
        } else if (category.elementId === 'meditationText' &&
          (!sadhaka[category.elementId] || sadhaka[category.elementId].trim() === '')) {
          element.value = DEFAULT_MEDITATION_TEXT;
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
        } else if (category.elementId === 'liabilityClauseText') {
          element.value = DEFAULT_LIABILITY_TEXT;
        } else if (category.elementId === 'referenceBooksText') {
          element.value = DEFAULT_REFERENCE_BOOKS_TEXT;
        } else if (category.elementId === 'meditationText') {
          element.value = DEFAULT_MEDITATION_TEXT;
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

  // Clear all notes fields
  const notesFields = ['jointsAndGlandsNotes', 'cardioNotes', 'nonCardioNotes',
    'relaxationNotes', 'meditativeNotes', 'breathingNotes',
    'pranayamaNotes', 'meditationNotes'];
  notesFields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element) element.value = '';
  });

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
    nonCardioNotes: document.getElementById('nonCardioNotes').value,
    relaxationNotes: document.getElementById('relaxationNotes').value,
    meditativeNotes: document.getElementById('meditativeNotes').value,
    breathingNotes: document.getElementById('breathingNotes').value,
    pranayamaNotes: document.getElementById('pranayamaNotes').value,
    meditationNotes: document.getElementById('meditationNotes').value
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
