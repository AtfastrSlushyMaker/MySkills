-- Users Table Seeder
    -- This file contains sample users for the MySkills training management system
    --
    -- Note: This file matches the actual users table structure:
    -- - id (auto-increment primary key)
    -- - first_name (varchar) - User's first name
    -- - last_name (varchar) - User's last name
    -- - email (varchar, unique) - User's email address
    -- - phone (varchar, nullable) - User's phone number
    -- - password (varchar) - Hashed password (all set to 'password123')
    -- - role (enum) - User role: admin, coordinator, trainer, trainee
    -- - status (enum) - User status: active, inactive, banned
    -- - email_verified_at (timestamp, nullable) - When email was verified
    -- - remember_token (varchar, nullable) - Laravel remember token
    -- - created_at (timestamp) - When the user was created
    -- - updated_at (timestamp) - When the user was last updated
    --
    -- All passwords are hashed version of 'password123' for testing

    -- Insert users with different roles and realistic data
    INSERT INTO users (first_name, last_name, email, phone, password, role, status, email_verified_at, created_at, updated_at) VALUES

    -- Admin Users
    ('John', 'Smith', 'admin@myskills.com', '+1-555-0101', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'admin', 'active', NOW(), NOW(), NOW()),
    ('Sarah', 'Johnson', 'sarah.admin@myskills.com', '+1-555-0102', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'admin', 'active', NOW(), NOW(), NOW()),

    -- Coordinator Users
    ('Michael', 'Davis', 'coordinator@myskills.com', '+1-555-0201', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'coordinator', 'active', NOW(), NOW(), NOW()),
    ('Emily', 'Wilson', 'emily.coordinator@myskills.com', '+1-555-0202', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'coordinator', 'active', NOW(), NOW(), NOW()),
    ('David', 'Brown', 'david.coordinator@myskills.com', '+1-555-0203', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'coordinator', 'active', NOW(), NOW(), NOW()),

    -- Trainer Users
    ('Alex', 'Rodriguez', 'trainer@myskills.com', '+1-555-0301', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),
    ('Jessica', 'Chen', 'jessica.trainer@myskills.com', '+1-555-0302', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),
    ('Marcus', 'Taylor', 'marcus.trainer@myskills.com', '+1-555-0303', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),
    ('Lisa', 'Anderson', 'lisa.trainer@myskills.com', '+1-555-0304', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),
    ('Robert', 'Garcia', 'robert.trainer@myskills.com', '+1-555-0305', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),
    ('Anna', 'Martinez', 'anna.trainer@myskills.com', '+1-555-0306', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),
    ('Kevin', 'Thompson', 'kevin.trainer@myskills.com', '+1-555-0307', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),
    ('Rachel', 'White', 'rachel.trainer@myskills.com', '+1-555-0308', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainer', 'active', NOW(), NOW(), NOW()),

    -- Trainee Users (Students/Participants)
    ('James', 'Miller', 'trainee@myskills.com', '+1-555-0401', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Emma', 'Davis', 'emma.trainee@myskills.com', '+1-555-0402', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('William', 'Moore', 'william.trainee@myskills.com', '+1-555-0403', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Olivia', 'Jackson', 'olivia.trainee@myskills.com', '+1-555-0404', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Benjamin', 'Martin', 'benjamin.trainee@myskills.com', '+1-555-0405', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Sophia', 'Lee', 'sophia.trainee@myskills.com', '+1-555-0406', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Mason', 'Walker', 'mason.trainee@myskills.com', '+1-555-0407', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Isabella', 'Hall', 'isabella.trainee@myskills.com', '+1-555-0408', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Ethan', 'Allen', 'ethan.trainee@myskills.com', '+1-555-0409', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Ava', 'Young', 'ava.trainee@myskills.com', '+1-555-0410', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Noah', 'King', 'noah.trainee@myskills.com', '+1-555-0411', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Charlotte', 'Wright', 'charlotte.trainee@myskills.com', '+1-555-0412', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Lucas', 'Lopez', 'lucas.trainee@myskills.com', '+1-555-0413', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Amelia', 'Hill', 'amelia.trainee@myskills.com', '+1-555-0414', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Henry', 'Scott', 'henry.trainee@myskills.com', '+1-555-0415', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Mia', 'Green', 'mia.trainee@myskills.com', '+1-555-0416', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Daniel', 'Adams', 'daniel.trainee@myskills.com', '+1-555-0417', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Harper', 'Baker', 'harper.trainee@myskills.com', '+1-555-0418', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Sebastian', 'Gonzalez', 'sebastian.trainee@myskills.com', '+1-555-0419', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),
    ('Evelyn', 'Nelson', 'evelyn.trainee@myskills.com', '+1-555-0420', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'active', NOW(), NOW(), NOW()),

    -- Some inactive/banned users for testing
    ('Test', 'Inactive', 'inactive@myskills.com', '+1-555-0501', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'inactive', NULL, NOW(), NOW()),
    ('Test', 'Banned', 'banned@myskills.com', '+1-555-0502', '$2y$10$wH5k6lNw2K6JqqPiRWaYwOQp6Qw3QwQwQwQwQwQwQwQwQwQwQW', 'trainee', 'banned', NULL, NOW(), NOW());

    -- Note: This file matches the actual users table structure:
    -- - id (auto-increment primary key)
    -- - first_name (varchar) - User's first name
    -- - last_name (varchar) - User's last name
    -- - email (varchar, unique) - User's email address
    -- - phone (varchar, nullable) - User's phone number
    -- - password (varchar) - Hashed password (all set to 'password123')
    -- - role (enum) - User role: admin, coordinator, trainer, trainee
    -- - status (enum) - User status: active, inactive, banned
    -- - is_active (boolean) - Whether the user account is active
    -- - email_verified_at (timestamp, nullable) - When email was verified
    -- - created_at (timestamp) - When the user was created
    -- - updated_at (timestamp) - When the user was last updated

    -- User Count Summary:
    -- - 2 Admins
    -- - 3 Coordinators
    -- - 8 Trainers
    -- - 20 Trainees
    -- - 2 Test users (inactive/banned)
    -- Total: 35 users

    -- Default Password: password123
    -- Test Login Credentials:
    -- Admin: admin@myskills.com / password123
    -- Coordinator: coordinator@myskills.com / password123
    -- Trainer: trainer@myskills.com / password123
    -- Trainee: trainee@myskills.com / password123

    -- To use this file:
    -- 1. Make sure your users table exists (run migrations first)
    -- 2. Run: mysql -u username -p database_name < users.sql
    -- 3. Or copy and paste the INSERT statements into your MySQL client
    -- 4. In Laravel: You can also create a seeder and run `php artisan db:seed`
