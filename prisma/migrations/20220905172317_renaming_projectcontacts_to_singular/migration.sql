/*
  Warnings:

  - You are about to drop the `ProjectContacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectContacts" DROP CONSTRAINT "ProjectContacts_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectContacts" DROP CONSTRAINT "ProjectContacts_project_id_fkey";

-- DropTable
DROP TABLE "ProjectContacts";

-- CreateTable
CREATE TABLE "ProjectContact" (
    "contact_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectContact_pkey" PRIMARY KEY ("contact_id","project_id")
);

-- AddForeignKey
ALTER TABLE "ProjectContact" ADD CONSTRAINT "ProjectContact_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContact" ADD CONSTRAINT "ProjectContact_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
