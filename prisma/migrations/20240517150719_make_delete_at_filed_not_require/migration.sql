-- AlterTable
ALTER TABLE "Country" ALTER COLUMN "deleteAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "deleteAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "deleteAt" DROP NOT NULL;
