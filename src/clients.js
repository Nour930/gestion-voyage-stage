// Vérifier si l'utilisateur est connecté
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
  window.location.href = './index.html';
}

// Afficher les informations de l'utilisateur
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userRole').textContent = currentUser.role;

// Liste des régions de Tunisie
const tunisianRegions = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
  "Tataouine", "Tozeur", "Tunis", "Zaghouan"
].sort(); // Tri alphabétique

// Liste des arrangements
const arrangements = [
  "LPD", "DP", "DP+", "PC", "PC+", "All Inclusive", "Soft All Inclusive"
];

// Variables globales
let clients = [];
let editingClientId = null;
let advanceCounter = 0;

// Éléments DOM
const clientsTableBody = document.getElementById('clientsTableBody');
const emptyState = document.getElementById('emptyState');
const clientModal = document.getElementById('clientModal');
const deleteModal = document.getElementById('deleteModal');
const clientForm = document.getElementById('clientForm');
const searchInput = document.getElementById('searchInput');
const advancesContainer = document.getElementById('advancesContainer');

// Charger les clients depuis le localStorage
function loadClients() {
  const savedClients = localStorage.getItem('clients');
  if (savedClients) {
    clients = JSON.parse(savedClients);
  }
  renderClients();
  updateDashboardStats();
}

// Sauvegarder les clients dans le localStorage
function saveClients() {
  localStorage.setItem('clients', JSON.stringify(clients));
  updateDashboardStats();
}

// Mettre à jour les statistiques du tableau de bord
function updateDashboardStats() {
  let dashboardData = JSON.parse(localStorage.getItem('dashboardData') || '{}');
  dashboardData.totalClients = clients.length;
  localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
}

// Remplir la liste déroulante des régions
function populateRegions(selectedRegion = null) {
  const regionSelect = document.getElementById("region");
  regionSelect.innerHTML =
    `<option value="">Sélectionner une région</option>` +
    tunisianRegions.map(region =>
      `<option value="${region}"${selectedRegion === region ? " selected" : ""}>${region}</option>`
    ).join("");
}

// Remplir la liste déroulante des arrangements
function populateArrangements(selectedArrangement = null) {
  const arrangementSelect = document.getElementById("arrangement");
  arrangementSelect.innerHTML =
    `<option value="">Sélectionner un arrangement</option>` +
    arrangements.map(arr =>
      `<option value="${arr}"${selectedArrangement === arr ? " selected" : ""}>${arr}</option>`
    ).join("");
}

// LOGIQUE DE CALCUL AUTOMATIQUE CORRIGÉE
function performAutomaticCalculations() {
  const tarifAchatInput = document.getElementById('tarifAchat');
  const tarifVenteInput = document.getElementById('tarifVente');
  const coefficientInput = document.getElementById('coefficient');
  const nbreNuitInput = document.getElementById('nbreNuit');
  const montantSejourInput = document.getElementById('montantSejour');
  const totalAchatInput = document.getElementById('totalAchat');

  const tarifAchat = parseFloat(tarifAchatInput.value) || 0;
  const tarifVente = parseFloat(tarifVenteInput.value) || 0;
  const coefficient = parseFloat(coefficientInput.value) || 0;
  const nbreNuit = parseInt(nbreNuitInput.value) || 0;
  const montantSejour = parseFloat(montantSejourInput.value) || 0;
  const totalAchat = parseFloat(totalAchatInput.value) || 0;

  // Vérifier que les champs obligatoires sont renseignés
  if (coefficient > 0 && nbreNuit > 0) {
    
    // Scénario 1: Si tarif vente est donné et montant séjour est vide, calculer montant séjour
    if (tarifVente > 0 && montantSejour === 0) {
      const calculatedMontantSejour = tarifVente * nbreNuit * coefficient;
      montantSejourInput.value = calculatedMontantSejour.toFixed(3);
    }

    // Scénario 2: Si tarif achat est donné et total achat est vide, calculer total achat
    if (tarifAchat > 0 && totalAchat === 0) {
      const calculatedTotalAchat = tarifAchat * nbreNuit * coefficient;
      totalAchatInput.value = calculatedTotalAchat.toFixed(3);
    }

    // Scénario 3: Si montant séjour est donné et tarif vente est vide, calculer tarif vente
    if (montantSejour > 0 && tarifVente === 0) {
      const calculatedTarifVente = montantSejour / (nbreNuit * coefficient);
      tarifVenteInput.value = calculatedTarifVente.toFixed(3);
    }

    // Scénario 4: Si total achat est donné et tarif achat est vide, calculer tarif achat
    if (totalAchat > 0 && tarifAchat === 0) {
      const calculatedTarifAchat = totalAchat / (nbreNuit * coefficient);
      tarifAchatInput.value = calculatedTarifAchat.toFixed(3);
    }
  }
}

// Calculer le montant du séjour (Fonction conservée pour compatibilité)
function calculateMontantSejour() {
  const tarifVenteInput = document.getElementById("tarifVente");
  const coefficientInput = document.getElementById("coefficient");
  const nbreNuitInput = document.getElementById("nbreNuit");
  const montantSejourInput = document.getElementById("montantSejour");

  const tarifVente = parseFloat(tarifVenteInput.value) || 0;
  const coefficient = parseFloat(coefficientInput.value) || 0;
  const nbreNuit = parseInt(nbreNuitInput.value) || 0;

  // Calculer montantSejour seulement si tarifVente est renseigné
  if (tarifVente > 0 && coefficient > 0 && nbreNuit > 0) {
    const montantSejour = tarifVente * coefficient * nbreNuit;
    montantSejourInput.value = montantSejour.toFixed(3);
  } else {
    montantSejourInput.value = '';
  }
}

// Calculer le total achat (Fonction conservée pour compatibilité)
function calculateTotalAchat() {
  const tarifAchatInput = document.getElementById('tarifAchat');
  const nbreNuitInput = document.getElementById('nbreNuit');
  const coefficientInput = document.getElementById('coefficient');
  const totalAchatInput = document.getElementById('totalAchat');

  const tarifAchat = parseFloat(tarifAchatInput.value) || 0;
  const nbreNuit = parseInt(nbreNuitInput.value) || 0;
  const coefficient = parseFloat(coefficientInput.value) || 0;

  // Calculer totalAchat seulement si tarifAchat est renseigné
  if (tarifAchat > 0 && nbreNuit > 0 && coefficient > 0) {
    const total = tarifAchat * nbreNuit * coefficient;
    totalAchatInput.value = total.toFixed(3);
  } else {
    totalAchatInput.value = '';
  }
}

// Calculer tarifAchat et tarifVente à partir de totalAchat et montantSejour (Fonction conservée)
function calculateTarifsFromTotals() {
  const totalAchatInput = document.getElementById('totalAchat');
  const montantSejourInput = document.getElementById('montantSejour');
  const coefficientInput = document.getElementById('coefficient');
  const nbreNuitInput = document.getElementById('nbreNuit');

  const tarifAchatInput = document.getElementById('tarifAchat');
  const tarifVenteInput = document.getElementById('tarifVente');

  const totalAchat = parseFloat(totalAchatInput.value) || 0;
  const montantSejour = parseFloat(montantSejourInput.value) || 0;
  const coefficient = parseFloat(coefficientInput.value) || 0;
  const nbreNuit = parseInt(nbreNuitInput.value) || 0;

  // Effectuer les calculs inverses seulement si coefficient et nbreNuit sont renseignés
  if (coefficient > 0 && nbreNuit > 0) {
    if (totalAchat > 0) {
      tarifAchatInput.value = (totalAchat / (coefficient * nbreNuit)).toFixed(3);
    } else {
      tarifAchatInput.value = '';
    }

    if (montantSejour > 0) {
      tarifVenteInput.value = (montantSejour / (coefficient * nbreNuit)).toFixed(3);
    } else {
      tarifVenteInput.value = '';
    }
  } else {
    tarifAchatInput.value = '';
    tarifVenteInput.value = '';
  }
}

// Ajouter un champ d'avance
function addAdvanceField(montant = '', date = '') {
  advanceCounter++;
  const advanceDiv = document.createElement('div');
  advanceDiv.className = 'advance-item';
  advanceDiv.innerHTML = `
    <div class="form-group">
      <label for="advanceMontant${advanceCounter}">Montant Avance</label>
      <input type="number" id="advanceMontant${advanceCounter}" name="advanceMontant${advanceCounter}" 
             step="0.01" min="0" value="${montant}" placeholder="Montant en DT">
    </div>
    <div class="form-group">
      <label for="advanceDate${advanceCounter}">Date Avance</label>
      <input type="date" id="advanceDate${advanceCounter}" name="advanceDate${advanceCounter}" value="${date}">
    </div>
    <button type="button" class="remove-advance-btn" onclick="removeAdvanceField(this)">
      <i class="fas fa-trash"></i>
    </button>
  `;
  advancesContainer.appendChild(advanceDiv);
}

// Supprimer un champ d'avance
function removeAdvanceField(button) {
  button.parentElement.remove();
}

// Collecter toutes les avances du formulaire
function collectAdvances() {
  const advances = [];
  const advanceItems = advancesContainer.querySelectorAll('.advance-item');
  
  advanceItems.forEach(item => {
    const montantInput = item.querySelector('input[name^="advanceMontant"]');
    const dateInput = item.querySelector('input[name^="advanceDate"]');
    
    const montant = parseFloat(montantInput.value);
    const date = dateInput.value;
    
    if (montant > 0 && date) {
      advances.push({ montant, date });
    }
  });
  
  return advances;
}

// Afficher les avances dans le formulaire
function displayAdvances(advances = []) {
  // Vider le conteneur
  advancesContainer.innerHTML = '';
  advanceCounter = 0;
  
  // Ajouter chaque avance
  if (advances && advances.length > 0) {
    advances.forEach(advance => {
      addAdvanceField(advance.montant, advance.date);
    });
  }
}

// Afficher les clients
function renderClients(filteredClients = null) {
  const clientsToRender = filteredClients || clients;

  if (clientsToRender.length === 0) {
    clientsTableBody.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    clientsTableBody.style.display = '';
    emptyState.style.display = 'none';

    clientsTableBody.innerHTML = clientsToRender.map(client => `
      <tr class="${client.statutAnnulation === 'annule' ? 'cancelled' : ''} payment-${client.statutPaiement || 'rien_paye'}">
        <td>${client.num}</td>
        <td>${client.nom}</td>
        <td>${client.prenom}</td>
        <td>${client.usine || '-'}</td>
        <td>${client.telephone}</td>
        <td>${client.email || '-'}</td>
        <td>${client.nbreAdult || 0}</td>
        <td>${client.nbreEnfant || 0}</td>
        <td>${client.nbreNuit || '-'}</td>
        <td>${client.dateDebut ? new Date(client.dateDebut).toLocaleDateString('fr-FR') : '-'}</td>
        <td>${client.dateFin ? new Date(client.dateFin).toLocaleDateString('fr-FR') : '-'}</td>
        <td>${client.arrangement || '-'}</td>
        <td>${client.tarifAchat ? client.tarifAchat.toFixed(3) + ' DT' : '-'}</td>
        <td>${client.tarifVente ? client.tarifVente.toFixed(3) + ' DT' : '-'}</td>
        <td>${client.coefficient ? client.coefficient.toFixed(2) : '-'}</td>
        <td>${client.montantSejour ? client.montantSejour.toFixed(3) + ' DT' : '-'}</td>
        <td>${client.totalAchat ? client.totalAchat.toFixed(3) + ' DT' : '-'}</td>
        <td>${client.nomHotel || '-'}</td>
        <td>${client.region || '-'}</td>
        <td>${client.bank || '-'}</td>
        <td>${client.statutAnnulation === 'annule' ? 'Annulé' : 'Actif'}</td>
        <td>
          ${client.statutPaiement === 'rien_paye' ? 'Rien Payé' : ''}
          ${client.statutPaiement === 'avance_payee' ? 'Avance Payée' : ''}
          ${client.statutPaiement === 'tout_paye' ? 'Tout Payé' : ''}
          ${client.advances && client.advances.length > 0 ? '<br>(' + client.advances.length + ' avance(s))' : ''}
        </td>
        <td>${client.createdBy || '-'}</td>
        <td>${client.modifiedBy || '-'}</td>
        <td>
          <div class="action-buttons">
            <button class="edit-btn" onclick="editClient('${client.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="confirmDeleteClient('${client.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

// Générer un ID unique (pour le champ 'id' interne)
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Générer un numéro de client (pour le champ 'num' affiché)
function generateClientNumber() {
  const lastClient = clients.length > 0 ? clients[clients.length - 1] : null;
  let lastNum = 0;
  if (lastClient && lastClient.num) {
    lastNum = parseInt(lastClient.num.replace('CLI-', ''));
  }
  return `CLI-${String(lastNum + 1).padStart(4, '0')}`;
}

// Ajouter un nouveau client
function addClient(clientData) {
  const newClient = {
    id: generateUniqueId(), // ID interne unique
    num: generateClientNumber(), // Numéro de client affiché
    ...clientData,
    dateAjout: new Date().toISOString(),
    statutAnnulation: clientData.statutAnnulation || 'actif', // Par défaut actif
    statutPaiement: clientData.statutPaiement || 'rien_paye', // Par défaut rien payé
    createdBy: currentUser.name, // Qui a créé le client
    modifiedBy: currentUser.name // Qui a modifié le client (même personne à la création)
  };

  clients.push(newClient);
  saveClients();
  renderClients();
  closeModal();
}

// Modifier un client
function updateClient(clientId, clientData) {
  const clientIndex = clients.findIndex(c => c.id === clientId);
  if (clientIndex !== -1) {
    clients[clientIndex] = {
      ...clients[clientIndex],
      ...clientData,
      modifiedBy: currentUser.name, // Qui a modifié le client
      dateModification: new Date().toISOString()
    };
    saveClients();
    renderClients();
    closeModal();
  }
}

// Supprimer un client
function deleteClient(clientId) {
  clients = clients.filter(c => c.id !== clientId);
  saveClients();
  renderClients();
  closeDeleteModal();
}

// Ouvrir le modal pour ajouter un client
function openAddClientModal() {
  editingClientId = null;
  document.getElementById('modalTitle').textContent = 'Nouveau Client';
  clientForm.reset();
  document.getElementById('num').value = generateClientNumber(); // Afficher le nouveau numéro
  populateRegions(); // Remplir la liste des régions
  populateArrangements(); // Remplir la liste des arrangements
  displayAdvances([]); // Vider les avances
  calculateDateFin(); // Calculer la date de fin au chargement
  // Appeler la nouvelle fonction de calcul automatique
  performAutomaticCalculations();
  clientModal.classList.add('show');
}

// Ouvrir le modal pour modifier un client
function editClient(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (client) {
    editingClientId = clientId;
    document.getElementById('modalTitle').textContent = 'Modifier Client';

    // Remplir le formulaire avec toutes les données
    document.getElementById('num').value = client.num || '';
    document.getElementById('nom').value = client.nom || '';
    document.getElementById('prenom').value = client.prenom || '';
    document.getElementById('usine').value = client.usine || '';
    document.getElementById('email').value = client.email || '';
    document.getElementById('telephone').value = client.telephone || '';
    document.getElementById('adresse').value = client.adresse || '';
    document.getElementById('nbreAdult').value = client.nbreAdult || 0;
    document.getElementById('nbreEnfant').value = client.nbreEnfant || 0;

    document.getElementById('nbreNuit').value = client.nbreNuit || '';
    document.getElementById('dateDebut').value = client.dateDebut || '';
    populateArrangements(client.arrangement); // Remplir et sélectionner l'arrangement
    document.getElementById('tarifAchat').value = client.tarifAchat || '';
    document.getElementById('tarifVente').value = client.tarifVente || '';
    document.getElementById('coefficient').value = client.coefficient || '';
    document.getElementById('montantSejour').value = client.montantSejour || '';
    document.getElementById('totalAchat').value = client.totalAchat || '';
    document.getElementById('nomHotel').value = client.nomHotel || '';
    populateRegions(client.region); // Remplir et sélectionner la région
    document.getElementById('bank').value = client.bank || '';
    document.getElementById('statutAnnulation').value = client.statutAnnulation || 'actif';
    document.getElementById('statutPaiement').value = client.statutPaiement || 'rien_paye';

    // Afficher les avances existantes
    displayAdvances(client.advances || []);

    calculateDateFin(); // Recalculer la date de fin après avoir rempli les champs
    // Appeler la nouvelle fonction de calcul automatique
    performAutomaticCalculations();
    clientModal.classList.add('show');
  }
}

// Confirmer la suppression d'un client
function confirmDeleteClient(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (client) {
    document.getElementById('clientToDelete').textContent = `${client.prenom} ${client.nom}`;
    document.getElementById('confirmDeleteBtn').onclick = () => deleteClient(clientId);
    deleteModal.classList.add('show');
  }
}

// Fermer le modal client
function closeModal() {
  clientModal.classList.remove('show');
  editingClientId = null;
}

// Fermer le modal de suppression
function closeDeleteModal() {
  deleteModal.classList.remove('show');
}

// Fonction pour calculer la date de fin
function calculateDateFin() {
  const dateDebutInput = document.getElementById("dateDebut");
  const nbreNuitInput = document.getElementById("nbreNuit");
  const dateFinInput = document.getElementById("dateFin");

  const dateDebut = dateDebutInput.value;
  const nbreNuit = parseInt(nbreNuitInput.value) || 0;

  if (dateDebut && nbreNuit > 0) {
    const debut = new Date(dateDebut);
    const fin = new Date(debut);
    fin.setDate(debut.getDate() + nbreNuit);
    dateFinInput.value = fin.toISOString().split('T')[0];
  } else {
    dateFinInput.value = '';
  }
}

// Rechercher des clients
function searchClients() {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm === '') {
    renderClients();
  } else {
    const filteredClients = clients.filter(client =>
      client.nom.toLowerCase().includes(searchTerm) ||
      client.prenom.toLowerCase().includes(searchTerm) ||
      client.num.toLowerCase().includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm)) ||
      (client.telephone && client.telephone.includes(searchTerm))
    );
    renderClients(filteredClients);
  }
}

// Gestionnaire de soumission du formulaire
function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(clientForm);
  const clientData = Object.fromEntries(formData.entries());

  // Convertir les nombres
  ['nbreAdult', 'nbreEnfant', 'nbreNuit'].forEach(field => {
    if (clientData[field]) {
      clientData[field] = parseInt(clientData[field]);
    }
  });

  ['tarifAchat', 'tarifVente', 'coefficient', 'montantSejour', 'totalAchat'].forEach(field => {
    if (clientData[field]) {
      clientData[field] = parseFloat(clientData[field]);
    }
  });

  // Collecter les avances
  clientData.advances = collectAdvances();

  if (editingClientId) {
    updateClient(editingClientId, clientData);
  } else {
    addClient(clientData);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  loadClients();

  // Boutons principaux
  document.getElementById('addClientBtn').addEventListener('click', openAddClientModal);
  document.getElementById('addFirstClientBtn').addEventListener('click', openAddClientModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('closeDeleteModalBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

  // Formulaire
  clientForm.addEventListener('submit', handleFormSubmit);

  // Recherche
  searchInput.addEventListener('input', searchClients);

  // Bouton retour
  document.getElementById('backBtn').addEventListener('click', function() {
    window.location.href = './dashboard.html';
  });

  // Bouton déconnexion
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = './index.html';
  });

  // Bouton ajouter avance
  document.getElementById('addAdvanceBtn').addEventListener('click', function() {
    addAdvanceField();
  });

  // EVENT LISTENERS POUR LE CALCUL AUTOMATIQUE
  const fieldsToWatch = ['tarifAchat', 'tarifVente', 'coefficient', 'nbreNuit', 'montantSejour', 'totalAchat'];
  fieldsToWatch.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', performAutomaticCalculations);
      field.addEventListener('change', performAutomaticCalculations);
    }
  });

  // Calcul de la date de fin
  document.getElementById('dateDebut').addEventListener('change', calculateDateFin);
  document.getElementById('nbreNuit').addEventListener('input', function() {
    calculateDateFin();
    performAutomaticCalculations(); // Aussi déclencher les calculs automatiques
  });

  // Fermer les modals en cliquant à l'extérieur
  clientModal.addEventListener('click', function(e) {
    if (e.target === clientModal) {
      closeModal();
    }
  });

  deleteModal.addEventListener('click', function(e) {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
});
