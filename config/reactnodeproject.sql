-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 12, 2025 at 04:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reactnodeproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `abnormalf`
--

CREATE TABLE `abnormalf` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `plate` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('auto-approved','pending-approval','rejected','approved') DEFAULT 'auto-approved',
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abnormalf`
--

INSERT INTO `abnormalf` (`id`, `name`, `plate`, `amount`, `user_id`, `created_at`, `status`, `approved_at`, `rejected_at`) VALUES
(1, 'Habib', '5478126', 125.00, 2, '2025-02-05 18:45:27', 'auto-approved', NULL, NULL),
(5, 'AhmedChanged', '6452126', 33.00, 2, '2025-02-05 20:50:44', 'auto-approved', NULL, NULL),
(7, 'Brhom', '8452671', 33.00, 3, '2025-02-05 21:02:59', 'auto-approved', NULL, NULL),
(9, 'Shadi Dabous', '9885319', 150.00, 5, '2025-02-07 15:24:38', 'auto-approved', NULL, NULL),
(11, 'Amr Wattad', '9885319', 250.00, 5, '2025-02-07 15:33:31', 'approved', NULL, NULL),
(12, 'Fawaz Wattad', '8120319', 349.00, 5, '2025-02-07 15:39:34', 'approved', '2025-02-07 15:40:15', NULL),
(13, 'Neven Wattad', '4120319', 349.00, 4, '2025-02-07 15:40:45', 'rejected', NULL, '2025-02-07 15:41:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `status` enum('active','not active') NOT NULL DEFAULT 'active',
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `phone` varchar(20) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `business_name`, `status`, `email`, `password_hash`, `role`, `phone`, `contact`, `created_at`, `updated_at`, `is_deleted`) VALUES
(1, 'TechCorp', 'active', 'user1@example.com', 'hashedpassword1', 'user', '1234567890', 'John Doe', '2025-02-05 18:25:39', '2025-02-07 14:15:07', 0),
(2, 'FuelPlus', 'active', 'user2@example.com', 'hashedpassword2', 'user', '0987654321', 'Jane Smith', '2025-02-05 18:25:39', '2025-02-07 14:15:07', 0),
(3, 'None', 'active', 'admin@example.com', 'hashedpasswordadmin', 'admin', '1122334455', 'Ibraheem Watad', '2025-02-05 18:25:39', '2025-02-07 14:15:07', 0),
(4, 'Station Management', 'active', 'ibraheemwatad35@gmail.com', '$2b$10$2GHSyikoRoNg/WEIvQCrB.Oe2uSH4UrJoCMszVFYET4IS6ggFKcFK', 'admin', '0503012581', 'Ibraheem Watad', '2025-02-07 14:41:03', '2025-02-07 14:41:03', 0),
(5, 'Trucks Company', 'active', 'mahmodtato@gmail.com', '$2b$10$kX7T7uFKcB4fiyrOqIPyD.WiKuof/UtI9I7/Y3d2QLX55edMHfs9a', 'user', '0584736952', 'Mahmod Tato', '2025-02-07 15:08:11', '2025-02-07 15:08:11', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abnormalf`
--
ALTER TABLE `abnormalf`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abnormalf`
--
ALTER TABLE `abnormalf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `abnormalf`
--
ALTER TABLE `abnormalf`
  ADD CONSTRAINT `abnormalf_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
