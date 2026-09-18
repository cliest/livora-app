-- CreateEnum
CREATE TYPE "PriceCategoryIcon" AS ENUM ('SHIELD', 'TOOTH', 'SPARKLE', 'BRACES', 'CROWN', 'BOLT');

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'settings',
    "phoneDisplay" TEXT NOT NULL DEFAULT '+260 76 073 7805',
    "phoneDial" TEXT NOT NULL DEFAULT '+260760737805',
    "email" TEXT NOT NULL DEFAULT 'info@livoradentalclinic.com',
    "addressLine1" TEXT NOT NULL DEFAULT 'Plot 00, Street Name',
    "addressLine2" TEXT NOT NULL DEFAULT 'Lusaka, Zambia',
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "credentials" TEXT NOT NULL,
    "photoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" "PriceCategoryIcon" NOT NULL,
    "note" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "price_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_items" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "price_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "team_members_published_sortOrder_idx" ON "team_members"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "testimonials_published_sortOrder_idx" ON "testimonials"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "price_items_categoryId_idx" ON "price_items"("categoryId");

-- AddForeignKey
ALTER TABLE "price_items" ADD CONSTRAINT "price_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "price_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
