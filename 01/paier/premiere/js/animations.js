const dot = document.querySelector('.cursor-dot');
const aura = document.querySelector('.cursor-aura');

let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let auraX = 0, auraY = 0;

// Mise à jour de la position de la souris
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Boucle d'animation fluide
function animate() {
    // Interpolation (vitesse de suivi)
    dotX += (mouseX - dotX) * 1;
    dotY += (mouseY - dotY) * 1;
    auraX += (mouseX - auraX) * 0.15; // 0.15 donne l'effet de traînée
    auraY += (mouseY - auraY) * 0.15;

    dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
    aura.style.transform = `translate(${auraX - 25}px, ${auraY - 25}px)`;

    requestAnimationFrame(animate);
}
animate();

// Interaction au survol
document.querySelectorAll('a').forEach(el => {
    el.addEventListener('mouseover', () => aura.classList.add('hovered'));
    el.addEventListener('mouseout', () => aura.classList.remove('hovered'));
});