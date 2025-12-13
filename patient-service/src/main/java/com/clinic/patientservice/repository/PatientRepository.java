package com.clinic.patientservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.patientservice.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
