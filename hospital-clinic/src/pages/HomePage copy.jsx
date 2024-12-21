import { Component } from "react";
import { FaGuitar, FaHeartbeat } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation

const HomePage = () => {
    const navigate = useNavigate(); // Declare the navigate function

    const handleBookAppointmentClick = () => {
        navigate('/login'); // Navigate to login page when the button is clicked
    };

    return (
        <div className="container mt-5 text-center">
            <div className="alert alert-info text-center">
                <FaHeartbeat /> Welcome to Lorna Shore Clinic - Compassionate Care, Advanced Medicine, Close to Home <FaHeartbeat />
            </div>

            <div className="intro mt-4">
                <p>
                    At Lorna Shore Clinic, our mission is to provide the highest standard of medical care with a patient-centered approach. 
                    We are committed to improving the health and well-being of our community through comprehensive healthcare services, 
                    state-of-the-art technology, and a compassionate, experienced medical team.
                </p>
                <p>
                    Whether you are visiting for a routine check-up, managing a chronic condition, or seeking specialized treatment, 
                    we ensure you receive personalized attention in a comfortable and professional environment. 
                    Our team of dedicated doctors, nurses, and staff is here to support your health journey at every stage.
                </p>
                <hr />

                <div className="metal-therapy mt-4">
                    <h3>Comprehensive Services for All Your Healthcare Needs</h3>
                    <p>
                        We offer a wide range of services including primary care, specialty treatments, diagnostic services, and preventive care.
                        Our clinic is designed to provide you with convenient access to the highest quality care, ensuring that you and your family 
                        receive the right treatment at the right time.
                    </p>
                    <p>
                        From advanced diagnostics to personalized treatment plans, we are dedicated to providing healthcare solutions that
                        are tailored to your individual needs.
                    </p>
                </div>

                <hr />


                <div className="metal-therapy mt-4">
                    <h3>Heavy Metal Therapy: Let the Riffs Heal You</h3>
                    <p>
                        Feeling stressed? Forget the pills, why not try some heavy metal therapy instead?
                        Studies (well, sort of) have shown that blasting some <strong>Lorna Shore</strong> or any of your favorite metalcore bands can alleviate stress, pump up your adrenaline, and improve your headbanging form!
                    </p>
                    <p>
                        So next time you're feeling overwhelmed, crank up the volume, let those breakdowns wash over you, and scream your worries away!
                        <br />
                        <FaGuitar size={30} /> It’s doctor-approved... kind of.
                    </p>
                </div>

                <hr />

                {/* Book an Appointment button now redirects to login */}
                <div className="actions mt-4">
                    <p>Ready to take the next step in your health journey?</p>
                    <button onClick={handleBookAppointmentClick} className="btn btn-primary">
                        Book an Appointment
                    </button>
                    <a href="/services" className="btn btn-secondary ml-3">Explore Our Services</a>
                </div>

                <hr />

                <div className="patient-review mt-5 p-4 bg-light text-dark">
                    <h3 className="text-center">A Heartfelt Thank You from One of Our Patients</h3>
                    <blockquote className="blockquote text-center">
                        <p style={{ fontSize: "1.2rem", fontStyle: "italic" }}>
                            "Being diagnosed with cancer was the most terrifying moment of my life, but from the moment I stepped into Lorna Shore Clinic, 
                            I knew I was in the right hands. The care, compassion, and expertise of the staff gave me hope when I needed it most.
                            Every doctor, nurse, and staff member treated me like family and ensured I never felt alone on this difficult journey.
                            Thanks to their dedication and support, I'm now in remission and can't thank them enough for giving me my life back."
                        </p>
                        <footer className="blockquote-footer text-dark">
                            — <cite>Sarah T., Cancer Survivor</cite>
                        </footer>
                    </blockquote>
                </div>

                <hr />

                <div className="bodybuilder-quote mt-5 p-4 bg-warning text-dark">
                    <h3 className="text-center">A Bodybuilder's Unfortunate Accident</h3>
                    <blockquote className="blockquote text-center">
                        <p style={{ fontSize: "1.3rem", fontStyle: "italic" }}>
                            "So there I was, trying to bench 400 pounds to impress the gym crowd, right? 
                            Well, I guess I didn't warm up enough because halfway through the lift, 
                            I heard a pop and my bicep turned into a noodle. Next thing I know, I'm here at Lorna Shore Clinic. 
                            The staff was amazing though—they fixed me up and even managed not to laugh too much when I told them what happened. 
                            Note to self: don't skip leg day... or stretching!"
                        </p>
                        <footer className="blockquote-footer text-dark">
                            — <cite>Mike D., Bodybuilder (and now wiser)</cite>
                        </footer>
                    </blockquote>
                </div>

                <hr />

                {/* Ozzy Osbourne Testimony Section */}
                <div className="ozzy-quote mt-5 p-4 bg-dark text-light">
                    <h3>Testimony from the Prince of Darkness Himself, Ozzy Osbourne</h3>
                    <blockquote className="blockquote text-center">
                        <p style={{ fontSize: "1.5rem", fontStyle: "italic" }}>
                            "You know, man... I was like, floating through the clinic, and the walls were melting, but then this nurse—she had like, wings, I swear—gave me this riff... and suddenly I felt my soul vibrating, yeah? I think I saw a unicorn made of flames... and, uh, I realized... I don’t need medicine, man. I just need more distortion pedals."
                        </p>
                        <footer className="blockquote-footer text-light">
                            — <cite>Ozzy Osbourne, probably while on LSD</cite>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
