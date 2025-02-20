document.addEventListener('DOMContentLoaded', () => {
    //  Variables globales
    const modal = document.getElementById('modal');
    const bookList = document.getElementById('books-list');
    const genreSelect = document.getElementById('genre');
    const genreButtonsContainer = document.getElementById('genre-buttons');
    const addBookForm = document.getElementById('add-book-form');

    // Fonctions
    const toggleModal = (show) => modal.style.display = show ? 'block' : 'none';

    document.getElementById('add-book-btn').onclick = () => toggleModal(true);
    document.getElementById('close-modal').onclick = () => toggleModal(false);
    window.onclick = (e) => { if (e.target === modal) toggleModal(false); };

    //  Affiche un message d'erreur/succès pendant 3 secondes
    const showToast = (message) => {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // Fonction pour charger les genres
    const fetchGenres = async () => {
        try {
            // récupère les genres via l'api
            const response = await fetch('/api/v1/genres');
            const genres = await response.json();

            // Affichage des genres dans les options du formulaire
            genreSelect.innerHTML =  genres.map(({ id, name }) => `<option value="${id}">${name}</option>`).join('');

            // Affichage des genres dans le conteneur
            genreButtonsContainer.innerHTML = `<button class="genre-btn" data-genre="">Tout</button>` + genres.map(({ id, name }) => `<button class="genre-btn" data-genre="${id}">${name}</button>`).join('');

            // Ajoute une requete lors que l'on clique sur un genre
            document.querySelectorAll('.genre-btn').forEach(btn =>
                btn.onclick = () => fetchBooks(btn.dataset.genre || null)
            );
        } catch (error) {
            console.error(error);
        }
    };

    // Fonction pour charger les livres
    const fetchBooks = async (genreId = null) => {
        try {
            // recupere les livres via l'api
            const response = await fetch(`/api/v1/books${genreId ? `?genre=${genreId}` : ''}`);
            const books = await response.json();

            // Affichage des livres dans le conteneur
            bookList.innerHTML = books.map(({ id, name, author, genre_name }) => `
                <li class="book-item">
                    <span>${name} - ${author} (${genre_name || 'Genre inconnu'})</span>
                    <button class="delete-btn" data-id="${id}">Supprimer</button>
                </li>
            `).join('');

            // Ajoute une requete lors que l'on clique sur un bouton de suppression
            document.querySelectorAll('.delete-btn').forEach(btn => btn.onclick = () => deleteBook(btn.dataset.id, btn.parentElement));
        } catch (error) { console.error(error); }
    };

    // Fonction pour supprimer un livre
    const deleteBook = async (id, bookItem) => {

        // Affiche une boite de dialogue de confirmation
        if (confirm('Supprimer ce livre ?')) {
            try {
                const response = await fetch(`/api/v1/books/${id}`, { method: 'DELETE' });
                if (response.ok) bookItem.remove();
                else throw new Error('Erreur suppression');
            } catch (error) { console.error(error); }
        }
    };

    // Ajoute un livre
    addBookForm.onsubmit = async (event) => {
        // Récupère les données
        event.preventDefault();
        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        const genreId = genreSelect.value;

        // Envoie les données vers l'api
        try {
            const response = await fetch('/api/v1/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, author, genre_id: genreId })
            });
            // Si l'ajout a fonctionné on affiche le toast
            if (response.ok) {
                fetchBooks();
                toggleModal(false);
                addBookForm.reset();
                showToast('Livre ajouté avec succès !');
            } else throw new Error();
        } catch {
            showToast('Erreur lors de l\'ajout !');
        }
    };

    // Chargement des genres et des livres
    fetchGenres();
    fetchBooks();
});
