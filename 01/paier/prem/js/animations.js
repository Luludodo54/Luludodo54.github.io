document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ANIMATION TEXTE : CYBER DECODING (Matrix-style) ---
    const glitchTitle = document.querySelector(".glitch-text");
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    
    if(glitchTitle) {
        let iterations = 0;
        const originalText = glitchTitle.dataset.value;
        
        const interval = setInterval(() => {
            glitchTitle.innerText = originalText.split("")
                .map((letter, index) => {
                    if(index < iterations) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
            
            if(iterations >= originalText.length) {
                clearInterval(interval);
            }
            iterations += 1 / 3;
        }, 30);
    }

    // --- 2. FONDS DYNAMIQUE : PARTICULES FLOTTANTES ---
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? '#00f2fe' : '#7000ff';
        particle.style.borderRadius = '50%';
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.pointerEvents = 'none';
        
        // Animation CSS inline pour chaque particule
        particle.animate([
            { transform: 'translateY(0px) translateX(0px)' },
            { transform: `translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 50 - 25}px)` }
        ], {
            duration: Math.random() * 6000 + 4000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });

        particlesContainer.appendChild(particle);
    }

    // --- 3. ANIMATION MOUSE PARALLAX 3D (Sur les Cartes) ---
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 
            
            // Calculer l'angle de rotation basé sur la position du curseur
            const rotateX = ((y / rect.height) - 0.5) * -25; // max 25deg
            const rotateY = ((x / rect.width) - 0.5) * 25;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.boxShadow = `${-rotateY * 0.5}px ${rotateX * 0.5}px 25px rgba(0, 242, 254, 0.2)`;
        });

        card.addEventListener('mouseleave', () => {
            // Remise à zéro fluide
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            card.style.boxShadow = 'none';
        });
    });

    // --- 4. SCROLL REVEAL (Aparition séquentielle) ---
    const revealElements = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4.5;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger initial
});