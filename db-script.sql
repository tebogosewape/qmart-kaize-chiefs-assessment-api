CREATE DATABASE `chiefs-assessment-db` /*!40100 COLLATE 'latin1_swedish_ci' */;

CREATE TABLE `fan-comments` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`comment` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`created_at` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;


CREATE TABLE `fan-comment-reply` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`comment_id` INT(11) NULL DEFAULT NULL,
	`fan_name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`fan_reply` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`created_at` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
