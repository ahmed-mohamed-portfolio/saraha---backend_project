import { createClient } from "redis";
import { redis_uri } from "../../config/config.service.js";

export const redisClient = createClient({
    url: redis_uri
})

export const connectRedis = async () => {
    try {
        await redisClient.connect()
        console.log("redis database connected");

    } catch (error) {
        console.log("faild to connect to redis database");

    }
}