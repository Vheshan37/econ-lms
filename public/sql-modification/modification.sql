-- MySQL Workbench Synchronization
-- Generated: 2026-05-29 14:18
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: laksh

USE `econ_lms`;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER TABLE `econ_lms`.`resource` 
ADD COLUMN `year` YEAR NULL DEFAULT NULL AFTER `updatedAt`,
ADD COLUMN `month` INT(11) NULL DEFAULT NULL AFTER `year`;

CREATE TABLE IF NOT EXISTS `econ_lms`.`student_payments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `year` YEAR NOT NULL,
  `month` INT(11) NOT NULL,
  `fee` DECIMAL(19,2) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `student_id` VARCHAR(191) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_student_payments_student1_idx` (`student_id` ASC) VISIBLE,
  CONSTRAINT `fk_student_payments_student1`
    FOREIGN KEY (`student_id`)
    REFERENCES `econ_lms`.`student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `econ_lms`.`online_classes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `youtube_link` TEXT NULL DEFAULT NULL,
  `youtube_time` DATETIME NULL DEFAULT NULL,
  `zoom_link` TEXT NULL DEFAULT NULL,
  `zoom_time` DATETIME NULL DEFAULT NULL,
  `zoom_id` VARCHAR(20) NULL DEFAULT NULL,
  `zoom_passcode` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
