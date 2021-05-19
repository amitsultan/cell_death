#
# TABLE STRUCTURE FOR: users
#

DROP TABLE IF EXISTS `users`;
CREATE DATABASE IF NOT EXISTS dbo;
USE dbo;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT UNIQUE,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `experiments` (
  `experiment_id` varchar(100) UNIQUE NOT NULL,
  `date` DATE,
  `num_pictures` int NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `user_id` int unsigned NOT NULL,
  `second_ch` varchar(100)
  ,
  PRIMARY KEY (`experiment_id`),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (experiment_id) REFERENCES experiments(experiment_id) ON DELETE CASCADE
);

CREATE TABLE `permissions` (
    `user_id` int unsigned NOT NULL,
    `experiment_id` varchar(100) NOT NULL,
    PRIMARY KEY (`user_id`,`experiment_id`),
    FOREIGN KEY (experiment_id) REFERENCES experiments(experiment_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );


CREATE TABLE `contactRequests` (
  `contactID` int unsigned UNIQUE NOT NULL AUTO_INCREMENT,
  `date` DATE,
  `email` varchar(255) NOT NULL,
  `name` varchar(200) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` varchar(1000) NOT NULL
);

