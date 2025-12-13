package com.clinic.doctorservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.clinic.doctorservice.entity.Doctor;
import com.clinic.doctorservice.repository.DoctorRepository;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorRepository repo;

    public DoctorController(DoctorRepository repo) {
        this.repo = repo;
    }

    // CREATE
    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return repo.save(doctor);
    }

    // READ ALL
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return repo.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Doctor getDoctor(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable Long id, @RequestBody Doctor updated) {
        Doctor doctor = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setName(updated.getName());
        doctor.setSpecialization(updated.getSpecialization());
        doctor.setAvailable(updated.isAvailable());

        return repo.save(doctor);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
