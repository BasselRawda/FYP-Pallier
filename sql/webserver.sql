-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 19, 2018 at 11:52 AM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webserver`
--

-- --------------------------------------------------------

--
-- Table structure for table `elections`
--

DROP TABLE IF EXISTS `elections`;
CREATE TABLE IF NOT EXISTS `elections` (
  `electionid` varchar(30) NOT NULL,
  `electionName` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `recipients` varchar(7000) NOT NULL,
  `password` varchar(72) NOT NULL,
  `option0` varchar(20) NOT NULL,
  `option1` varchar(20) NOT NULL,
  `question` varchar(60) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  PRIMARY KEY (`electionid`),
  UNIQUE KEY `Token` (`electionid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `elections`
--

INSERT INTO `elections` (`electionid`, `electionName`, `email`, `recipients`, `password`, `option0`, `option1`, `question`, `startdate`, `enddate`) VALUES
('1542626057323', 'hello', 'basselrawda@hotmail.com', 'm.mmaster@hotmail.com', '$2b$10$IYWks5Lf283zntUcAttmge66OwzqWaZ8EX4V3OSYqa2n45WzL7KFG', 'boom boom', 'paw paw', 'what does the fox say?', '2018-11-19', '2018-11-21'),
('1542626388536', 'hello1', 'basselrawda@hotmail.com', 'm.mmaster@hotmail.com', '$2b$10$NEnqv3SdEmo0JxNDH3x1aO1x9d8Kii/Gf1xRWnwlEj0SZ.v1eaG6a', 'fifaa', 'fifaaa', 'fifa', '2018-11-19', '2018-11-20'),
('1542626559460', 'heah', 'basselrawda@hotmail.com', 'm.mmaster@hotmail.com', '$2b$10$a0VBHjuG5aApTgX3794x8OYQSIGC5/J9yZF5ftgIh1QcbZN4LKurq', 'hehe', 'hehehe', 'he', '2018-11-19', '2018-11-20');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
