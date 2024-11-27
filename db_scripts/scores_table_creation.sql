USE campo_minado;

CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    grid_size VARCHAR(10) NOT NULL,
    bomb_count INT NOT NULL,
    game_mode VARCHAR(20) NOT NULL,
    time_spent TIME NOT NULL,
    date_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);