-- MariaDB dump 10.17  Distrib 10.4.14-MariaDB, for Linux (x86_64)
--
-- Host: faure    Database: cs314
-- ------------------------------------------------------
-- Server version	10.3.22-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `world`
--

DROP TABLE IF EXISTS `world`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `world` (
  `index` int(11) NOT NULL,
  `id` varchar(30) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `latitude` varchar(1000) DEFAULT NULL,
  `longitude` varchar(1000) DEFAULT NULL,
  `altitude` varchar(1000) DEFAULT NULL,
  `continent` varchar(1000) DEFAULT NULL,
  `iso_country` varchar(1000) DEFAULT NULL,
  `iso_region` varchar(1000) DEFAULT NULL,
  `municipality` varchar(1000) DEFAULT NULL,
  `scheduled_service` varchar(1000) DEFAULT NULL,
  `gps_code` varchar(1000) DEFAULT NULL,
  `iata_code` varchar(1000) DEFAULT NULL,
  `local_code` varchar(1000) DEFAULT NULL,
  `home_link` varchar(1000) DEFAULT NULL,
  `wikipedia_link` varchar(1000) DEFAULT NULL,
  `keywords` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `airports_name_idx` (`name`),
  FULLTEXT KEY `airpots_municipality_idx` (`municipality`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `world`
--
-- WHERE:  name like '%Denver%'

LOCK TABLES `world` WRITE;
/*!40000 ALTER TABLE `world` DISABLE KEYS */;
INSERT INTO `world` VALUES (16889,'CO35','heliport','Denver Health Heliport','39.727500915527344','-104.99099731445312','5212','NA','US','US-CO','Denver','no','CO35',NULL,'CO35',NULL,NULL,NULL),(16893,'CO39','heliport','Denver Federal Center Helistop','39.72330093383789','-105.11100006103516','5550','NA','US','US-CO','Denver','no','CO39',NULL,'CO39',NULL,NULL,NULL),(16895,'CO41','heliport','Denver Police Department-District 3 Heliport','39.6875','-104.95999908447266','5340','NA','US','US-CO','Denver','no','CO41',NULL,'CO41',NULL,NULL,NULL),(16952,'CO99','heliport','Denver Artcc Heliport','40.187198638916016','-105.12699890136719','5057','NA','US','US-CO','Longmont','no','CO99',NULL,'CO99',NULL,NULL,NULL),(3486,'KDEN','large_airport','Denver International Airport','39.861698150635','-104.672996521','5431','NA','US','US-CO','Denver','yes','KDEN','DEN','DEN','http://www.flydenver.com/','http://en.wikipedia.org/wiki/Denver_International_Airport','DVX, KVDX'),(19703,'KE57','small_airport','Denver City Airport','32.975101470947','-102.84200286865','3575','NA','US','US-TX','Denver City','no','E57',NULL,'E57',NULL,NULL,NULL),(28113,'X-KDEN','closed','Denver Stapleton International Airport','39.774200439453125','-104.87899780273438','5333','NA','US','US-CO','Denver','no',NULL,NULL,NULL,NULL,'http://en.wikipedia.org/wiki/Stapleton_International_Airport','DEN KDEN');
/*!40000 ALTER TABLE `world` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-22 15:34:19
