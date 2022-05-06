import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// import { chromium, firefox, webkit } from 'playwright'

import fs from 'fs'
import path, { win32 } from 'path'

import puppeteer from 'puppeteer-extra'
import UserAgent from 'user-agents'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin())

/*
TODO
Change to Puppeteer if stealth works
*/

/*
  TODO
  Create the rest of accounts
  Keep them logged
  Reacts at post to like
 
  Navigate to profile page
  Exclude pinned twit
  Exclude data-testid="unlike"
 
  - Launch different browser to each account
  - Set a UserAgent for each account according correct browser
  - Login each account

  - When have a new twitt
    - Find the first main @
    - Test if has data-testid="like"
      - If Yes
        - Click like
          - If isn't a reply OR If isn't sequences twitt (thread) 
            - Click share
      - If No
        - Quit loop
*/
const envDev = process.env.NODE_ENV === 'development'

const users = [
  // {
  //   name: process.env.MAIN_NAME,
  //   user: process.env.MAIN_USER,
  //   password: process.env.MAIN_PASS,
  //   //browser: chromium,
  //   //userAgent: userAgents.windowsChrome
  //   userAgent: new userAgent({ userAgent: /Chrome/ }).toString()
  // },
  // {
  //   name: process.env.SMURF_NAME,
  //   user: process.env.SMURF_USER,
  //   password: process.env.SMURF_PASS,
  //   // browser: firefox,
  //   // userAgent: userAgents.windowsChrome
  //   //browser: chromium,
  //   userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
  //   //userAgent: userAgents.windowsEdge
  // },
  // {
  //   name: process.env.BRASA_NAME,
  //   user: process.env.BRASA_USER,
  //   password: process.env.BRASA_PASS,
  //  // browser: chromium,
  //  userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
  //  //userAgent: userAgents.androidChrome
  // },
  // {
  //   name: process.env.RAULEITE_NAME,
  //   user: process.env.RAULEITE_USER,
  //   password: process.env.RAULEITE_PASS,
  //   //browser: chromium,
  //   userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
  //   //userAgent: userAgents.appleChrome
  // },
  {
    name: process.env.JOMARIOLSON_NAME,
    user: process.env.JOMARIOLSON_USER,
    password: process.env.JOMARIOLSON_PASS,
    // browser: chromium,
    userAgent: new UserAgent({ userAgent: /Chrome/ }).toString()
    // userAgent: userAgents.iosChrome
    // browser: webkit,
    // userAgent: userAgents.appleSafari
  }
]

const waitFeedLoads = async (page, selector, options) => {
  const { useTimeoutOnDev = false } = options || {}

  if (useTimeoutOnDev && envDev) {
    console.info('using timeout')
    return page.waitForTimeout(10000);
  }

  console.info('using waiting feed selector')
  return page.waitForSelector(selector.like, {
    // strict: true,
    timeout: 10000
  })

  // await page.waitForLoadState('networkidle');

  // await page.waitForNavigation({
  //   timeout: 1000000
  // });

}
const createDir = (baseDir, dateBase) => {
  const dir = path.normalize(
    `./${baseDir}/${dateBase.getFullYear()}_${dateBase.getMonth()}_${dateBase.getDay()}_${dateBase.getHours()}_${dateBase.getMinutes()}_${dateBase.getSeconds()}`
  )
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

const runBrowserForUser = async (user) => {
  // with playwright instead puppeteer
  // const browser = await user.browser.launch({
  // const context = await browser.newContext();
  // const page = await context.newPage({
  // const userAgent = new UserAgent();
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

  // await page.goto('https://ipinfo.io', {
  //   waitUntil: 'networkidle2',
  // });
  // await page.goto('https://whatismyipaddress.com/', {
  //   waitUntil: 'networkidle2',
  // });
  // await page.goto('https://www.purevpn.com/what-is-my-ip', {
  //   waitUntil: 'networkidle2',
  // });
  await page.goto('https://twitter.com/i/flow/login', {
    waitUntil: 'networkidle2',
  });

  const rootDir = 'screenshots'
  const baseDir = createDir(rootDir, new Date())

  await page.screenshot({
    path: `${baseDir}/login_${user.user}.png`,
  });

  const input = {
    user: 'input[type="text"]',
    password: 'input[type="password"]'
  }

  const selector = {
    like: 'div[data-testid="like"]',
    retweet: 'div[data-testid="retweet"]',
    main: 'article[data-testid="tweet"]',
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

  await waitFeedLoads(page, selector, {
    useTimeoutOnDev: true
  })

  await page.screenshot({
    path: `${baseDir}/wait_feed_inputPassword_${user.user}.png`,
  });

  console.info('a')

  // await page.goto(`https://twitter.com/{process.env.MAIN_USER}/with_replies`, {
  await page.goto(`https://twitter.com/${process.env.JOMARIOLSON_USER}/with_replies`, {
    waitUntil: 'networkidle2',
  });
  const repliesDir = createDir(baseDir, new Date())

  await page.waitForTimeout(1000)
  console.info('b')

  await page.screenshot({
    path: `${repliesDir}/replies_${user.user}.png`,
    fullPage: true,
    timeout: 10000
  });

  console.info('c')

  const nameAndUser = `${user.name.replace(' ', '\\s')}@${user.user}`
  console.log('nameAndUser', nameAndUser)

  await page.waitForSelector(selector.main)

  const tweetsRaw = await page.evaluate(selector => {
    // const main = document.querySelectorAll(selector.main)
    return Array.from(
      // main,
      document.querySelectorAll(selector.main),
      (element) => {
        return element.textContent
      }
    )
  }, selector)

  // normalize enter and concatenation
  // and add index
  const tweets = tweetsRaw.map((t, i) => {
    return [t.replace(/(\r\n|\n|\r)/gm, ''), i]
  })

  const toLike = new RegExp(`^${nameAndUser}.*`)
  const replyAndRetweetsPattern = new RegExp(`^${nameAndUser}.*(\\d.*Replying\\sto\\s@|Retweeted.*)`)
  const threadsToRetweetPattern = new RegExp(`^${nameAndUser}.*1Show\\sthis\\sthread$`)
  const isThread = new RegExp(`^${nameAndUser}.*Show\\sthis\\sthread$`)

  const tweetsToLike = tweets.filter(t => {
    return toLike.test(t[0])
  })

  const likes = await page.$$(selector.like)
  console.log('likes.length', likes.length)

  for (const [, i] of tweetsToLike) {
    // tweetsToLike.forEach(async ([t, i]) => {
    // likes[i].click()
    console.log('i', i)
    await page.evaluate((element) => {
      element.click()
    }, likes[i])

    await page.screenshot({
      path: `${repliesDir}/like${i}_${user.user}.png`,
      fullPage: true
    });
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000)
  }
  console.info('tweetsToLike', tweetsToLike)

  const notReplyAndRetweets = tweets.filter(t => {
    return !replyAndRetweetsPattern.test(t[0])
  })

  const tweetsToRetweet = notReplyAndRetweets.filter(t => {
    const tweet = t[0]
    if (isThread.test(tweet)) {
      return threadsToRetweetPattern.test(tweet)
    }
    return true
  })

  const retweet = await page.$$(selector.retweet)
  for (const [, i] of tweetsToRetweet) {
    console.log('i', i)
    // likes[i].click()
    await page.evaluate((element) => {
      element.click()
    }, retweet[i])

    await page.screenshot({
      path: `${repliesDir}/retweet_${i}_${user.user}.png`,
      timeout: 10000,
      fullPage: true
    });

    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000)
  }
  console.info('tweetsToRetweet', tweetsToRetweet)

  await page.waitForTimeout(2000);
  await browser.close();
}

users.forEach(user => {
  runBrowserForUser(user)
});

function evaluateLogConfig(page) {
  page.on('console', async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });
}

// const userAgents = {
//   windowsEdge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4482.0 Safari/537.36 Edg/92.0.874.0',
//   // windowsEdge: new UserAgent({ deviceCategory: 'desktop', platform: 'Win32' }).toString(),
//   windowsChrome: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.7113.93 Safari/537.36',
//   windowsFirefox: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
//   appleSafari: '5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
//   appleChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.3538.77 Safari/537.36',
//   androidChrome: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
//   iosSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Snapchat/10.77.5.59 (like Safari/604.1)',
//   iosChrome: 'Mozilla/5.0 (iPod; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1'
//   // iosChrome: new UserAgent({ deviceCategory: 'mobile' })
// }
