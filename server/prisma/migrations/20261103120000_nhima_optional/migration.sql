-- The clinic no longer accepts NHIMA. Stop requiring it on new bookings
-- while keeping the answers already stored on past bookings.
ALTER TABLE "booking_requests" ALTER COLUMN "nhimaMember" DROP NOT NULL;
