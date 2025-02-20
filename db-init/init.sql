CREATE TABLE IF NOT EXISTS `books` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `genres` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `books_genres` (
    book_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

INSERT INTO books (name, author) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald'),
('To Kill a Mockingbird', 'Harper Lee'),
('The Catcher in the Rye', 'J.D. Salinger'),
('1984', 'George Orwell'),
('Pride and Prejudice', 'Jane Austen'),
('The Picture of Dorian Gray', 'Oscar Wilde'),
('The Lord of the Rings', 'J.R.R. Tolkien'),
('The Little Prince', 'Antoine de Saint-Exup ry'),
('The Alchemist', 'Paulo Coelho'),
('The Count of Monte Cristo', 'Alexandre Dumas');

INSERT INTO genres (name) VALUES
('Fantasy'),
('Science Fiction'),
('Romance'),
('Mystery'),
('Horror'),
('Thriller'),
('Historical Fiction'),
('Crime'),
('Adventure');

INSERT INTO books_genres (book_id, genre_id) VALUES
(1, 1),
(1, 3),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(4, 2),
(4, 3),
(5, 1),
(5, 2),
(6, 4),
(6, 5),
(6, 6),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(8, 7),
(8, 8),
(9, 1),
(9, 2),
(10, 3),
(10, 5);
