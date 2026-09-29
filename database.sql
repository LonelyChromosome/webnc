CREATE DATABASE IF NOT EXISTS newsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE newsdb;

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255)
);

INSERT INTO users (username, password, fullname)
SELECT 'admin', '123456', 'Administrator'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
