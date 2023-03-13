-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false;
