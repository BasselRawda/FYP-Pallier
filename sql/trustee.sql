-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 25, 2018 at 02:27 AM
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
-- Database: `trustee`
--

-- --------------------------------------------------------

--
-- Table structure for table `commons`
--

DROP TABLE IF EXISTS `commons`;
CREATE TABLE IF NOT EXISTS `commons` (
  `electionid` varchar(30) NOT NULL,
  `voterid` int(11) NOT NULL AUTO_INCREMENT,
  `sharecommon` int(11) NOT NULL,
  `voted` tinyint(1) NOT NULL,
  PRIMARY KEY (`voterid`)
) ENGINE=MyISAM AUTO_INCREMENT=1857418 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `commons`
--

INSERT INTO `commons` (`electionid`, `voterid`, `sharecommon`, `voted`) VALUES
('1543097339383', 1134078, 720591, 1),
('1543097339383', 808204, 1891479, 1),
('1543097339383', 1792523, 1332479, 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
