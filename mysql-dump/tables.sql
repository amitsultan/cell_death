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

INSERT INTO dbo.users (first_name,last_name,email,password) VALUES('amit','sultan','amitsul@post.bgu.ac.il','123456aA!');
INSERT INTO dbo.users (first_name,last_name,email,password) VALUES('yarin','bokobza','yarinbo@post.bgu.ac.il','123456aA!');
INSERT INTO dbo.users (first_name,last_name,email,password) VALUES('liat','cohen','liatco@post.bgu.ac.il','123456aA!');
INSERT INTO dbo.users (first_name,last_name,email,password) VALUES('hayim','reyes','haimrey@post.bgu.ac.il','123456aA!');
