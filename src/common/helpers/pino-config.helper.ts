export const pinoConfig = (sourceToken: string) => ({
  genReqId: () => crypto.randomUUID(),
  redact: {
    paths: [
      'req.headers.authorization',
      'res.headers.authorization',
      'res.headers["x-powered-by"]',
    ],
    remove: true,
  },
  transport: {
    targets: [
      {
        level: 'trace',
        target: 'pino/file',
        options: {
          destination: 'logs/file.log',
        },
      },
      {
        level: 'trace',
        target: 'pino-pretty',
      },
      {
        level: 'trace',
        target: '@logtail/pino',
        options: { sourceToken },
      },
    ],
  },
})
