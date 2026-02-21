-- ================================================================
--  database/schema.sql
--  Run once to create tables and seed book data
--  mysql -u root -p < database/schema.sql
-- ================================================================

CREATE DATABASE IF NOT EXISTS folio_bookstore
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE folio_bookstore;

-- ── Create user ──────────────────────────────────────────────────
-- CREATE USER 'folio_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON folio_bookstore.* TO 'folio_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ── Tables ───────────────────────────────────────────────────────
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id             INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  title          VARCHAR(255)     NOT NULL,
  author         VARCHAR(255)     NOT NULL,
  category       VARCHAR(50)      NOT NULL COMMENT 'nyt|classics|children|top9|social|fantasy',
  category_label VARCHAR(80)      NOT NULL,
  price          DECIMAL(8,2)     NOT NULL,
  year           SMALLINT         NOT NULL,
  stock          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  description    TEXT,
  color          VARCHAR(7)       DEFAULT '#5a4a2a',
  created_at     DATETIME         DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  total      DECIMAL(10,2) NOT NULL,
  status     ENUM('pending','confirmed','shipped','delivered','cancelled')
               NOT NULL DEFAULT 'pending',
  created_at DATETIME      DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  order_id   INT UNSIGNED  NOT NULL,
  book_id    INT UNSIGNED  NOT NULL,
  qty        SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(8,2)  NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id)  REFERENCES books(id)  ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Seed Data ────────────────────────────────────────────────────
INSERT INTO books (title, author, category, category_label, price, year, stock, description, color) VALUES
-- NYT Bestsellers
('Tomorrow, and Tomorrow, and Tomorrow', 'Gabrielle Zevin', 'nyt', 'NYT Bestseller', 18.99, 2022, 14,
  'A sweeping novel about creativity, identity, love, and the redemptive powers of play.',
  '#6b7a4a'),
('Fourth Wing', 'Rebecca Yarros', 'nyt', 'NYT Bestseller', 22.99, 2023, 9,
  'Twenty-three-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant — but her mother has other plans involving dragons.',
  '#7a3a3a'),
('Intermezzo', 'Sally Rooney', 'nyt', 'NYT Bestseller', 20.00, 2024, 21,
  'Two brothers grieve their father while navigating wildly different love affairs. Rooney at her most expansive.',
  '#3a4a6b'),

-- Classics
('Middlemarch', 'George Eliot', 'classics', 'Classic', 12.99, 1871, 33,
  'Set in the fictitious Midlands town of Middlemarch, widely regarded as one of the greatest novels in the English language.',
  '#5a4a2a'),
('Anna Karenina', 'Leo Tolstoy', 'classics', 'Classic', 11.99, 1878, 28,
  'A masterpiece of realistic fiction exploring love, jealousy, faith, and social class in 19th-century Russia.',
  '#4a2a2a'),
('To Kill a Mockingbird', 'Harper Lee', 'classics', 'Classic', 13.50, 1960, 41,
  'Through the eyes of young Scout Finch, this Pulitzer Prize winner explores racial injustice and moral growth.',
  '#3a5a3a'),

-- Children's Books
('The Phantom Tollbooth', 'Norton Juster', 'children', 'Children''s Book', 10.99, 1961, 17,
  'Milo drives through a magical tollbooth and discovers the Lands Beyond in this witty adventure through puns and logic.',
  '#7a5a2a'),
('Where the Wild Things Are', 'Maurice Sendak', 'children', 'Children''s Book', 9.99, 1963, 52,
  'Max dons a wolf suit and sails to the land of wild things in this timeless picture book about imagination and love.',
  '#3a5a6b'),

-- Top 9
('Demon Copperhead', 'Barbara Kingsolver', 'top9', 'Top 9', 19.99, 2022, 11,
  'A Pulitzer Prize-winning retelling of David Copperfield set in the Appalachian opioid crisis.',
  '#6b3a4a'),
('Lessons in Chemistry', 'Bonnie Garmus', 'top9', 'Top 9', 17.99, 2022, 8,
  'A chemist-turned-cooking-show host in 1960s California inspires women to think for themselves.',
  '#4a6b3a'),
('The Covenant of Water', 'Abraham Verghese', 'top9', 'Top 9', 21.50, 2023, 6,
  'An epic spanning three generations of a family in South India, tracing a mysterious illness through history.',
  '#2a4a6b'),

-- Social Justice
('The New Jim Crow', 'Michelle Alexander', 'social', 'Social Justice', 16.99, 2010, 24,
  'A groundbreaking study of mass incarceration as a contemporary form of racial control.',
  '#3a3a6b'),
('Braiding Sweetgrass', 'Robin Wall Kimmerer', 'social', 'Social Justice', 18.00, 2013, 19,
  'A botanist and Indigenous member braids together Native wisdom and scientific knowledge to offer a new vision of the world.',
  '#3a6b3a'),
('Just Mercy', 'Bryan Stevenson', 'social', 'Social Justice', 15.99, 2014, 30,
  'A powerful true story of justice and redemption following attorney Bryan Stevenson defending the wrongly condemned.',
  '#6b4a2a'),

-- Fantasy
('The Way of Kings', 'Brandon Sanderson', 'fantasy', 'Fantasy', 24.99, 2010, 13,
  'The first Stormlight Archive book, set on a world ravaged by supernatural storms where ancient weapons are sought.',
  '#2a5a6b'),
('A Wizard of Earthsea', 'Ursula K. Le Guin', 'fantasy', 'Fantasy', 13.99, 1968, 22,
  'A young boy with extraordinary gifts goes to wizard school and unleashes a terrible shadow upon the world.',
  '#4a2a6b'),
('The Name of the Wind', 'Patrick Rothfuss', 'fantasy', 'Fantasy', 16.99, 2007, 16,
  'The first-person account of a magically gifted man who grows to be the most notorious wizard his world has ever seen.',
  '#6b5a2a'),
('Piranesi', 'Susanna Clarke', 'fantasy', 'Fantasy', 14.99, 2020, 20,
  'Piranesi lives in a mysterious house of infinite halls. His past may be stranger than he can imagine.',
  '#4a6b5a');