const API_BASE = 'http://localhost:8080';

let currentSection = 'dashboard';
let allDoctors = [];
let allPatients = [];
let allAppointments = [];

// Show section
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.closest('.nav-link')?.classList.add('active');
    
    currentSection = section;
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        doctors: 'Doctors Management',
        patients: 'Patients Management',
        appointments: 'Appointments Management'
    };
    document.getElementById('page-title').textContent = titles[section] || section;

    if (section !== 'dashboard') {
        loadData(section);
    } else {
        loadDashboard();
    }
}

// Load Dashboard
async function loadDashboard() {
    try {
        const doctors = await fetch(`${API_BASE}/doctors`).then(r => r.json());
        const patients = await fetch(`${API_BASE}/patients`).then(r => r.json());
        const appointments = await fetch(`${API_BASE}/appointments`).then(r => r.json());

        document.getElementById('total-doctors').textContent = doctors.length;
        document.getElementById('total-patients').textContent = patients.length;
        document.getElementById('total-appointments').textContent = appointments.length;
        document.getElementById('available-doctors').textContent = doctors.filter(d => d.available).length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load data
async function loadData(type) {
    try {
        const response = await fetch(`${API_BASE}/${type}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (type === 'doctors') allDoctors = data;
        if (type === 'patients') allPatients = data;
        if (type === 'appointments') allAppointments = data;
        
        displayData(type, data);
        attachSearchListener(type);
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById(type + '-list').innerHTML = `<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> Error loading ${type}: ${error.message}</div>`;
    }
}

// Attach search listener
function attachSearchListener(type) {
    const searchId = type + '-search';
    const searchBox = document.getElementById(searchId);
    
    if (searchBox) {
        // Remove old listeners
        searchBox.replaceWith(searchBox.cloneNode(true));
        const newSearchBox = document.getElementById(searchId);
        
        newSearchBox.addEventListener('input', (e) => {
            filterData(type, e.target.value);
        });
    }
}

// Display data
function displayData(type, data) {
    const container = document.getElementById(type + '-list');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle"></i> No data available. Create a new entry to get started!</div>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'row';

    data.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${getTitle(type, item)}</h5>
                    <p class="card-text">${getDetails(type, item)}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-info btn-sm" onclick="view${capitalize(type.slice(0, -1))}(${item.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="edit${capitalize(type.slice(0, -1))}(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="delete${capitalize(type.slice(0, -1))}(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });

    container.appendChild(grid);
}

function getTitle(type, item) {
    if (type === 'doctors') return item.name;
    if (type === 'patients') return item.name;
    if (type === 'appointments') return `Appointment ${item.id}`;
}

function getDetails(type, item) {
    if (type === 'doctors') return `Specialization: ${item.specialization}, Available: ${item.available}`;
    if (type === 'patients') return `Age: ${item.age}, Gender: ${item.gender}`;
    if (type === 'appointments') return `Doctor ID: ${item.doctorId}, Patient ID: ${item.patientId}, Date: ${item.appointmentDate}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show forms
function showDoctorForm(doctor = null) {
    if (doctor) {
        document.getElementById('doctor-id').value = doctor.id;
        document.getElementById('doctor-name').value = doctor.name;
        document.getElementById('doctor-specialization').value = doctor.specialization;
        document.getElementById('doctor-available').value = doctor.available.toString();
    } else {
        document.getElementById('doctor-form').reset();
    }
    new bootstrap.Modal(document.getElementById('doctor-modal')).show();
}

function showPatientForm(patient = null) {
    if (patient) {
        document.getElementById('patient-id').value = patient.id;
        document.getElementById('patient-name').value = patient.name;
        document.getElementById('patient-age').value = patient.age;
        document.getElementById('patient-gender').value = patient.gender;
    } else {
        document.getElementById('patient-form').reset();
    }
    new bootstrap.Modal(document.getElementById('patient-modal')).show();
}

function showAppointmentForm(appointment = null) {
    if (appointment) {
        document.getElementById('appointment-id').value = appointment.id;
        document.getElementById('appointment-doctorId').value = appointment.doctorId;
        document.getElementById('appointment-patientId').value = appointment.patientId;
        document.getElementById('appointment-date').value = appointment.appointmentDate;
    } else {
        document.getElementById('appointment-form').reset();
    }
    new bootstrap.Modal(document.getElementById('appointment-modal')).show();
}

// Form submissions
document.getElementById('doctor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('doctor-id').value;
    const data = {
        name: document.getElementById('doctor-name').value,
        specialization: document.getElementById('doctor-specialization').value,
        available: document.getElementById('doctor-available').value === 'true'
    };
    await saveData('doctors', data, id);
    bootstrap.Modal.getInstance(document.getElementById('doctor-modal')).hide();
    
    // Clear search box and reload data
    setTimeout(() => {
        const searchBox = document.getElementById('doctor-search');
        if (searchBox) searchBox.value = '';
        loadData('doctors');
    }, 500);
});

document.getElementById('patient-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('patient-id').value;
    const data = {
        name: document.getElementById('patient-name').value,
        age: parseInt(document.getElementById('patient-age').value),
        gender: document.getElementById('patient-gender').value
    };
    await saveData('patients', data, id);
    bootstrap.Modal.getInstance(document.getElementById('patient-modal')).hide();
    
    // Clear search box and reload data
    setTimeout(() => {
        const searchBox = document.getElementById('patient-search');
        if (searchBox) searchBox.value = '';
        loadData('patients');
    }, 500);
});

document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('appointment-id').value;
    const data = {
        doctorId: parseInt(document.getElementById('appointment-doctorId').value),
        patientId: parseInt(document.getElementById('appointment-patientId').value),
        appointmentDate: document.getElementById('appointment-date').value
    };
    await saveData('appointments', data, id);
    bootstrap.Modal.getInstance(document.getElementById('appointment-modal')).hide();
    
    // Clear search box and reload data
    setTimeout(() => {
        const searchBox = document.getElementById('appointment-search');
        if (searchBox) searchBox.value = '';
        loadData('appointments');
    }, 500);
});

// Save data
async function saveData(type, data, id = null) {
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/${type}/${id}` : `${API_BASE}/${type}`;
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        alert(`${capitalize(type.slice(0, -1))} ${id ? 'updated' : 'created'} successfully!`);
    } catch (error) {
        console.error('Error saving data:', error);
        alert(`Error saving ${type.slice(0, -1)}: ${error.message}`);
    }
}

// View functions
async function viewDoctor(id) {
    try {
        const response = await fetch(`${API_BASE}/doctors/${id}`);
        const doctor = await response.json();
        document.getElementById('view-doctor-content').innerHTML = `
            <p><strong>ID:</strong> ${doctor.id}</p>
            <p><strong>Name:</strong> ${doctor.name}</p>
            <p><strong>Specialization:</strong> ${doctor.specialization}</p>
            <p><strong>Available:</strong> ${doctor.available ? 'Yes' : 'No'}</p>
        `;
        new bootstrap.Modal(document.getElementById('view-doctor-modal')).show();
    } catch (error) {
        console.error('Error fetching doctor:', error);
        alert('Error fetching doctor details');
    }
}

async function viewPatient(id) {
    try {
        const response = await fetch(`${API_BASE}/patients/${id}`);
        const patient = await response.json();
        document.getElementById('view-patient-content').innerHTML = `
            <p><strong>ID:</strong> ${patient.id}</p>
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
        `;
        new bootstrap.Modal(document.getElementById('view-patient-modal')).show();
    } catch (error) {
        console.error('Error fetching patient:', error);
        alert('Error fetching patient details');
    }
}

async function viewAppointment(id) {
    try {
        const response = await fetch(`${API_BASE}/appointments/${id}`);
        const appointment = await response.json();
        document.getElementById('view-appointment-content').innerHTML = `
            <p><strong>ID:</strong> ${appointment.id}</p>
            <p><strong>Doctor ID:</strong> ${appointment.doctorId}</p>
            <p><strong>Patient ID:</strong> ${appointment.patientId}</p>
            <p><strong>Appointment Date:</strong> ${appointment.appointmentDate}</p>
        `;
        new bootstrap.Modal(document.getElementById('view-appointment-modal')).show();
    } catch (error) {
        console.error('Error fetching appointment:', error);
        alert('Error fetching appointment details');
    }
}

// Delete functions
async function deleteDoctor(id) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        try {
            const response = await fetch(`${API_BASE}/doctors/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            alert('Doctor deleted successfully!');
            loadData('doctors');
        } catch (error) {
            console.error('Error deleting doctor:', error);
            alert('Error deleting doctor');
        }
    }
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        try {
            const response = await fetch(`${API_BASE}/patients/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            alert('Patient deleted successfully!');
            loadData('patients');
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Error deleting patient');
        }
    }
}

async function deleteAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        try {
            const response = await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            alert('Appointment deleted successfully!');
            loadData('appointments');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Error deleting appointment');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    showSection('dashboard');
    
    // Give a small delay to ensure all elements are rendered
    setTimeout(() => {
        console.log('Initializing search listeners...');
    }, 500);
});

// Attach search listener
function attachSearchListener(type) {
    const searchId = type + '-search';
    const searchBox = document.getElementById(searchId);
    
    if (!searchBox) {
        console.log('Search box not found:', searchId);
        return;
    }
    
    // Clear previous value
    searchBox.value = '';
    
    // Remove old event listener by cloning
    const newSearchBox = searchBox.cloneNode(true);
    searchBox.parentNode.replaceChild(newSearchBox, searchBox);
    
    // Add new event listener
    newSearchBox.addEventListener('input', function(e) {
        console.log('Search input for ' + type + ':', e.target.value);
        filterDataByType(type, e.target.value);
    });
    
    console.log('Search listener attached for:', type);
}

function filterDataByType(type, query) {
    console.log('filterDataByType called:', type, query);
    
    let data = [];
    
    if (type === 'doctors') {
        data = allDoctors;
    } else if (type === 'patients') {
        data = allPatients;
    } else if (type === 'appointments') {
        data = allAppointments;
    }
    
    console.log('Data to filter:', data);
    
    if (!data || data.length === 0) {
        console.log('No data available');
        document.getElementById(type + '-list').innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle"></i> No data available</div>';
        return;
    }

    // If search is empty, show all
    if (!query || query.trim() === '') {
        displayData(type, data);
        return;
    }

    const queryLower = query.toLowerCase();
    const filtered = data.filter(item => {
        try {
            if (type === 'doctors') {
                const nameMatch = item.name && item.name.toLowerCase().includes(queryLower);
                const specMatch = item.specialization && item.specialization.toLowerCase().includes(queryLower);
                return nameMatch || specMatch;
            } else if (type === 'patients') {
                const nameMatch = item.name && item.name.toLowerCase().includes(queryLower);
                const ageMatch = item.age && item.age.toString().includes(queryLower);
                const genderMatch = item.gender && item.gender.toLowerCase().includes(queryLower);
                return nameMatch || ageMatch || genderMatch;
            } else if (type === 'appointments') {
                const doctorMatch = item.doctorId && item.doctorId.toString().includes(query);
                const patientMatch = item.patientId && item.patientId.toString().includes(query);
                const dateMatch = item.appointmentDate && item.appointmentDate.includes(query);
                return doctorMatch || patientMatch || dateMatch;
            }
        } catch (e) {
            console.error('Error filtering item:', e);
            return false;
        }
        return false;
    });

    console.log('Filtered results:', filtered);
    
    if (filtered.length === 0) {
        document.getElementById(type + '-list').innerHTML = '<div class="alert alert-warning"><i class="fas fa-search"></i> No results found for "' + query + '"</div>';
    } else {
        displayData(type, filtered);
    }
}