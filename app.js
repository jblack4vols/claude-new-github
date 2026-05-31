const storageKey = 'pt-practice-manager-v1';

const state = {
  patients: [],
  appointments: []
};

const patientForm = document.getElementById('patient-form');
const appointmentForm = document.getElementById('appointment-form');
const patientList = document.getElementById('patient-list');
const appointmentList = document.getElementById('appointment-list');
const patientSelect = document.getElementById('patient-select');
const summary = document.getElementById('summary');

function loadState() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    state.patients = Array.isArray(parsed.patients) ? parsed.patients : [];
    state.appointments = Array.isArray(parsed.appointments) ? parsed.appointments : [];
  } catch {
    state.patients = [];
    state.appointments = [];
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function renderSummary() {
  const revenue = state.appointments.reduce((total, item) => total + Number(item.fee), 0);
  summary.textContent = '';

  const blocks = [
    `Patients: ${state.patients.length}`,
    `Visits: ${state.appointments.length}`,
    `Revenue: ${formatCurrency(revenue)}`
  ];

  for (const block of blocks) {
    const item = document.createElement('span');
    item.textContent = block;
    summary.appendChild(item);
  }
}

function renderPatients() {
  patientList.textContent = '';
  patientSelect.textContent = '';

  if (state.patients.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Add a patient first';
    patientSelect.appendChild(option);
    return;
  }

  for (const patient of state.patients) {
    const li = document.createElement('li');
    li.textContent = `${patient.name} · ${patient.phone} · ${patient.condition}`;
    patientList.appendChild(li);

    const option = document.createElement('option');
    option.value = patient.id;
    option.textContent = patient.name;
    patientSelect.appendChild(option);
  }
}

function renderAppointments() {
  appointmentList.textContent = '';

  for (const appointment of state.appointments) {
    const patient = state.patients.find((item) => item.id === appointment.patientId);
    const li = document.createElement('li');
    li.textContent = `${appointment.date} · ${patient ? patient.name : 'Unknown patient'} · ${formatCurrency(Number(appointment.fee))}`;
    appointmentList.appendChild(li);
  }
}

patientForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(patientForm);

  state.patients.push({
    id: crypto.randomUUID(),
    name: String(form.get('name') || '').trim(),
    phone: String(form.get('phone') || '').trim(),
    condition: String(form.get('condition') || '').trim()
  });

  saveState();
  patientForm.reset();
  renderPatients();
  renderAppointments();
  renderSummary();
});

appointmentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(appointmentForm);

  state.appointments.unshift({
    id: crypto.randomUUID(),
    patientId: String(form.get('patientId') || ''),
    date: String(form.get('date') || ''),
    fee: Number(form.get('fee') || 0)
  });

  saveState();
  appointmentForm.reset();
  renderAppointments();
  renderSummary();
});

loadState();
renderPatients();
renderAppointments();
renderSummary();
