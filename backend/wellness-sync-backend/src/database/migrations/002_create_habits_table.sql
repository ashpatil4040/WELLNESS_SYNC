CREATE TABLE habits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  target INT NOT NULL,
  completed INT DEFAULT 0,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);