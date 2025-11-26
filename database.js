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
    // First, try to load from database
    const defaultTextsDoc = await db.collection('settings').doc('defaultTexts').get();
    
    if (defaultTextsDoc.exists) {
      const dbTexts = defaultTextsDoc.data();
      updateDefaultTexts(dbTexts);
      console.log('Default texts loaded from database');
    } else {
      // If document doesn't exist, create it with current hardcoded defaults
      await saveDefaultTextsToDatabase(getDefaultTexts());
      console.log('Default texts initialized in database');
    }

    // Now apply to UI
    applyDefaultTextsToUI();
    console.log('Default texts applied to UI');
  } catch (error) {
    console.error('Error loading default texts:', error);
    // Fall back to hardcoded defaults if database fails
    applyDefaultTextsToUI();
  }
}

function applyDefaultTextsToUI() {
  const dietTextArea = document.getElementById('dietAndAdditionalNotes');
  const routineTextArea = document.getElementById('routineText');
  const prayerTextArea = document.getElementById('prayerText');
  const liabilityTextArea = document.getElementById('liabilityClauseText');
  const referenceBooksTextArea = document.getElementById('referenceBooksText');
  const meditationTextArea = document.getElementById('meditationText');

  if (dietTextArea && (!dietTextArea.value || dietTextArea.value.trim() === '')) {
    dietTextArea.value = DEFAULT_DIET_TEXT;
  }
  if (routineTextArea && (!routineTextArea.value || routineTextArea.value.trim() === '')) {
    routineTextArea.value = DEFAULT_ROUTINE_TEXT;
  }
  if (prayerTextArea && (!prayerTextArea.value || prayerTextArea.value.trim() === '')) {
    prayerTextArea.value = DEFAULT_PRAYER_TEXT;
  }
  if (liabilityTextArea && (!liabilityTextArea.value || liabilityTextArea.value.trim() === '')) {
    liabilityTextArea.value = DEFAULT_LIABILITY_TEXT;
  }
  if (referenceBooksTextArea && (!referenceBooksTextArea.value || referenceBooksTextArea.value.trim() === '')) {
    referenceBooksTextArea.value = DEFAULT_REFERENCE_BOOKS_TEXT;
  }
  if (meditationTextArea && (!meditationTextArea.value || meditationTextArea.value.trim() === '')) {
    meditationTextArea.value = DEFAULT_MEDITATION_TEXT;
  }
}

async function saveDefaultTextsToDatabase(texts) {
  try {
    await db.collection('settings').doc('defaultTexts').set(texts, { merge: true });
    console.log('Default texts saved to database');
    return true;
  } catch (error) {
    console.error('Error saving default texts:', error);
    throw error;
  }
}

// ===========================
// Default Text Management UI Functions
// ===========================

function showDefaultTextsModal() {
  if (!currentUser?.isAdmin) {
    alert("You don't have permission to edit default texts.");
    return;
  }

  const modal = document.getElementById('defaultTextsModal');
  modal.style.display = 'block';
  
  // Populate fields with current defaults
  document.getElementById('defaultPrayerText').value = DEFAULT_PRAYER_TEXT;
  document.getElementById('defaultMeditationText').value = DEFAULT_MEDITATION_TEXT;
  document.getElementById('defaultReferenceBooksText').value = DEFAULT_REFERENCE_BOOKS_TEXT;
  document.getElementById('defaultDietText').value = DEFAULT_DIET_TEXT;
  document.getElementById('defaultRoutineText').value = DEFAULT_ROUTINE_TEXT;
  document.getElementById('defaultLiabilityText').value = DEFAULT_LIABILITY_TEXT;
}

function closeDefaultTextsModal() {
  const modal = document.getElementById('defaultTextsModal');
  modal.style.display = 'none';
}

async function saveDefaultTexts() {
  const prayer = document.getElementById('defaultPrayerText').value;
  const meditation = document.getElementById('defaultMeditationText').value;
  const referenceBooks = document.getElementById('defaultReferenceBooksText').value;
  const diet = document.getElementById('defaultDietText').value;
  const routine = document.getElementById('defaultRoutineText').value;
  const liability = document.getElementById('defaultLiabilityText').value;

  const texts = {
    prayer,
    meditation,
    referenceBooks,
    diet,
    routine,
    liability
  };

  try {
    await saveDefaultTextsToDatabase(texts);
    updateDefaultTexts(texts);
    alert('Default texts saved successfully!');
    closeDefaultTextsModal();
  } catch (error) {
    alert('Error saving default texts: ' + error.message);
  }
}

// ===========================
// Reset Individual Field to Default
// ===========================

function resetToDefault(textareaId, defaultKey) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) {
    console.error('Textarea not found:', textareaId);
    return;
  }

  // Map the defaultKey to the corresponding DEFAULT_*_TEXT constant
  let defaultValue = '';
  switch (defaultKey) {
    case 'prayer':
      defaultValue = DEFAULT_PRAYER_TEXT;
      break;
    case 'meditation':
      defaultValue = DEFAULT_MEDITATION_TEXT;
      break;
    case 'referenceBooks':
      defaultValue = DEFAULT_REFERENCE_BOOKS_TEXT;
      break;
    case 'diet':
      defaultValue = DEFAULT_DIET_TEXT;
      break;
    case 'routine':
      defaultValue = DEFAULT_ROUTINE_TEXT;
      break;
    case 'liability':
      defaultValue = DEFAULT_LIABILITY_TEXT;
      break;
    default:
      console.error('Unknown default key:', defaultKey);
      return;
  }

  // Confirm before resetting
  const fieldNames = {
    'prayer': 'Prayer',
    'meditation': 'Meditation Practice',
    'referenceBooks': 'Recommended Reading',
    'diet': 'Dietary Recommendations',
    'routine': 'Routine',
    'liability': 'Liability Clause'
  };

  const fieldName = fieldNames[defaultKey] || defaultKey;
  
  if (confirm(`Are you sure you want to reset "${fieldName}" to the default text?\n\nThis will replace the current content for this student.`)) {
    textarea.value = defaultValue;
    // Trigger a visual feedback
    textarea.style.transition = 'background-color 0.3s ease';
    textarea.style.backgroundColor = '#d4edda';
    setTimeout(() => {
      textarea.style.backgroundColor = '';
    }, 500);
  }
}

// ===========================
// Sadhaka Database Operations
// ===========================

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
        users: [],
        settings: {}
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

    // Backup settings (including default texts)
    const settingsSnapshot = await db.collection('settings').get();
    settingsSnapshot.forEach(doc => {
      backup.data.settings[doc.id] = doc.data();
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

    // Restore settings if present
    if (backup.data.settings) {
      for (const [docId, data] of Object.entries(backup.data.settings)) {
        const ref = db.collection('settings').doc(docId);
        batch.set(ref, data);
        operationCount++;

        if (operationCount > 400) {
          await batch.commit();
          operationCount = 0;
        }
      }
    }

    // Commit any remaining operations
    if (operationCount > 0) {
      await batch.commit();
    }

    // Reload data
    await Promise.all([loadAsanas(), loadSadhakaNames(), loadDefaultTexts()]);
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
