import yenv from "yenv";

const env = yenv();

export const environment = {
    jwtSecret: env.jwtSecret || "secretKey", 
    PORT: env.PORT || 3500,
    USER: env.USER,
    PASSWORD: env.PASSWORD,
    CLUSTER_NAME: env.CLUSTER_NAME,
    DATABASE_NAME: env.DATABASE_NAME,
}

