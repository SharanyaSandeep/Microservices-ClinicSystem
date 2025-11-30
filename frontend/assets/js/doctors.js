// assets/js/doctors.js
document.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  const form = document.getElementById("doctor-form");
  const formTitle = document.getElementById("form-title");
  const doctorIdInput = document.getElementById("doctor-id");
  const nameInput = document.getElementById("doctor-name");
  const specialtyInput = document.getElementById("doctor-specialty");
  const emailInput = document.getElementById("doctor-email");
  const phoneInput = document.getElementById("doctor-phone");
  const availabilityInput = document.getElementById("doctor-availability");
  const cancelEditBtn = document.getElementById("btn-cancel-edit");
  const formError = document.getElementById("form-error");
  const tableBody = document.getElementById("doctors-table-body");
  const searchInput = document.getElementById("doctor-search");
  const logoutBtn = document.getElementById("btn-logout");

  let allDoctors = [];
  let editingDoctorId = null;

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError.textContent = "";

    const doctorData = {
      name: nameInput.value.trim(),
      specialty: specialtyInput.value,
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      availability: availabilityInput.value.trim(),
    };

    try {
      let result;
      if (editingDoctorId) {
        result = await updateDoctor(editingDoctorId, doctorData);
        editingDoctorId = null;
      } else {
        result = await createDoctor(doctorData);
      }

      // Reset form
      form.reset();
      formTitle.textContent = "Add New Doctor";
      cancelEditBtn.style.display = "none";
      
      // Refresh list
      await loadDoctors();
      showNotification("Doctor saved successfully!", "success");
    } catch (err) {
      formError.textContent = err.message || "Failed to save doctor";
      console.error(err);
    }
  });

  // Cancel edit
  cancelEditBtn.addEventListener("click", () => {
    form.reset();
    formTitle.textContent = "Add New Doctor";
    editingDoctorId = null;
    cancelEditBtn.style.display = "none";
    doctorIdInput.value = "";
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = allDoctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query)
      );
      renderDoctors(filtered);
    });
  }

  // Load and display doctors
  async function loadDoctors() {
    try {
      allDoctors = await getDoctors();
      renderDoctors(allDoctors);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      tableBody.innerHTML = '<tr><td colspan="7">Failed to load doctors. Please try again.</td></tr>';
    }
  }

  function renderDoctors(doctors) {
    if (!doctors.length) {
      tableBody.innerHTML = '<tr><td colspan="7">No doctors found.</td></tr>';
      return;
    }

    tableBody.innerHTML = doctors.map((doctor) => `
      <tr>
        <td>${doctor.id || doctor.doctorId || ""}</td>
        <td>${doctor.name || ""}</td>
        <td>
          <span class="badge badge-primary">${doctor.specialty || ""}</span>
        </td>
        <td>${doctor.email || ""}</td>
        <td>${doctor.phone || ""}</td>
        <td>${doctor.availability || ""}</td>
        <td>
          <button onclick="editDoctor(${doctor.id || doctor.doctorId})" class="btn btn-sm btn-secondary">Edit</button>
          <button onclick="deleteDoctor(${doctor.id || doctor.doctorId})" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  // Edit doctor
  window.editDoctor = async function(id) {
    try {
      const doctor = allDoctors.find(d => (d.id || d.doctorId) == id);
      if (!doctor) return;

      editingDoctorId = id;
      doctorIdInput.value = id;
      nameInput.value = doctor.name || "";
      specialtyInput.value = doctor.specialty || "";
      emailInput.value = doctor.email || "";
      phoneInput.value = doctor.phone || "";
      availabilityInput.value = doctor.availability || "";

      formTitle.textContent = "Edit Doctor";
      cancelEditBtn.style.display = "inline-block";
      form.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Failed to load doctor for editing:", err);
    }
  };

  // Delete doctor
  window.deleteDoctor = async function(id) {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await deleteDoctor(id);
      await loadDoctors();
      showNotification("Doctor deleted successfully!", "success");
    } catch (err) {
      alert("Failed to delete doctor: " + err.message);
      console.error(err);
    }
  };

  // Notification helper
  function showNotification(message, type = "info") {
    // Simple toast notification - you can enhance this
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
  loadDoctors();
});
