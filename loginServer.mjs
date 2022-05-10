import http from 'http'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { stringify, parse } from '@ungap/structured-clone/json';

import { getReqData, evaluateLogConfig, onInterrupt } from './utils.mjs'

puppeteer.use(StealthPlugin())

const envDev = process.env.NODE_ENV === 'development'

const initPuppeteer = async (user) => {
  if (user.puppeteerBrowser) {
    return user.puppeteerBrowser
  }

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      // '--proxy-server=https=151.106.13.222:1080'
    ],
    // headless: false
  });

  const page = await browser.newPage({
    userAgent: user.userAgent
  });

  evaluateLogConfig(page)
  onInterrupt(browser)

  return { page, browser }
}

const login = async (page, user, baseDir) => {
  await page.goto('https://twitter.com/i/flow/login', {
    waitUntil: 'networkidle2',
  });

  // const rootDir = `screenshots/${user.user}`
  // baseDir = createDir(rootDir, new Date())

  await page.screenshot({
    path: `${baseDir}/login_${user.user}.png`,
  });

  const input = {
    user: 'input[type="text"]',
    password: 'input[type="password"]'
  }

  const inputUser = await page.waitForSelector(input.user)
  await inputUser.focus()
  await page.keyboard.type(user.user)

  await page.screenshot({
    path: `${baseDir}/inputUser_${user.user}.png`,
  });

  await page.keyboard.press('Tab');

  await page.screenshot({
    path: `${baseDir}/tab_${user.user}.png`,
  });
  await page.keyboard.press('Enter');

  // await page.fill(input.password, user.password);
  // await page.$eval(input.password, el => el.value = user.password);
  const inputPassword = await page.waitForSelector(input.password, {
    timeout: 10000
  })

  await page.screenshot({
    path: `${baseDir}/wait_inputPassword_${user.user}.png`,
  });

  await inputPassword.focus()
  await page.keyboard.type(user.password)

  await page.screenshot({
    path: `${baseDir}/inputPassword_${user.user}.png`,
  });

  if (!envDev) {
    console.info('clicked to login')
    await page.click('div[data-testid="LoginForm_Login_Button"]');
  }

  await page.screenshot({
    path: `${baseDir}/wait_feed_inputPassword_${user.user}.png`,
  });

  return page
}

const host = '127.0.0.1';
// const host = 'localhost';
const port = 8000;

const requestListener = async (req, res) => {
  if (req.url === "/initPuppeteer" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });

    console.log('server')




    // res.write("Hi there, This is a Vanilla Node.js API");
    const user = await getReqData(req)

    // console.log('user', user)

    const context = await initPuppeteer(user)

    console.log('context.page', context.page)
    console.log('context.browser', context.browser)

    // res.end(inspect(context));
    // res.end(JSON.stringify(context));
    res.end(stringify(context));
    // res.end(page);
  }

  // If no route present
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

