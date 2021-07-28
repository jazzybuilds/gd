import GhostCMS from '@tryghost/content-api'

const api = new GhostCMS({
  key: process.env.GHOST_API_KEY || '',
  url: process.env.GHOST_API_URL || '',
  version: 'v3',
})

type ErrorResponse = { message: string }

const is404 = (error: ErrorResponse) => /not found/i.test(error.message)

export async function getAllBlogPosts() {
  try {
    return await api.posts.browse({
      limit: 'all',
      order: 'published_at DESC',
    })
  } catch (error) {
    if (is404(error)) return
    throw new Error(`[getAllBlogPosts]: ${error}`)
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await api.posts.read({ slug })
  } catch (error) {
    throw new Error(`[getBlogPostBySlug]: ${error}`)
  }
}
