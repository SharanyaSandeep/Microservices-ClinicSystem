// assets/js/payments.js
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  const paymentForm = document.getElementById("payment-form");
  const patientSelect = document.getElementById("payment-patient");
  const doctorSelect = document.getElementById("payment-doctor");
  const amountInput = document.getElementById("payment-amount");
  const serviceSelect = document.getElementById("payment-service");
  const formError = document.getElementById("payment-form-error");
  const tableBody = document.getElementById("payments-table-body");
  const statusFilter = document.getElementById("payment-status-filter");
  const dateFilter = document.getElementById("payment-date-filter");

  let allPatients = [];
  let allDoctors = [];
  let allPayments = [];

  // Load initial data
  try {
    [allPatients, allDoctors, allPayments] = await Promise.all([
      getPatients(),
      getDoctors(),
      getPayments(),
    ]);
    populateSelects();
    renderPayments(allPayments);
  } catch (err) {
    console.error("Failed to load initial data:", err);
    tableBody.innerHTML = '<tr><td colspan="8">Failed to load data. Please refresh the page.</td></tr>';
  }

  // Populate patient and doctor dropdowns
  function populateSelects() {
    patientSelect.innerHTML = '<option value="">Select patient</option>' + 
      allPatients.map(p => `<option value="${p.id || p.patientId}">${p.name}</option>`).join("");
    
    doctorSelect.innerHTML = '<option value="">Select doctor</option>' + 
      allDoctors.map(d => `<option value="${d.id || d.doctorId}">${d.name}</option>`).join("");
  }

  // Payment form submission
  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError.textContent = "";

    const paymentData = {
      patientId: patientSelect.value,
      doctorId: doctorSelect.value,
      amount: parseFloat(amountInput.value),
      service: serviceSelect.value,
      status: "pending", // Default status
      date: new Date().toISOString().split('T')[0], // Today's date
    };

    if (!paymentData.patientId || !paymentData.doctorId || !paymentData.amount || !paymentData.service) {
      formError.textContent = "Please fill all required fields";
      return;
    }

    try {
      const newPayment = await createPayment(paymentData);
      allPayments.unshift(newPayment); // Add to beginning of list
      renderPayments(allPayments);
      
      // Reset form
      paymentForm.reset();
      formError.textContent = "Payment processed successfully! Status: Pending";
      showNotification("Payment created successfully!", "success");
    } catch (err) {
      formError.textContent = err.message || "Failed to process payment";
      console.error(err);
    }
  });

  // Filters
  function applyFilters(payments) {
    let filtered = [...payments];

    // Status filter
    if (statusFilter.value) {
      filtered = filtered.filter(p => (p.status || "").toLowerCase() === statusFilter.value.toLowerCase());
    }

    // Date filter
    if (dateFilter.value) {
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.date || p.createdAt).toISOString().split('T')[0];
        return paymentDate === dateFilter.value;
      });
    }

    return filtered;
  }

  statusFilter.addEventListener("change", () => renderPayments(allPayments));
  dateFilter.addEventListener("change", () => renderPayments(allPayments));

  function renderPayments(payments) {
    const filteredPayments = applyFilters(payments);
    
    if (!filteredPayments.length) {
      tableBody.innerHTML = '<tr><td colspan="8">No payments found matching the filters.</td></tr>';
      return;
    }

    tableBody.innerHTML = filteredPayments.map((payment) => {
      const statusClass = payment.status === "completed" ? "badge-success" : 
                         payment.status === "pending" ? "badge-warning" : "badge-danger";
      const statusText = payment.status === "completed" ? "Completed" : 
                        payment.status === "pending" ? "Pending" : "Failed";
      
      const patientName = allPatients.find(p => 
        (p.id || p.patientId) == payment.patientId)?.name || "Unknown";
      const doctorName = allDoctors.find(d => 
        (d.id || d.doctorId) == payment.doctorId)?.name || "Unknown";

      return `
        <tr>
          <td>${payment.id || payment.paymentId || ""}</td>
          <td>${patientName}</td>
          <td>${doctorName}</td>
          <td>₹${(payment.amount || 0).toFixed(2)}</td>
          <td>${payment.service || ""}</td>
          <td>${new Date(payment.date || payment.createdAt).toLocaleDateString()}</td>
          <td>
            <span class="badge ${statusClass}">${statusText}</span>
          </td>
          <td>
            ${payment.status === "pending" ? 
              `<button onclick="markPaymentComplete(${payment.id || payment.paymentId})" class="btn btn-sm btn-success">Complete</button>` : 
              ""}
            <button onclick="viewPaymentDetails(${payment.id || payment.paymentId})" class="btn btn-sm btn-info">View</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // Mark payment as complete (you'll need to implement this endpoint)
  window.markPaymentComplete = async function(id) {
    if (!confirm("Mark this payment as completed?")) return;

    try {
      // This would call your backend to update payment status
      await updatePaymentStatus(id, "completed");
      // Refresh payments
      allPayments = await getPayments();
      renderPayments(allPayments);
      showNotification("Payment marked as completed!", "success");
    } catch (err) {
      alert("Failed to update payment: " + err.message);
      console.error(err);
    }
  };

  // View payment details
  window.viewPaymentDetails = function(id) {
    const payment = allPayments.find(p => (p.id || p.paymentId) == id);
    if (payment) {
      const patientName = allPatients.find(p => (p.id || p.patientId) == payment.patientId)?.name || "Unknown";
      const doctorName = allDoctors.find(d => (d.id || d.doctorId) == payment.doctorId)?.name || "Unknown";
      
      const details = `
        Payment Details
        ==============
        ID: ${payment.id || payment.paymentId}
        Patient: ${patientName}
        Doctor: ${doctorName}
        Amount: ₹${(payment.amount || 0).toFixed(2)}
        Service: ${payment.service || ""}
        Date: ${new Date(payment.date || payment.createdAt).toLocaleString()}
        Status: ${payment.status || "Unknown"}
        ${payment.notes ? `\nNotes: ${payment.notes}` : ""}
      `;
      
      alert(details);
      // In a real app, this would open a modal with full details
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
});
