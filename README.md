Lorna Shore Clinic Project

Lorna Shore Clinic is a comprehensive hospital management system designed to streamline and digitize key hospital-based processes. The system ensures seamless interaction between patients and doctors, providing an efficient and organized workflow for appointment booking, prescription management, and medical record keeping.

The platform comprises several core collections, including UserType, UserInfo, Doctor, Patient, BookAppointment, Appointment, Prescription, and MedicalRecords, which interconnect logically to maintain modularity and clarity in data handling.

Key Features:

Patient Registration and Login:
Patients create accounts, log in, and gain access to appointment booking features.


Specialized Appointment Booking:
Patients select a specialty, choose a doctor within that specialty, specify a date and time, and provide relevant notes.
Booked appointments are marked as requested, awaiting approval by the doctor.


Doctor Appointment Management:
Doctors can view, approve, or reject patient appointments.
Approved appointments transition from the BookAppointment collection to the Appointment collection, reflecting their confirmed status.


Prescription Management:
Doctors select patients from a dropdown menu and add prescriptions, including medication, dosage, and instructions.
Prescriptions are stored in the Prescriptions collection for easy retrieval and management.

Medical Records Management:
Doctors can upload and manage patient-specific medical records, stored in the MedicalRecords collection.

Data Flow and Modularity:

The system ensures a logical flow of data:
UserType and UserInfo link to Patient and Doctor.
BookAppointment transitions to Appointment upon approval.
Appointment enables doctors to manage Prescriptions and MedicalRecords.
This modular design ensures scalability and clarity across database operations.


Benefits:
Streamlined patient-doctor interactions.
Organized data handling and tracking.
Modular architecture for scalable hospital management.
Secure and efficient storage of appointments, prescriptions, and medical records.
Lorna Shore Clinic ensures a seamless healthcare experience for patients while empowering doctors with efficient tools for appointment and record management.