import * as React from 'react'
import { GetStaticProps } from 'next'
import { PostsOrPages } from '@tryghost/content-api'
import { format } from 'date-fns'

import PostLink from '../../components/PostLink'
import { getAllBlogPosts } from '../../lib/ghost-cms'

interface Props {
  posts: PostsOrPages
}

const BlogIndex: React.FC<Props> = ({ posts }) => {
  return (
    <div>
      <h1>Blog Index</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <PostLink slug={post.slug}>
              {post.title} - {format(new Date(post.published_at), 'PPP')}
            </PostLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async ({}) => {
  try {
    const posts = await getAllBlogPosts()
    return {
      props: { posts },
    }
  } catch (error) {
    throw new Error(error)
  }
}

export default BlogIndex
