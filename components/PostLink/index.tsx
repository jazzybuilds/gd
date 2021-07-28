import * as React from 'react'
import NextLink from 'next/link'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  slug: string
}

const PostLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ children, onClick, slug, ...rest }, ref) => {
    return (
      <NextLink href={{ pathname: '/blog/[slug]', query: { slug } }} passHref>
        <a {...rest} onClick={onClick} ref={ref}>
          {children}
        </a>
      </NextLink>
    )
  }
)

export default PostLink
