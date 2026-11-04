-- Two-factor sign-in (authenticator app codes) and per-account lockout for
-- admin users. Existing accounts start with 2FA unset and set it up on their
-- next sign-in.
ALTER TABLE "admin_users" ADD COLUMN     "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "totpEnabledAt" TIMESTAMP(3),
ADD COLUMN     "totpLastStep" INTEGER,
ADD COLUMN     "totpSecret" TEXT;
