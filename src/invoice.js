// Vérifier si l'utilisateur est connecté
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
  window.location.href = './index.html';
}

// Afficher les informations de l'utilisateur
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userRole').textContent = currentUser.role;

// Variables globales
let invoices = [];
let clients = [];

// Éléments DOM
const invoiceForm = document.getElementById('invoiceForm');
const invoiceItemsContainer = document.getElementById('invoiceItemsContainer');
const subtotalSpan = document.getElementById('subtotal');
const taxSpan = document.getElementById('tax');
const totalSpan = document.getElementById('total');
const clientSelect = document.getElementById('clientSelect');
const clientEmailInput = document.getElementById('clientEmail');
const invoicesTableBody = document.getElementById('invoicesTableBody');
const emptyInvoicesState = document.getElementById('emptyInvoices');

// Charger les clients et les factures depuis le localStorage
function loadData() {
  const savedClients = localStorage.getItem('clients');
  if (savedClients) {
    clients = JSON.parse(savedClients);
  }
  const savedInvoices = localStorage.getItem('invoices');
  if (savedInvoices) {
    invoices = JSON.parse(savedInvoices);
  }
  populateClientSelect();
  renderInvoices();
  generateNewInvoiceNumber();
  document.getElementById('invoiceDate').valueAsDate = new Date();
}

// Sauvegarder les factures dans le localStorage
function saveInvoices() {
  localStorage.setItem('invoices', JSON.stringify(invoices));
  renderInvoices();
}

// Remplir le sélecteur de clients
function populateClientSelect() {
  clientSelect.innerHTML = '<option value="">Sélectionner un client</option>';
  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = `${client.prenom} ${client.nom}`;
    clientSelect.appendChild(option);
  });
}

// Générer un nouveau numéro de facture
function generateNewInvoiceNumber() {
  const lastInvoiceNumber = invoices.length > 0 ? parseInt(invoices[invoices.length - 1].invoiceNumber.split('-')[1]) : 0;
  const newNumber = lastInvoiceNumber + 1;
  document.getElementById('invoiceNumber').value = `INV-${String(newNumber).padStart(4, '0')}`;
}

// Ajouter un article à la facture
function addInvoiceItem(item = {}) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('invoice-item');
  itemDiv.innerHTML = `
    <div class="form-group">
      <label>Description</label>
      <input type="text" class="item-description" value="${item.description || ''}" required>
    </div>
    <div class="form-group">
      <label>Quantité</label>
      <input type="number" class="item-quantity" value="${item.quantity || 1}" min="1" required>
    </div>
    <div class="form-group">
      <label>Prix Unitaire (DT)</label>
      <input type="number" class="item-price" value="${item.price || 0}" min="0" step="0.01" required>
    </div>
    <button type="button" class="remove-item-btn"><i class="fas fa-times"></i></button>
  `;
  invoiceItemsContainer.appendChild(itemDiv);
  
  itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => {
    itemDiv.remove();
    calculateTotals();
  });
  
  itemDiv.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateTotals);
  });
  
  calculateTotals();
}

// Calculer les totaux de la facture
function calculateTotals() {
  let subtotal = 0;
  document.querySelectorAll('.invoice-item').forEach(itemDiv => {
    const quantity = parseFloat(itemDiv.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(itemDiv.querySelector('.item-price').value) || 0;
    subtotal += quantity * price;
  });
  
  const tax = subtotal * 0.20; // TVA à 20%
  const total = subtotal + tax;
  
  subtotalSpan.textContent = `${subtotal.toFixed(3)} DT`;
  taxSpan.textContent = `${tax.toFixed(3)} DT`;
  totalSpan.textContent = `${total.toFixed(3)} DT`;
}

// Afficher les factures dans le tableau d'historique
function renderInvoices() {
  if (invoices.length === 0) {
    invoicesTableBody.style.display = 'none';
    emptyInvoicesState.style.display = 'block';
  } else {
    invoicesTableBody.style.display = '';
    emptyInvoicesState.style.display = 'none';
    
    invoicesTableBody.innerHTML = invoices.map(invoice => `
      <tr>
        <td>${invoice.invoiceNumber}</td>
        <td>${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}</td>
        <td>${invoice.clientName}</td>
        <td>${invoice.total.toFixed(3)} DT</td>
        <td>
          <div class="action-buttons">
            <button class="view-btn" onclick="viewInvoice('${invoice.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="delete-btn" onclick="deleteInvoice('${invoice.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

// Voir une facture (simulé, pourrait ouvrir un modal ou une nouvelle page)
function viewInvoice(invoiceId) {
  const invoice = invoices.find(inv => inv.id === invoiceId);
  if (invoice) {
    alert(`Détails de la facture ${invoice.invoiceNumber}:\nClient: ${invoice.clientName}\nTotal: ${invoice.total.toFixed(3)} DT\nArticles: ${invoice.items.map(item => item.description).join(', ')}`);
    // Ici, vous pourriez implémenter l'affichage détaillé de la facture
  }
}

// Supprimer une facture
function deleteInvoice(invoiceId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
    invoices = invoices.filter(inv => inv.id !== invoiceId);
    saveInvoices();
  }
}

// Event Listeners
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = './dashboard.html';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = './index.html';
});

document.getElementById('newInvoiceBtn').addEventListener('click', () => {
  invoiceForm.reset();
  invoiceItemsContainer.innerHTML = '';
  addInvoiceItem(); // Ajouter un article par défaut
  generateNewInvoiceNumber();
  document.getElementById('invoiceDate').valueAsDate = new Date();
  calculateTotals();
});

document.getElementById('addItemBtn').addEventListener('click', () => {
  addInvoiceItem();
});

document.getElementById('printInvoiceBtn').addEventListener('click', () => {
  window.print();
});

clientSelect.addEventListener('change', () => {
  const selectedClient = clients.find(c => c.id === clientSelect.value);
  clientEmailInput.value = selectedClient ? selectedClient.email : '';
});

invoiceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const invoiceNumber = document.getElementById('invoiceNumber').value;
  const invoiceDate = document.getElementById('invoiceDate').value;
  const selectedClientId = clientSelect.value;
  const clientName = clientSelect.options[clientSelect.selectedIndex].text;
  
  const items = [];
  document.querySelectorAll('.invoice-item').forEach(itemDiv => {
    items.push({
      description: itemDiv.querySelector('.item-description').value,
      quantity: parseFloat(itemDiv.querySelector('.item-quantity').value),
      price: parseFloat(itemDiv.querySelector('.item-price').value)
    });
  });
  
  const subtotal = parseFloat(subtotalSpan.textContent.replace(' DT', ''));
  const tax = parseFloat(taxSpan.textContent.replace(' DT', ''));
  const total = parseFloat(totalSpan.textContent.replace(' DT', ''));
  
  const newInvoice = {
    id: Date.now().toString(), // ID unique pour la facture
    invoiceNumber,
    invoiceDate,
    clientId: selectedClientId,
    clientName,
    items,
    subtotal,
    tax,
    total
  };
  
  invoices.push(newInvoice);
  saveInvoices();
  
  // Réinitialiser le formulaire pour une nouvelle facture
  invoiceForm.reset();
  invoiceItemsContainer.innerHTML = '';
  addInvoiceItem();
  generateNewInvoiceNumber();
  document.getElementById('invoiceDate').valueAsDate = new Date();
  calculateTotals();
  alert('Facture enregistrée avec succès !');
});

// Initialisation
loadData();
addInvoiceItem(); // Ajouter un premier article par défaut
