import 'dotenv/config'

import http from 'http'
import fs from 'fs'
import path from 'path'

import { inspect } from 'util'
import { stringify, parse } from '@ungap/structured-clone/json';
import UserAgent from 'user-agents'

export const getReqData = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      let data = "";
      // listen to data sent by client
      req.on("data", (chunk) => {
        // append the string version to the data
        data += chunk;
      });
      // listen till the end
      req.on("end", () => {
        // send back the data
        // resolve(JSON.parse(data));
        resolve(parse(data));
        // resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export const evaluateLogConfig = page => {
  page.on('console', async msg => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });
}

export const onInterrupt = browser => {
  process.on('SIGINT', async () => {
    await browser.close();
    console.log("Browser closed");
    process.exit();
  })
}

export const initPuppeteer = async user => new Promise((resolve, reject) => {
  // if (user.puppeteerBrowser) {
  //   return user.puppeteerBrowser
  // }
  const options = {
    hostname: '127.0.0.1',
    port: '8000',
    path: '/initPuppeteer',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Length': users.length
    }
  }

  const req = http.request(options, async (res) => {
    console.log('Status Code:', res.statusCode);
    const data = await getReqData(res)
    console.log('data', inspect(data))
    resolve(data)
  })
  req.write(stringify(user))
  req.end()
})

export const users = [
  // {
  //   name: process.env.MAIN_NAME,
  //   user: process.env.MAIN_USER,
  //   password: process.env.MAIN_PASS,
  //   //browser: chromium,
  //   //userAgent: userAgents.windowsChrome
  //   puppeteerBrowser: null,
  //   isLogged: false,
  //   userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
  // },
  // {
  //   name: process.env.SMURF_NAME,
  //   user: process.env.SMURF_USER,
  //   password: process.env.SMURF_PASS,
  //   // browser: firefox,
  //   // userAgent: userAgents.windowsChrome
  //   //browser: chromium,
  //   puppeteerBrowser: null,
  //   isLogged: false,
  //   userAgent: new UserAgent({ userAgent: /Chrome/ }).toString(),
  //   //userAgent: userAgents.windowsEdge
  // },
  {
    name: process.env.BRASA_NAME,
    user: process.env.BRASA_USER,
    password: process.env.BRASA_PASS,
    // browser: chromium,
    puppeteerBrowser: null,
    isLogged: false,
    userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
    //userAgent: userAgents.androidChrome
  },
  {
    name: process.env.RAULEITE_NAME,
    user: process.env.RAULEITE_USER,
    password: process.env.RAULEITE_PASS,
    //browser: chromium,
    puppeteerBrowser: null,
    isLogged: false,
    userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
    //userAgent: userAgents.appleChrome
  },
  {
    name: process.env.JOMARIOLSON_NAME,
    user: process.env.JOMARIOLSON_USER,
    password: process.env.JOMARIOLSON_PASS,
    // browser: chromium,
    puppeteerBrowser: null,
    isLogged: false,
    userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
    // userAgent: userAgents.iosChrome
    // browser: webkit,
    // userAgent: userAgents.appleSafari
  }
]

export const createDir = (baseDir, dateBase) => {
  const dir = path.normalize(
    `./${baseDir}/${dateBase.getFullYear()}_${dateBase.getMonth()}_${dateBase.getDay()}_${dateBase.getHours()}_${dateBase.getMinutes()}_${dateBase.getSeconds()}`
  )
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

