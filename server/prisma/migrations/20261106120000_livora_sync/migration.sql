-- Bookings collected by the clinic's Livora system: when, and the appointment they became there.
ALTER TABLE "booking_requests" ADD COLUMN "sentToLivoraAt" TIMESTAMP(3),
ADD COLUMN "livoraRef" TEXT;

CREATE INDEX "booking_requests_sentToLivoraAt_idx" ON "booking_requests"("sentToLivoraAt");
