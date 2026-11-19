CREATE DATABASE IF NOT EXISTS eyai_registration
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eyai_registration;

CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(40) NOT NULL,
  region VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(190) NOT NULL,
  education VARCHAR(120) NOT NULL,
  occupation VARCHAR(120) NOT NULL,
  category VARCHAR(120) NOT NULL,
  course VARCHAR(180) NOT NULL,
  level VARCHAR(80) NOT NULL,
  interests VARCHAR(255) NULL,
  career_goal VARCHAR(255) NULL,
  mode VARCHAR(80) NOT NULL,
  consent TINYINT(1) NOT NULL DEFAULT 0,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
