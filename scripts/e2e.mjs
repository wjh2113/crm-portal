/**
 * Lightweight end-to-end smoke test against the running Vite app.
 * Usage: node scripts/e2e.mjs [baseUrl]
 */
import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:5174'
const routes = [
  { path: '/', expect: /把常见问题|CRM/ },
  { path: '/faq', expect: /常见问题/ },
  { path: '/sop', expect: /SOP/ },
  { path: '/tools', expect: /常用工具/ },
  { path: '/manuals', expect: /操作手册/ },
  { path: '/recordings', expect: /录屏/ },
  { path: '/rules', expect: /业务规则/ },
  { path: '/notices', expect: /系统通知/ },
  { path: '/service-star', expect: /服务之星/ },
  { path: '/search?q=工单', expect: /搜索结果/ },
]

const failures = []

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

page.on('pageerror', (err) => {
  failures.push(`pageerror: ${err.message}`)
})
page.on('console', (msg) => {
  if (msg.type() === 'error') failures.push(`console.error: ${msg.text()}`)
})

console.log(`E2E against ${base}`)

for (const route of routes) {
  const url = `${base}${route.path}`
  const response = await page.goto(url, { waitUntil: 'networkidle' })
  const status = response?.status() ?? 0
  const title = (await page.locator('h1').first().textContent().catch(() => null))?.trim() ?? ''
  const brand = await page.getByText('CRM 知识门户').count()
  if (status >= 400 || !route.expect.test(title) || brand < 1) {
    failures.push(`route ${route.path}: status=${status} title="${title}" brand=${brand}`)
    console.log(`FAIL  ${route.path}  status=${status} title="${title}"`)
  } else {
    console.log(`OK    ${route.path}  → ${title}`)
  }
}

await page.goto(base, { waitUntil: 'networkidle' })
await page.locator('h1', { hasText: '把常见问题' }).waitFor()
const searchInput = page.locator('input[name="q"]')
await searchInput.click()
await searchInput.fill('')
await searchInput.pressSequentially('客户', { delay: 40 })
await Promise.all([
  page.waitForURL((url) => url.pathname === '/search' && Boolean(url.searchParams.get('q'))),
  page.getByRole('button', { name: '搜索' }).click(),
])
await page.locator('h1', { hasText: '搜索结果' }).waitFor()
const searchTitle = (await page.locator('h1').first().textContent())?.trim()
const resultButtons = await page.locator('main button.w-full').count()
const searchUrl = page.url()
console.log(`OK    search flow → ${searchTitle} (${resultButtons} results) @ ${searchUrl}`)
if (!searchTitle?.includes('搜索') || resultButtons < 1 || !searchUrl.includes('/search')) {
  failures.push(`search flow failed title=${searchTitle} results=${resultButtons} url=${searchUrl}`)
}

await page.goto(`${base}/faq`, { waitUntil: 'networkidle' })
await page.locator('main button.w-full').first().click()
const detail = (await page.locator('main aside h2').first().textContent())?.trim()
console.log(`OK    faq detail → ${detail}`)
if (!detail) failures.push('faq detail panel empty')

await page.goto(`${base}/service-star`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: '投 TA 一票' }).first().click()
const voted = await page.getByRole('button', { name: /^已投票$/ }).count()
const locked = await page.getByRole('button', { name: /^本月已投票$/ }).count()
console.log(`OK    vote → voted=${voted} locked=${locked}`)
if (voted !== 1 || locked !== 3) failures.push(`vote state unexpected voted=${voted} locked=${locked}`)

await page.goto(`${base}/not-a-real-page`, { waitUntil: 'networkidle' })
await page.waitForURL((url) => url.pathname === '/')
console.log('OK    unknown route redirects home')

await browser.close()

if (failures.length) {
  console.error('\nFAILURES:')
  for (const f of failures) console.error('-', f)
  process.exit(1)
}

console.log('\nAll E2E checks passed.')
