-- Seed Categories
INSERT INTO categories (name) VALUES 
('Computer Science'),
('Information Technology'),
('Electrical Engineering'),
('Mathematics'),
('Fiction')
ON CONFLICT (name) DO NOTHING;

-- Seed Users
-- admin@library.com / admin123
INSERT INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@library.com', '$2b$10$e7KQac1pRRO8.WcR.u40K.p33P1OiOn4ElnYW054G5trmGDU.zVcO', 'admin')
ON CONFLICT (email) DO NOTHING;

-- student@library.com / student123
INSERT INTO users (name, email, password_hash, role) VALUES
('Jane Doe', 'student@library.com', '$2b$10$60cR7UU/IkVOOnE4dc3wlOIJd.b.jOOnCrC2V4TnA8QmQC8is956i', 'student')
ON CONFLICT (email) DO NOTHING;

-- Seed Student profiles for student user
INSERT INTO students (user_id, roll_number, department, semester, phone)
SELECT id, 'CS2026001', 'Computer Science', '6', '1234567890'
FROM users
WHERE email = 'student@library.com'
ON CONFLICT (roll_number) DO NOTHING;

-- Seed Sample Books
INSERT INTO books (title, author, isbn, publisher, category_id, total_count, available_count, shelf_location, description) VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'MIT Press', (SELECT id FROM categories WHERE name = 'Computer Science'), 5, 5, 'Shelf A1', 'A comprehensive guide to the algorithm design and analysis.'),
('Clean Code', 'Robert C. Martin', '9780132350884', 'Prentice Hall', (SELECT id FROM categories WHERE name = 'Computer Science'), 3, 3, 'Shelf A2', 'A handbook of agile software craftsmanship.'),
('The Pragmatic Programmer', 'Andrew Hunt', '9780201616224', 'Addison-Wesley', (SELECT id FROM categories WHERE name = 'Computer Science'), 4, 4, 'Shelf A3', 'Your journey to mastery in software development.'),
('Calculus', 'James Stewart', '9780538497817', 'Cengage Learning', (SELECT id FROM categories WHERE name = 'Mathematics'), 2, 2, 'Shelf B1', 'Calculus textbook covering single and multivariable calculus.')
ON CONFLICT (isbn) DO NOTHING;
