import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// import { chromium, firefox, webkit } from 'playwright'
import puppeteer from 'puppeteer'

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

const userAgents = {
  windowsEdge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4482.0 Safari/537.36 Edg/92.0.874.0',
  windowsChrome: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.7113.93 Safari/537.36',
  windowsFirefox: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
  appleSafari: '5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
  appleChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.3538.77 Safari/537.36',
  androidChrome: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
  iosSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Snapchat/10.77.5.59 (like Safari/604.1)',
  iosChrome: 'Mozilla/5.0 (iPod; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1'
}
const users = [
  // {
  //   name: process.env.MAIN_NAME,
  //   user: process.env.MAIN_USER,
  //   password: process.env.MAIN_PASS,
  //   //browser: chromium,
  //   userAgent: userAgents.windowsChrome
  // },
  // {
  //   name: process.env.SMURF_NAME,
  //   user: process.env.SMURF_USER,
  //   password: process.env.SMURF_PASS,
  //   // browser: firefox,
  //   // userAgent: userAgents.windowsChrome
  //   //browser: chromium,
  //   userAgent: userAgents.windowsEdge
  // },
  // {
  //   name: process.env.BRASA_NAME,
  //   user: process.env.BRASA_USER,
  //   password: process.env.BRASA_PASS,
  //  // browser: chromium,
  //   userAgent: userAgents.androidChrome
  // },
  // {
  //   name: process.env.RAULEITE_NAME,
  //   user: process.env.RAULEITE_USER,
  //   password: process.env.RAULEITE_PASS,
  //   //browser: chromium,
  //   userAgent: userAgents.appleChrome
  // },
  {
    name: process.env.JOMARIOLSON_NAME,
    user: process.env.JOMARIOLSON_USER,
    password: process.env.JOMARIOLSON_PASS,
    // browser: chromium,
    userAgent: userAgents.iosChrome
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
    timeout: 1000000
  })

  // await page.waitForLoadState('networkidle');

  // await page.waitForNavigation({
  //   timeout: 1000000
  // });

}

const runBrowserForUser = async (user) => {
  // with playwright instead puppeteer
  // const browser = await user.browser.launch({
  // const context = await browser.newContext();
  // const page = await context.newPage({

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    // headless: false
  });

  const page = await browser.newPage({
    userAgent: user.userAgent
  });

  await page.goto('https://twitter.com/i/flow/login', {
    waitUntil: 'networkidle2',
  });

  const input = {
    user: 'input[type="text"]',
    password: 'input[type="password"]'
  }

  const selectorMain = 'article[data-testid="tweet"]'
  const selector = {
    like: 'div[data-testid="like"]',
    main: selectorMain,
    isMainProfile: `${selectorMain}`
  }

  // await page.fill(input.user, user.user);
  // await page.$eval(input.user, (el, user) => {
  //   return el.value = user.user
  // }, user);

  await page.focus(input.user)
  await page.keyboard.type(user.user)

  await page.screenshot({
    path: `screenshots/${user.user}_test_.png`,
    // fullPage: true 
  });



  // const userElem = await page.$(input.user)
  // const nextElem = await page.$x("//div[@role='button']")
  // const nextElem = await page.$x("//*[text()[contains(., 'Next')]]")
  // console.info('userElem', userElem)
  // console.info('nextElem', nextElem[0])

  // await nextElem[0].click()
  // await nextElem[0].focus()

  // await userElem.focus()
  // await userElem.press('Tab')
  // await userElem.press('Tab')
  // await userElem.press('Enter')
  await page.keyboard.press('Tab');

  // await page.waitForTimeout(3000);
  await page.screenshot({
    path: `screenshots/${user.user}_test_0.png`,
    // fullPage: true 
  });
  await page.keyboard.press('Enter');
  // await page.focus()

  // await page.fill(input.password, user.password);
  // await page.$eval(input.password, el => el.value = user.password);
  // await page.waitForTimeout(3000);
  // await page.screenshot({
  //   path: `screenshots/${user.user}_test_1.png`,
  //   // fullPage: true 
  // });

  // await page.waitForNavigation({
  //   // timeout: 1000000
  // });

  await page.waitForSelector(input.password, {
    timeout: 3000
  })

  await page.screenshot({
    path: `screenshots/${user.user}_test_2.png`,
    // fullPage: true 
  });
  await page.focus(input.password)
  await page.keyboard.type(user.password)
  // await page.$eval(input.password, (el, user) => {
  //   return el.value = user.password
  // }, user);

  await page.screenshot({
    path: `screenshots/${user.user}_0.png`,
    // fullPage: true 
  });

  if (!envDev) {
    console.info('clicked to login')
    await page.click('div[data-testid="LoginForm_Login_Button"]');
  }

  await waitFeedLoads(page, selector, {
    useTimeoutOnDev: true
  })

  await page.screenshot({
    path: `screenshots/${user.user}_1.png`,
    // fullPage: true 
  });

  console.info('a')

  // await page.goto(`https://twitter.com/{process.env.MAIN_USER}/with_replies`, {
  await page.goto(`https://twitter.com/${process.env.JOMARIOLSON_USER}/with_replies`, {
    waitUntil: 'networkidle2',
    // timeout: 1000000
  });
  console.info('b')

  // await waitFeedLoads(page, selector)

  await page.screenshot({
    path: `screenshots/${user.user}_2.png`,
    fullPage: true,
    timeout: 100000
  });

  console.info('c')

  const name = process.env.JOMARIOLSON_NAME.replace(' ', '\\s')

  // let tweets = await page.locator(selector.main).allTextContents()
  // const tweetsElement = await page.$$(selector.main) // locator(selector.main).allTextContents()
  // let tweets = await page.evaluate(el => el.textContent, tweetsElement)
  // let tweets = await page.evaluate(el => el.textContent, tweetsElement)
  const tweetsRaw = await page.evaluate((selector) => {
    return Array.from(
      document.querySelectorAll(selector.main),
      (element) => element.textContent
    )
  }, selector)

  // normalize enter and concatenation
  // and add index
  const tweets = tweetsRaw.map((t, i) => {
    return [t.replace(/(\r\n|\n|\r)/gm, ''), i]
  })

  const replyAndRetweetsPattern = new RegExp(`^${name}.*(\\d.*Replying\\sto\\s@|Retweeted.*)`)
  const threadsToRetweetPattern = new RegExp(`^${name}.*1Show\\sthis\\sthread$`)
  const isThread = new RegExp(`^${name}.*Show\\sthis\\sthread$`)

  const replyAndRetweets = tweets.filter(t => {
    return !replyAndRetweetsPattern.test(t[0])
  })

  const threadsToRetweet = replyAndRetweets.filter(t => {
    const tweet = t[0]
    if (isThread.test(tweet)) {
      return threadsToRetweetPattern.test(tweet)
    }
    return true
  })

  console.info('threadsToRetweet', threadsToRetweet)

  await page.waitForTimeout(1000);
  await browser.close();
}

users.forEach(user => {
  runBrowserForUser(user)
});


