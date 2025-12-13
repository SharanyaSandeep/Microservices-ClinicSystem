package com.clinic.doctorservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.doctorservice.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
