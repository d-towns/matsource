import Redis from "ioredis";
import { config } from '@/lib/config';

const redis = new Redis(config.services.redis.url);

export default redis; 