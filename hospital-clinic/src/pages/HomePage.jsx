import { FaGuitar, FaHeartbeat, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUserType } from '../tools/FormMethodCtrl';
import './HomePage.css'; 

const HomePage = () => {
    const navigate = useNavigate();
    const userType = getUserType();

    const handleBookAppointmentClick = () => {
        if (!userType) {
            navigate('/login');
        } else if (userType === 'patient') {
            navigate('/patient/bookAppointment');
        } else {
            alert('You must be logged in as a patient to book an appointment.');
        }
    };

    const handleAboutUsClick = () => {
        if (userType) {
            navigate(`/${userType}/aboutus`); 
        } else {
            navigate('/aboutus'); 
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section text-center">
                <h1 className="hero-title">
                    <FaHeartbeat className="heartbeat-icon" /> Welcome to Lorna Shore Clinic
                </h1>
                <p className="hero-subtitle">Compassionate Care, Advanced Medicine, Close to Home</p>
            </div>

            <div className="content-section">
                {/* Introduction */}
                <section className="intro text-center">
                    <p className="intro-text">
                        At Lorna Shore Clinic, our mission is to provide the highest standard of medical care with a patient-centered approach.
                        We are committed to improving the health and well-being of our community through comprehensive healthcare services,
                        state-of-the-art technology, and a compassionate, experienced medical team.
                    </p>
                    <p className="intro-text">
                        Whether you are visiting for a routine check-up, managing a chronic condition, or seeking specialized treatment,
                        we ensure you receive personalized attention in a comfortable and professional environment.
                    </p>
                </section>

                {/* Heavy Metal Therapy Section */}
                <div className="metal-therapy mt-4 text-center">
                    <h3>Heavy Metal Therapy: Let the Riffs Heal You</h3>
                    <p className="therapy-text">
                        Feeling stressed? Forget the pills, why not try some heavy metal therapy instead? Studies (well, sort of) have shown that
                        blasting some <strong>Lorna Shore</strong> or any of your favorite metalcore bands can alleviate stress, pump up your adrenaline,
                        and improve your headbanging form!
                    </p>
                    <p className="therapy-text">
                        So next time you're feeling overwhelmed, crank up the volume, let those breakdowns wash over you, and scream your worries away!
                        <br />
                        <FaGuitar size={30} /> It’s doctor-approved... kind of.
                    </p>
                </div>

                <hr />

                {/* Call-to-Action Buttons */}
                <div className="cta-buttons text-center mt-5">
                    <button onClick={handleBookAppointmentClick} className="btn btn-primary cta-btn">
                        Book an Appointment
                    </button>
                    <button onClick={handleAboutUsClick} className="btn btn-secondary ml-3 cta-btn">
                        Explore Our Services
                    </button>
                </div>

                {/* Testimonials Section */}
                <section className="testimonials mt-5">
                    {[
                        {
                            title: 'A Heartfelt Thank You from One of Our Patients',
                            text: '"Being diagnosed with cancer was the most terrifying moment of my life, but from the moment I stepped into Lorna Shore Clinic, I knew I was in the right hands. The care, compassion, and expertise of the staff gave me hope when I needed it most. Thanks to their dedication and support, I\'m now in remission and can\'t thank them enough for giving me my life back."',
                            author: 'Sarah T., Cancer Survivor',
                            bgClass: 'bg-light text-dark',
                        },
                        {
                            title: "A Bodybuilder's Unfortunate Accident",
                            text: '"So there I was, trying to bench 400 pounds to impress the gym crowd, right? Halfway through the lift, I heard a pop and my bicep turned into a noodle. The staff was amazing though—they fixed me up and even managed not to laugh too much."',
                            author: 'Mike Cox, Bodybuilder',
                            bgClass: 'bg-warning text-dark',
                        },
                        {
                            title: 'Testimony from the Prince of Darkness Himself, Ozzy Osbourne',
                            text: '"You know, man... I was like, floating through the clinic, and the walls were melting, but then this nurse—she had wings! I think I saw a unicorn made of flames... I realized... I don’t need medicine, I just need more distortion pedals."',
                            author: 'Ozzy Osbourne, Probably on LSD',
                            bgClass: 'bg-dark text-light',
                        },
                    ].map(({ title, text, author, bgClass }, index) => (
                        <div key={index} className={`testimonial-card ${bgClass} mt-4`}>
                            <h3 className="text-center">{title}</h3>
                            <blockquote className="blockquote text-center">
                                <p className="testimonial-text">{text}</p>
                                <footer className="blockquote-footer">
                                    — <cite>{author}</cite>
                                </footer>
                            </blockquote>
                        </div>
                    ))}
                </section>
            </div>

            {/* Footer Section */}
            <footer className="footer bg-dark text-light py-5">
                <div className="container">
                    <div className="row">
                        {/* Contact Info */}
                        <div className="col-md-3">
                            <h4>Contact Us</h4>
                            <p>123 Main St, New York, NY 10001</p>
                            <p>Phone: +1 (123) 456-7890</p>
                            <p>Email: lornashore@gmail.com</p>
                        </div>

                        {/* Quick Links */}
                        <div className="col-md-3">
                            <h4>Quick Links</h4>
                            <ul>
                                <li>
                                    <button
                                        className="btn btn-link text-light p-0"
                                        onClick={() => {
                                            if (userType) {
                                                navigate(`/${userType}/aboutus`); // Dynamic route
                                            } else {
                                                navigate('/aboutus'); // Default for unauthenticated users
                                            }
                                        }}
                                    >
                                        About Us
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="btn btn-link text-light p-0"
                                        onClick={() => {
                                            if (!userType) {
                                                navigate('/login'); 
                                            } else if (userType === 'patient') {
                                                navigate('/patient/bookAppointment'); 
                                            } else {
                                                alert('Only patients can book appointments.'); 
                                            }
                                        }}
                                    >
                                        Book an Appointment
                                    </button>
                                </li>

                                <li><button
                                    className="btn btn-link text-light p-0"
                                    onClick={() => {
                                        if (userType) {
                                            navigate(`/${userType}/privacypolicy`); 
                                        } else {
                                            navigate('/privacypolicy'); 
                                        }
                                    }}
                                >
                                    Privacy Policy
                                </button></li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div className="col-md-3">
                            <h4>Follow Us</h4>
                            <ul className="list-inline">
                                {[
                                    { href: 'https://facebook.com', icon: <FaFacebook size={24} /> },
                                    { href: 'https://twitter.com', icon: <FaTwitter size={24} /> },
                                    { href: 'https://instagram.com', icon: <FaInstagram size={24} /> },
                                ].map(({ href, icon }, index) => (
                                    <li key={index} className="list-inline-item">
                                        <a href={href} target="_blank" rel="noreferrer">
                                            {icon}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Operating Hours */}
                        <div className="col-md-3">
                            <h4>Operating Hours</h4>
                            <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                            <p>Saturday: 10:00 AM - 2:00 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="row mt-4">
                        <div className="col text-center">
                            <p>&copy; 2024 Lorna Shore Clinic. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
