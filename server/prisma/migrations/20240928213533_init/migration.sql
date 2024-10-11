-- CreateTable
CREATE TABLE "Salareis" (
    "UserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "salary" INTEGER NOT NULL,

    CONSTRAINT "Salareis_pkey" PRIMARY KEY ("UserId")
);
