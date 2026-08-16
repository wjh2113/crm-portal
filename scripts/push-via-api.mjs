/**
 * Push the current HEAD commit to GitHub via the Git Data API.
 * Workaround when git HTTPS cannot reach github.com:443 but `gh` can.
 *
 * Usage: node scripts/push-via-api.mjs [owner/repo]
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

const repo = process.argv[2] || 'wjh2113/crm-portal'
const token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim()
const api = 'https://api.github.com'

async function gh(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${api}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'crm-portal-push-script',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text}`)
  }
  return data
}

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const message = execFileSync('git', ['log', '-1', '--pretty=%B'], { encoding: 'utf8' }).trim()
console.log(`Pushing ${files.length} files to ${repo}`)
console.log(`Commit message: ${message.split('\n')[0]}`)

// Empty repos reject git/blobs until at least one commit exists.
let parentSha = null
try {
  const ref = await gh(`/repos/${repo}/git/ref/heads/main`)
  parentSha = ref.object.sha
} catch {
  console.log('Seeding empty repository via Contents API...')
  const seeded = await gh(`/repos/${repo}/contents/README.md`, {
    method: 'PUT',
    body: {
      message: 'chore: initialize repository',
      content: Buffer.from('# CRM Portal\n').toString('base64'),
    },
  })
  parentSha = seeded.commit.sha
}

const treeItems = []
for (const file of files) {
  const buf = readFileSync(file)
  const blob = await gh(`/repos/${repo}/git/blobs`, {
    method: 'POST',
    body: {
      content: buf.toString('base64'),
      encoding: 'base64',
    },
  })
  treeItems.push({
    path: file.replaceAll('\\', '/'),
    mode: '100644',
    type: 'blob',
    sha: blob.sha,
  })
  console.log(`  blob ${basename(file)}`)
}

const tree = await gh(`/repos/${repo}/git/trees`, {
  method: 'POST',
  body: { tree: treeItems },
})
console.log(`tree ${tree.sha}`)

const commit = await gh(`/repos/${repo}/git/commits`, {
  method: 'POST',
  body: {
    message,
    tree: tree.sha,
    parents: parentSha ? [parentSha] : [],
  },
})
console.log(`commit ${commit.sha}`)

await gh(`/repos/${repo}/git/refs/heads/main`, {
  method: 'PATCH',
  body: { sha: commit.sha, force: true },
})

console.log(`Done: https://github.com/${repo}`)
