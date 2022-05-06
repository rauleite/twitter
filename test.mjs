let tweets = [
  'Marilson João@jomariolson·43sThread ending with 1Show this thread',
  'Marilson João@jomariolson·43sThread ending with 11Show this thread',
  'Marilson João@jomariolson·1hSimples',
  'Marilson João@jomariolson·1hThread B 2\n' +
  'Thread B 2\n' +
  'Thread B 2Show this thread',
  'Marilson João@jomariolson·1hThread B 1\n' +
  'Thread B 1\n' +
  'Thread B 11Show this thread',
  'Marilson João@jomariolson·1hThread A 2\n' +
  'Thread A 2\n' +
  'Thread A 2Show this thread',
  'Marilson João@jomariolson·1hThread A 1\n' +
  'Thread A 1\n' +
  'Thread A 11Show this thread',
  'Marilson João@jomariolson·May 3Replying to @MakeItAQuote and @kudimellBoa',
  'Marilson João RetweetedRafael Portugal @rafaelportugal·May 1Quem te critica com o instagran no privado não tem moral pra te criticar.491092,864',
  'Marilson João@jomariolson·May 3Replying to @rafaelportugalExcelente reflexão',
  'Marilson João@jomariolson·May 3Replying to @rafaelportugalBom dia de tarde'
].map(t => {
  return t.replace(/(\r\n|\n|\r)/gm, ' ')
})

console.log('year', new Date().getFullYear())
process.exit()
console.info('tweets.length', tweets.length)

const name = "Marilson\\sJoão"
const user = "jomariolson"

// like and not retweet
const replyAndRetweetsPattern = new RegExp(`^${name}.*(\\d.*Replying\\sto\\s@|Retweeted.*)`)
const threadsToRetweetPattern = new RegExp(`^${name}.*1Show\\sthis\\sthread$`)
const isThread = new RegExp(`^${name}.*Show\\sthis\\sthread$`)

const replyAndRetweets = tweets.filter((t => {
  return !replyAndRetweetsPattern.test(t)
}))
console.info('replyAndRetweets', replyAndRetweets)

const threadsToRetweet = replyAndRetweets.filter(t => {
  console.info('t', t)
  if (isThread.test(t)) {
    return threadsToRetweetPattern.test(t)
  }
  return true
})
console.info('threadsToRetweet', threadsToRetweet)
