import * as functions from "firebase-functions";
const { default: next } = require('next')

const nextjsDistDir = '.next'

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
})
const nextjsHandle = nextjsServer.getRequestHandler()

export default functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    return nextjsServer.prepare().then(() => nextjsHandle(req, res))
  })
