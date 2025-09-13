import React, { useState } from 'react';
import "../../styles/AideSupport.css";

const AideSupport = () => {
    const faqData = [
        { question: "Ahoana no hanampiana Mpino vaovao?", answer: "Mandehana any amin'ny sidebar → Mpino → Ajouter." },
        { question: "Ahoana ny hanovana mot de passe?", answer: "Paramètres → Mon profil." },
        { question: "Ahoana no ahafahana manova ny mombamomba ahy?", answer: "Mandehana any amin'ny pejy Profile ary tsindrio ny bokotra Edit." },
        { question: "Ahoana no ahafahana mijery ny tatitra?", answer: "Mandehana any amin'ny Dashboard ary misafidia ny tatitra tianao hijerena." }
    ];

    const [openIndex, setOpenIndex] = useState(null);
    const toggleAccordion = (index) => setOpenIndex(openIndex === index ? null : index);

    const [formData, setFormData] = useState({ nom: '', email: '', message: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message envoyé! Nous vous répondrons bientôt.');
        setFormData({ nom: '', email: '', message: '' });
    };

    const developers = [
        { nom: "Razafindraibe Safidiniaina Judicael", role: "Développeur Fullstack Web", tel: "+261 34 35 17 339", avatar: "/images/dev1.png" },
        { nom: "Andriamihaja Lalao", role: "Développeur Frontend", tel: "+261 33 12 45 678", avatar: "/images/dev2.png" },
        { nom: "Rakotovao Hery", role: "Développeur Backend", tel: "+261 32 11 22 333", avatar: "/images/dev3.png" }
    ];

    return (
        <div className="aide-support-container">
            <header className="aide-header"><h1>Aide & Support</h1></header>

            <main className="aide-content">
                <section className="faq-section">
                    <h2>📖 FAQ</h2>
                    <div className="accordion">
                        {faqData.map((item, index) => (
                            <div key={index} className="accordion-item">
                                <button
                                    className={`accordion-button ${openIndex === index ? 'active' : ''}`}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {item.question}
                                </button>
                                <div className={`accordion-content ${openIndex === index ? 'show' : ''}`}>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="tutorials-section">
                    <h2>🎥 Tutoriels vidéo</h2>
                    <div className="video-container">
                        <iframe
                            width="100%"
                            height="315"
                            // src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Tutoriel YouTube"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </section>

                <section className="contact-section">
                    <h2>📩 Contact support</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> support@flm.org</p>
                        <p><strong>Téléphone:</strong> +261 34 00 123 45</p>
                    </div>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nom">Nom</label>
                            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Envoyer</button>
                    </form>
                </section>

                <section className="about-section">
                    <h2>ℹ️ À propos de l'application</h2>
                    <div className="app-info">
                        <p><strong>Nom de l'application:</strong> FLM Gestion</p>
                        <p><strong>Version:</strong> 1.2.0</p>
                        <p><strong>Année de sortie:</strong> 2023</p>
                        <p><strong>Description:</strong> Application web pour la gestion des Mpino et suivi des activités de la communauté FLM. Permet de gérer les profils, les rapports et de centraliser les informations.</p>
                    </div>

                    <h3>Développeurs</h3>
                    <div className="developers-list">
                        {developers.map((dev, index) => (
                            <div key={index} className="developer-profile">
                                <img src={dev.avatar} alt={dev.nom} className="developer-avatar" />
                                <div className="developer-details">
                                    <p><strong>Nom:</strong> {dev.nom}</p>
                                    <p><strong>Rôle:</strong> {dev.role}</p>
                                    <p><strong>Téléphone:</strong> {dev.tel}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                        
            </main>
        </div>
    );
};

export default AideSupport;
