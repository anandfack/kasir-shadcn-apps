-- AlterTable
ALTER TABLE `penerimaanbarang_t` MODIFY `tanggal_penerimaan` TIMESTAMP(6) NOT NULL,
    MODIFY `tanggal_faktur` DATE NULL,
    MODIFY `tanggal_surat_jalan` DATE NULL;
