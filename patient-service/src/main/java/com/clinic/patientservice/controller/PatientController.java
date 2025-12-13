package com.clinic.patientservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import com.clinic.patientservice.entity.Patient;
import com.clinic.patientservice.repository.PatientRepository;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientRepository repo;

    public PatientController(PatientRepository repo) {
        this.repo = repo;
    }

    // CREATE
    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return repo.save(patient);
    }

    // READ ALL
    @GetMapping
    public List<Patient> getAllPatients() {
        return repo.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient updated) {
        Patient patient = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setName(updated.getName());
        patient.setAge(updated.getAge());
        patient.setGender(updated.getGender());

        return repo.save(patient);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
