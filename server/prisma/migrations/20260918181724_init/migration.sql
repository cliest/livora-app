-- CreateEnum
CREATE TYPE "PreferredTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'OVERNIGHT');

-- CreateEnum
CREATE TYPE "NhimaStatus" AS ENUM ('YES', 'NO', 'UNSURE');

-- CreateEnum
CREATE TYPE "PatientType" AS ENUM ('NEW', 'RETURNING');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('EMERGENCY', 'CHECKUP', 'FILLING', 'ROOT_CANAL', 'CROWN_BRIDGE', 'EXTRACTION', 'IMPLANT', 'BRACES', 'WHITENING', 'CHILDREN', 'DENTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactSubject" AS ENUM ('APPOINTMENT', 'TREATMENT', 'PRICES', 'NHIMA', 'RECORDS', 'FEEDBACK', 'OTHER');

-- CreateTable
CREATE TABLE "booking_requests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "patientType" "PatientType",
    "service" "ServiceType" NOT NULL,
    "preferredDate" DATE NOT NULL,
    "preferredTime" "PreferredTime" NOT NULL DEFAULT 'MORNING',
    "nhimaMember" "NhimaStatus" NOT NULL,
    "message" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "staffNotes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" "ContactSubject" NOT NULL,
    "message" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "staffNotes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_requests_status_preferredDate_idx" ON "booking_requests"("status", "preferredDate");

-- CreateIndex
CREATE INDEX "booking_requests_createdAt_idx" ON "booking_requests"("createdAt");

-- CreateIndex
CREATE INDEX "contact_messages_status_createdAt_idx" ON "contact_messages"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
