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
// Multi-Select Asana Functions
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
    const row = document.createElement('tr');
    row.style.cursor = 'pointer';

    const checkboxCell = document.createElement('td');
    checkboxCell.style.width = '40px';
    checkboxCell.style.textAlign = 'center';
    checkboxCell.style.padding = '8px';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = asana[0];
    checkbox.id = "asana_" + asana[0].replace(/\s+/g, '_');
    checkbox.className = 'asana-checkbox';
    checkboxCell.appendChild(checkbox);

    const nameCell = document.createElement('td');
    nameCell.style.padding = '8px';
    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = checkbox.id;
    nameLabel.textContent = asana[2] || asana[0];
    nameLabel.style.cursor = 'pointer';
    nameLabel.style.display = 'block';
    nameLabel.style.width = '100%';
    nameCell.appendChild(nameLabel);

    // Allow clicking on the row to toggle checkbox
    row.addEventListener('click', function(e) {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    });

    row.appendChild(checkboxCell);
    row.appendChild(nameCell);
    tableBody.appendChild(row);
  });
}

function addMultipleAsanas() {
  const modal = document.getElementById('multiAsanaModal');
  const category = modal.getAttribute('data-category');
  const asanaCategory = modal.getAttribute('data-asana-category');
  const checkboxes = document.querySelectorAll('#asanaCheckboxTableBody input[type="checkbox"]:checked');

  checkboxes.forEach(checkbox => {
    const asanaName = checkbox.value;
    const asana = {
      asanaName: asanaName,
      repetitions: '',
      specialNotes: ''
    };
    addAsanaToCategory(asana, category, asanaCategory);
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
