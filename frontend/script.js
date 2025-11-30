const BASE_URL = "http://localhost:7777/api/patient";

// GET patient by ID
function getPatient() {
    const id = document.getElementById("patientIdInput").value;

    fetch(`${BASE_URL}/get-patient?id=${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("patientResult").textContent =
                JSON.stringify(data, null, 2);
        })
        .catch(err => {
            document.getElementById("patientResult").textContent = "Error: " + err;
        });
}


// ADD patient
function addPatient() {
    const patientData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        age: document.getElementById("age").value
    };

    fetch(`${BASE_URL}/add-patient`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("addResult").textContent =
            JSON.stringify(data, null, 2);
    })
    .catch(err => {
        document.getElementById("addResult").textContent = "Error: " + err;
    });
}
