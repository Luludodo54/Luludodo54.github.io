// Classe pour représenter un média
class Media {
    constructor(id, titre, auteur, type, annee, quantite, description) {
        this.id = id;
        this.titre = titre;
        this.auteur = auteur;
        this.type = type;
        this.annee = annee;
        this.quantite = quantite;
        this.quantiteDisponible = quantite;
        this.description = description;
        this.dateAjout = new Date().toLocaleDateString('fr-FR');
    }

    getStatus() {
        return this.quantiteDisponible > 0 ? 'disponible' : 'emprunte';
    }

    emprunter() {
        if (this.quantiteDisponible > 0) {
            this.quantiteDisponible--;
            return true;
        }
        return false;
    }

    retourner() {
        if (this.quantiteDisponible < this.quantite) {
            this.quantiteDisponible++;
            return true;
        }
        return false;
    }
}

// Classe pour gérer la médiathèque
class Mediatheque {
    constructor() {
        this.medias = this.loadFromLocalStorage() || [];
        this.nextId = this.medias.length > 0 ? Math.max(...this.medias.map(m => m.id)) + 1 : 1;
    }

    addMedia(titre, auteur, type, annee, quantite, description) {
        const media = new Media(this.nextId++, titre, auteur, type, annee, quantite, description);
        this.medias.push(media);
        this.saveToLocalStorage();
        return media;
    }

    removeMedia(id) {
        this.medias = this.medias.filter(m => m.id !== id);
        this.saveToLocalStorage();
    }

    getMedia(id) {
        return this.medias.find(m => m.id === id);
    }

    getAllMedias() {
        return this.medias;
    }

    getMediasByType(type) {
        if (!type) return this.medias;
        return this.medias.filter(m => m.type === type);
    }

    searchMedias(query) {
        const lowerQuery = query.toLowerCase();
        return this.medias.filter(m =>
            m.titre.toLowerCase().includes(lowerQuery) ||
            m.auteur.toLowerCase().includes(lowerQuery)
        );
    }

    getStats() {
        const total = this.medias.reduce((sum, m) => sum + m.quantite, 0);
        const available = this.medias.reduce((sum, m) => sum + m.quantiteDisponible, 0);
        const borrowed = total - available;

        return {
            total,
            available,
            borrowed
        };
    }

    saveToLocalStorage() {
        localStorage.setItem('mediatheque', JSON.stringify(this.medias));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('mediatheque');
        if (!data) return null;

        const medias = JSON.parse(data);
        return medias.map(m => {
            const media = new Media(m.id, m.titre, m.auteur, m.type, m.annee, m.quantite, m.description);
            media.quantiteDisponible = m.quantiteDisponible;
            media.dateAjout = m.dateAjout;
            return media;
        });
    }
}

// Variables globales
const mediatheque = new Mediatheque();
let filteredMedias = [];
let sortOrder = 'title'; // 'title' ou 'type'

// Éléments du DOM
const mediaForm = document.getElementById('mediaForm');
const mediaList = document.getElementById('mediaList');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const statusFilter = document.getElementById('statusFilter');
const sortByTitle = document.getElementById('sortByTitle');
const sortByType = document.getElementById('sortByType');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    render();
    attachListeners();
});

// Écouteurs d'événements
function attachListeners() {
    mediaForm.addEventListener('submit', handleAddMedia);
    searchInput.addEventListener('input', filterAndRender);
    typeFilter.addEventListener('change', filterAndRender);
    statusFilter.addEventListener('change', filterAndRender);
    sortByTitle.addEventListener('click', () => {
        sortOrder = 'title';
        filterAndRender();
    });
    sortByType.addEventListener('click', () => {
        sortOrder = 'type';
        filterAndRender();
    });
}

// Ajouter un média
function handleAddMedia(e) {
    e.preventDefault();

    const titre = document.getElementById('titre').value.trim();
    const auteur = document.getElementById('auteur').value.trim();
    const type = document.getElementById('type').value;
    const annee = document.getElementById('annee').value || 'N/A';
    const quantite = parseInt(document.getElementById('quantite').value) || 1;
    const description = document.getElementById('description').value.trim();

    if (!titre || !type) {
        alert('Veuillez remplir au moins le titre et le type!');
        return;
    }

    mediatheque.addMedia(titre, auteur, type, annee, quantite, description);
    mediaForm.reset();
    filterAndRender();

    // Notification visuelle
    showNotification('✅ Média ajouté avec succès!', 'success');
}

// Emprunter un média
function borrowMedia(id) {
    const media = mediatheque.getMedia(id);
    if (media && media.emprunter()) {
        mediatheque.saveToLocalStorage();
        filterAndRender();
        showNotification('📤 Média emprunté avec succès!', 'success');
    } else {
        showNotification('❌ Aucun exemplaire disponible!', 'error');
    }
}

// Retourner un média
function returnMedia(id) {
    const media = mediatheque.getMedia(id);
    if (media && media.retourner()) {
        mediatheque.saveToLocalStorage();
        filterAndRender();
        showNotification('📥 Média retourné avec succès!', 'success');
    }
}

// Supprimer un média
function deleteMedia(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média?')) {
        mediatheque.removeMedia(id);
        filterAndRender();
        showNotification('🗑️ Média supprimé avec succès!', 'success');
    }
}

// Filtrer et afficher
function filterAndRender() {
    const searchQuery = searchInput.value;
    const typeFilterValue = typeFilter.value;
    const statusFilterValue = statusFilter.value;

    // Filtrer par recherche
    let filtered = searchQuery ? mediatheque.searchMedias(searchQuery) : mediatheque.getAllMedias();

    // Filtrer par type
    if (typeFilterValue) {
        filtered = filtered.filter(m => m.type === typeFilterValue);
    }

    // Filtrer par statut
    if (statusFilterValue) {
        filtered = filtered.filter(m => m.getStatus() === statusFilterValue);
    }

    // Trier
    filtered.sort((a, b) => {
        if (sortOrder === 'title') {
            return a.titre.localeCompare(b.titre);
        } else {
            return a.type.localeCompare(b.type);
        }
    });

    filteredMedias = filtered;
    render();
}

// Afficher les médias
function render() {
    updateStats();
    renderMediaList();
}

// Afficher la liste des médias
function renderMediaList() {
    if (filteredMedias.length === 0) {
        mediaList.innerHTML = '<p class="empty-message">Aucun média trouvé. Essayez de modifier vos filtres!</p>';
        return;
    }

    mediaList.innerHTML = filteredMedias.map(media => createMediaCard(media)).join('');
}

// Créer une carte de média
function createMediaCard(media) {
    const status = media.getStatus();
    const statusClass = status === 'disponible' ? 'status-disponible' : 'status-emprunte';
    const statusText = status === 'disponible' ? '✅ Disponible' : '❌ Emprunté';

    const typeIcons = {
        'livre': '📖',
        'dvd': '🎬',
        'magazine': '📰',
        'musique': '🎵',
        'autre': '📦'
    };

    const icon = typeIcons[media.type] || '📦';

    return `
        <div class="media-card">
            <div class="media-card-header">
                <h3 class="media-title">${icon} ${escapeHtml(media.titre)}</h3>
                <span class="media-type">${media.type}</span>
            </div>

            <div class="media-info">
                ${media.auteur ? `<div><strong>Auteur:</strong> ${escapeHtml(media.auteur)}</div>` : ''}
                ${media.annee !== 'N/A' ? `<div><strong>Année:</strong> ${media.annee}</div>` : ''}
                <div><strong>Quantité:</strong> ${media.quantiteDisponible}/${media.quantite}</div>
                <div><strong>Ajouté le:</strong> ${media.dateAjout}</div>
            </div>

            ${media.description ? `<p class="media-description">${escapeHtml(media.description)}</p>` : ''}

            <div class="media-status ${statusClass}">${statusText}</div>

            <div class="media-actions">
                ${media.quantiteDisponible > 0 ?
                    `<button class="btn btn-success btn-small" onclick="borrowMedia(${media.id})">📤 Emprunter</button>` :
                    `<button class="btn btn-warning btn-small" onclick="returnMedia(${media.id})">📥 Retourner</button>`
                }
                <button class="btn btn-danger btn-small" onclick="deleteMedia(${media.id})">🗑️ Supprimer</button>
            </div>
        </div>
    `;
}

// Mettre à jour les statistiques
function updateStats() {
    const stats = mediatheque.getStats();
    document.getElementById('totalMedia').textContent = stats.total;
    document.getElementById('availableMedia').textContent = stats.available;
    document.getElementById('borrowedMedia').textContent = stats.borrowed;
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Échapper les caractères HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
