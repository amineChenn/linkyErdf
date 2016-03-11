-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 04 Février 2016 à 00:03
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `projeterdf_bdd`
--

-- --------------------------------------------------------

--
-- Structure de la table `anomalie`
--

CREATE TABLE IF NOT EXISTS `anomalie` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` datetime NOT NULL,
  `Provenance` varchar(45) NOT NULL,
  `IdTypeAnomalie` int(11) NOT NULL,
  `IdOptCompteur` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IdOptCompteur_idx` (`IdOptCompteur`),
  KEY `IdTypeAnomalie_idx` (`IdTypeAnomalie`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Contenu de la table `anomalie`
--

INSERT INTO `anomalie` (`Id`, `Date`, `Provenance`, `IdTypeAnomalie`, `IdOptCompteur`) VALUES
(1, '2016-01-24 00:00:00', 'Panne ERDF', 2, 2147483647),
(2, '2016-01-25 00:00:00', 'Disjoncteur', 4, 2147483647),
(3, '2016-01-26 00:00:00', 'Panne ERDF', 3, 2147483647),
(4, '2016-01-27 00:00:00', 'Disjoncteur', 1, 2147483647),
(5, '2016-01-28 00:00:00', 'Disjoncteur', 1, 2147483647),
(6, '2016-01-29 00:00:00', 'Panne ERDF', 2, 2147483647),
(7, '2016-01-30 00:00:00', 'Disjoncteur', 2, 2147483647),
(8, '2016-01-31 00:00:00', 'Panne ERDF', 4, 2147483647),
(9, '2016-02-01 00:00:00', 'Panne ERDF', 3, 2147483647),
(10, '2016-02-02 00:00:00', 'Disjoncteur', 1, 2147483647),
(11, '2016-02-03 00:00:00', 'Panne ERDF', 2, 2147483647),
(12, '2016-02-04 15:11:23', 'Disjoncteur', 2, 2147483647),
(13, '2016-02-05 13:12:11', 'Disjoncteur', 2, 2147483647),
(14, '2016-02-06 07:32:57', 'Panne ERDF', 4, 2147483647);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `anomalie`
--
ALTER TABLE `anomalie`
  ADD CONSTRAINT `IdOptCompteur` FOREIGN KEY (`IdOptCompteur`) REFERENCES `optioncompteur` (`IdOptCompteur`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `IdTypeAnomalie` FOREIGN KEY (`IdTypeAnomalie`) REFERENCES `typeanomalie` (`IdTypeAnomalie`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
