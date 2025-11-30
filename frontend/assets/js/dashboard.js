// assets/js/dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  const metricPatients = document.getElementById("metric-patients");
  const metricPayments = document.getElementById("metric-payments");
  const metricRevenue = document.getElementById("metric-revenue");
  const tableBody = document.getElementById("patients-table-body");
  const searchInput = document.getElementById("patient-search");

  let allPatients = [];

  async function loadData() {
    try {
      const [patients, payments] = await Promise.all([
        getPatients(),
        getPayments(),
      ]);

      allPatients = patients;

      metricPatients.textContent = patients.length;
      metricPayments.textContent = payments.length;

      const revenue = payments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );
      metricRevenue.textContent = "₹" + revenue.toFixed(2);

      renderPatients(patients);
    } catch (err) {
      console.error(err);
      tableBody.innerHTML =
        '<tr><td colspan="4">Failed to load data.</td></tr>';
    }
  }

  function renderPatients(list) {
    if (!list.length) {
      tableBody.innerHTML =
        '<tr><td colspan="4">No patients found.</td></tr>';
      return;
    }

    tableBody.innerHTML = "";
    list.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name || p.fullName || ""}</td>
        <td>${p.age || ""}</td>
        <td>
          <button class="btn btn-sm">View</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Simple client-side search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allPatients.filter((p) =>
        (p.name || p.fullName || "").toLowerCase().includes(q)
      );
      renderPatients(filtered);
    });
  }

  loadData();
});
