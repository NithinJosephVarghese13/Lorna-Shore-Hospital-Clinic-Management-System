import React from 'react';
import '../AboutUs.css'; // Updated path for your CSS file

const AboutUs = () => {
  return (
    <div className="about-us-container">
      
      {/* Welcome Section */}
      <section className="about-us-section hero-section">
        <h1>Welcome to Lorna Shore Clinic</h1>
        <p>
          At Lorna Shore Clinic, we are committed to providing exceptional healthcare services in a compassionate and welcoming environment. Located in the heart of our community, our clinic has been a trusted name for comprehensive medical care, offering a wide range of services designed to meet the health needs of individuals and families alike.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to deliver high-quality, patient-centered care with a focus on improving the health and well-being of our patients. We aim to create a healing environment where every patient is treated with respect, empathy, and professionalism. We believe in building lasting relationships with our patients, empowering them to take control of their health through personalized care and support.
        </p>
      </section>

      {/* Unique Factors */}
      <section className="unique-factors-section bg-light">
        <h2>What Sets Us Apart?</h2>
        <p>
          At Lorna Shore Clinic, we combine state-of-the-art medical technology with a holistic approach to healthcare. We pride ourselves on offering:
        </p>
        <ul className="unique-list">
          <li><strong>Experienced and Compassionate Healthcare Providers:</strong> Our team consists of skilled doctors, nurses, specialists, and support staff who are dedicated to delivering excellent care.</li>
          <li><strong>Patient-Centered Approach:</strong> We listen to your concerns, take the time to understand your health goals, and collaborate with you to create personalized treatment plans.</li>
          <li><strong>Comprehensive Services:</strong> From general healthcare and preventative care to specialized treatments, our clinic offers a wide array of services to address your health needs.</li>
          <li><strong>State-of-the-Art Facilities:</strong> We use the latest medical equipment and technologies to ensure accurate diagnoses and effective treatments.</li>
        </ul>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Services</h2>
        <p>We offer a broad spectrum of services to meet the diverse needs of our patients, including but not limited to:</p>
        <ul className="services-list">
          <li>Preventive Health & Wellness</li>
          <li>Primary Care</li>
          <li>Chronic Disease Management</li>
          <li>Women’s and Men’s Health</li>
          <li>Pediatric Care</li>
          <li>Mental Health Services</li>
          <li>Cancer Care</li>
          <li>Diagnostic Imaging</li>
          <li>Laboratory Services</li>
        </ul>
      </section>

      {/* Meet Our Team */}
      <section className="meet-team-section bg-light">
        <h2>Meet Our Team</h2>
        <p>
          Our team is the heart of our clinic. Each member is dedicated to providing compassionate care and continuous support for our patients. Led by our experienced physicians, our healthcare providers work together to ensure that you receive the best possible treatment.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us-section">
        <h2>Why Choose Us?</h2>
        <ul className="why-choose-us-list">
          <li><strong>Trusted Care:</strong> We’re a trusted part of the community, known for our quality care and patient satisfaction.</li>
          <li><strong>Convenient Location:</strong> Our clinic is centrally located, making it easy for you to access the care you need.</li>
          <li><strong>Flexible Hours:</strong> We offer extended hours to accommodate your busy schedule, ensuring you receive care when you need it most.</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Your Health, Our Priority</h2>
        <p>
          At Lorna Shore Clinic, your health and well-being are our top priority. Whether you're visiting for a routine check-up, seeking treatment for a specific concern, or exploring ways to improve your health, we're here to help. We look forward to becoming your partner in health and providing you with the personalized care you deserve.
        </p>
      </section>

      {/* Contact Us */}
      <section className="contact-us-section">
        <h2>Contact Us</h2>
        <p>
          Ready to take the next step in your healthcare journey? Contact us today to schedule an appointment or to learn more about our services. We’re here to answer any questions you may have.
        </p>

        {/* Contact Details */}
        <div className="contact-details">
          <p><strong>Email:</strong> lornashore@gmail.com</p>
          <p><strong>Reception:</strong> +1 (123) 456-7890</p>
          <p><strong>Dr. Trevor Philips:</strong> +1 (987) 654-3210</p>
          <p><strong>Nurse Alex Carter:</strong> +1 (555) 123-4567</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
