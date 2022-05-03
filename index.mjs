import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { chromium, firefox, webkit } from 'playwright'

// (async () => {
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
  //   userName: process.env.MAIN_USER,
  //   password: process.env.MAIN_PASS,
  //   browser: chromium,
  //   userAgent: userAgents.windowsChrome
  // },
  // {
  //   userName: process.env.SMURF_USER,
  //   password: process.env.SMURF_PASS,
  //   // browser: firefox,
  //   // userAgent: userAgents.windowsChrome
  //   browser: chromium,
  //   userAgent: userAgents.windowsEdge
  // },
  // {
  //   userName: process.env.BRASA_USER,
  //   password: process.env.BRASA_PASS,
  //   browser: chromium,
  //   userAgent: userAgents.androidChrome
  // },
  // {
  //   userName: process.env.RAULEITE_USER,
  //   password: process.env.RAULEITE_PASS,
  //   browser: chromium,
  //   userAgent: userAgents.appleChrome
  // },
  {
    userName: process.env.JOMARIOLSON_USER,
    password: process.env.JOMARIOLSON_PASS,
    browser: chromium,
    userAgent: userAgents.iosChrome
    // browser: webkit,
    // userAgent: userAgents.appleSafari
  }
]
const runBrowserForUser = async (user) => {
  const browser = await user.browser.launch({
    // headless: false
  });
  const context = await browser.newContext();

  const page = await context.newPage({
    userAgent: user.userAgent
  });
  // const repliesPage = await context.newPage({
  //   userAgent: user.userAgent
  // });

  await page.goto('https://twitter.com/i/flow/login', {
    waitUntil: 'networkidle',
  });

  const input = {
    userName: 'input[type="text"]',
    password: 'input[type="password"]'
  }

  const selector = {
    like: 'div[data-testid="like"]',
    // main: 'article[data-testid="tweet"]'
    main: 'a'
  }

  await page.fill(input.userName, user.userName);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.fill(input.password, user.password);

  await page.screenshot({
    path: `screenshots/${user.userName}_0.png`,
    // fullPage: true 
  });

  await page.click('div[data-testid="LoginForm_Login_Button"]');

  // await page.waitForNavigation({
  //   timeout: 1000000
  // });

  // await page.waitForLoadState('networkidle');

  // await page.waitForSelector(selector.like, {
  //   // strict: true,
  //   timeout: 1000000
  // })

  await page.waitForTimeout(10000); // wait for 2 seconds

  await page.screenshot({
    path: `screenshots/${user.userName}_1.png`,
    // fullPage: true 
  });

  console.log('a')
  await page.goto('https://twitter.com/cap_planalto/with_replies', {
    waitUntil: 'networkidle',
  });
  console.log('b')

  // await page.waitForNavigation({
  //   timeout: 1000000
  // });
  await page.waitForSelector(selector.like, {
    // strict: true,
    timeout: 1000000
  })
  await page.screenshot({
    path: `screenshots/${user.userName}_2.png`,
    // fullPage: true,
    timeout: 1000000
  });

  // const innerHtmls = await page.locator(selector.main).innerHTML();
  // // const innerHtmls = await page.content();
  // console.log('-------')
  // console.log('innerHtmls', innerHtmls)
  // console.log('-------')

  // await page.waitForSelector(selector.like)
  // page.click(selector.like);

  // await repliesPage.waitForTimeout(2000); // wait for 2 seconds



  await browser.close();
}

users.forEach(user => {
  runBrowserForUser(user)
});

// })();
