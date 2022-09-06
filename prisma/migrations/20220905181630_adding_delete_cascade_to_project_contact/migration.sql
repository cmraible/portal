-- DropForeignKey
ALTER TABLE "ProjectContact" DROP CONSTRAINT "ProjectContact_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectContact" DROP CONSTRAINT "ProjectContact_project_id_fkey";

-- AddForeignKey
ALTER TABLE "ProjectContact" ADD CONSTRAINT "ProjectContact_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContact" ADD CONSTRAINT "ProjectContact_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
