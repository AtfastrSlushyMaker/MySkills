-- Categories Table Seeder
-- This file contains sample categories for the MySkills training management system

-- Insert categories with various training domains
INSERT INTO categories (name, description, is_active, created_at, updated_at) VALUES
-- Programming & Development
('Frontend Development', 'User interface and user experience development using modern frameworks and technologies', true, NOW(), NOW()),
('Backend Development', 'Server-side development, APIs, databases, and system architecture', true, NOW(), NOW()),
('Full Stack Development', 'Complete web development covering both frontend and backend technologies', true, NOW(), NOW()),
('Mobile Development', 'iOS, Android, and cross-platform mobile application development', true, NOW(), NOW()),
('DevOps & Cloud', 'Infrastructure, deployment, containerization, and cloud services', true, NOW(), NOW()),
('Database Management', 'Database design, optimization, administration, and data modeling', true, NOW(), NOW()),
('Web Design', 'UI/UX design, responsive design, and visual design principles', true, NOW(), NOW()),
('Game Development', 'Video game programming, game engines, and interactive media development', true, NOW(), NOW()),

-- Data & Analytics
('Data Science', 'Data analysis, machine learning, statistics, and data visualization', true, NOW(), NOW()),
('Machine Learning', 'AI algorithms, neural networks, and predictive modeling', true, NOW(), NOW()),
('Business Intelligence', 'Data warehousing, reporting, and business analytics tools', true, NOW(), NOW()),
('Big Data', 'Distributed computing, data processing frameworks, and large-scale analytics', true, NOW(), NOW()),

-- Business & Management
('Project Management', 'Agile, Scrum, project planning, and team leadership methodologies', true, NOW(), NOW()),
('Digital Marketing', 'SEO, social media marketing, content marketing, and online advertising', true, NOW(), NOW()),
('Business Analysis', 'Requirements gathering, process improvement, and stakeholder management', true, NOW(), NOW()),
('Leadership & Management', 'Team leadership, strategic planning, and organizational development', true, NOW(), NOW()),
('Entrepreneurship', 'Startup development, business planning, and innovation management', true, NOW(), NOW()),

-- Design & Creative
('Graphic Design', 'Visual design, branding, typography, and creative software training', true, NOW(), NOW()),
('Video Production', 'Video editing, motion graphics, cinematography, and multimedia content', true, NOW(), NOW()),
('3D Modeling & Animation', '3D design, animation, rendering, and virtual reality content creation', true, NOW(), NOW()),
('Photography', 'Digital photography, photo editing, and visual storytelling techniques', true, NOW(), NOW()),

-- Technology & Tools
('Cybersecurity', 'Information security, ethical hacking, network security, and compliance', true, NOW(), NOW()),
('Cloud Computing', 'AWS, Azure, Google Cloud, and cloud architecture best practices', true, NOW(), NOW()),
('Software Testing', 'Quality assurance, automated testing, and test-driven development', true, NOW(), NOW()),
('Network Administration', 'Network configuration, troubleshooting, and infrastructure management', true, NOW(), NOW()),

-- Soft Skills & Professional Development
('Communication Skills', 'Public speaking, presentation skills, and effective communication', true, NOW(), NOW()),
('Time Management', 'Productivity techniques, workflow optimization, and priority management', true, NOW(), NOW()),
('Problem Solving', 'Critical thinking, analytical skills, and creative problem-solving methods', true, NOW(), NOW()),
('Team Collaboration', 'Teamwork, conflict resolution, and collaborative work methodologies', true, NOW(), NOW()),

-- Industry-Specific
('Healthcare Technology', 'Medical software, healthcare systems, and health informatics', true, NOW(), NOW()),
('Financial Technology', 'Fintech applications, blockchain, and financial software development', true, NOW(), NOW()),
('E-commerce', 'Online retail platforms, payment systems, and digital commerce strategies', true, NOW(), NOW()),
('Education Technology', 'Learning management systems, educational apps, and e-learning platforms', true, NOW(), NOW()),

-- Emerging Technologies
('Artificial Intelligence', 'AI development, natural language processing, and intelligent systems', true, NOW(), NOW()),
('Blockchain', 'Cryptocurrency, smart contracts, and distributed ledger technologies', true, NOW(), NOW()),
('Internet of Things', 'IoT devices, sensor networks, and connected systems development', true, NOW(), NOW()),
('Virtual Reality', 'VR development, immersive experiences, and augmented reality applications', true, NOW(), NOW()),

-- Languages & Frameworks
('JavaScript Frameworks', 'React, Vue, Angular, and modern JavaScript development', true, NOW(), NOW()),
('Python Programming', 'Python development, scripting, and Python-based frameworks', true, NOW(), NOW()),
('Java Development', 'Java programming, Spring framework, and enterprise Java applications', true, NOW(), NOW()),
('PHP Development', 'PHP programming, Laravel, WordPress, and web development', true, NOW(), NOW()),
('C# & .NET', 'Microsoft .NET framework, C# programming, and Windows development', true, NOW(), NOW()),

-- Specialized Skills
('API Development', 'RESTful APIs, GraphQL, and web service development', true, NOW(), NOW()),
('Microservices', 'Service-oriented architecture, containerization, and distributed systems', true, NOW(), NOW()),
('Performance Optimization', 'Code optimization, system performance, and scalability techniques', true, NOW(), NOW()),
('Accessibility', 'Web accessibility, inclusive design, and compliance standards', true, NOW(), NOW());

-- Note: This file matches the actual categories table structure:
-- - id (auto-increment primary key)
-- - name (varchar) - Category name
-- - description (text, nullable) - Detailed description of the category
-- - is_active (boolean, default true) - Whether the category is active/available
-- - created_at (timestamp) - When the category was created
-- - updated_at (timestamp) - When the category was last updated

-- To use this file:
-- 1. Make sure your categories table exists (run migrations first)
-- 2. Run: mysql -u username -p database_name < categories.sql
-- 3. Or copy and paste the INSERT statements into your MySQL client
-- 4. In Laravel: You can also create a seeder and run `php artisan db:seed`
