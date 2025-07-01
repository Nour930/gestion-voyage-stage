let selectedUser = null;

// Gestion de la sélection d'utilisateur
document.querySelectorAll('.user-option').forEach(option => {
  option.addEventListener('click', function() {
    // Retirer la sélection précédente
    document.querySelectorAll('.user-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Ajouter la sélection à l'option cliquée
    this.classList.add('selected');
    selectedUser = this.dataset.user;
    
    // Activer le bouton de connexion si un utilisateur est sélectionné
    updateLoginButton();
  });
});

// Gestion du champ mot de passe
document.getElementById('password').addEventListener('input', updateLoginButton);

function updateLoginButton() {
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  
  if (selectedUser && password.length > 0) {
    loginBtn.disabled = false;
  } else {
    loginBtn.disabled = true;
  }
}

// Gestion de la connexion
document.getElementById('loginBtn').addEventListener('click', function() {
  const password = document.getElementById('password').value;
  
  if (!selectedUser) {
    alert('Veuillez sélectionner un utilisateur');
    return;
  }
  
  if (!password) {
    alert('Veuillez entrer votre mot de passe');
    return;
  }
  
  // Simulation de l'authentification (à remplacer par une vraie logique)
  if (authenticateUser(selectedUser, password)) {
    // Stocker les informations de l'utilisateur connecté
    localStorage.setItem('currentUser', JSON.stringify({
      id: selectedUser,
      name: getUserName(selectedUser),
      role: getUserRole(selectedUser)
    }));
    
    // Rediriger vers le tableau de bord
    window.location.href = './dashboard.html';
  } else {
    alert('Mot de passe incorrect');
  }
});

function authenticateUser(user, password) {
  // Mots de passe par défaut (à remplacer par une vraie authentification)
  const passwords = {
    'admin': 'admin123',
    'agent1': 'agent123',
    'agent2': 'agent123',
    'comptable': 'compta123'
  };
  
  return passwords[user] === password;
}

function getUserName(userId) {
  const names = {
    'admin': 'Administrateur',
    'agent1': 'Agent Commercial 1',
    'agent2': 'Agent Commercial 2',
    'comptable': 'Comptable'
  };
  return names[userId];
}

function getUserRole(userId) {
  const roles = {
    'admin': 'Admin',
    'agent1': 'Agent',
    'agent2': 'Agent',
    'comptable': 'Comptable'
  };
  return roles[userId];
}

// Initialiser l'état du bouton
updateLoginButton();
