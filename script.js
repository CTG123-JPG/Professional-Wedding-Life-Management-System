// Data Storage
const appData = {
  proposal: {
    date: '2026-02-28',
    time: '15:00',
    location: 'Old Harry Rocks',
    notes: ''
  },
  wedding: {
    date: '2026-06-15',
    time: '14:00',
    venue: '',
    notes: ''
  },
  dates: [],
  budget: {
    items: [],
    total: 0
  },
  guests: [],
  vendors: [],
  timeline: [],
  notes: []
};

// Load data from localStorage
function loadData() {
  const saved = localStorage.getItem('lifePlannerData');
  if (saved) {
    Object.assign(appData, JSON.parse(saved));
    updateDashboard();
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('lifePlannerData', JSON.stringify(appData));
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    
    // Update active button
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Show selected tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
  });
});

// Update Dashboard
function updateDashboard() {
  const proposalDate = new Date(appData.proposal.date);
  const weddingDate = new Date(appData.wedding.date);
  const today = new Date();
  
  // Calculate days
  const daysToProposal = Math.ceil((proposalDate - today) / (1000 * 60 * 60 * 24));
  const daysToWedding = Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24));
  
  document.getElementById('proposalDays').textContent = daysToProposal;
  document.getElementById('weddingDays').textContent = daysToWedding;
  
  // Budget
  const totalBudget = appData.budget.items.reduce((sum, item) => sum + item.amount, 0);
  document.getElementById('totalBudget').textContent = `£${totalBudget}`;
  
  // Guests
  document.getElementById('guestCount').textContent = `${appData.guests.length} invited`;
  
  // Tasks
  const totalTasks = appData.timeline.length;
  const completedTasks = appData.timeline.filter(t => t.completed).length;
  document.getElementById('tasksComplete').textContent = `${completedTasks}/${totalTasks}`;
}

// Key Dates
function addDate() {
  const date = document.getElementById('newDate').value;
  const description = document.getElementById('dateDescription').value;
  
  if (!date || !description) return;
  
  appData.dates.push({ date, description });
  renderDates();
  saveData();
  
  document.getElementById('newDate').value = '';
  document.getElementById('dateDescription').value = '';
}

function renderDates() {
  const list = document.getElementById('datesList');
  list.innerHTML = appData.dates.map((d, i) => `
    <div class="list-item">
      <div>
        <strong>${d.date}</strong>
        <p>${d.description}</p>
      </div>
      <button class="btn-icon" onclick="removeDate(${i})">❌</button>
    </div>
  `).join('');
}

function removeDate(index) {
  appData.dates.splice(index, 1);
  renderDates();
  saveData();
}

// Proposal
function saveProposal() {
  appData.proposal.date = document.getElementById('proposalDate').value;
  appData.proposal.time = document.getElementById('proposalTime').value;
  appData.proposal.location = document.getElementById('proposalLocation').value;
  appData.proposal.notes = document.getElementById('proposalNotes').value;
  saveData();
  updateDashboard();
  alert('Proposal details saved!');
}

// Wedding
function saveWedding() {
  appData.wedding.date = document.getElementById('weddingDate').value;
  appData.wedding.time = document.getElementById('weddingTime').value;
  appData.wedding.venue = document.getElementById('weddingVenue').value;
  appData.wedding.notes = document.getElementById('weddingNotes').value;
  saveData();
  updateDashboard();
  alert('Wedding details saved!');
}

// Budget
function addBudgetItem() {
  const category = document.getElementById('budgetCategory').value;
  const amount = parseFloat(document.getElementById('budgetAmount').value);
  const notes = document.getElementById('budgetNotes').value;
  
  if (!category || !amount) return;
  
  appData.budget.items.push({ category, amount, notes, paid: false });
  renderBudget();
  saveData();
  updateDashboard();
  
  document.getElementById('budgetCategory').value = '';
  document.getElementById('budgetAmount').value = '';
  document.getElementById('budgetNotes').value = '';
}

function renderBudget() {
  const list = document.getElementById('budgetList');
  const total = appData.budget.items.reduce((sum, item) => sum + item.amount, 0);
  
  list.innerHTML = appData.budget.items.map((item, i) => `
    <div class="list-item ${item.paid ? 'completed' : ''}">
      <div>
        <strong>${item.category}</strong> - £${item.amount}
        <p>${item.notes}</p>
      </div>
      <div>
        <button class="btn-icon" onclick="toggleBudgetPaid(${i})">${item.paid ? '✅' : '⭕'}</button>
        <button class="btn-icon" onclick="removeBudgetItem(${i})">❌</button>
      </div>
    </div>
  `).join('');
  
  document.getElementById('totalBudgetDisplay').textContent = `Total: £${total}`;
}

function toggleBudgetPaid(index) {
  appData.budget.items[index].paid = !appData.budget.items[index].paid;
  renderBudget();
  saveData();
}

function removeBudgetItem(index) {
  appData.budget.items.splice(index, 1);
  renderBudget();
  saveData();
  updateDashboard();
}

// Guests
function addGuest() {
  const name = document.getElementById('guestName').value;
  const email = document.getElementById('guestEmail').value;
  const phone = document.getElementById('guestPhone').value;
  const group = document.getElementById('guestGroup').value;
  
  if (!name) return;
  
  appData.guests.push({ name, email, phone, group, rsvp: 'pending' });
  renderGuests();
  saveData();
  updateDashboard();
  
  document.getElementById('guestName').value = '';
  document.getElementById('guestEmail').value = '';
  document.getElementById('guestPhone').value = '';
  document.getElementById('guestGroup').value = '';
}

function renderGuests() {
  const list = document.getElementById('guestList');
  list.innerHTML = appData.guests.map((g, i) => `
    <div class="list-item">
      <div>
        <strong>${g.name}</strong> - ${g.group}
        <p>${g.email} | ${g.phone}</p>
        <span class="badge">RSVP: ${g.rsvp}</span>
      </div>
      <button class="btn-icon" onclick="removeGuest(${i})">❌</button>
    </div>
  `).join('');
}

function removeGuest(index) {
  appData.guests.splice(index, 1);
  renderGuests();
  saveData();
  updateDashboard();
}

// Vendors
function addVendor() {
  const name = document.getElementById('vendorName').value;
  const category = document.getElementById('vendorCategory').value;
  const contact = document.getElementById('vendorContact').value;
  const cost = document.getElementById('vendorCost').value;
  
  if (!name) return;
  
  appData.vendors.push({ name, category, contact, cost });
  renderVendors();
  saveData();
  
  document.getElementById('vendorName').value = '';
  document.getElementById('vendorCategory').value = '';
  document.getElementById('vendorContact').value = '';
  document.getElementById('vendorCost').value = '';
}

function renderVendors() {
  const list = document.getElementById('vendorList');
  list.innerHTML = appData.vendors.map((v, i) => `
    <div class="list-item">
      <div>
        <strong>${v.name}</strong> - ${v.category}
        <p>${v.contact} | £${v.cost}</p>
      </div>
      <button class="btn-icon" onclick="removeVendor(${i})">❌</button>
    </div>
  `).join('');
}

function removeVendor(index) {
  appData.vendors.splice(index, 1);
  renderVendors();
  saveData();
}

// Timeline
function addTimelineItem() {
  const date = document.getElementById('timelineDate').value;
  const task = document.getElementById('timelineTask').value;
  
  if (!date || !task) return;
  
  appData.timeline.push({ date, task, completed: false });
  renderTimeline();
  saveData();
  updateDashboard();
  
  document.getElementById('timelineDate').value = '';
  document.getElementById('timelineTask').value = '';
}

function renderTimeline() {
  const list = document.getElementById('timelineList');
  list.innerHTML = appData.timeline.map((t, i) => `
    <div class="timeline-item ${t.completed ? 'completed' : ''}">
      <div>
        <strong>${t.date}</strong>
        <p>${t.task}</p>
      </div>
      <div>
        <button class="btn-icon" onclick="toggleTimelineComplete(${i})">${t.completed ? '✅' : '⭕'}</button>
        <button class="btn-icon" onclick="removeTimelineItem(${i})">❌</button>
      </div>
    </div>
  `).join('');
}

function toggleTimelineComplete(index) {
  appData.timeline[index].completed = !appData.timeline[index].completed;
  renderTimeline();
  saveData();
  updateDashboard();
}

function removeTimelineItem(index) {
  appData.timeline.splice(index, 1);
  renderTimeline();
  saveData();
  updateDashboard();
}

// Notes
function addNote() {
  const content = document.getElementById('newNote').value;
  
  if (!content) return;
  
  appData.notes.push({ content, date: new Date().toISOString() });
  renderNotes();
  saveData();
  
  document.getElementById('newNote').value = '';
}

function renderNotes() {
  const list = document.getElementById('notesList');
  list.innerHTML = appData.notes.map((n, i) => `
    <div class="list-item">
      <div>
        <p>${n.content}</p>
        <small>${new Date(n.date).toLocaleString()}</small>
      </div>
      <button class="btn-icon" onclick="removeNote(${i})">❌</button>
    </div>
  `).join('');
}

function removeNote(index) {
  appData.notes.splice(index, 1);
  renderNotes();
  saveData();
}

// Export/Import
function exportData() {
  const dataStr = JSON.stringify(appData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'life-planner-data.json';
  link.click();
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        Object.assign(appData, data);
        saveData();
        updateDashboard();
        renderDates();
        renderBudget();
        renderGuests();
        renderVendors();
        renderTimeline();
        renderNotes();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data!');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Initialize
loadData();
renderDates();
renderBudget();
renderGuests();
renderVendors();
renderTimeline();
renderNotes();
updateDashboard();
