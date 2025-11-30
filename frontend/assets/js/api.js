// assets/js/api.js
const API_BASE = "http://localhost:7777"; // API Gateway URL

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
    ...extra,
  };
}

async function apiRequest(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: authHeaders(options.headers || {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed: " + res.status);
  }

  // Try JSON, else text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

// ---- Auth ----
async function login(username, password) {
  // Change URL/body according to your backend contract
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// ---- Doctors ----
async function getDoctors() {
  return apiRequest("/doctor");
}

async function createDoctor(doctor) {
  return apiRequest("/doctor", {
    method: "POST",
    body: JSON.stringify(doctor),
  });
}
// Doctors - additional functions
async function updateDoctor(id, doctor) {
  return apiRequest(`/doctor/${id}`, {
    method: "PUT",
    body: JSON.stringify(doctor),
  });
}

async function deleteDoctor(id) {
  return apiRequest(`/doctor/${id}`, {
    method: "DELETE",
  });
}

// ---- Patients ----
async function getPatients() {
  return apiRequest("/patient");
}

async function createPatient(patient) {
  return apiRequest("/patient", {
    method: "POST",
    body: JSON.stringify(patient),
  });
}

// Add to assets/js/api.js for patients

async function updatePatient(id, patient) {
  return apiRequest(`/patient/${id}`, {
    method: "PUT",
    body: JSON.stringify(patient),
  });
}

async function deletePatient(id) {
  return apiRequest(`/patient/${id}`, {
    method: "DELETE",
  });
}

async function getPatient(id) {
  return apiRequest(`/patient/${id}`);
}


// ---- Payments ----
async function getPayments() {
  return apiRequest("/payment");
}

async function createPayment(payment) {
  return apiRequest("/payment", {
    method: "POST",
    body: JSON.stringify(payment),
  });
}
