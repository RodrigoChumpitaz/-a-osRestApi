// import yenv from "yenv";
import dotenv from "dotenv";
dotenv.config();
// const env = yenv();

export const environment = {
    jwtSecret: process.env.jwtSecret || "secretKey", 
    PORT: process.env.PORT || 4000,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    CLUSTER_NAME: process.env.CLUSTER_NAME,
    DATABASE_NAME: process.env.DATABASE_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_ACCESS_KEY_SECRET,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    BOT_EMAIL: process.env.BOT_EMAIL,
    BOT_PASS: process.env.BOT_PASS,
}

