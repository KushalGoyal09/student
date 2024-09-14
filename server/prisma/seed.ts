import { PrismaClient } from "prisma/prisma-client";
const db = new PrismaClient();

const main = async () => {
    console.log("Seeding database...");
    const admin = await db.admin.create({
        data: {
            password: "admin",
        },
    });
    console.log(admin);
};

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
