-- CreateTable
CREATE TABLE "accreditations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "badgeUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accreditations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accreditations_published_sortOrder_idx" ON "accreditations"("published", "sortOrder");
