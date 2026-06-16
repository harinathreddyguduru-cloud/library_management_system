-- Seed Categories
INSERT INTO categories (name) VALUES 
('Computer Science'),
('Information Technology'),
('Electrical Engineering'),
('Mathematics'),
('Fiction'),
('Programming'),
('Data Structures'),
('Algorithms'),
('Database'),
('Operating Systems'),
('Networking'),
('Computer Architecture'),
('Digital Electronics'),
('Electronics'),
('Civil Engineering'),
('Mechanical Engineering'),
('AI & ML'),
('Cyber Security'),
('Software Engineering')
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
('Programming in C', 'E. Balagurusamy', '9780070642555', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Programming'), 3, 3, 'Shelf P1', 'A comprehensive introduction to C programming.'),
('Let Us C', 'Yashavant Kanetkar', '9788176561581', 'BPB Publications', (SELECT id FROM categories WHERE name = 'Programming'), 3, 3, 'Shelf P2', 'A practical guide to learning C programming.'),
('Python Crash Course', 'Eric Matthes', '9781593279288', 'No Starch Press', (SELECT id FROM categories WHERE name = 'Programming'), 3, 3, 'Shelf P3', 'A hands-on introduction to programming with Python.'),
('Java: The Complete Reference', 'Herbert Schildt', '9781260440232', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Programming'), 3, 3, 'Shelf P4', 'A complete guide to Java programming and the Java API.'),
('Head First Java', 'Kathy Sierra', '9780596009205', 'O''Reilly Media', (SELECT id FROM categories WHERE name = 'Programming'), 3, 3, 'Shelf P5', 'A learning-focused guide to Java for beginners.'),
('Data Structures Using C', 'Reema Thareja', '9780195679206', 'Oxford University Press', (SELECT id FROM categories WHERE name = 'Data Structures'), 3, 3, 'Shelf D1', 'A clear explanation of data structures using C.'),
('Data Structures and Algorithms Made Easy', 'Narasimha Karumanchi', '9788193245276', 'CareerMonk Publications', (SELECT id FROM categories WHERE name = 'Data Structures'), 3, 3, 'Shelf D2', 'A practical guide to common data structure and algorithm problems.'),
('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'MIT Press', (SELECT id FROM categories WHERE name = 'Algorithms'), 5, 5, 'Shelf A1', 'A comprehensive guide to the algorithm design and analysis.'),
('Database System Concepts', 'Abraham Silberschatz', '9780073523323', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Database'), 3, 3, 'Shelf DB1', 'A cornerstone reference for database system theory and design.'),
('Database Management Systems', 'Raghu Ramakrishnan', '9780072465631', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Database'), 3, 3, 'Shelf DB2', 'Core principles and practices for database systems.'),
('Operating System Concepts', 'Abraham Silberschatz', '9781118063330', 'Wiley', (SELECT id FROM categories WHERE name = 'Operating Systems'), 3, 3, 'Shelf OS1', 'A widely used textbook on operating system principles.'),
('Modern Operating Systems', 'Andrew S. Tanenbaum', '9780133591620', 'Pearson', (SELECT id FROM categories WHERE name = 'Operating Systems'), 3, 3, 'Shelf OS2', 'A modern introduction to operating system concepts.'),
('Computer Networks', 'Andrew S. Tanenbaum', '9780132126953', 'Pearson', (SELECT id FROM categories WHERE name = 'Networking'), 3, 3, 'Shelf N1', 'An authoritative text on computer networking principles.'),
('Data Communications and Networking', 'Behrouz Forouzan', '9780073520648', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Networking'), 3, 3, 'Shelf N2', 'A clear and accessible guide to networking fundamentals.'),
('Computer Organization and Architecture', 'William Stallings', '9780133761017', 'Pearson', (SELECT id FROM categories WHERE name = 'Computer Architecture'), 3, 3, 'Shelf CA1', 'A detailed text on computer hardware and architecture.'),
('Digital Logic and Computer Design', 'M. Morris Mano', '9780131989269', 'Pearson', (SELECT id FROM categories WHERE name = 'Digital Electronics'), 3, 3, 'Shelf DE1', 'Basics of digital logic design and circuits.'),
('Digital Electronics', 'R.P. Jain', '9788120336535', 'Tata McGraw Hill', (SELECT id FROM categories WHERE name = 'Digital Electronics'), 3, 3, 'Shelf DE2', 'Fundamentals of digital electronics and systems.'),
('Signals and Systems', 'Alan Oppenheim', '9780138147570', 'Pearson', (SELECT id FROM categories WHERE name = 'Electronics'), 3, 3, 'Shelf EL1', 'A foundational text on signal processing and systems.'),
('Electronic Devices and Circuit Theory', 'Boylestad', '9780138147571', 'Pearson', (SELECT id FROM categories WHERE name = 'Electronics'), 3, 3, 'Shelf EL2', 'A core text on electronic devices and circuit theory.'),
('Power System Engineering', 'Nagrath & Kothari', '9780070642043', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Electrical Engineering'), 3, 3, 'Shelf EE1', 'A standard textbook on power systems engineering.'),
('Electrical Machines', 'P.S. Bimbhra', '9780198088535', 'Oxford University Press', (SELECT id FROM categories WHERE name = 'Electrical Engineering'), 3, 3, 'Shelf EE2', 'A textbook covering electrical machines and machinery.'),
('Control Systems Engineering', 'I.J. Nagrath', '9780070278203', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Electrical Engineering'), 3, 3, 'Shelf EE3', 'A practical guide to control systems and engineering.'),
('Strength of Materials', 'R.K. Rajput', '9788121925369', 'S. Chand', (SELECT id FROM categories WHERE name = 'Mechanical Engineering'), 3, 3, 'Shelf ME1', 'Fundamentals of strength of materials for engineering students.'),
('Theory of Machines', 'S.S. Rattan', '9788180454909', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Mechanical Engineering'), 3, 3, 'Shelf ME2', 'A textbook on machine theory and dynamics.'),
('Thermodynamics', 'P.K. Nag', '9780070151525', 'Tata McGraw Hill', (SELECT id FROM categories WHERE name = 'Mechanical Engineering'), 3, 3, 'Shelf ME3', 'An introduction to thermodynamics for engineers.'),
('Engineering Mechanics', 'R.C. Hibbeler', '9780133915422', 'Pearson', (SELECT id FROM categories WHERE name = 'Civil Engineering'), 3, 3, 'Shelf CE1', 'A core text for engineering mechanics and statics.'),
('Fluid Mechanics', 'R.K. Rajput', '9780070580432', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Civil Engineering'), 3, 3, 'Shelf CE2', 'A foundational guide to fluid mechanics for engineers.'),
('Structural Analysis', 'R.C. Hibbeler', '9780133399094', 'Pearson', (SELECT id FROM categories WHERE name = 'Civil Engineering'), 3, 3, 'Shelf CE3', 'A detailed text on structural analysis and design.'),
('Reinforced Concrete Design', 'B.C. Punmia', '9788181285206', 'Laxmi Publications', (SELECT id FROM categories WHERE name = 'Civil Engineering'), 3, 3, 'Shelf CE4', 'A textbook on reinforced concrete design and practice.'),
('Environmental Engineering', 'Peavy & Rowe', '9780070170381', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Civil Engineering'), 3, 3, 'Shelf CE5', 'A comprehensive text on environmental engineering.'),
('Engineering Mathematics I', 'B.S. Grewal', '9788181285411', 'Khanna Publishers', (SELECT id FROM categories WHERE name = 'Mathematics'), 3, 3, 'Shelf MATH1', 'A mathematics textbook for engineering students.'),
('Higher Engineering Mathematics', 'B.S. Grewal', '9788121914457', 'Khanna Publishers', (SELECT id FROM categories WHERE name = 'Mathematics'), 3, 3, 'Shelf MATH2', 'A higher-level mathematics textbook for engineering studies.'),
('Discrete Mathematics and Its Applications', 'Kenneth Rosen', '9780073383095', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'Mathematics'), 3, 3, 'Shelf MATH3', 'A textbook on discrete mathematics and its applications.'),
('Artificial Intelligence: A Modern Approach', 'Stuart Russell', '9780136042594', 'Pearson', (SELECT id FROM categories WHERE name = 'AI & ML'), 3, 3, 'Shelf AI1', 'A comprehensive textbook on artificial intelligence.'),
('Machine Learning', 'Tom M. Mitchell', '9780070428072', 'McGraw Hill', (SELECT id FROM categories WHERE name = 'AI & ML'), 3, 3, 'Shelf AI2', 'An introductory textbook on machine learning.'),
('Deep Learning', 'Ian Goodfellow', '9780262035613', 'MIT Press', (SELECT id FROM categories WHERE name = 'AI & ML'), 3, 3, 'Shelf AI3', 'A practical guide to deep learning techniques.'),
('Cyber Security Essentials', 'Charles Brooks', '9780134746274', 'Pearson', (SELECT id FROM categories WHERE name = 'Cyber Security'), 3, 3, 'Shelf CS1', 'An introduction to cybersecurity principles and practices.'),
('Cryptography and Network Security', 'William Stallings', '9780132140397', 'Pearson', (SELECT id FROM categories WHERE name = 'Cyber Security'), 3, 3, 'Shelf CS2', 'A detailed guide to cryptography and network security.'),
('Software Engineering', 'Ian Sommerville', '9780133943030', 'Pearson', (SELECT id FROM categories WHERE name = 'Software Engineering'), 3, 3, 'Shelf SE1', 'A text on software engineering methods and best practices.'),
('Clean Code', 'Robert C. Martin', '9780132350884', 'Prentice Hall', (SELECT id FROM categories WHERE name = 'Software Engineering'), 3, 3, 'Shelf SE2', 'A handbook of agile software craftsmanship.')
ON CONFLICT (isbn) DO NOTHING;
