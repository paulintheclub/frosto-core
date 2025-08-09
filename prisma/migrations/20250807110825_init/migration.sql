-- CreateEnum
CREATE TYPE "public"."Availability" AS ENUM ('IN_STOCK', 'ON_ORDER');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "brandId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "gallery" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "availability" "public"."Availability" NOT NULL,
    "specImage" TEXT,
    "includesImage" TEXT,
    "accessories" TEXT,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RelatedProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,

    CONSTRAINT "RelatedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Catalog" (
    "id" TEXT NOT NULL,
    "previewImg" TEXT,
    "pdfUrl" TEXT NOT NULL,

    CONSTRAINT "Catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyInfo" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "logo" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "openingHours" TEXT NOT NULL,

    CONSTRAINT "CompanyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "trackingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Language" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "public"."ProductTranslation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BrandTranslation" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "BrandTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CatalogTranslation" (
    "id" TEXT NOT NULL,
    "catalogId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CatalogTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyInfoTranslation" (
    "id" TEXT NOT NULL,
    "companyInfoId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CompanyInfoTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CatalogToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CatalogToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedProduct_productId_relatedId_key" ON "public"."RelatedProduct"("productId", "relatedId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "public"."Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "public"."Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_productId_languageCode_key" ON "public"."ProductTranslation"("productId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_languageCode_key" ON "public"."CategoryTranslation"("categoryId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "BrandTranslation_brandId_languageCode_key" ON "public"."BrandTranslation"("brandId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogTranslation_catalogId_languageCode_key" ON "public"."CatalogTranslation"("catalogId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyInfoTranslation_companyInfoId_languageCode_key" ON "public"."CompanyInfoTranslation"("companyInfoId", "languageCode");

-- CreateIndex
CREATE INDEX "_CatalogToProduct_B_index" ON "public"."_CatalogToProduct"("B");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RelatedProduct" ADD CONSTRAINT "RelatedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RelatedProduct" ADD CONSTRAINT "RelatedProduct_relatedId_fkey" FOREIGN KEY ("relatedId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductTranslation" ADD CONSTRAINT "ProductTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "public"."Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "public"."Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BrandTranslation" ADD CONSTRAINT "BrandTranslation_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BrandTranslation" ADD CONSTRAINT "BrandTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "public"."Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CatalogTranslation" ADD CONSTRAINT "CatalogTranslation_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "public"."Catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CatalogTranslation" ADD CONSTRAINT "CatalogTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "public"."Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyInfoTranslation" ADD CONSTRAINT "CompanyInfoTranslation_companyInfoId_fkey" FOREIGN KEY ("companyInfoId") REFERENCES "public"."CompanyInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyInfoTranslation" ADD CONSTRAINT "CompanyInfoTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "public"."Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CatalogToProduct" ADD CONSTRAINT "_CatalogToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CatalogToProduct" ADD CONSTRAINT "_CatalogToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
