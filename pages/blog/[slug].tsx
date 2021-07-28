import * as React from 'react'
import { PostOrPage } from '@tryghost/content-api'
import { GetStaticPaths, GetStaticProps } from 'next'
import NextHead from 'next/head'
import { format, isEqual } from 'date-fns'

import { getAllBlogPosts, getBlogPostBySlug } from '../../lib/ghost-cms'

interface Props extends PostOrPage {}

const Article: React.FC<Props> = ({
  html,
  published_at,
  title,
  updated_at,
}) => {
  return (
    <>
      <NextHead>
        <script
          async
          crossOrigin="anonymous"
          integrity="sha512-axJX7DJduStuBB8ePC8ryGzacZPr3rdLaIDZitiEgWWk2gsXxEFlm4UW0iNzj2h3wp5mOylgHAzBzM4nRSvTZA=="
          referrerPolicy="no-referrer"
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"
        />
        <script
          async
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-bash.min.js"
          type="text/javascript"
        />
        <script
          async
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-markup.min.js"
          type="text/javascript"
        />
        <script
          async
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-yaml.min.js"
          type="text/javascript"
        />
      </NextHead>
      <header>
        <h1>{title}</h1>
        <div>
          <div>
            <div className="flex flex-col">
              <p>{`${format(new Date(published_at!), 'PPP')}`}</p>
              {/* Check if the dates are the same and if they are don't render.
              Do this because Ghost CMS populates updated_at at create time. */}
              {isEqual(new Date(published_at!), new Date(updated_at!)) && (
                <span>Updated: {format(new Date(updated_at!), 'PPP')}</span>
              )}
            </div>
          </div>
        </div>
      </header>
      <article dangerouslySetInnerHTML={{ __html: html! }} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllBlogPosts()

  return {
    fallback: false,
    paths: posts.map(({ slug }) => `/blog/${slug}`),
  }
}

export const getStaticProps: GetStaticProps<Props> = async ctx => {
  try {
    const post = await getBlogPostBySlug(ctx.params!.slug as string)
    return {
      props: post,
    }
  } catch (error) {
    throw new Error(error)
  }
}

export default Article
