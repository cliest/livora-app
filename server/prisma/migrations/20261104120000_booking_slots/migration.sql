-- Bookings move from loose time bands to fixed 3-hour slots (one booking per
-- slot, enforced in src/routes/bookings.js). preferredTime is kept, now
-- optional, so existing bookings keep their original band.
ALTER TABLE "booking_requests" ADD COLUMN     "slotHour" INTEGER,
ALTER COLUMN "preferredTime" DROP NOT NULL,
ALTER COLUMN "preferredTime" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "booking_requests_preferredDate_slotHour_idx" ON "booking_requests"("preferredDate", "slotHour");
