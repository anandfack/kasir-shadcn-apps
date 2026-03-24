This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```
kasir-shadcn-apps
├─ .env
├─ .eslintrc.json
├─ bun.lockb
├─ components.json
├─ db_kasir_apps.sql
├─ docker-compose.yml
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ data
│  │  ├─ harga.data.js
│  │  ├─ kategori.data.js
│  │  ├─ loginpemakai.data.js
│  │  ├─ pegawai.data.js
│  │  ├─ produk.data.js
│  │  ├─ satuan.data.js
│  │  └─ supplier.data.js
│  ├─ migrations
│  │  ├─ 20251227134528_init
│  │  │  └─ migration.sql
│  │  ├─ 20260113152939_add_pembayaran_pembelian_table
│  │  │  └─ migration.sql
│  │  ├─ 20260116084224_add_nomor_pembayaran
│  │  │  └─ migration.sql
│  │  ├─ 20260123152606_add_produk_variant_and_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260123154117_add_deleted_at_to_produk_variant_and_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260130171533_add_mutasi_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260130175658_delete_produk_variant_on_mutasi_stok
│  │  │  └─ migration.sql
│  │  ├─ 20260201171842_add_satuan_to_produk_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260203150612_add_purchase_order_and_penerimaan
│  │  │  └─ migration.sql
│  │  ├─ 20260205173300_change_pegawai_id_to_pegawai_id
│  │  │  └─ migration.sql
│  │  ├─ 20260205173506_change_pegawai_id_to_pegawai_id_on_penerimaan_barang_detail
│  │  │  └─ migration.sql
│  │  ├─ 20260216160916_add_detail_purchase_order_to_penerimaan_purchase_order
│  │  │  └─ migration.sql
│  │  ├─ 20260219150909_add_retur_penerimaan_and_detail_retur_penerimaan
│  │  │  └─ migration.sql
│  │  ├─ 20260222093627_add_generator_number
│  │  │  └─ migration.sql
│  │  ├─ 20260224150525_add_nomor_faktur_tanggal_faktur_nomor_surat_jalan_and_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224155804_update_type_of_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224162008_update_tanggal_faktur_and_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224163615_set_back_tanggal_to_datetime
│  │  │  └─ migration.sql
│  │  ├─ 20260225153235_add_invoice_pembelian_invoice_penerimaan_pembayaran_invoice
│  │  │  └─ migration.sql
│  │  ├─ 20260225153406_update_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260225153537_update_document_counter
│  │  │  └─ migration.sql
│  │  ├─ 20260228141334_remove_penerimaan_id_on_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260228150456_add_pegawai_id_to_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260302133216_add_nomor_rekening_to_pembayaran_invoice
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.js
├─ public
│  └─ image
│     ├─ collection-image.webp
│     ├─ hero-image-1.webp
│     └─ hero-image-2.webp
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  └─ auth-admin
│  │  │     ├─ layout.js
│  │  │     ├─ login
│  │  │     │  └─ page.jsx
│  │  │     ├─ register
│  │  │     │  └─ page.jsx
│  │  │     └─ verify-email
│  │  │        └─ page.jsx
│  │  ├─ (client)
│  │  │  ├─ layout.js
│  │  │  └─ page.jsx
│  │  ├─ admin
│  │  │  ├─ dashboard
│  │  │  │  └─ page.jsx
│  │  │  ├─ harga-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ invoice
│  │  │  │  └─ page.jsx
│  │  │  ├─ kategori-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ konfigurasi-pengguna
│  │  │  │  └─ page.jsx
│  │  │  ├─ layout.js
│  │  │  ├─ pegawai
│  │  │  │  └─ page.jsx
│  │  │  ├─ pembelian-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ penerimaan
│  │  │  ├─ penerimaan-po
│  │  │  │  └─ page.jsx
│  │  │  ├─ produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ produk-variant
│  │  │  │  └─ page.jsx
│  │  │  ├─ purchase-order
│  │  │  │  └─ page.jsx
│  │  │  ├─ retur-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ satuan-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ stock-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ stok-variant
│  │  │  │  └─ page.jsx
│  │  │  └─ supplier
│  │  │     └─ page.jsx
│  │  ├─ api
│  │  │  └─ v1
│  │  │     ├─ admin
│  │  │     │  ├─ harga-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ invoice
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ pembayaran-invoice
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ kategori-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ konfigurasi-pengguna
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ reset-password
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ mutasi-stok
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ mutasi-stok-variant
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pegawai
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pembayaran-invoice
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ batal
│  │  │     │  │        └─ route.js
│  │  │     │  ├─ pembayaran-pembelian
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pembelian-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ pembayaran
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ penerimaan-po
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ produk-variant
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ purchase-order
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ retur-penerimaan
│  │  │     │  │  └─ route.js
│  │  │     │  ├─ retur-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ satuan-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ stock
│  │  │     │  │  ├─ keluar
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ masuk
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ penyesuaian
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ stok-variant
│  │  │     │  │  ├─ penyesuaian
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  └─ supplier
│  │  │     │     ├─ route.js
│  │  │     │     └─ [id]
│  │  │     │        └─ route.js
│  │  │     └─ auth
│  │  │        └─ admin
│  │  │           ├─ login
│  │  │           │  └─ route.js
│  │  │           ├─ logout
│  │  │           │  └─ route.js
│  │  │           ├─ register
│  │  │           │  └─ route.js
│  │  │           └─ verify-email
│  │  │              └─ route.js
│  │  ├─ favicon.ico
│  │  ├─ fonts
│  │  │  ├─ GeistMonoVF.woff
│  │  │  └─ GeistVF.woff
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  ├─ providers
│  │  │  ├─ Providers.js
│  │  │  └─ ReactQueryProvider.js
│  │  └─ utils
│  │     └─ fetchOptions.js
│  ├─ components
│  │  ├─ admin-invoice
│  │  │  ├─ AdminDetailinvoice.jsx
│  │  │  ├─ AdminInvoiceActions.jsx
│  │  │  ├─ AdminInvoiceDialog.jsx
│  │  │  ├─ AdminInvoiceTable.jsx
│  │  │  ├─ AdminPembayaranInvoice.jsx
│  │  │  └─ AdminTambahInvoiceForm.jsx
│  │  ├─ admin-mutasi-stok-variant
│  │  │  └─ AdminMutasiStokVariant.jsx
│  │  ├─ admin-navbar
│  │  │  └─ AdminNavbar.jsx
│  │  ├─ admin-penerimaan-po
│  │  │  ├─ AdminDetailPenerimaanPo.jsx
│  │  │  ├─ AdminPenerimaanPoActions.jsx
│  │  │  ├─ AdminPenerimaanPoDialog.jsx
│  │  │  ├─ AdminPenerimaanPoTable.jsx
│  │  │  └─ AdminReturPenerimaanPo.jsx
│  │  ├─ admin-produk-variant
│  │  │  ├─ AdminProdukVariantActions.jsx
│  │  │  ├─ AdminProdukVariantDialog.jsx
│  │  │  ├─ AdminProdukVariantTable.jsx
│  │  │  ├─ AdminTambahProdukVariantForm.jsx
│  │  │  └─ AdminUpdateProdukVariantForm.jsx
│  │  ├─ admin-purchase-oder
│  │  │  ├─ AdminDetailPurchaseOrder.jsx
│  │  │  ├─ AdminPurchaseOrderTable.jsx
│  │  │  ├─ AdminTambahPurchaseOrderForm.jsx
│  │  │  └─ AdminTerimaPurchaseOrderForm.jsx
│  │  ├─ admin-stok-variant
│  │  │  ├─ AdminPenyesuaianStokVariantForm.jsx
│  │  │  ├─ AdminStokVariantActions.jsx
│  │  │  ├─ AdminStokVariantDialog.jsx
│  │  │  ├─ AdminStokVariantTable.jsx
│  │  │  └─ AdminUpdateStokVariantForm.jsx
│  │  ├─ AdminShell.jsx
│  │  ├─ AppSidebar.jsx
│  │  ├─ BarangTable.jsx
│  │  ├─ Breadcrumbs.jsx
│  │  ├─ components.zip
│  │  ├─ harga-produk
│  │  │  ├─ HargaProdukActions.jsx
│  │  │  ├─ HargaProdukDialog.jsx
│  │  │  ├─ HargaProdukTable.jsx
│  │  │  ├─ TambahHargaProdukForm.jsx
│  │  │  └─ UpdateHargaProdukForm.jsx
│  │  ├─ hero
│  │  │  └─ Hero.jsx
│  │  ├─ kategori-produk
│  │  │  ├─ KategoriProdukActions.jsx
│  │  │  ├─ KategoriProdukDialog.jsx
│  │  │  ├─ KategoriProdukTable.jsx
│  │  │  ├─ TambahKategoriProdukForm.jsx
│  │  │  └─ UpdateKategoriProdukForm.jsx
│  │  ├─ konfigurasi-pengguna
│  │  │  ├─ KonfigurasiPenggunaActions.jsx
│  │  │  ├─ KonfigurasiPenggunaDialog.jsx
│  │  │  ├─ KonfigurasiPenggunaTable.jsx
│  │  │  ├─ ResetPasswordForm.jsx
│  │  │  ├─ TambahKonfigurasiPenggunaForm.jsx
│  │  │  └─ UpdateKonfigurasiPenggunaForm.jsx
│  │  ├─ logout
│  │  │  └─ handleLogout.jsx
│  │  ├─ mutasi-stok
│  │  │  └─ MutasiStok.jsx
│  │  ├─ navbar
│  │  │  └─ Navbar.jsx
│  │  ├─ our-product
│  │  │  └─ OurProduct.jsx
│  │  ├─ pegawai
│  │  │  ├─ DetailPegawai.jsx
│  │  │  ├─ PegawaiActions.jsx
│  │  │  ├─ PegawaiDialog.jsx
│  │  │  ├─ PegawaiTable.jsx
│  │  │  ├─ TambahPegawaiForm.jsx
│  │  │  └─ UpdatePegawaiForm.jsx
│  │  ├─ pembelian-produk
│  │  │  ├─ DetailPembelianProduk.jsx
│  │  │  ├─ PembayaranPembelianProduk.jsx
│  │  │  ├─ PembelianProdukTable.jsx
│  │  │  ├─ ReturPembelianProduk.jsx
│  │  │  └─ TambahPembelianProduk.jsx
│  │  ├─ produk
│  │  │  ├─ ProdukActions.jsx
│  │  │  ├─ ProdukDialog.jsx
│  │  │  ├─ ProdukTable.jsx
│  │  │  ├─ TambahProdukForm.jsx
│  │  │  └─ UpdateProdukForm.jsx
│  │  ├─ retur-produk
│  │  │  ├─ DetailReturProduk.jsx
│  │  │  └─ ReturProdukTable.jsx
│  │  ├─ satuan-produk
│  │  │  ├─ SatuanProdukActions.jsx
│  │  │  ├─ SatuanProdukDialog.jsx
│  │  │  ├─ SatuanProdukTable.jsx
│  │  │  ├─ TambahSatuanProdukForm.jsx
│  │  │  └─ UpdateSatuanProdukForm.jsx
│  │  ├─ SidebarCollapsibleMenu.jsx
│  │  ├─ signature-pieces
│  │  │  └─ SignaturePieces.jsx
│  │  ├─ stock-produk
│  │  │  ├─ PenyesuaianStockForm.jsx
│  │  │  ├─ StockProdukActions.jsx
│  │  │  ├─ StockProdukDialog.jsx
│  │  │  ├─ StockProdukTable.jsx
│  │  │  └─ UpdateStockProdukForm.jsx
│  │  ├─ supplier
│  │  │  ├─ SupplierActions.jsx
│  │  │  ├─ SupplierDialog.jsx
│  │  │  ├─ SupplierTable.jsx
│  │  │  ├─ TambahSupplierForm.jsx
│  │  │  └─ UpdateSupplierForm.jsx
│  │  ├─ tagline
│  │  │  └─ Tagline.jsx
│  │  └─ ui
│  │     ├─ accordion.jsx
│  │     ├─ alert-dialog.jsx
│  │     ├─ avatar.jsx
│  │     ├─ badge.js
│  │     ├─ badge.jsx
│  │     ├─ breadcrumb.jsx
│  │     ├─ button.jsx
│  │     ├─ calendar.jsx
│  │     ├─ card.jsx
│  │     ├─ checkbox.jsx
│  │     ├─ collapsible
│  │     │  ├─ Collapsible.jsx
│  │     │  ├─ CollapsibleContent.jsx
│  │     │  └─ CollapsibleTrigger.jsx
│  │     ├─ collapsible.jsx
│  │     ├─ dialog.jsx
│  │     ├─ dropdown-menu.jsx
│  │     ├─ form.jsx
│  │     ├─ input.jsx
│  │     ├─ label.jsx
│  │     ├─ navigation-menu.jsx
│  │     ├─ popover.jsx
│  │     ├─ select.jsx
│  │     ├─ separator.jsx
│  │     ├─ sheet.jsx
│  │     ├─ sidebar
│  │     │  ├─ index.jsx
│  │     │  ├─ Sidebar.jsx
│  │     │  ├─ sidebar.zip
│  │     │  ├─ SidebarFooter.jsx
│  │     │  ├─ SidebarFooterMenu.jsx
│  │     │  ├─ SidebarGroup.jsx
│  │     │  ├─ SidebarGroupContent.jsx
│  │     │  ├─ SidebarGroupLabel.jsx
│  │     │  ├─ SidebarHeader.jsx
│  │     │  ├─ SidebarMenu.jsx
│  │     │  ├─ SidebarMenuButton.jsx
│  │     │  └─ SidebarMenuItem.jsx
│  │     ├─ sidebar.jsx
│  │     ├─ skeleton.jsx
│  │     ├─ switch.jsx
│  │     ├─ table.jsx
│  │     ├─ textarea.jsx
│  │     ├─ toast.jsx
│  │     ├─ toaster.jsx
│  │     └─ tooltip.jsx
│  ├─ hooks
│  │  ├─ admin-invoice
│  │  │  └─ useFetchAdminInvoice.js
│  │  ├─ admin-penerimaan-po
│  │  │  └─ useFetchAdminPenerimaanPo.js
│  │  ├─ admin-produk-variant
│  │  │  └─ useFetchAdminProdukVariant.js
│  │  ├─ admin-purchase-order
│  │  │  └─ useFetchAdminPurchaseOrder.js
│  │  ├─ admin-stok-variant
│  │  │  └─ useFetchAdminStokVariant.js
│  │  ├─ harga-produk
│  │  │  └─ useFetchHargaProduk.js
│  │  ├─ kategori-produk
│  │  │  └─ useFetchKategoriProduk.js
│  │  ├─ konfigurasi-pengguna
│  │  │  └─ useFetchKonfigurasiPengguna.js
│  │  ├─ mutasi-stok
│  │  │  └─ useFetchMutasiStok.js
│  │  ├─ pegawai
│  │  │  └─ useFetchPegawai.js
│  │  ├─ pembelian-produk
│  │  │  └─ useFetchPembelianProduk.js
│  │  ├─ produk
│  │  │  └─ useFetchProduk.js
│  │  ├─ retur-produk
│  │  │  └─ useFetchReturProduk.js
│  │  ├─ satuan-produk
│  │  │  └─ useFetchSatuanProduk.js
│  │  ├─ stock-produk
│  │  │  └─ useFetchStockProduk.js
│  │  ├─ supplier
│  │  │  └─ useFetchSupplier.jsx
│  │  ├─ use-mobile.jsx
│  │  └─ use-toast.js
│  ├─ lib
│  │  ├─ apiRequest.js
│  │  ├─ auth.js
│  │  ├─ documentNumber.js
│  │  ├─ formatRupiah.js
│  │  ├─ formatTanggal.js
│  │  ├─ getApiErrorMessage.js
│  │  ├─ hitungStatusPembayaran.js
│  │  ├─ jsonResponse.js
│  │  ├─ prisma.js
│  │  ├─ roleBadge.js
│  │  ├─ utils.js
│  │  ├─ verifyAuth.js
│  │  └─ verifyJwt.js
│  ├─ middleware.js
│  └─ modules
│     └─ produk
│        ├─ produk.reprository.js
│        ├─ produk.service.js
│        └─ produk.validation.js
├─ tailwind.config.js
├─ todo.md
└─ zsh.exe.stackdump

```
```
kasir-shadcn-apps
├─ .env
├─ .eslintrc.json
├─ bun.lockb
├─ components.json
├─ db_kasir_apps.sql
├─ docker-compose.yml
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ data
│  │  ├─ harga.data.js
│  │  ├─ kategori.data.js
│  │  ├─ loginpemakai.data.js
│  │  ├─ pegawai.data.js
│  │  ├─ produk.data.js
│  │  ├─ satuan.data.js
│  │  └─ supplier.data.js
│  ├─ migrations
│  │  ├─ 20251227134528_init
│  │  │  └─ migration.sql
│  │  ├─ 20260113152939_add_pembayaran_pembelian_table
│  │  │  └─ migration.sql
│  │  ├─ 20260116084224_add_nomor_pembayaran
│  │  │  └─ migration.sql
│  │  ├─ 20260123152606_add_produk_variant_and_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260123154117_add_deleted_at_to_produk_variant_and_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260130171533_add_mutasi_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260130175658_delete_produk_variant_on_mutasi_stok
│  │  │  └─ migration.sql
│  │  ├─ 20260201171842_add_satuan_to_produk_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260203150612_add_purchase_order_and_penerimaan
│  │  │  └─ migration.sql
│  │  ├─ 20260205173300_change_pegawai_id_to_pegawai_id
│  │  │  └─ migration.sql
│  │  ├─ 20260205173506_change_pegawai_id_to_pegawai_id_on_penerimaan_barang_detail
│  │  │  └─ migration.sql
│  │  ├─ 20260216160916_add_detail_purchase_order_to_penerimaan_purchase_order
│  │  │  └─ migration.sql
│  │  ├─ 20260219150909_add_retur_penerimaan_and_detail_retur_penerimaan
│  │  │  └─ migration.sql
│  │  ├─ 20260222093627_add_generator_number
│  │  │  └─ migration.sql
│  │  ├─ 20260224150525_add_nomor_faktur_tanggal_faktur_nomor_surat_jalan_and_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224155804_update_type_of_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224162008_update_tanggal_faktur_and_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224163615_set_back_tanggal_to_datetime
│  │  │  └─ migration.sql
│  │  ├─ 20260225153235_add_invoice_pembelian_invoice_penerimaan_pembayaran_invoice
│  │  │  └─ migration.sql
│  │  ├─ 20260225153406_update_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260225153537_update_document_counter
│  │  │  └─ migration.sql
│  │  ├─ 20260228141334_remove_penerimaan_id_on_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260228150456_add_pegawai_id_to_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260302133216_add_nomor_rekening_to_pembayaran_invoice
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.js
├─ public
│  └─ image
│     ├─ collection-image.webp
│     ├─ hero-image-1.webp
│     └─ hero-image-2.webp
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  └─ auth-admin
│  │  │     ├─ layout.js
│  │  │     ├─ login
│  │  │     │  └─ page.jsx
│  │  │     ├─ register
│  │  │     │  └─ page.jsx
│  │  │     └─ verify-email
│  │  │        └─ page.jsx
│  │  ├─ (client)
│  │  │  ├─ layout.js
│  │  │  └─ page.jsx
│  │  ├─ admin
│  │  │  ├─ dashboard
│  │  │  │  └─ page.jsx
│  │  │  ├─ harga-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ invoice
│  │  │  │  └─ page.jsx
│  │  │  ├─ kategori-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ konfigurasi-pengguna
│  │  │  │  └─ page.jsx
│  │  │  ├─ layout.js
│  │  │  ├─ pegawai
│  │  │  │  └─ page.jsx
│  │  │  ├─ pembelian-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ penerimaan
│  │  │  ├─ penerimaan-po
│  │  │  │  └─ page.jsx
│  │  │  ├─ produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ produk-variant
│  │  │  │  └─ page.jsx
│  │  │  ├─ purchase-order
│  │  │  │  └─ page.jsx
│  │  │  ├─ retur-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ satuan-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ stock-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ stok-variant
│  │  │  │  └─ page.jsx
│  │  │  └─ supplier
│  │  │     └─ page.jsx
│  │  ├─ api
│  │  │  └─ v1
│  │  │     ├─ admin
│  │  │     │  ├─ harga-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ invoice
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ pembayaran-invoice
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ kategori-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ konfigurasi-pengguna
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ reset-password
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ mutasi-stok
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ mutasi-stok-variant
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pegawai
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pembayaran-invoice
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ batal
│  │  │     │  │        └─ route.js
│  │  │     │  ├─ pembayaran-pembelian
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pembelian-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ pembayaran
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ penerimaan-po
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ produk-variant
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ purchase-order
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ retur-penerimaan
│  │  │     │  │  └─ route.js
│  │  │     │  ├─ retur-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ satuan-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ stock
│  │  │     │  │  ├─ keluar
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ masuk
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ penyesuaian
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ stok-variant
│  │  │     │  │  ├─ penyesuaian
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  └─ supplier
│  │  │     │     ├─ route.js
│  │  │     │     └─ [id]
│  │  │     │        └─ route.js
│  │  │     └─ auth
│  │  │        └─ admin
│  │  │           ├─ login
│  │  │           │  └─ route.js
│  │  │           ├─ logout
│  │  │           │  └─ route.js
│  │  │           ├─ register
│  │  │           │  └─ route.js
│  │  │           └─ verify-email
│  │  │              └─ route.js
│  │  ├─ favicon.ico
│  │  ├─ fonts
│  │  │  ├─ GeistMonoVF.woff
│  │  │  └─ GeistVF.woff
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  ├─ providers
│  │  │  ├─ Providers.js
│  │  │  └─ ReactQueryProvider.js
│  │  └─ utils
│  │     └─ fetchOptions.js
│  ├─ components
│  │  ├─ admin-invoice
│  │  │  ├─ AdminDetailinvoice.jsx
│  │  │  ├─ AdminInvoiceActions.jsx
│  │  │  ├─ AdminInvoiceDialog.jsx
│  │  │  ├─ AdminInvoiceTable.jsx
│  │  │  ├─ AdminPembayaranInvoice.jsx
│  │  │  └─ AdminTambahInvoiceForm.jsx
│  │  ├─ admin-mutasi-stok-variant
│  │  │  └─ AdminMutasiStokVariant.jsx
│  │  ├─ admin-navbar
│  │  │  └─ AdminNavbar.jsx
│  │  ├─ admin-penerimaan-po
│  │  │  ├─ AdminDetailPenerimaanPo.jsx
│  │  │  ├─ AdminPenerimaanPoActions.jsx
│  │  │  ├─ AdminPenerimaanPoDialog.jsx
│  │  │  ├─ AdminPenerimaanPoTable.jsx
│  │  │  └─ AdminReturPenerimaanPo.jsx
│  │  ├─ admin-produk-variant
│  │  │  ├─ AdminProdukVariantActions.jsx
│  │  │  ├─ AdminProdukVariantDialog.jsx
│  │  │  ├─ AdminProdukVariantTable.jsx
│  │  │  ├─ AdminTambahProdukVariantForm.jsx
│  │  │  └─ AdminUpdateProdukVariantForm.jsx
│  │  ├─ admin-purchase-oder
│  │  │  ├─ AdminDetailPurchaseOrder.jsx
│  │  │  ├─ AdminPurchaseOrderTable.jsx
│  │  │  ├─ AdminTambahPurchaseOrderForm.jsx
│  │  │  └─ AdminTerimaPurchaseOrderForm.jsx
│  │  ├─ admin-stok-variant
│  │  │  ├─ AdminPenyesuaianStokVariantForm.jsx
│  │  │  ├─ AdminStokVariantActions.jsx
│  │  │  ├─ AdminStokVariantDialog.jsx
│  │  │  ├─ AdminStokVariantTable.jsx
│  │  │  └─ AdminUpdateStokVariantForm.jsx
│  │  ├─ AdminShell.jsx
│  │  ├─ AppSidebar.jsx
│  │  ├─ BarangTable.jsx
│  │  ├─ Breadcrumbs.jsx
│  │  ├─ components.zip
│  │  ├─ harga-produk
│  │  │  ├─ HargaProdukActions.jsx
│  │  │  ├─ HargaProdukDialog.jsx
│  │  │  ├─ HargaProdukTable.jsx
│  │  │  ├─ TambahHargaProdukForm.jsx
│  │  │  └─ UpdateHargaProdukForm.jsx
│  │  ├─ hero
│  │  │  └─ Hero.jsx
│  │  ├─ kategori-produk
│  │  │  ├─ KategoriProdukActions.jsx
│  │  │  ├─ KategoriProdukDialog.jsx
│  │  │  ├─ KategoriProdukTable.jsx
│  │  │  ├─ TambahKategoriProdukForm.jsx
│  │  │  └─ UpdateKategoriProdukForm.jsx
│  │  ├─ konfigurasi-pengguna
│  │  │  ├─ KonfigurasiPenggunaActions.jsx
│  │  │  ├─ KonfigurasiPenggunaDialog.jsx
│  │  │  ├─ KonfigurasiPenggunaTable.jsx
│  │  │  ├─ ResetPasswordForm.jsx
│  │  │  ├─ TambahKonfigurasiPenggunaForm.jsx
│  │  │  └─ UpdateKonfigurasiPenggunaForm.jsx
│  │  ├─ logout
│  │  │  └─ handleLogout.jsx
│  │  ├─ mutasi-stok
│  │  │  └─ MutasiStok.jsx
│  │  ├─ navbar
│  │  │  └─ Navbar.jsx
│  │  ├─ our-product
│  │  │  └─ OurProduct.jsx
│  │  ├─ pegawai
│  │  │  ├─ DetailPegawai.jsx
│  │  │  ├─ PegawaiActions.jsx
│  │  │  ├─ PegawaiDialog.jsx
│  │  │  ├─ PegawaiTable.jsx
│  │  │  ├─ TambahPegawaiForm.jsx
│  │  │  └─ UpdatePegawaiForm.jsx
│  │  ├─ pembelian-produk
│  │  │  ├─ DetailPembelianProduk.jsx
│  │  │  ├─ PembayaranPembelianProduk.jsx
│  │  │  ├─ PembelianProdukTable.jsx
│  │  │  ├─ ReturPembelianProduk.jsx
│  │  │  └─ TambahPembelianProduk.jsx
│  │  ├─ produk
│  │  │  ├─ ProdukActions.jsx
│  │  │  ├─ ProdukDialog.jsx
│  │  │  ├─ ProdukTable.jsx
│  │  │  ├─ TambahProdukForm.jsx
│  │  │  └─ UpdateProdukForm.jsx
│  │  ├─ retur-produk
│  │  │  ├─ DetailReturProduk.jsx
│  │  │  └─ ReturProdukTable.jsx
│  │  ├─ satuan-produk
│  │  │  ├─ SatuanProdukActions.jsx
│  │  │  ├─ SatuanProdukDialog.jsx
│  │  │  ├─ SatuanProdukTable.jsx
│  │  │  ├─ TambahSatuanProdukForm.jsx
│  │  │  └─ UpdateSatuanProdukForm.jsx
│  │  ├─ SidebarCollapsibleMenu.jsx
│  │  ├─ signature-pieces
│  │  │  └─ SignaturePieces.jsx
│  │  ├─ stock-produk
│  │  │  ├─ PenyesuaianStockForm.jsx
│  │  │  ├─ StockProdukActions.jsx
│  │  │  ├─ StockProdukDialog.jsx
│  │  │  ├─ StockProdukTable.jsx
│  │  │  └─ UpdateStockProdukForm.jsx
│  │  ├─ supplier
│  │  │  ├─ SupplierActions.jsx
│  │  │  ├─ SupplierDialog.jsx
│  │  │  ├─ SupplierTable.jsx
│  │  │  ├─ TambahSupplierForm.jsx
│  │  │  └─ UpdateSupplierForm.jsx
│  │  ├─ tagline
│  │  │  └─ Tagline.jsx
│  │  └─ ui
│  │     ├─ accordion.jsx
│  │     ├─ alert-dialog.jsx
│  │     ├─ avatar.jsx
│  │     ├─ badge.js
│  │     ├─ badge.jsx
│  │     ├─ breadcrumb.jsx
│  │     ├─ button.jsx
│  │     ├─ calendar.jsx
│  │     ├─ card.jsx
│  │     ├─ checkbox.jsx
│  │     ├─ collapsible
│  │     │  ├─ Collapsible.jsx
│  │     │  ├─ CollapsibleContent.jsx
│  │     │  └─ CollapsibleTrigger.jsx
│  │     ├─ collapsible.jsx
│  │     ├─ dialog.jsx
│  │     ├─ dropdown-menu.jsx
│  │     ├─ form.jsx
│  │     ├─ input.jsx
│  │     ├─ label.jsx
│  │     ├─ navigation-menu.jsx
│  │     ├─ popover.jsx
│  │     ├─ select.jsx
│  │     ├─ separator.jsx
│  │     ├─ sheet.jsx
│  │     ├─ sidebar
│  │     │  ├─ index.jsx
│  │     │  ├─ Sidebar.jsx
│  │     │  ├─ sidebar.zip
│  │     │  ├─ SidebarFooter.jsx
│  │     │  ├─ SidebarFooterMenu.jsx
│  │     │  ├─ SidebarGroup.jsx
│  │     │  ├─ SidebarGroupContent.jsx
│  │     │  ├─ SidebarGroupLabel.jsx
│  │     │  ├─ SidebarHeader.jsx
│  │     │  ├─ SidebarMenu.jsx
│  │     │  ├─ SidebarMenuButton.jsx
│  │     │  └─ SidebarMenuItem.jsx
│  │     ├─ sidebar.jsx
│  │     ├─ skeleton.jsx
│  │     ├─ switch.jsx
│  │     ├─ table.jsx
│  │     ├─ textarea.jsx
│  │     ├─ toast.jsx
│  │     ├─ toaster.jsx
│  │     └─ tooltip.jsx
│  ├─ hooks
│  │  ├─ admin-invoice
│  │  │  └─ useFetchAdminInvoice.js
│  │  ├─ admin-penerimaan-po
│  │  │  └─ useFetchAdminPenerimaanPo.js
│  │  ├─ admin-produk-variant
│  │  │  └─ useFetchAdminProdukVariant.js
│  │  ├─ admin-purchase-order
│  │  │  └─ useFetchAdminPurchaseOrder.js
│  │  ├─ admin-stok-variant
│  │  │  └─ useFetchAdminStokVariant.js
│  │  ├─ harga-produk
│  │  │  └─ useFetchHargaProduk.js
│  │  ├─ kategori-produk
│  │  │  └─ useFetchKategoriProduk.js
│  │  ├─ konfigurasi-pengguna
│  │  │  └─ useFetchKonfigurasiPengguna.js
│  │  ├─ mutasi-stok
│  │  │  └─ useFetchMutasiStok.js
│  │  ├─ pegawai
│  │  │  └─ useFetchPegawai.js
│  │  ├─ pembelian-produk
│  │  │  └─ useFetchPembelianProduk.js
│  │  ├─ produk
│  │  │  └─ useFetchProduk.js
│  │  ├─ retur-produk
│  │  │  └─ useFetchReturProduk.js
│  │  ├─ satuan-produk
│  │  │  └─ useFetchSatuanProduk.js
│  │  ├─ stock-produk
│  │  │  └─ useFetchStockProduk.js
│  │  ├─ supplier
│  │  │  └─ useFetchSupplier.jsx
│  │  ├─ use-mobile.jsx
│  │  └─ use-toast.js
│  ├─ lib
│  │  ├─ apiRequest.js
│  │  ├─ auth.js
│  │  ├─ documentNumber.js
│  │  ├─ formatRupiah.js
│  │  ├─ formatTanggal.js
│  │  ├─ getApiErrorMessage.js
│  │  ├─ hitungStatusPembayaran.js
│  │  ├─ jsonResponse.js
│  │  ├─ prisma.js
│  │  ├─ roleBadge.js
│  │  ├─ utils.js
│  │  ├─ verifyAuth.js
│  │  └─ verifyJwt.js
│  ├─ middleware.js
│  └─ modules
│     ├─ harga-produk
│     │  ├─ hargaproduk.repository.js
│     │  ├─ hargaproduk.service.js
│     │  └─ hargaproduk.validation.js
│     ├─ invoice
│     │  ├─ invoice.repository.js
│     │  ├─ invoice.service.js
│     │  └─ invoice.validation.js
│     ├─ kategori-produk
│     │  ├─ kategoriproduk.repository.js
│     │  ├─ kategoriproduk.service.js
│     │  └─ kategoriproduk.validation.js
│     ├─ konfigurasi-pengguna
│     │  ├─ konfigurasipengguna.repository.js
│     │  ├─ konfigurasipengguna.service.js
│     │  └─ konfigurasipengguna.validation.js
│     ├─ mutasi-stok
│     │  ├─ mutasiStok.repository.js
│     │  └─ mutasistok.service.js
│     ├─ mutasi-stok-variant
│     │  ├─ mutasistokvariant.repository.js
│     │  └─ mutasistokvariant.service.js
│     ├─ pegawai
│     │  ├─ pegawai.repository.js
│     │  ├─ pegawai.service.js
│     │  └─ pegawai.validation.js
│     ├─ penerimaan-po
│     │  ├─ penerimaanpo.repository.js
│     │  ├─ penerimaanpo.service.js
│     │  └─ penerimaanpo.validation.js
│     ├─ produk
│     │  ├─ produk.reprository.js
│     │  ├─ produk.service.js
│     │  └─ produk.validation.js
│     ├─ produk-variant
│     │  ├─ produkvariant.repository.js
│     │  ├─ produkvariant.service.js
│     │  └─ produkvariant.validation.js
│     ├─ purchase-order
│     │  ├─ purchaseorder.repository.js
│     │  ├─ purchaseorder.service.js
│     │  └─ purchaseorder.validation.js
│     ├─ retur-penerimaan
│     │  ├─ returpenerimaan.repository.js
│     │  ├─ returpenerimaan.service.js
│     │  └─ returpenerimaan.validation.js
│     ├─ satuan-produk
│     │  ├─ satuanproduk.repository.js
│     │  ├─ satuanproduk.service.js
│     │  └─ satuanproduk.validation.js
│     ├─ stok-variant
│     │  ├─ stokvariant.repository.js
│     │  ├─ stokvariant.service.js
│     │  └─ stokvariant.validation.js
│     └─ supplier
│        ├─ supplier.repository.js
│        ├─ supplier.service.js
│        └─ supplier.validation.js
├─ tailwind.config.js
├─ todo.md
└─ zsh.exe.stackdump

```
```
kasir-shadcn-apps
├─ .env
├─ .eslintrc.json
├─ bun.lockb
├─ components.json
├─ db_kasir_apps.sql
├─ docker-compose.yml
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ data
│  │  ├─ harga.data.js
│  │  ├─ kategori.data.js
│  │  ├─ loginpemakai.data.js
│  │  ├─ pegawai.data.js
│  │  ├─ produk.data.js
│  │  ├─ satuan.data.js
│  │  └─ supplier.data.js
│  ├─ migrations
│  │  ├─ 20251227134528_init
│  │  │  └─ migration.sql
│  │  ├─ 20260113152939_add_pembayaran_pembelian_table
│  │  │  └─ migration.sql
│  │  ├─ 20260116084224_add_nomor_pembayaran
│  │  │  └─ migration.sql
│  │  ├─ 20260123152606_add_produk_variant_and_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260123154117_add_deleted_at_to_produk_variant_and_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260130171533_add_mutasi_stok_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260130175658_delete_produk_variant_on_mutasi_stok
│  │  │  └─ migration.sql
│  │  ├─ 20260201171842_add_satuan_to_produk_variant
│  │  │  └─ migration.sql
│  │  ├─ 20260203150612_add_purchase_order_and_penerimaan
│  │  │  └─ migration.sql
│  │  ├─ 20260205173300_change_pegawai_id_to_pegawai_id
│  │  │  └─ migration.sql
│  │  ├─ 20260205173506_change_pegawai_id_to_pegawai_id_on_penerimaan_barang_detail
│  │  │  └─ migration.sql
│  │  ├─ 20260216160916_add_detail_purchase_order_to_penerimaan_purchase_order
│  │  │  └─ migration.sql
│  │  ├─ 20260219150909_add_retur_penerimaan_and_detail_retur_penerimaan
│  │  │  └─ migration.sql
│  │  ├─ 20260222093627_add_generator_number
│  │  │  └─ migration.sql
│  │  ├─ 20260224150525_add_nomor_faktur_tanggal_faktur_nomor_surat_jalan_and_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224155804_update_type_of_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224162008_update_tanggal_faktur_and_tanggal_surat_jalan
│  │  │  └─ migration.sql
│  │  ├─ 20260224163615_set_back_tanggal_to_datetime
│  │  │  └─ migration.sql
│  │  ├─ 20260225153235_add_invoice_pembelian_invoice_penerimaan_pembayaran_invoice
│  │  │  └─ migration.sql
│  │  ├─ 20260225153406_update_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260225153537_update_document_counter
│  │  │  └─ migration.sql
│  │  ├─ 20260228141334_remove_penerimaan_id_on_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260228150456_add_pegawai_id_to_invoice_pembelian
│  │  │  └─ migration.sql
│  │  ├─ 20260302133216_add_nomor_rekening_to_pembayaran_invoice
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.js
├─ public
│  └─ image
│     ├─ collection-image.webp
│     ├─ hero-image-1.webp
│     └─ hero-image-2.webp
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  └─ auth-admin
│  │  │     ├─ layout.js
│  │  │     ├─ login
│  │  │     │  └─ page.jsx
│  │  │     ├─ register
│  │  │     │  └─ page.jsx
│  │  │     └─ verify-email
│  │  │        └─ page.jsx
│  │  ├─ (client)
│  │  │  ├─ layout.js
│  │  │  └─ page.jsx
│  │  ├─ admin
│  │  │  ├─ dashboard
│  │  │  │  └─ page.jsx
│  │  │  ├─ harga-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ invoice
│  │  │  │  └─ page.jsx
│  │  │  ├─ kategori-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ konfigurasi-pengguna
│  │  │  │  └─ page.jsx
│  │  │  ├─ layout.js
│  │  │  ├─ pegawai
│  │  │  │  └─ page.jsx
│  │  │  ├─ pembelian-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ penerimaan
│  │  │  ├─ penerimaan-po
│  │  │  │  └─ page.jsx
│  │  │  ├─ produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ produk-variant
│  │  │  │  └─ page.jsx
│  │  │  ├─ purchase-order
│  │  │  │  └─ page.jsx
│  │  │  ├─ retur-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ satuan-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ stock-produk
│  │  │  │  └─ page.jsx
│  │  │  ├─ stok-variant
│  │  │  │  └─ page.jsx
│  │  │  └─ supplier
│  │  │     └─ page.jsx
│  │  ├─ api
│  │  │  └─ v1
│  │  │     ├─ admin
│  │  │     │  ├─ harga-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ invoice
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ pembayaran-invoice
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ kategori-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ konfigurasi-pengguna
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ reset-password
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ mutasi-stok
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ mutasi-stok-variant
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pegawai
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pembayaran-invoice
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ batal
│  │  │     │  │        └─ route.js
│  │  │     │  ├─ pembayaran-pembelian
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ pembelian-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     ├─ pembayaran
│  │  │     │  │     │  └─ route.js
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ penerimaan-po
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ produk-variant
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ purchase-order
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ retur-penerimaan
│  │  │     │  │  └─ route.js
│  │  │     │  ├─ retur-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ satuan-produk
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ stock
│  │  │     │  │  ├─ keluar
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ masuk
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ penyesuaian
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  ├─ stok-variant
│  │  │     │  │  ├─ penyesuaian
│  │  │     │  │  │  └─ route.js
│  │  │     │  │  ├─ route.js
│  │  │     │  │  └─ [id]
│  │  │     │  │     └─ route.js
│  │  │     │  └─ supplier
│  │  │     │     ├─ route.js
│  │  │     │     └─ [id]
│  │  │     │        └─ route.js
│  │  │     ├─ auth
│  │  │     │  └─ admin
│  │  │     │     ├─ login
│  │  │     │     │  └─ route.js
│  │  │     │     ├─ logout
│  │  │     │     │  └─ route.js
│  │  │     │     ├─ register
│  │  │     │     │  └─ route.js
│  │  │     │     └─ verify-email
│  │  │     │        └─ route.js
│  │  │     └─ redis
│  │  │        └─ route.js
│  │  ├─ favicon.ico
│  │  ├─ fonts
│  │  │  ├─ GeistMonoVF.woff
│  │  │  └─ GeistVF.woff
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  ├─ providers
│  │  │  ├─ Providers.js
│  │  │  └─ ReactQueryProvider.js
│  │  └─ utils
│  │     └─ fetchOptions.js
│  ├─ components
│  │  ├─ admin-invoice
│  │  │  ├─ AdminDetailinvoice.jsx
│  │  │  ├─ AdminInvoiceActions.jsx
│  │  │  ├─ AdminInvoiceDialog.jsx
│  │  │  ├─ AdminInvoiceTable.jsx
│  │  │  ├─ AdminPembayaranInvoice.jsx
│  │  │  └─ AdminTambahInvoiceForm.jsx
│  │  ├─ admin-mutasi-stok-variant
│  │  │  └─ AdminMutasiStokVariant.jsx
│  │  ├─ admin-navbar
│  │  │  └─ AdminNavbar.jsx
│  │  ├─ admin-penerimaan-po
│  │  │  ├─ AdminDetailPenerimaanPo.jsx
│  │  │  ├─ AdminPenerimaanPoActions.jsx
│  │  │  ├─ AdminPenerimaanPoDialog.jsx
│  │  │  ├─ AdminPenerimaanPoTable.jsx
│  │  │  └─ AdminReturPenerimaanPo.jsx
│  │  ├─ admin-produk-variant
│  │  │  ├─ AdminProdukVariantActions.jsx
│  │  │  ├─ AdminProdukVariantDialog.jsx
│  │  │  ├─ AdminProdukVariantTable.jsx
│  │  │  ├─ AdminTambahProdukVariantForm.jsx
│  │  │  └─ AdminUpdateProdukVariantForm.jsx
│  │  ├─ admin-purchase-oder
│  │  │  ├─ AdminDetailPurchaseOrder.jsx
│  │  │  ├─ AdminPurchaseOrderTable.jsx
│  │  │  ├─ AdminTambahPurchaseOrderForm.jsx
│  │  │  └─ AdminTerimaPurchaseOrderForm.jsx
│  │  ├─ admin-stok-variant
│  │  │  ├─ AdminPenyesuaianStokVariantForm.jsx
│  │  │  ├─ AdminStokVariantActions.jsx
│  │  │  ├─ AdminStokVariantDialog.jsx
│  │  │  ├─ AdminStokVariantTable.jsx
│  │  │  └─ AdminUpdateStokVariantForm.jsx
│  │  ├─ AdminShell.jsx
│  │  ├─ AppSidebar.jsx
│  │  ├─ BarangTable.jsx
│  │  ├─ Breadcrumbs.jsx
│  │  ├─ components.zip
│  │  ├─ harga-produk
│  │  │  ├─ HargaProdukActions.jsx
│  │  │  ├─ HargaProdukDialog.jsx
│  │  │  ├─ HargaProdukTable.jsx
│  │  │  ├─ TambahHargaProdukForm.jsx
│  │  │  └─ UpdateHargaProdukForm.jsx
│  │  ├─ hero
│  │  │  └─ Hero.jsx
│  │  ├─ kategori-produk
│  │  │  ├─ KategoriProdukActions.jsx
│  │  │  ├─ KategoriProdukDialog.jsx
│  │  │  ├─ KategoriProdukTable.jsx
│  │  │  ├─ TambahKategoriProdukForm.jsx
│  │  │  └─ UpdateKategoriProdukForm.jsx
│  │  ├─ konfigurasi-pengguna
│  │  │  ├─ KonfigurasiPenggunaActions.jsx
│  │  │  ├─ KonfigurasiPenggunaDialog.jsx
│  │  │  ├─ KonfigurasiPenggunaTable.jsx
│  │  │  ├─ ResetPasswordForm.jsx
│  │  │  ├─ TambahKonfigurasiPenggunaForm.jsx
│  │  │  └─ UpdateKonfigurasiPenggunaForm.jsx
│  │  ├─ logout
│  │  │  └─ handleLogout.jsx
│  │  ├─ mutasi-stok
│  │  │  └─ MutasiStok.jsx
│  │  ├─ navbar
│  │  │  └─ Navbar.jsx
│  │  ├─ our-product
│  │  │  └─ OurProduct.jsx
│  │  ├─ pegawai
│  │  │  ├─ DetailPegawai.jsx
│  │  │  ├─ PegawaiActions.jsx
│  │  │  ├─ PegawaiDialog.jsx
│  │  │  ├─ PegawaiTable.jsx
│  │  │  ├─ TambahPegawaiForm.jsx
│  │  │  └─ UpdatePegawaiForm.jsx
│  │  ├─ pembelian-produk
│  │  │  ├─ DetailPembelianProduk.jsx
│  │  │  ├─ PembayaranPembelianProduk.jsx
│  │  │  ├─ PembelianProdukTable.jsx
│  │  │  ├─ ReturPembelianProduk.jsx
│  │  │  └─ TambahPembelianProduk.jsx
│  │  ├─ produk
│  │  │  ├─ ProdukActions.jsx
│  │  │  ├─ ProdukDialog.jsx
│  │  │  ├─ ProdukTable.jsx
│  │  │  ├─ TambahProdukForm.jsx
│  │  │  └─ UpdateProdukForm.jsx
│  │  ├─ retur-produk
│  │  │  ├─ DetailReturProduk.jsx
│  │  │  └─ ReturProdukTable.jsx
│  │  ├─ satuan-produk
│  │  │  ├─ SatuanProdukActions.jsx
│  │  │  ├─ SatuanProdukDialog.jsx
│  │  │  ├─ SatuanProdukTable.jsx
│  │  │  ├─ TambahSatuanProdukForm.jsx
│  │  │  └─ UpdateSatuanProdukForm.jsx
│  │  ├─ SidebarCollapsibleMenu.jsx
│  │  ├─ signature-pieces
│  │  │  └─ SignaturePieces.jsx
│  │  ├─ stock-produk
│  │  │  ├─ PenyesuaianStockForm.jsx
│  │  │  ├─ StockProdukActions.jsx
│  │  │  ├─ StockProdukDialog.jsx
│  │  │  ├─ StockProdukTable.jsx
│  │  │  └─ UpdateStockProdukForm.jsx
│  │  ├─ supplier
│  │  │  ├─ SupplierActions.jsx
│  │  │  ├─ SupplierDialog.jsx
│  │  │  ├─ SupplierTable.jsx
│  │  │  ├─ TambahSupplierForm.jsx
│  │  │  └─ UpdateSupplierForm.jsx
│  │  ├─ tagline
│  │  │  └─ Tagline.jsx
│  │  └─ ui
│  │     ├─ accordion.jsx
│  │     ├─ alert-dialog.jsx
│  │     ├─ avatar.jsx
│  │     ├─ badge.js
│  │     ├─ badge.jsx
│  │     ├─ breadcrumb.jsx
│  │     ├─ button.jsx
│  │     ├─ calendar.jsx
│  │     ├─ card.jsx
│  │     ├─ checkbox.jsx
│  │     ├─ collapsible
│  │     │  ├─ Collapsible.jsx
│  │     │  ├─ CollapsibleContent.jsx
│  │     │  └─ CollapsibleTrigger.jsx
│  │     ├─ collapsible.jsx
│  │     ├─ dialog.jsx
│  │     ├─ dropdown-menu.jsx
│  │     ├─ form.jsx
│  │     ├─ input.jsx
│  │     ├─ label.jsx
│  │     ├─ navigation-menu.jsx
│  │     ├─ popover.jsx
│  │     ├─ select.jsx
│  │     ├─ separator.jsx
│  │     ├─ sheet.jsx
│  │     ├─ sidebar
│  │     │  ├─ index.jsx
│  │     │  ├─ Sidebar.jsx
│  │     │  ├─ sidebar.zip
│  │     │  ├─ SidebarFooter.jsx
│  │     │  ├─ SidebarFooterMenu.jsx
│  │     │  ├─ SidebarGroup.jsx
│  │     │  ├─ SidebarGroupContent.jsx
│  │     │  ├─ SidebarGroupLabel.jsx
│  │     │  ├─ SidebarHeader.jsx
│  │     │  ├─ SidebarMenu.jsx
│  │     │  ├─ SidebarMenuButton.jsx
│  │     │  └─ SidebarMenuItem.jsx
│  │     ├─ sidebar.jsx
│  │     ├─ skeleton.jsx
│  │     ├─ switch.jsx
│  │     ├─ table.jsx
│  │     ├─ textarea.jsx
│  │     ├─ toast.jsx
│  │     ├─ toaster.jsx
│  │     └─ tooltip.jsx
│  ├─ hooks
│  │  ├─ admin-invoice
│  │  │  └─ useFetchAdminInvoice.js
│  │  ├─ admin-penerimaan-po
│  │  │  └─ useFetchAdminPenerimaanPo.js
│  │  ├─ admin-produk-variant
│  │  │  └─ useFetchAdminProdukVariant.js
│  │  ├─ admin-purchase-order
│  │  │  └─ useFetchAdminPurchaseOrder.js
│  │  ├─ admin-stok-variant
│  │  │  └─ useFetchAdminStokVariant.js
│  │  ├─ harga-produk
│  │  │  └─ useFetchHargaProduk.js
│  │  ├─ kategori-produk
│  │  │  └─ useFetchKategoriProduk.js
│  │  ├─ konfigurasi-pengguna
│  │  │  └─ useFetchKonfigurasiPengguna.js
│  │  ├─ mutasi-stok
│  │  │  └─ useFetchMutasiStok.js
│  │  ├─ pegawai
│  │  │  └─ useFetchPegawai.js
│  │  ├─ pembelian-produk
│  │  │  └─ useFetchPembelianProduk.js
│  │  ├─ produk
│  │  │  └─ useFetchProduk.js
│  │  ├─ retur-produk
│  │  │  └─ useFetchReturProduk.js
│  │  ├─ satuan-produk
│  │  │  └─ useFetchSatuanProduk.js
│  │  ├─ stock-produk
│  │  │  └─ useFetchStockProduk.js
│  │  ├─ supplier
│  │  │  └─ useFetchSupplier.jsx
│  │  ├─ use-mobile.jsx
│  │  └─ use-toast.js
│  ├─ lib
│  │  ├─ apiRequest.js
│  │  ├─ auth.js
│  │  ├─ cache.js
│  │  ├─ documentNumber.js
│  │  ├─ formatRupiah.js
│  │  ├─ formatTanggal.js
│  │  ├─ getApiErrorMessage.js
│  │  ├─ hitungStatusPembayaran.js
│  │  ├─ jsonResponse.js
│  │  ├─ prisma.js
│  │  ├─ redis.js
│  │  ├─ roleBadge.js
│  │  ├─ utils.js
│  │  ├─ verifyAuth.js
│  │  └─ verifyJwt.js
│  ├─ middleware.js
│  └─ modules
│     ├─ harga-produk
│     │  ├─ hargaproduk.repository.js
│     │  ├─ hargaproduk.service.js
│     │  └─ hargaproduk.validation.js
│     ├─ invoice
│     │  ├─ invoice.repository.js
│     │  ├─ invoice.service.js
│     │  └─ invoice.validation.js
│     ├─ kategori-produk
│     │  ├─ kategoriproduk.repository.js
│     │  ├─ kategoriproduk.service.js
│     │  └─ kategoriproduk.validation.js
│     ├─ konfigurasi-pengguna
│     │  ├─ konfigurasipengguna.repository.js
│     │  ├─ konfigurasipengguna.service.js
│     │  └─ konfigurasipengguna.validation.js
│     ├─ mutasi-stok
│     │  ├─ mutasiStok.repository.js
│     │  └─ mutasistok.service.js
│     ├─ mutasi-stok-variant
│     │  ├─ mutasistokvariant.repository.js
│     │  └─ mutasistokvariant.service.js
│     ├─ pegawai
│     │  ├─ pegawai.repository.js
│     │  ├─ pegawai.service.js
│     │  └─ pegawai.validation.js
│     ├─ penerimaan-po
│     │  ├─ penerimaanpo.repository.js
│     │  ├─ penerimaanpo.service.js
│     │  └─ penerimaanpo.validation.js
│     ├─ produk
│     │  ├─ produk.reprository.js
│     │  ├─ produk.service.js
│     │  └─ produk.validation.js
│     ├─ produk-variant
│     │  ├─ produkvariant.repository.js
│     │  ├─ produkvariant.service.js
│     │  └─ produkvariant.validation.js
│     ├─ purchase-order
│     │  ├─ purchaseorder.repository.js
│     │  ├─ purchaseorder.service.js
│     │  └─ purchaseorder.validation.js
│     ├─ retur-penerimaan
│     │  ├─ returpenerimaan.repository.js
│     │  ├─ returpenerimaan.service.js
│     │  └─ returpenerimaan.validation.js
│     ├─ satuan-produk
│     │  ├─ satuanproduk.repository.js
│     │  ├─ satuanproduk.service.js
│     │  └─ satuanproduk.validation.js
│     ├─ stok-variant
│     │  ├─ stokvariant.repository.js
│     │  ├─ stokvariant.service.js
│     │  └─ stokvariant.validation.js
│     └─ supplier
│        ├─ supplier.repository.js
│        ├─ supplier.service.js
│        └─ supplier.validation.js
├─ tailwind.config.js
├─ todo.md
└─ zsh.exe.stackdump

```