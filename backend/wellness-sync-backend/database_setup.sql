-- Database Setup Script for Wellness Sync
-- Run this script as MySQL root user

-- Create database
CREATE DATABASE IF NOT EXISTS wellness_sync;

-- Create a dedicated user for the application (optional but recommended)
CREATE USER IF NOT EXISTS 'wellness_user'@'localhost' IDENTIFIED BY 'wellness_password';

-- Grant all privileges on the wellness_sync database to the user
GRANT ALL PRIVILEGES ON wellness_sync.* TO 'wellness_user'@'localhost';

-- Flush privileges to ensure they take effect
FLUSH PRIVILEGES;

-- Use the database
USE wellness_sync;

-- Show that database is selected
SELECT 'Database wellness_sync created and selected successfully!' as Status;
