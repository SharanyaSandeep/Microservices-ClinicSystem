// assets/js/patients.js
document.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  const form = document.getElementById("patient-form");
  const formTitle = document.getElementById("patient-form-title");
  const patientIdInput = document.getElementById("patient-id");
  const nameInput = document.getElementById("patient-name");
  const ageInput = document.getElementById("patient-age");
  const genderInput = document.getElementById("patient-gender");
  const emailInput = document.getElementById("patient-email");
  const phoneInput = document.getElementById("patient-phone");
  const medicalHistoryInput = document.getElementById("patient-medical-history");
  const cancelEditBtn = document.getElementById("btn-cancel-patient-edit");
  const formError = document.getElementById("patient-form-error");
  const tableBody = document.getElementById("patients-table-body");
  const searchInput = document.getElementById("patient-search");

  let allPatients = [];
  let editingPatientId = null;

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError.textContent = "";

    const patientData = {
      name: nameInput.value.trim(),
      age: parseInt(ageInput.value),
      gender: genderInput.value,
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      medicalHistory: medicalHistoryInput.value.trim(),
    };

    try {
      let result;
      if (editingPatientId) {
        result = await updatePatient(editingPatientId, patientData);
        editingPatientId = null;
      } else {
        result = await createPatient(patientData);
      }

      // Reset form
      form.reset();
      formTitle.textContent = "Register New Patient";
      cancelEditBtn.style.display = "none";
      
      // Refresh list
      await loadPatients();
      showNotification("Patient saved successfully!", "success");
    } catch (err) {
      formError.textContent = err.message || "Failed to save patient";
      console.error(err);
    }
  });

  // Cancel edit
  cancelEditBtn.addEventListener("click", () => {
    form.reset();
    formTitle.textContent = "Register New Patient";
    editingPatientId = null;
    cancelEditBtn.style.display = "none";
    patientIdInput.value = "";
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = allPatients.filter((patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query)
      );
      renderPatients(filtered);
    });
  }

  // Load and display patients
  async function loadPatients() {
    try {
      allPatients = await getPatients();
      renderPatients(allPatients);
    } catch (err) {
      console.error("Failed to load patients:", err);
      tableBody.innerHTML = '<tr><td colspan="7">Failed to load patients. Please try again.</td></tr>';
    }
  }

  function renderPatients(patients) {
    if (!patients.length) {
      tableBody.innerHTML = '<tr><td colspan="7">No patients found.</td></tr>';
      return;
    }

    tableBody.innerHTML = patients.map((patient) => `
      <tr>
        <td>${patient.id || patient.patientId || ""}</td>
        <td>${patient.name || ""}</td>
        <td>${patient.age || ""}</td>
        <td>
          <span class="badge badge-secondary">${patient.gender || ""}</span>
        </td>
        <td>${patient.email || ""}</td>
        <td>${patient.phone || ""}</td>
        <td>
          <button onclick="editPatient(${patient.id || patient.patientId})" class="btn btn-sm btn-secondary">Edit</button>
          <button onclick="viewPatientHistory(${patient.id || patient.patientId})" class="btn btn-sm btn-info">History</button>
          <button onclick="deletePatient(${patient.id || patient.patientId})" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  // Edit patient
  window.editPatient = async function(id) {
    try {
      const patient = allPatients.find(p => (p.id || p.patientId) == id);
      if (!patient) return;

      editingPatientId = id;
      patientIdInput.value = id;
      nameInput.value = patient.name || "";
      ageInput.value = patient.age || "";
      genderInput.value = patient.gender || "";
      emailInput.value = patient.email || "";
      phoneInput.value = patient.phone || "";
      medicalHistoryInput.value = patient.medicalHistory || "";

      formTitle.textContent = "Edit Patient";
      cancelEditBtn.style.display = "inline-block";
      form.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Failed to load patient for editing:", err);
    }
  };

  // View patient history (placeholder - you'll need to implement this endpoint)
  window.viewPatientHistory = function(id) {
    const patient = allPatients.find(p => (p.id || p.patientId) == id);
    if (patient) {
      alert(`Medical History for ${patient.name}:\n\n${patient.medicalHistory || "No history available."}`);
      // In a real app, this would open a modal or navigate to a details page
    }
  };

  // Delete patient
  window.deletePatient = async function(id) {
    if (!confirm("Are you sure you want to delete this patient? This action cannot be undone.")) return;

    try {
      await deletePatient(id);
      await loadPatients();
      showNotification("Patient deleted successfully!", "success");
    } catch (err) {
      alert("Failed to delete patient: " + err.message);
      console.error(err);
    }
  };

  // Notification helper
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 12px 20px;
      background: ${type === "success" ? "#10b981" : "#3b82f6"}; color: white;
      border-radius: 8px; z-index: 1000; font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }

  // Initial load
  loadPatients();
});
