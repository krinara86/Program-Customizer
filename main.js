// ===========================
// Firebase Initialization
// ===========================

firebase.initializeApp(firebaseConfig);
db = firebase.firestore();

// ===========================
// Main Initialization
// ===========================

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
