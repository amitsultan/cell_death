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
  `email` varchar(255) NOT NULL,
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
  PRIMARY KEY (`experiment_id`),
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

INSERT INTO dbo.users (first_name,last_name,email,password) VALUES('amit','sultan','amitsul@post.bgu.ac.il','123456aA!');
INSERT INTO dbo.users (first_name,last_name,email,password) VALUES('yarin','hayun','yarinbo@post.bgu.ac.il','123456aA!');
INSERT INTO dbo.users (,last_name,emaifirst_namel,password) VALUES('liat','cohen','liatp@post.bgu.ac.il','123456aA!');
INSERT INTO dbo.users (first_name,last_name,email,password) VALUES('haim','reyes','reyes@post.bgu.ac.il','123456aA!');

INSERT INTO dbo.experiments (experiment_id,date,num_pictures,width,height,user_id) VALUES('20180514','2018-05-14','60','1392','1040','1');
