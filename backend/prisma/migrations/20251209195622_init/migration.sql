-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "fullContent" TEXT NOT NULL,
    "simplifiedSnippet" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isSimplifying" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
