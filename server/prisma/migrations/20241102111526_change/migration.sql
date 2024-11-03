-- AlterTable
ALTER TABLE "BiologyVisionBoard" ADD COLUMN     "numberOfExtraLectures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfRegularLectures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfRevisionLectures" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "notes" SET DEFAULT false,
ALTER COLUMN "leacture" SET DEFAULT false,
ALTER COLUMN "ncert" SET DEFAULT false,
ALTER COLUMN "QP" SET DEFAULT false,
ALTER COLUMN "revision" SET DEFAULT false,
ALTER COLUMN "viva" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ChemistryVisionBoard" ADD COLUMN     "numberOfExtraLectures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfRegularLectures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfRevisionLectures" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "notes" SET DEFAULT false,
ALTER COLUMN "leacture" SET DEFAULT false,
ALTER COLUMN "ncert" SET DEFAULT false,
ALTER COLUMN "QP" SET DEFAULT false,
ALTER COLUMN "revision" SET DEFAULT false,
ALTER COLUMN "viva" SET DEFAULT false;

-- AlterTable
ALTER TABLE "PhysicsVisionBoard" ALTER COLUMN "notes" SET DEFAULT false,
ALTER COLUMN "leacture" SET DEFAULT false,
ALTER COLUMN "ncert" SET DEFAULT false,
ALTER COLUMN "QP" SET DEFAULT false,
ALTER COLUMN "revision" SET DEFAULT false,
ALTER COLUMN "viva" SET DEFAULT false;
