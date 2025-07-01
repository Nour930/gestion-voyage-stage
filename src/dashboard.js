// Vérifier si l'utilisateur est connecté
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
  window.location.href = './index.html';
}

// Afficher les informations de l'utilisateur
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userRole').textContent = currentUser.role;

// Gestion de la déconnexion
document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('currentUser');
  window.location.href = './index.html';
});

// Simulation de données (à remplacer par de vraies données)
let dashboardData = {
  totalClients: 0,
  activeTrips: 0,
  revenue: 0,
  pending: 0,
  recentTrips: []
};

// Charger les données depuis le localStorage ou initialiser
function loadDashboardData() {
  // Charger les clients pour calculer les statistiques
  const clients = JSON.parse(localStorage.getItem('clients') || '[]');
  
  // Calculer le total des clients
  dashboardData.totalClients = clients.length;
  
  // Calculer le chiffre d'affaires (total des montants de séjour)
  dashboardData.revenue = clients.reduce((total, client) => {
    return total + (client.montantSejour || 0);
  }, 0);
  
  // Calculer les voyages actifs (clients non annulés)
  dashboardData.activeTrips = clients.filter(client => 
    client.statutAnnulation !== 'annule'
  ).length;
  
  // Calculer les clients en attente (rien payé)
  dashboardData.pending = clients.filter(client => 
    client.statutPaiement === 'rien_paye' && client.statutAnnulation !== 'annule'
  ).length;
  
  // Obtenir les 5 derniers clients créés pour "Voyages Récents"
  dashboardData.recentTrips = clients
    .sort((a, b) => new Date(b.dateAjout || 0) - new Date(a.dateAjout || 0))
    .slice(0, 5)
    .map(client => ({
      id: client.id,
      clientName: `${client.prenom} ${client.nom}`,
      destination: client.region || 'Non spécifiée',
      hotel: client.nomHotel || 'Non spécifié',
      dateDebut: client.dateDebut,
      dateFin: client.dateFin,
      montant: client.montantSejour || 0,
      statut: client.statutAnnulation === 'annule' ? 'Annulé' : 
              client.statutPaiement === 'tout_paye' ? 'Payé' :
              client.statutPaiement === 'avance_payee' ? 'Avance' : 'En attente'
    }));
  
  updateDashboard();
}

// Sauvegarder les données
function saveDashboardData() {
  localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
}

// Mettre à jour l'affichage du tableau de bord
function updateDashboard() {
  // Mettre à jour les cartes de statistiques
  document.getElementById('totalClients').textContent = dashboardData.totalClients;
  document.getElementById('activeTrips').textContent = dashboardData.activeTrips;
  document.getElementById('revenue').textContent = dashboardData.revenue.toFixed(3);
  document.getElementById('pending').textContent = dashboardData.pending;
  
  // Mettre à jour la section des voyages récents
  const recentTripsContainer = document.getElementById('recentTripsContainer');
  
  if (dashboardData.recentTrips.length === 0) {
    recentTripsContainer.innerHTML = `
      <div class="empty-recent-trips">
        <p>Aucun client récent</p>
      </div>
    `;
  } else {
    recentTripsContainer.innerHTML = dashboardData.recentTrips.map(trip => `
      <div class="recent-trip-item">
        <div class="trip-info">
          <div class="trip-client">${trip.clientName}</div>
          <div class="trip-details">
            <span class="trip-destination">${trip.destination}</span>
            ${trip.hotel !== 'Non spécifié' ? ` • ${trip.hotel}` : ''}
          </div>
          <div class="trip-dates">
            ${trip.dateDebut ? new Date(trip.dateDebut).toLocaleDateString('fr-FR') : 'Date non définie'}
            ${trip.dateFin ? ' → ' + new Date(trip.dateFin).toLocaleDateString('fr-FR') : ''}
          </div>
        </div>
        <div class="trip-amount">
          <div class="amount">${trip.montant.toFixed(3)} DT</div>
          <div class="status status-${trip.statut.toLowerCase().replace(' ', '-')}">${trip.statut}</div>
        </div>
      </div>
    `).join('');
  }
}

// Calculer les pourcentages de croissance (simulation)
function calculateGrowthPercentages() {
  // Pour la démonstration, nous utilisons des valeurs simulées
  // Dans une vraie application, vous compareriez avec les données du mois précédent
  const growthData = {
    clients: Math.floor(Math.random() * 20) + 5, // 5-25%
    trips: Math.floor(Math.random() * 15) + 3,   // 3-18%
    revenue: Math.floor(Math.random() * 25) + 10, // 10-35%
    pending: -(Math.floor(Math.random() * 10) + 1) // -1% à -10%
  };
  
  // Mettre à jour les pourcentages dans l'interface
  document.getElementById('clientsGrowth').textContent = `+${growthData.clients}% ce mois`;
  document.getElementById('tripsGrowth').textContent = `+${growthData.trips}% ce mois`;
  document.getElementById('revenueGrowth').textContent = `+${growthData.revenue}% ce mois`;
  document.getElementById('pendingGrowth').textContent = `${growthData.pending}% ce mois`;
}

// Gestion des actions rapides
document.getElementById('newClientBtn').addEventListener('click', function() {
  window.location.href = './clients.html';
});

document.getElementById('newTripBtn').addEventListener('click', function() {
  window.location.href = './invoice.html';
});

document.getElementById('importExcelBtn').addEventListener('click', function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      alert('Import Excel: ' + file.name + ' (fonctionnalité en cours de développement)');
    }
  };
  input.click();
});

document.getElementById('exportDataBtn').addEventListener('click', function() {
  // Simuler l'export des données
  const clients = JSON.parse(localStorage.getItem('clients') || '[]');
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Nom,Prénom,Email,Téléphone,Montant Séjour,Statut\n"
    + clients.map(client => 
        `${client.nom},${client.prenom},${client.email || ''},${client.telephone},${client.montantSejour || 0},${client.statutAnnulation}`
      ).join('\n');
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'clients_export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Actualiser les données toutes les 30 secondes
setInterval(loadDashboardData, 30000);

// Charger les données au démarrage
loadDashboardData();
calculateGrowthPercentages();
