--------------------------------------
-- TABLE DEFINITIONS                --
--------------------------------------

-- Drop Tables
DROP TABLE IF EXISTS Pokemon;
DROP TABLE IF EXISTS Types;
DROP TABLE IF EXISTS Sets;

-- Types Table
CREATE TABLE Types (
    type_id INT NOT NULL AUTO_INCREMENT,
    type_name VARCHAR(145) NOT NULL,
    PRIMARY KEY (type_id)
);

-- Set Table
CREATE TABLE Sets (
    set_id INT NOT NULL AUTO_INCREMENT,
    set_name VARCHAR(145) NOT NULL,
    PRIMARY KEY (set_id)
);

-- Pokemon Table
CREATE TABLE Pokemon (
	pokemon_id INT NOT NULL AUTO_INCREMENT,
    pokemon_name VARCHAR(145) NOT NULL,
    pokemon_hp INT NOT NULL,
    pokemon_flavor_text VARCHAR(255),
    type_id INT NOT NULL,
    set_id INT NOT NULL,
    PRIMARY KEY (pokemon_id),
    FOREIGN KEY (type_id)
        REFERENCES Types (type_id)
            ON DELETE CASCADE,
    FOREIGN KEY (set_id)
        REFERENCES Sets (set_id)
            ON DELETE CASCADE
);

---------------------------------------------------------------------------------------------

--------------------------------------
-- TEST VALUES                      --
--------------------------------------

-- Types Table
INSERT INTO Types (type_name)
VALUES
('Grass'),
('Fire'),
('Water'),
('Lightning'),
('Psychic'),
('Fighting'),
('Darkness'),
('Metal'),
('Colorless'),
('Fairy'),
('Dragon');

-- Sets Table
INSERT INTO Sets (set_name)
VALUES
('Temporal Forces'),
('Paldea Evolved');

-- Pokemon Table
INSERT INTO Pokemon (pokemon_name, pokemon_hp, pokemon_flavor_text, type_id, set_id)
VALUES
(
	'Melmetal',
    160,
    'At the end of its life-span, Melmetal will rust and fall apart. The small shards left behind will eventually be reborn as Meltan.',
    (SELECT type_id FROM Types WHERE type_name = 'Metal'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')
),
(
	'Yamper',
    70,
    'This Pokémon is very popular as a herding dog in the Galar region. As it runs, it generates electricity from the base of its tail.',
    (SELECT type_id FROM Types WHERE type_name = 'Lightning'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')
);