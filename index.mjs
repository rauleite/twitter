import { initPuppeteer, users, createDir } from './utils.mjs'

const envDev = process.env.NODE_ENV === 'development'

const rootDir = 'screenshots'
const baseDir = createDir(rootDir, new Date())

const runBrowserForUser = async (users, index) => {
  const user = users[index]

  console.log('users', users)
  console.log('index', index)
  console.log('users[index]', users[index])

  // const { page, browser } = await initPuppeteer(user)
  const data = await initPuppeteer(user)

  console.log('data', data)
  // console.log('page', page)
  // console.log('browser', browser)

  process.exit()
  // user.puppeteerBrowser = await initPuppeteer(user)
  // let { browser, page } = user.puppeteerBrowser

  // if (!user.isUserLogged) {
  //   page = await login(page, user, baseDir)
  //   user.isUserLogged = true
  // }

  // const selector = {
  //   like: 'div[data-testid="like"]',
  //   retweet: 'div[data-testid="retweet"]',
  //   main: 'article[data-testid="tweet"]',
  // }

  // // await waitFeedLoads(page, selector, {
  // //   useTimeoutOnDev: true
  // // })

  // console.info('using timeout')
  // page.waitForTimeout(10000);

  // console.info('a')
  // const mainUser = process.env.MAIN_USER
  // const mainName = process.env.MAIN_NAME
  // const nameAndUser = `${user.name.replace(' ', '\\s')}@${user.user}`
  // // const nameAndUser = `${mainName.replace(' ', '\\s')}@${mainUser}`

  // // await page.goto(`https://twitter.com/${process.env.JOMARIOLSON_USER}/with_replies`, {
  // await page.goto(`https://twitter.com/${mainUser}/with_replies`, {
  //   waitUntil: 'networkidle2',
  // });
  // const repliesDir = createDir(baseDir, new Date())

  // await page.waitForTimeout(2000)
  // console.info('b')

  // await page.screenshot({
  //   path: `${repliesDir}/replies_${user.user}.png`,
  //   fullPage: true,
  //   timeout: 10000
  // });

  // console.info('c')

  // await page.waitForSelector(selector.main)

  // const tweetsRaw = await page.evaluate(selector => {
  //   // const main = document.querySelectorAll(selector.main)
  //   return Array.from(
  //     // main,
  //     document.querySelectorAll(selector.main),
  //     (element) => {
  //       return element.textContent
  //     }
  //   )
  // }, selector)

  // // normalize enter and concatenation
  // // and add index
  // const tweets = tweetsRaw.map((t, i) => {
  //   return [t.replace(/(\r\n|\n|\r)/gm, ''), i]
  // })

  // console.log('mainName', mainName)
  // console.log('mainUser', mainUser)
  // console.log('nameAndUser', nameAndUser)

  // console.log('tweets', tweets)

  // // const toLike = new RegExp(`^${nameAndUser}.*`)
  // // const toLike = new RegExp(`^${user.name}.*`)
  // const toLike = new RegExp(`^${mainName}.*`)

  // // const replyAndRetweetsPattern = new RegExp(`^${user.name}.*(\\d.*Replying\\sto\\s@|Retweeted.*)`)
  // const replyAndRetweetsPattern = new RegExp(`^${mainName}.*(\\d.*Replying\\sto\\s@|Retweeted.*)`)

  // // const threadsToRetweetPattern = new RegExp(`^${user.name}.*1Show\\sthis\\sthread$`)
  // const threadsToRetweetPattern = new RegExp(`^${mainName}.*1Show\\sthis\\sthread$`)

  // // const isThread = new RegExp(`^${user.name}.*Show\\sthis\\sthread$`)
  // const isThread = new RegExp(`^${mainName}.*Show\\sthis\\sthread$`)

  // const tweetsToLike = tweets.filter(t => {
  //   return toLike.test(t[0])
  // })

  // // // const mainTweets = await page.$$(selector.main)
  // // const likes = await page.$$(selector.like)
  // // console.log('likes.length', likes.length)
  // // // for (const [, i] of likes) {
  // // // tweetsToLike.forEach(async ([t, i]) => {
  // // // likes[i].click()
  // // for (const l of likes) {
  // //   await page.evaluate(async (element) => {
  // //     const text = element.textContent
  // //     console.log('text', text)

  // //     const toLike = new RegExp(`^${mainName}.*`)
  // //     if (toLike.test(text)) {
  // //       console.log('click like', text)
  // //       await element.click()
  // //     }
  // //   }, l)

  // // }

  // const likes = await page.$$(selector.like)
  // console.log('likes.length', likes.length)

  // for (const [, i] of tweetsToLike) {
  //   // tweetsToLike.forEach(async ([t, i]) => {
  //   // likes[i].click()
  //   console.log('i', i)
  //   await page.evaluate((element) => {
  //     element.click()
  //   }, likes[i])



  //   await page.screenshot({
  //     path: `${repliesDir}/like${i}_${user.user}.png`,
  //     fullPage: true
  //   });
  //   await page.waitForTimeout(1000)
  //   await page.keyboard.press('Escape');
  //   await page.waitForTimeout(1000)
  // }

  // console.info('tweetsToLike', tweetsToLike)

  // const notReplyAndRetweets = tweets.filter(t => {
  //   return !replyAndRetweetsPattern.test(t[0])
  // })

  // const tweetsToRetweet = notReplyAndRetweets.filter(t => {
  //   const tweet = t[0]
  //   if (isThread.test(tweet)) {
  //     return threadsToRetweetPattern.test(tweet)
  //   }
  //   return true
  // })

  // console.info('tweetsToRetweet', tweetsToRetweet)

  // if (isArrayEmpty(tweetsToLike) && isArrayEmpty(tweetsToRetweet)) {
  //   // if (isArrayEmpty([]) && isArrayEmpty([])) {
  //   await appTimeout(30000)
  //   console.log('-> call again', user.name)
  //   // self calling (with same user)
  //   await runBrowserForUser(users, index)
  //   return
  // }

  // // const retweet = await page.$$(selector.retweet)
  // for (const [, i] of tweetsToRetweet) {
  //   console.log('i', i)
  //   // likes[i].click()
  //   await page.evaluate((element) => {
  //     element.click()
  //   }, mainTweets[i])

  //   await page.screenshot({
  //     path: `${repliesDir}/retweet_${i}_${user.user}.png`,
  //     timeout: 10000,
  //     fullPage: true
  //   });

  //   await page.waitForTimeout(1000)
  //   await page.keyboard.press('Escape');
  //   await page.waitForTimeout(1000)
  // }

  // await page.waitForTimeout(2000);

  // // infinite loop
  // if (users.length - 1 <= index) {
  //   console.log('ENTROU')
  //   index = 0
  // } else {
  //   index++
  // }
  // console.log('users.length', users.length)
  // console.log('index', index)

  // await runBrowserForUser(users, index)
}

(async () => {
  // while (true) {
  // users.forEach(async (user, i) => {
  // console.log(`forEach ${i}`, user.name)
  await runBrowserForUser(users, 0)
  // });
  // }
})()

function isUserLogged(user) {
  return !!user.puppeteerBrowser
}

function isArrayEmpty(arr) {
  return Array.isArray(arr) && arr.length === 0
}

function appTimeout(delayms) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, delayms);
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
