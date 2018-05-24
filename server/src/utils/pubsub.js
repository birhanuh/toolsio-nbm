import { RedisPubSub } from 'graphql-redis-subscriptions'

export default new RedisPubSub({
  connection: {
    host: process.env.REDIS_DNS,
    port: process.env.REDIS_PORT,
    retry_strategy: options => {
      // reconnect after
      return Math.max(options.attempt * 100, 3000)
    }
  }
})