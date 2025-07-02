-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2025 at 04:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_kasir_apps`
--

-- --------------------------------------------------------

--
-- Table structure for table `detailpembelian_t`
--

CREATE TABLE `detailpembelian_t` (
  `id` int(11) NOT NULL,
  `pembelian_id` int(11) DEFAULT NULL,
  `produk_id` int(11) DEFAULT NULL,
  `harga_satuan` double NOT NULL,
  `jumlah_produk` int(11) NOT NULL,
  `harga_produk` double NOT NULL,
  `total_harga` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `detailpembelian_t`
--

INSERT INTO `detailpembelian_t` (`id`, `pembelian_id`, `produk_id`, `harga_satuan`, `jumlah_produk`, `harga_produk`, `total_harga`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 150000, 2, 150000, 300000, '2025-06-16 13:55:48.508', '2025-06-16 13:55:48.508', NULL),
(2, 1, 2, 10000, 3, 10000, 30000, '2025-06-16 13:55:48.508', '2025-06-16 13:55:48.508', NULL),
(3, 2, 1, 150000, 5, 150000, 750000, '2025-06-18 12:17:54.241', '2025-06-18 12:17:54.241', NULL),
(4, 3, 2, 10000, 3, 10000, 30000, '2025-06-18 12:18:42.253', '2025-06-18 12:18:42.253', NULL),
(5, 3, 1, 150000, 2, 150000, 300000, '2025-06-18 12:18:42.253', '2025-06-18 12:18:42.253', NULL),
(6, 4, 1, 150000, 3, 150000, 450000, '2025-06-18 12:19:08.220', '2025-06-18 12:19:08.220', NULL),
(7, 5, 1, 150000, 4, 150000, 600000, '2025-06-18 12:24:51.884', '2025-06-18 12:24:51.884', NULL),
(8, 6, 1, 150000, 2, 150000, 300000, '2025-06-18 13:04:15.510', '2025-06-18 13:04:15.510', NULL),
(9, 7, 1, 150000, 6, 150000, 900000, '2025-06-18 15:16:45.723', '2025-06-18 15:16:45.723', NULL),
(10, 7, 2, 10000, 4, 10000, 40000, '2025-06-18 15:16:45.723', '2025-06-18 15:16:45.723', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `detailpenjualan_t`
--

CREATE TABLE `detailpenjualan_t` (
  `id` int(11) NOT NULL,
  `penjualan_id` int(11) DEFAULT NULL,
  `produk_id` int(11) DEFAULT NULL,
  `harga_satuan` double NOT NULL,
  `jumlah_produk` int(11) NOT NULL,
  `harga_produk` double NOT NULL,
  `total_harga` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hargaproduk_m`
--

CREATE TABLE `hargaproduk_m` (
  `id` int(11) NOT NULL,
  `produk_id` int(11) DEFAULT NULL,
  `harga_beli` double NOT NULL,
  `harga_jual` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hargaproduk_m`
--

INSERT INTO `hargaproduk_m` (`id`, `produk_id`, `harga_beli`, `harga_jual`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 200000, 150000, '2025-04-28 13:29:48.599', '2025-04-28 13:29:48.599', NULL),
(2, 2, 5000, 10000, '2025-06-16 13:49:37.281', '2025-06-16 13:49:37.281', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kategoriproduk_m`
--

CREATE TABLE `kategoriproduk_m` (
  `id` int(11) NOT NULL,
  `kode_kategori` varchar(191) NOT NULL,
  `nama_kategori` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategoriproduk_m`
--

INSERT INTO `kategoriproduk_m` (`id`, `kode_kategori`, `nama_kategori`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'KAT-0001', 'Perabotan Rumah Tangga', '2025-04-20 14:15:28.195', '2025-04-20 14:15:28.195', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mutasistok_m`
--

CREATE TABLE `mutasistok_m` (
  `id` int(11) NOT NULL,
  `produk_id` int(11) DEFAULT NULL,
  `tipe_mutasi` varchar(191) NOT NULL,
  `jumlah_mutasi` int(11) NOT NULL,
  `keterangan_mutasi` varchar(191) NOT NULL,
  `pegawai_id` int(11) DEFAULT NULL,
  `satuan_produk_id` int(11) DEFAULT NULL,
  `tanggal_kadaluarsa` datetime(3) DEFAULT NULL,
  `tanggal_mutasi` datetime(3) NOT NULL,
  `nomor_mutasi` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mutasistok_m`
--

INSERT INTO `mutasistok_m` (`id`, `produk_id`, `tipe_mutasi`, `jumlah_mutasi`, `keterangan_mutasi`, `pegawai_id`, `satuan_produk_id`, `tanggal_kadaluarsa`, `tanggal_mutasi`, `nomor_mutasi`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'MASUK', 2, 'Pembelian 123123', NULL, NULL, NULL, '2025-06-16 13:55:48.000', 'MT-PB-1-1', '2025-06-16 13:55:48.532', '2025-06-16 13:55:48.532', NULL),
(2, 2, 'MASUK', 3, 'Pembelian 123123', NULL, NULL, NULL, '2025-06-16 13:55:48.000', 'MT-PB-1-2', '2025-06-16 13:55:48.532', '2025-06-16 13:55:48.532', NULL),
(3, 1, 'MASUK', 5, 'Pembelian 123', NULL, NULL, NULL, '2025-06-18 12:17:54.000', 'MT-PB-2-1', '2025-06-18 12:17:54.354', '2025-06-18 12:17:54.354', NULL),
(4, 2, 'MASUK', 3, 'Pembelian 123', NULL, NULL, NULL, '2025-06-18 12:18:42.000', 'MT-PB-3-1', '2025-06-18 12:18:42.275', '2025-06-18 12:18:42.275', NULL),
(5, 1, 'MASUK', 2, 'Pembelian 123', NULL, NULL, NULL, '2025-06-18 12:18:42.000', 'MT-PB-3-2', '2025-06-18 12:18:42.275', '2025-06-18 12:18:42.275', NULL),
(6, 1, 'MASUK', 3, 'Pembelian 123', NULL, NULL, NULL, '2025-06-18 12:19:08.000', 'MT-PB-4-1', '2025-06-18 12:19:08.243', '2025-06-18 12:19:08.243', NULL),
(7, 1, 'MASUK', 4, 'Pembelian 123', NULL, NULL, NULL, '2025-06-18 12:24:51.000', 'MT-PB-5-1', '2025-06-18 12:24:51.930', '2025-06-18 12:24:51.930', NULL),
(8, 1, 'MASUK', 2, 'Pembelian 123', NULL, NULL, NULL, '2025-06-18 13:04:15.000', 'MT-PB-6-1', '2025-06-18 13:04:15.593', '2025-06-18 13:04:15.593', NULL),
(9, 1, 'MASUK', 6, 'Pembelian 09887', NULL, NULL, NULL, '2025-06-18 15:16:45.000', 'MT-PB-7-1', '2025-06-18 15:16:45.805', '2025-06-18 15:16:45.805', NULL),
(10, 2, 'MASUK', 4, 'Pembelian 09887', NULL, NULL, NULL, '2025-06-18 15:16:45.000', 'MT-PB-7-2', '2025-06-18 15:16:45.805', '2025-06-18 15:16:45.805', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pegawai_m`
--

CREATE TABLE `pegawai_m` (
  `id` int(11) NOT NULL,
  `nip_pegawai` varchar(191) NOT NULL,
  `nama_pegawai` varchar(191) NOT NULL,
  `tanggal_lahir` datetime(3) NOT NULL,
  `jenis_kelamin` varchar(191) NOT NULL,
  `alamat_pegawai` varchar(191) NOT NULL,
  `nomor_telepon_pegawai` varchar(191) NOT NULL,
  `email_pegawai` varchar(191) NOT NULL,
  `jabatan_pegawai` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `is_aktif` tinyint(1) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pegawai_m`
--

INSERT INTO `pegawai_m` (`id`, `nip_pegawai`, `nama_pegawai`, `tanggal_lahir`, `jenis_kelamin`, `alamat_pegawai`, `nomor_telepon_pegawai`, `email_pegawai`, `jabatan_pegawai`, `password`, `is_aktif`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '123456', 'Anand', '1999-02-03 21:25:10.000', 'Laki-Laki', 'Surabaya', '09876543123', 'anand@anand.com', 'Staff', 'aaa', 1, '0000-00-00 00:00:00.000', '0000-00-00 00:00:00.000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran_t`
--

CREATE TABLE `pembayaran_t` (
  `id` int(11) NOT NULL,
  `penjualan_id` int(11) NOT NULL,
  `tanggal_bayar` datetime(3) NOT NULL,
  `jumlah_bayar` double NOT NULL,
  `metode_bayar` varchar(191) NOT NULL,
  `nomor_referensi` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembelian_t`
--

CREATE TABLE `pembelian_t` (
  `id` int(11) NOT NULL,
  `nomor_pembelian` varchar(191) NOT NULL,
  `tanggal_pembelian` datetime(3) NOT NULL,
  `status_pembelian` varchar(191) NOT NULL,
  `total_harga` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `nomor_faktur` varchar(191) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pembelian_t`
--

INSERT INTO `pembelian_t` (`id`, `nomor_pembelian`, `tanggal_pembelian`, `status_pembelian`, `total_harga`, `created_at`, `updated_at`, `deleted_at`, `nomor_faktur`, `supplier_id`) VALUES
(1, '123123', '2025-06-16 00:00:00.000', 'SELESAI', 330000, '2025-06-16 13:55:48.508', '2025-06-16 13:55:48.508', NULL, '123123', 1),
(2, '123', '2025-03-12 00:00:00.000', 'SELESAI', 750000, '2025-06-18 12:17:54.241', '2025-06-18 12:17:54.241', NULL, '123', 1),
(3, '123', '2025-06-18 00:00:00.000', 'SELESAI', 330000, '2025-06-18 12:18:42.253', '2025-06-18 12:18:42.253', NULL, '123', 1),
(4, '123', '2025-06-18 00:00:00.000', 'SELESAI', 450000, '2025-06-18 12:19:08.220', '2025-06-18 12:19:08.220', NULL, '123', 1),
(5, '123', '2025-06-18 00:00:00.000', 'SELESAI', 600000, '2025-06-18 12:24:51.884', '2025-06-18 12:24:51.884', NULL, '123', 2),
(6, '123', '2025-06-18 00:00:00.000', 'SELESAI', 300000, '2025-06-18 13:04:15.510', '2025-06-18 13:04:15.510', NULL, '123', 1),
(7, '09887', '2025-06-18 00:00:00.000', 'SELESAI', 940000, '2025-06-18 15:16:45.723', '2025-06-18 15:16:45.723', NULL, '09871', 1);

-- --------------------------------------------------------

--
-- Table structure for table `penjualan_t`
--

CREATE TABLE `penjualan_t` (
  `id` int(11) NOT NULL,
  `nomor_penjualan` varchar(191) NOT NULL,
  `tanggal_penjualan` datetime(3) NOT NULL,
  `status_penjualan` varchar(191) NOT NULL,
  `total_harga` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produk_m`
--

CREATE TABLE `produk_m` (
  `id` int(11) NOT NULL,
  `kategori_id` int(11) DEFAULT NULL,
  `satuan_produk_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `kode_produk` varchar(191) NOT NULL,
  `nama_produk` varchar(191) NOT NULL,
  `deskripsi_produk` varchar(191) DEFAULT NULL,
  `gambar_produk` varchar(191) DEFAULT NULL,
  `is_aktif` tinyint(1) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produk_m`
--

INSERT INTO `produk_m` (`id`, `kategori_id`, `satuan_produk_id`, `supplier_id`, `kode_produk`, `nama_produk`, `deskripsi_produk`, `gambar_produk`, `is_aktif`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 'PROD-0001', 'Panci Besar', 'Panci Besar', NULL, 1, '2025-04-20 14:21:45.968', '2025-04-20 14:21:45.968', NULL),
(2, 1, 1, 1, 'asdasd', 'Produk 2', '123', NULL, 1, '2025-06-16 13:48:49.369', '2025-06-16 13:48:49.369', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `satuanproduk_m`
--

CREATE TABLE `satuanproduk_m` (
  `id` int(11) NOT NULL,
  `kode_satuan` varchar(191) NOT NULL,
  `nama_satuan` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `satuanproduk_m`
--

INSERT INTO `satuanproduk_m` (`id`, `kode_satuan`, `nama_satuan`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'SAT-0001', 'PCS', '2025-04-20 14:15:04.385', '2025-04-20 14:15:04.385', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stokproduk_m`
--

CREATE TABLE `stokproduk_m` (
  `id` int(11) NOT NULL,
  `produk_id` int(11) DEFAULT NULL,
  `jumlah_stok` int(11) NOT NULL,
  `minimal_stok` int(11) NOT NULL,
  `maksimal_stok` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stokproduk_m`
--

INSERT INTO `stokproduk_m` (`id`, `produk_id`, `jumlah_stok`, `minimal_stok`, `maksimal_stok`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 24, 0, 0, '2025-06-16 13:55:48.000', '2025-06-18 15:16:45.000', NULL),
(2, 2, 10, 0, 0, '2025-06-16 13:55:48.000', '2025-06-18 15:16:45.000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `supplier_m`
--

CREATE TABLE `supplier_m` (
  `id` int(11) NOT NULL,
  `nama_supplier` varchar(191) NOT NULL,
  `alamat_supplier` varchar(191) NOT NULL,
  `nomor_telepon_supplier` varchar(191) NOT NULL,
  `is_aktif` tinyint(1) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `kode_supplier` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supplier_m`
--

INSERT INTO `supplier_m` (`id`, `nama_supplier`, `alamat_supplier`, `nomor_telepon_supplier`, `is_aktif`, `created_at`, `updated_at`, `deleted_at`, `kode_supplier`) VALUES
(1, 'PT Dunia Perabot', 'Karang Lor Surabaya', '08124567523', 1, '2025-04-20 14:16:37.100', '2025-04-20 14:16:37.100', NULL, 'SUPP-0001'),
(2, 'PT. Rumah Tangga', 'Surabaya Jawa Timur', '0141086240', 1, '2025-04-20 14:21:08.133', '2025-04-20 14:21:08.133', NULL, 'SUPP-0002');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1cb9f48b-0cf4-4629-a673-36c62cec836f', '002d767628b8801240ff1fc751a01de0efc1b1d58a2fdc99395eebfc85e02769', '2025-04-28 13:27:51.632', '20250428132751_add_pembelian_nomor_faktur', NULL, NULL, '2025-04-28 13:27:51.626', 1),
('72209ef5-b53e-44ca-b03f-35666b82dc80', '41df8b6e910a1c7b7edb18b8b8721082d7f1a1f073bce392c8d5cf9af23c8393', '2025-04-20 13:59:03.865', '20250420135903_update_model_stok', NULL, NULL, '2025-04-20 13:59:03.786', 1),
('7b9e3fbd-4c4e-4b96-8598-1c2b07c1b1a5', 'b614c55983b5bf65e33d8947a8ee89f40ad9078c7828309c1f950ca039564c80', '2025-04-20 13:59:02.676', '20241228100706_init_migration', NULL, NULL, '2025-04-20 13:59:02.641', 1),
('869a83c3-4db6-4470-97da-a13ad9e76732', '5fc2cc7837121b7d1bfab44205c42d8fa41ef1f0ba5fa8a789b250f76f935fe3', '2025-04-20 13:59:02.906', '20250101112021_init_migration', NULL, NULL, '2025-04-20 13:59:02.676', 1),
('8cec9854-44a6-4da0-a12c-5ed52fe6add8', '122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec', '2025-04-20 13:59:02.908', '20250101112339_ubah_tipe_kolom', NULL, NULL, '2025-04-20 13:59:02.907', 1),
('9077330a-a8f0-4fe3-8294-58074aca49bb', '322dfdd9b08c8d4c55e8e41645333e34e8e2d3650a8eaaa8e51ede772d2fdca4', '2025-04-20 13:59:02.978', '20250210162756_penambahan', NULL, NULL, '2025-04-20 13:59:02.973', 1),
('bfbccf38-247e-4c04-b647-fbd14afcad0b', '67bb14bea376cb00fb04667255cc66629a10ef152926b7d233b1ecf29a295a16', '2025-04-20 13:59:02.971', '20250210150049_ubah_supplier', NULL, NULL, '2025-04-20 13:59:02.934', 1),
('d823c36f-3867-4071-b5b2-3407d51d66fb', 'a2bd7e6399af7de048e4705339068088d69ed71f7a57a82ff5c059f8628b2fbf', '2025-04-20 13:59:02.934', '20250101112419_ubah_tipe_kolom', NULL, NULL, '2025-04-20 13:59:02.909', 1),
('e4af62dc-9e5f-45de-88b4-cf17babcdb11', 'a9b437bcdfc6c18cefcab1fb60a71dd8142447e94a70ad5bb61c44a2cc33b444', '2025-04-28 13:20:45.200', '20250428132045_add_pembelian_and_detail_pembelian', NULL, NULL, '2025-04-28 13:20:45.105', 1),
('f3077f0a-60a5-43b7-9f71-4bc8d95cad50', '512a5b796ae251223778358b4e855e99c99c6f448017016a03f9a20dd96229f3', '2025-04-20 14:40:31.568', '20250420144031_add_unique_to_produk_id', NULL, NULL, '2025-04-20 14:40:31.559', 1),
('fce26975-ed8f-4970-a89a-5b762f6caf9a', '40c182b8643f5fa9abe852a069984deb4e4e9c3ebd8003739a8635a58a66391d', '2025-04-29 12:07:31.612', '20250429120731_edit_supplier_id_on_pembelian_table', NULL, NULL, '2025-04-29 12:07:31.573', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detailpembelian_t`
--
ALTER TABLE `detailpembelian_t`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detailpembelian_t_pembelian_id_fkey` (`pembelian_id`),
  ADD KEY `detailpembelian_t_produk_id_fkey` (`produk_id`);

--
-- Indexes for table `detailpenjualan_t`
--
ALTER TABLE `detailpenjualan_t`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detailpenjualan_t_penjualan_id_fkey` (`penjualan_id`),
  ADD KEY `detailpenjualan_t_produk_id_fkey` (`produk_id`);

--
-- Indexes for table `hargaproduk_m`
--
ALTER TABLE `hargaproduk_m`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hargaproduk_m_produk_id_fkey` (`produk_id`);

--
-- Indexes for table `kategoriproduk_m`
--
ALTER TABLE `kategoriproduk_m`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mutasistok_m`
--
ALTER TABLE `mutasistok_m`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mutasistok_m_produk_id_fkey` (`produk_id`),
  ADD KEY `mutasistok_m_pegawai_id_fkey` (`pegawai_id`),
  ADD KEY `mutasistok_m_satuan_produk_id_fkey` (`satuan_produk_id`);

--
-- Indexes for table `pegawai_m`
--
ALTER TABLE `pegawai_m`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pembayaran_t`
--
ALTER TABLE `pembayaran_t`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pembayaran_t_penjualan_id_fkey` (`penjualan_id`);

--
-- Indexes for table `pembelian_t`
--
ALTER TABLE `pembelian_t`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pembelian_t_supplier_id_fkey` (`supplier_id`);

--
-- Indexes for table `penjualan_t`
--
ALTER TABLE `penjualan_t`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produk_m`
--
ALTER TABLE `produk_m`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produk_m_kategori_id_fkey` (`kategori_id`),
  ADD KEY `produk_m_satuan_produk_id_fkey` (`satuan_produk_id`),
  ADD KEY `produk_m_supplier_id_fkey` (`supplier_id`);

--
-- Indexes for table `satuanproduk_m`
--
ALTER TABLE `satuanproduk_m`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stokproduk_m`
--
ALTER TABLE `stokproduk_m`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stokproduk_m_produk_id_key` (`produk_id`);

--
-- Indexes for table `supplier_m`
--
ALTER TABLE `supplier_m`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detailpembelian_t`
--
ALTER TABLE `detailpembelian_t`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `detailpenjualan_t`
--
ALTER TABLE `detailpenjualan_t`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hargaproduk_m`
--
ALTER TABLE `hargaproduk_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kategoriproduk_m`
--
ALTER TABLE `kategoriproduk_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mutasistok_m`
--
ALTER TABLE `mutasistok_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pegawai_m`
--
ALTER TABLE `pegawai_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pembayaran_t`
--
ALTER TABLE `pembayaran_t`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembelian_t`
--
ALTER TABLE `pembelian_t`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `penjualan_t`
--
ALTER TABLE `penjualan_t`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produk_m`
--
ALTER TABLE `produk_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `satuanproduk_m`
--
ALTER TABLE `satuanproduk_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stokproduk_m`
--
ALTER TABLE `stokproduk_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `supplier_m`
--
ALTER TABLE `supplier_m`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detailpembelian_t`
--
ALTER TABLE `detailpembelian_t`
  ADD CONSTRAINT `detailpembelian_t_pembelian_id_fkey` FOREIGN KEY (`pembelian_id`) REFERENCES `pembelian_t` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detailpembelian_t_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `detailpenjualan_t`
--
ALTER TABLE `detailpenjualan_t`
  ADD CONSTRAINT `detailpenjualan_t_penjualan_id_fkey` FOREIGN KEY (`penjualan_id`) REFERENCES `penjualan_t` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detailpenjualan_t_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hargaproduk_m`
--
ALTER TABLE `hargaproduk_m`
  ADD CONSTRAINT `hargaproduk_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `mutasistok_m`
--
ALTER TABLE `mutasistok_m`
  ADD CONSTRAINT `mutasistok_m_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mutasistok_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mutasistok_m_satuan_produk_id_fkey` FOREIGN KEY (`satuan_produk_id`) REFERENCES `satuanproduk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pembayaran_t`
--
ALTER TABLE `pembayaran_t`
  ADD CONSTRAINT `pembayaran_t_penjualan_id_fkey` FOREIGN KEY (`penjualan_id`) REFERENCES `penjualan_t` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `pembelian_t`
--
ALTER TABLE `pembelian_t`
  ADD CONSTRAINT `pembelian_t_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `produk_m`
--
ALTER TABLE `produk_m`
  ADD CONSTRAINT `produk_m_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriproduk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `produk_m_satuan_produk_id_fkey` FOREIGN KEY (`satuan_produk_id`) REFERENCES `satuanproduk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `produk_m_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stokproduk_m`
--
ALTER TABLE `stokproduk_m`
  ADD CONSTRAINT `stokproduk_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
