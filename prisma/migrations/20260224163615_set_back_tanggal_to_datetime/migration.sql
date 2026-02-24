-- AlterTable
ALTER TABLE `penerimaanbarang_t` MODIFY `tanggal_penerimaan` DATETIME(3) NOT NULL,
    MODIFY `tanggal_faktur` DATETIME(3) NULL,
    MODIFY `tanggal_surat_jalan` DATETIME(3) NULL;
