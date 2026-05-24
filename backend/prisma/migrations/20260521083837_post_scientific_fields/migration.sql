-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "doi" TEXT,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "references" TEXT,
ADD COLUMN     "supplementaryFilename" TEXT,
ADD COLUMN     "supplementaryOriginalName" TEXT;
