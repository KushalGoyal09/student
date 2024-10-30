-- CreateTable
CREATE TABLE "SeniorWeek" (
    "id" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,

    CONSTRAINT "SeniorWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCallRecordSenior" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,

    CONSTRAINT "StudentCallRecordSenior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentsCallRecordSenior" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,

    CONSTRAINT "ParentsCallRecordSenior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeniorCallStudent" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "day" "DaysOfWeek" NOT NULL,
    "callStatus" "CallStatus" NOT NULL,
    "studentRecordId" TEXT NOT NULL,

    CONSTRAINT "SeniorCallStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeniorCallParent" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "day" "DaysOfWeek" NOT NULL,
    "callStatus" "CallStatus" NOT NULL,
    "studentRecordId" TEXT NOT NULL,

    CONSTRAINT "SeniorCallParent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeniorWeek_startDate_mentorId_key" ON "SeniorWeek"("startDate", "mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCallRecordSenior_studentId_weekId_key" ON "StudentCallRecordSenior"("studentId", "weekId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentsCallRecordSenior_studentId_weekId_key" ON "ParentsCallRecordSenior"("studentId", "weekId");

-- CreateIndex
CREATE UNIQUE INDEX "SeniorCallStudent_date_studentRecordId_key" ON "SeniorCallStudent"("date", "studentRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "SeniorCallParent_date_studentRecordId_key" ON "SeniorCallParent"("date", "studentRecordId");

-- AddForeignKey
ALTER TABLE "SeniorWeek" ADD CONSTRAINT "SeniorWeek_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "SeniorMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCallRecordSenior" ADD CONSTRAINT "StudentCallRecordSenior_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "SeniorWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCallRecordSenior" ADD CONSTRAINT "StudentCallRecordSenior_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentsCallRecordSenior" ADD CONSTRAINT "ParentsCallRecordSenior_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "SeniorWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentsCallRecordSenior" ADD CONSTRAINT "ParentsCallRecordSenior_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeniorCallStudent" ADD CONSTRAINT "SeniorCallStudent_studentRecordId_fkey" FOREIGN KEY ("studentRecordId") REFERENCES "StudentCallRecordSenior"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeniorCallParent" ADD CONSTRAINT "SeniorCallParent_studentRecordId_fkey" FOREIGN KEY ("studentRecordId") REFERENCES "ParentsCallRecordSenior"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
