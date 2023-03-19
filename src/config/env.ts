import yenv from "yenv";

const env = yenv();

export const environment = {
    jwtSecret: env.jwtSecret || "secretKey", 
    PORT: env.PORT || 3500,
    USER: env.USER,
    PASSWORD: env.PASSWORD,
    CLUSTER_NAME: env.CLUSTER_NAME,
    DATABASE_NAME: env.DATABASE_NAME,
    AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
    AWS_ACCESS_KEY_SECRET: env.AWS_ACCESS_KEY_SECRET,
    AWS_BUCKET_NAME: env.AWS_BUCKET_NAME,
    AWS_REGION: env.AWS_REGION,
    BOT_EMAIL: env.BOT_EMAIL,
    BOT_PASS: env.BOT_PASS,
}

