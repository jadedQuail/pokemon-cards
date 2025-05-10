CREATE DATABASE IF NOT EXISTS pokemoncards;
USE pokemoncards;

--------------------------------------
-- TABLE DEFINITIONS                --
--------------------------------------

-- Drop Tables
DROP TABLE IF EXISTS Pokemon;
DROP TABLE IF EXISTS Types;
DROP TABLE IF EXISTS Sets;
DROP TABLE IF EXISTS Users;

-- Types Table
CREATE TABLE Types (
    type_id INT NOT NULL AUTO_INCREMENT,
    type_name VARCHAR(145) NOT NULL UNIQUE,
    PRIMARY KEY (type_id)
);

-- Set Table
CREATE TABLE Sets (
    set_id INT NOT NULL AUTO_INCREMENT,
    set_name VARCHAR(145) NOT NULL UNIQUE,
    PRIMARY KEY (set_id)
);

-- Pokemon Table
CREATE TABLE Pokemon (
	pokemon_id INT NOT NULL AUTO_INCREMENT,
    pokemon_name VARCHAR(145) NOT NULL,
    pokemon_hp INT NOT NULL,
    pokemon_flavor_text VARCHAR(255),
    type_id INT NULL,
    set_id INT NULL,
    PRIMARY KEY (pokemon_id),
    FOREIGN KEY (type_id)
        REFERENCES Types (type_id)
            ON DELETE SET NULL,
    FOREIGN KEY (set_id)
        REFERENCES Sets (set_id)
            ON DELETE SET NULL
);

-- Users Table
CREATE TABLE Users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id)
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
),
(
    'Grubbin',
    70,
    'Its natural enemies, like Rookidee, may flee rather than risk getting caught in its large mandibles that can snap thick tree branches.',
    (SELECT type_id FROM Types WHERE type_name = 'Grass'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')
),
(
    'Medicham',
    120,
    'It elegantly avoids attacks with dance-like steps, then launches a devastating blow in the same motion',
    (SELECT type_id FROM Types WHERE type_name = 'Fighting'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')
),
(
    'Tranquill',
    80,
    'It can fly moderately quickly. No matter how far it travels, it can always find its way back to its master and its nest.',
    (SELECT type_id FROM Types WHERE type_name = 'Colorless'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')
),
(
    'Zeraora',
    120,
    'It runs as fast as lightning strikes, shredding its opponents with its high-voltage claws.',
    (SELECT type_id FROM Types WHERE type_name = 'Lightning'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')
),
(
    'Sharpedo',
    120,
    'As soon as it catches the scent of prey, Sharpedo will jet seawater from its backside, hurtling toward the target at 75 mph.',
    (SELECT type_id FROM Types WHERE type_name = 'Water'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')
),
(
    'Great Tusk',
    140,
    'Sightings of this Pokémon have occurred in recent years. The name Great Tusk was taken from a creature listed in a certain book.',
    (SELECT type_id FROM Types WHERE type_name = 'Fighting'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')  
),
(
    'Metagross',
    180,
    'Because the magnetic powers of these Pokémon get stronger in freezing temperatures, Metagross living on snowy mountains are full of energy',
    (SELECT type_id FROM Types WHERE type_name = 'Metal'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')  
),
(
    'Carkol',
    110,
    'The temperature inside its body increases when it experiences strong emotions. It rolls around frantically while spewing flames.',
    (SELECT type_id FROM Types WHERE type_name = 'Fighting'),
    (SELECT set_id FROM Sets WHERE set_name = 'Temporal Forces')  
),
(
    'Glimmora',
    130,
    'When this Pokémon detects danger, it will open up its crystalline petals and fire beams from its conical body.',
    (SELECT type_id FROM Types WHERE type_name = 'Fighting'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')  
),
(
    'Combee',
    50,
    'At night, Combee sleep in a group of about a hundred, packed closely together in a lump.',
    (SELECT type_id FROM Types WHERE type_name = 'Grass'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')  
),
(
    'Gothorita',
    90,
    'This Pokémon will hypnotize children to put them to sleep before carrying them away. Be wary of nights when the starlight is bright.',
    (SELECT type_id FROM Types WHERE type_name = 'Psychic'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')
),
(
    'Flamigo',
    110,
    'This Pokémon apparently ties the base of its neck into a knot so that energy stored in its belly does not escape from its beak.',
    (SELECT type_id FROM Types WHERE type_name = 'Colorless'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')
),
(
    'Bombirdier',
    120,
    'It gathers things up in an apron made from shed feathers added to the Pokémon''s chest feathers, then drops those things from high places for fun.',
    (SELECT type_id FROM Types WHERE type_name = 'Darkness'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')
),
(
    'Glimmet',
    40,
    'It absorbs nutrients from cave walls. The petals it wears are made of crystallized poison.',
    (SELECT type_id FROM Types WHERE type_name = 'Fighting'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')
),
(
    'Shroodle',
    50,
    'Though usually a mellow Pokémon, it will sink its sharp, poison-soaked front teeth into any that anger it, causing paralysis in the object of its ire.',
    (SELECT type_id FROM Types WHERE type_name = 'Darkness'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')
),
(
    'Tinkatink',
    60,
    'It swings its handmade hammer around to protect itself, but the hammer is often stolen by Pokémon that eat metal.',
    (SELECT type_id FROM Types WHERE type_name = 'Psychic'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')
),
(
    'Wattrel',
    60,
    'When its wings catch the wind, the bones within produce electricity. This Pokémon dives into the ocean, catching prey by electrocuting them.',
    (SELECT type_id FROM Types WHERE type_name = 'Lightning'),
    (SELECT set_id FROM Sets WHERE set_name = 'Paldea Evolved')
);
