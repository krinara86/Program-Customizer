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
