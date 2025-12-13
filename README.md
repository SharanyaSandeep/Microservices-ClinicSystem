# Clinic Management System

A microservices-based clinic management application built with Spring Boot and Spring Cloud for managing doctors, patients, and appointments.

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Services](#services)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)

---

## 🏥 Overview

**Key Features**:
- 👨‍⚕️ Doctor profile management
- 👥 Patient record management
- 📅 Appointment scheduling
- 🔔 Automated notifications
- 🔍 Service discovery with Eureka
- 🌐 API Gateway routing

---

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS)
    ↓
API Gateway
    ↓
┌─────────────────────────────────────┐
│ Microservices                       │
├─────────────────────────────────────┤
│ Doctor | Patient | Appointment      │
│ Notification | Eureka Server        │
└─────────────────────────────────────┘
```

**Pattern**: Service Discovery, REST APIs, Event-Driven Architecture

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 3.2.5+ |
| Cloud | Spring Cloud 2023.0.1+ |
| ORM | JPA/Hibernate |
| Database | H2/MySQL/PostgreSQL |
| Frontend | HTML5, CSS3, Bootstrap 5, Vanilla JS |
| Build | Maven |

---

## 📁 Project Structure

```
ClinicSystem/
├── eureka-server/              # Service Registry
├── doctor-service/             # Doctor Management
├── patient-service/            # Patient Management
├── appointment-service/        # Appointment Scheduling
├── notification-service/       # Notifications
├── api-gateway/                # Request Router
├── clinic-frontend/            # Web UI
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── README.md
```

---

## 🚀 Services

### 1. **Eureka Server** (Port: 8761)
Service discovery and registration. Access dashboard at `http://localhost:8761`

### 2. **Doctor Service** (Port: 8080)
**Endpoints**:
- `POST /doctors` - Create doctor
- `GET /doctors` - List all doctors
- `GET /doctors/{id}` - Get doctor by ID
- `PUT /doctors/{id}` - Update doctor
- `DELETE /doctors/{id}` - Delete doctor

### 3. **Patient Service** (Port: 8081)
**Endpoints**:
- `POST /patients` - Create patient
- `GET /patients` - List all patients
- `GET /patients/{id}` - Get patient by ID
- `PUT /patients/{id}` - Update patient
- `DELETE /patients/{id}` - Delete patient

### 4. **Appointment Service** (Port: 8082)
**Endpoints**:
- `POST /appointments` - Create appointment
- `GET /appointments` - List all appointments
- `GET /appointments/{id}` - Get appointment by ID
- `PUT /appointments/{id}` - Update appointment
- `DELETE /appointments/{id}` - Cancel appointment

### 5. **Notification Service** (Port: 8083)
**Endpoint**:
- `POST /notifications` - Send notification (email/SMS)

### 6. **API Gateway**
Routes requests to appropriate microservices with dynamic service discovery.

### 7. **Frontend** (clinic-frontend/)
Single-page application with CRUD operations for doctors, patients, and appointments.

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Maven 3.6+
- Git

### Installation

1. **Clone Repository**:
```bash
git clone https://github.com/SharanyaSandeep/ClinicSystem.git
cd ClinicSystem
```

2. **Build All Services**:
```bash
./mvnw clean install
```

3. **Start Services** (each in separate terminal):

```bash
# Terminal 1 - Eureka Server
cd eureka-server
../mvnw spring-boot:run

# Terminal 2 - Doctor Service
cd doctor-service
../mvnw spring-boot:run

# Terminal 3 - Patient Service
cd patient-service
../mvnw spring-boot:run

# Terminal 4 - Appointment Service
cd appointment-service
../mvnw spring-boot:run

# Terminal 5 - Notification Service
cd notification-service
../mvnw spring-boot:run

# Terminal 6 - Frontend
cd clinic-frontend
python -m http.server 8000
# or
npx http-server
```

4. **Access Application**:
- Frontend: `http://localhost:8000`
- Eureka Dashboard: `http://localhost:8761`

---

## 📡 API Examples

### Create Doctor
```http
POST /doctors
Content-Type: application/json

{
  "name": "Dr. John Smith",
  "specialization": "Cardiology",
  "available": true
}
```

### Create Patient
```http
POST /patients
Content-Type: application/json

{
  "name": "Jane Doe",
  "age": 30,
  "gender": "Female"
}
```

### Create Appointment
```http
POST /appointments
Content-Type: application/json

{
  "doctorId": 1,
  "patientId": 1,
  "appointmentDate": "2024-12-25T10:30:00"
}
```

### Send Notification
```http
POST /notifications
Content-Type: application/json

{
  "recipient": "patient@example.com",
  "message": "Your appointment is confirmed",
  "type": "EMAIL"
}
```

---

## ⚙️ Configuration

Each service requires `application.properties` in `src/main/resources/`:

**Doctor Service Example**:
```properties
spring.application.name=doctor-service
server.port=8080
eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/
spring.datasource.url=jdbc:h2:mem:doctordb
spring.jpa.hibernate.ddl-auto=update
```

**Eureka Server**:
```properties
spring.application.name=eureka-server
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

---

## 🐳 Docker Deployment (Optional)

**Dockerfile** (for each service):
```dockerfile
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  eureka-server:
    image: clinic-eureka:latest
    ports:
      - "8761:8761"
  
  doctor-service:
    image: clinic-doctor:latest
    ports:
      - "8080:8080"
    depends_on:
      - eureka-server
  
  patient-service:
    image: clinic-patient:latest
    ports:
      - "8081:8081"
    depends_on:
      - eureka-server
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Configure CORS in API Gateway |
| Services not in Eureka | Check `eureka.client.serviceUrl.defaultZone` |
| Database errors | Verify datasource configuration |
| Port conflicts | Change port in `application.properties` |

---

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit: `git commit -m "[FEAT] Your feature"`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 👤 Author

**Sharanya Sandeep**

---

**Version**: 1.0.0 | **Last Updated**: December 2025
