import { Redis } from "@upstash/redis";

// lazily initialize redis to avoid build-time errors when env vars are missing
let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });
  }
  return _redis;
}

// Initiate Redis instance by connecting to REST URL
export const redis = {
  hset: (...args: Parameters<Redis["hset"]>) => getRedis().hset(...args),
  get: <T = unknown>(...args: Parameters<Redis["get"]>) => getRedis().get<T>(...args),
  set: (...args: Parameters<Redis["set"]>) => getRedis().set(...args),
  del: (...args: Parameters<Redis["del"]>) => getRedis().del(...args),
};

// This is a separate global Redis instance that we use
// for global operations (e.g. linkCache, recordClick)
// so that if this redis goes down, it won't impact other endpoints
const hasGlobalRedisConfig =
  !!process.env.UPSTASH_GLOBAL_REDIS_REST_URL &&
  !!process.env.UPSTASH_GLOBAL_REDIS_REST_TOKEN;

const redisConfig = {
  url: hasGlobalRedisConfig
    ? process.env.UPSTASH_GLOBAL_REDIS_REST_URL
    : process.env.UPSTASH_REDIS_REST_URL || "",
  token: hasGlobalRedisConfig
    ? process.env.UPSTASH_GLOBAL_REDIS_REST_TOKEN
    : process.env.UPSTASH_REDIS_REST_TOKEN || "",
};

let _redisGlobal: Redis | null = null;

function getRedisGlobal(): Redis {
  if (!_redisGlobal) {
    _redisGlobal = new Redis(redisConfig);
  }
  return _redisGlobal;
}

export const redisGlobal = {
  hset: (...args: Parameters<Redis["hset"]>) => getRedisGlobal().hset(...args),
  get: <T = unknown>(...args: Parameters<Redis["get"]>) => getRedisGlobal().get<T>(...args),
  set: (...args: Parameters<Redis["set"]>) => getRedisGlobal().set(...args),
  del: (...args: Parameters<Redis["del"]>) => getRedisGlobal().del(...args),
};

let _redisGlobalWithTimeout: Redis | null = null;

function getRedisGlobalWithTimeout(): Redis {
  if (!_redisGlobalWithTimeout) {
    _redisGlobalWithTimeout = new Redis({
      ...redisConfig,
      signal: () => AbortSignal.timeout(1500),
    });
  }
  return _redisGlobalWithTimeout;
}

export const redisGlobalWithTimeout = {
  get: <T = unknown>(...args: Parameters<Redis["get"]>) => getRedisGlobalWithTimeout().get<T>(...args),
};
