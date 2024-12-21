import React from 'react';
import './PrivacyPolicy.css'; // Import the advanced styling

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <header className="privacy-header text-center">
                <h1>Privacy Policy</h1>
                <p className="effective-date">Effective Date: 13/05/2000</p>
            </header>

            <section className="privacy-section">
                <h2>1. Introduction</h2>
                <p>
                    Lorna Shore Clinic (“we”, “us”, or “our”) is committed to protecting the privacy of our patients, staff, and visitors. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. 
                    By accessing or using our services, you consent to the practices described in this policy.
                </p>
            </section>

            <section className="privacy-section">
                <h2>2. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul>
                    <li><strong>Personal Identification Information:</strong> Name, contact details, date of birth, gender, and address.</li>
                    <li><strong>Medical Information:</strong> Health conditions, medical history, medications, treatment records, and diagnoses.</li>
                    <li><strong>Appointment Details:</strong> Dates, times, and types of appointments.</li>
                    <li><strong>Billing Information:</strong> Payment details for services rendered, if applicable.</li>
                    <li><strong>Technical Information:</strong> IP address, browser type, and other details collected automatically when using our website.</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>3. How We Use Your Information</h2>
                <p>We use the information collected to:</p>
                <ul>
                    <li>Provide, improve, and personalize our healthcare services.</li>
                    <li>Manage and schedule appointments efficiently.</li>
                    <li>Maintain accurate medical records to support your healthcare.</li>
                    <li>Process billing and payments.</li>
                    <li>Enhance patient and user experience on our website.</li>
                    <li>Conduct internal research and statistical analysis to improve services.</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>4. How We Share Your Information</h2>
                <p>We do not sell or trade your personal information. We may share information in the following situations:</p>
                <ul>
                    <li><strong>With Healthcare Providers:</strong> To coordinate care and ensure effective treatment.</li>
                    <li><strong>With Third-Party Service Providers:</strong> To process billing or provide specific services.</li>
                    <li><strong>For Legal Reasons:</strong> To comply with legal obligations or protect our rights and safety.</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>5. Data Security</h2>
                <p>
                    We implement security measures to protect your information from unauthorized access, alteration, and disclosure. 
                    However, no online data transmission or storage system can be guaranteed to be 100% secure. 
                    We encourage you to take steps to secure your personal information when using the internet.
                </p>
            </section>

            <section className="privacy-section">
                <h2>6. Data Retention</h2>
                <p>
                    We retain personal information as long as it is necessary to fulfill the purposes outlined in this policy or as required by law. 
                    Upon request, we may delete or anonymize personal information if it is no longer needed for these purposes.
                </p>
            </section>

            <section className="privacy-section">
                <h2>7. Your Rights and Choices</h2>
                <ul>
                    <li><strong>Access:</strong> Request a copy of the information we hold about you.</li>
                    <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete information.</li>
                    <li><strong>Deletion:</strong> Request deletion of personal information, subject to legal or contractual obligations.</li>
                    <li><strong>Restriction:</strong> Request restrictions on how we process your information.</li>
                    <li><strong>Data Portability:</strong> Request transfer of your information to another entity where technically feasible.</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>8. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <address>
                    <p>Email: <a href="mailto:lornashore@gmail.com">lornashore@gmail.com</a></p>
                    <p>Phone: <a href="tel:+11234567890">+1 (123) 456-7890</a></p>
                    <p>Address: 123 Main St, New York, NY 10001</p>
                </address>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
