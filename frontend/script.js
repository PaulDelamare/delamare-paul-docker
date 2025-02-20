document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('books-list');
    const addBookBtn = document.getElementById('add-book-btn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const addBookForm = document.getElementById('add-book-form');
    const genreSelect = document.getElementById('genre'); // 🚀 Sélecteur de genre dans le formulaire
    const genreButtonsContainer = document.getElementById('genre-buttons');

    // Fonction pour récupérer et afficher les genres
    function fetchGenres() {
        fetch('/api/v1/genres')
            .then(response => response.json())
            .then(data => {
                genreSelect.innerHTML = '';
                genreButtonsContainer.innerHTML = '';

                data.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreSelect.appendChild(option);

                    const button = document.createElement('button');
                    button.textContent = genre.name;
                    button.dataset.genreId = genre.id;
                    button.classList.add('genre-btn');
                    button.addEventListener('click', () => filterBooksByGenre(genre.id));
                    genreButtonsContainer.appendChild(button);
                });
            })
            .catch(error => console.error(error));
    }

    // Fonction pour récupérer et afficher les livres
    function fetchBooks(genreId = null) {
        let url = '/api/v1/books';
        if (genreId) {
            url += `?genre=${genreId}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                bookList.innerHTML = ''; // 🚀 Vider la liste des livres

                data.forEach(book => {
                    const bookItem = document.createElement('li');
                    bookItem.innerHTML = `<span>${book.name} - ${book.author} (${book.genre_name || 'Genre inconnu'})</span>`;
                    bookItem.classList.add('book-item');

                    // 🚀 Bouton de suppression avec confirmation
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Supprimer';
                    deleteBtn.classList.add('delete-btn');
                    deleteBtn.addEventListener('click', () => {
                        if (confirm(`🚀 Es-tu sûr de vouloir supprimer "${book.name}" de ${book.author} ?`)) {
                            fetch(`/api/v1/books/${book.id}`, { method: 'DELETE' })
                                .then(response => {
                                    if (response.ok) {
                                        bookItem.remove();
                                        console.log(`Livre supprimé: ${book.id}`);
                                    } else {
                                        console.error('Erreur lors de la suppression du livre');
                                    }
                                })
                                .catch(error => console.error(error));
                        }
                    });

                    bookItem.appendChild(deleteBtn);
                    bookList.appendChild(bookItem);
                });
            })
            .catch(error => console.error("Erreur lors de la récupération des livres:", error));
    }


    /**
     * Fetches the books according to the given genre ID and displays them in the page
     * @param {number} genreId - The ID of the genre to filter the books
     */
    function filterBooksByGenre(genreId) {
        fetchBooks(genreId);
    }

    // Event pour la modal
    addBookBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        // 🚀 Disparition après 3 secondes
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }


    // Submit du formulaire d'ajout
    addBookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        const genreId = genreSelect.value;

        fetch('/api/v1/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, author, genre_id: genreId })
        })
            .then(response => response.json())
            .then(() => {
                fetchBooks(); // 🚀 Recharger la liste après ajout
                modal.style.display = 'none';
                addBookForm.reset();
                showToast("📚 Livre ajouté avec succès !"); // 🚀 Afficher le message
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout du livre:", error);
                showToast("❌ Erreur lors de l'ajout !");
            });
    });


    // Charge les genres et les livres au démarrage
    fetchGenres();
    fetchBooks();
});