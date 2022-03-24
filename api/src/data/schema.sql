CREATE DATABASE IF NOT EXISTS `meal`;

CREATE TABLE IF NOT EXISTS `meal`.`ingredient` (
    `id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `serving_size` INT unsigned NOT NULL DEFAULT 0,
    `serving_unit` ENUM('gram','ounce','teaspoon','tablespoon') NOT NULL DEFAULT 'gram',
    `calories_per_serving` INT unsigned NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `uuid` (`uuid`),
    KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `meal`.`dish` (
    `id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `portion` INT unsigned NOT NULL DEFAULT 0,
    `portion_unit` ENUM('gram','ounce') NOT NULL DEFAULT 'gram',
    PRIMARY KEY (`id`),
    KEY `uuid` (`uuid`),
    KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `meal`.`dish_ingredient` (
    `dish_id` BIGINT unsigned NOT NULL,
    `ingredient_id` BIGINT unsigned NOT NULL,
    `number_servings` INT unsigned NOT NULL DEFAULT 0,
    PRIMARY KEY (`dish_id`,`ingredient_id`),
    FOREIGN KEY (`dish_id`)
        REFERENCES `dish` (`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`ingredient_id`)
        REFERENCES `ingredient` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;