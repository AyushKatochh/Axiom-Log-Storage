-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "datasetName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "logs_id_key" ON "logs"("id");
