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
// Event Listeners
// ===========================

window.onclick = function (event) {
  const multiAsanaModal = document.getElementById('multiAsanaModal');
  const multiDeleteModal = document.getElementById('multiDeleteModal');
  const changePasswordModal = document.getElementById('changePasswordModal');
  const userManagementModal = document.getElementById('userManagementModal');
  const databaseBackupModal = document.getElementById('databaseBackupModal');
  const defaultTextsModal = document.getElementById('defaultTextsModal');

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
  if (event.target == defaultTextsModal) {
    closeDefaultTextsModal();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDefaultUsers();
});
