-- CreateTable
CREATE TABLE "ProjectContacts" (
    "contact_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectContacts_pkey" PRIMARY KEY ("contact_id","project_id")
);

-- AddForeignKey
ALTER TABLE "ProjectContacts" ADD CONSTRAINT "ProjectContacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContacts" ADD CONSTRAINT "ProjectContacts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
