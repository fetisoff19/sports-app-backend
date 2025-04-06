import { DataSource } from 'typeorm'
import * as path from 'node:path'
import * as process from 'process'

const config = () => ({
  env: process.env.NODE_ENV,
  host: process.env.HOST ?? '0.0.0.0',
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
  auth: {
    secret: process.env.APP_SECRET,
    expiresIn: process.env.EXPIRES_IN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CB_URL,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackUrl: process.env.GITHUB_CB_URL,
    clientUrl: process.env.CLIENT_URL,
  },

  upload: {
    dir: process.env.APP_UPLOAD_DIR,
  },
  db: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) ?? 5432,
    user: process.env.POSTGRES_USER ?? 'postgres',
    pass: process.env.POSTGRES_PASSWORD ?? 'postgres',
    name: process.env.POSTGRES_DB ?? 'postgres',
  },
  mailer: {
    host: process.env.EMAIL_HOST,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  log: {
    token: process.env.LOG_TOKEN,
    dir: process.env.APP_LOGS_DIR,
  },

  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) ?? 6379,
    password: process.env.REDIS_PASSWORD,
  },
})

export default config

export const connectionSource = new DataSource({
  type: 'postgres',
  host: config().db.host,
  port: config().db.port,
  username: config().db.user,
  password: config().db.pass,
  database: config().db.name,
  migrations: [path.join(__dirname, 'db', 'migration', '**', '*.js')],
})
