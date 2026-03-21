CREATE DATABASE IF NOT EXISTS ifrs_cardapio;
USE ifrs_cardapio;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('servidor', 'aluno') NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    meal_type ENUM('Café da Manhã', 'Almoço', 'Jantar') NOT NULL,
    items JSON NOT NULL -- Armazena o vetor de itens nativamente
);

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    menu_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    UNIQUE(user_id, menu_id) -- Impede favoritar o mesmo cardápio duas vezes
);

-- Inserindo utilizadores de teste
INSERT INTO users (login, password, type, name) VALUES 
('aluno', '123', 'aluno', 'João (Aluno)'),
('servidor', '123', 'servidor', 'Maria (Servidora)');