/*
  Warnings:

  - You are about to drop the column `reviewId` on the `ReviewRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewRequestId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ReviewRequest" DROP CONSTRAINT "ReviewRequest_reviewId_fkey";

-- DropIndex
DROP INDEX "ReviewRequest_reviewId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reviewRequestId" INTEGER;

-- AlterTable
ALTER TABLE "ReviewRequest" DROP COLUMN "reviewId";

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewRequestId_key" ON "Review"("reviewRequestId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewRequestId_fkey" FOREIGN KEY ("reviewRequestId") REFERENCES "ReviewRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
