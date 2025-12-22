-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "title" TEXT,
    "slug" TEXT NOT NULL,
    "prefix" TEXT,
    "suffix" TEXT,
    "accreditation" TEXT,
    "department" TEXT,
    "company" TEXT,
    "headline" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardLink" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "value" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardAppearance" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "theme" TEXT,
    "logoUrl" TEXT,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardAppearance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");

-- CreateIndex
CREATE INDEX "Card_userId_idx" ON "Card"("userId");

-- CreateIndex
CREATE INDEX "CardLink_cardId_idx" ON "CardLink"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardAppearance_cardId_key" ON "CardAppearance"("cardId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardLink" ADD CONSTRAINT "CardLink_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardAppearance" ADD CONSTRAINT "CardAppearance_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
