import path from 'path'
import { GatsbyNode } from 'gatsby'
import AllMarkdownRemark from '../src/models/AllMarkdownRemark'
import { generateSlug } from '../src/utils/slugs'

const createPages: GatsbyNode['createPages'] = ({ actions, graphql }) => {
  const { createPage } = actions
  const postTemplate = path.resolve(`src/templates/Post.tsx`)
  return graphql(`
    {
      allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 10) {
        edges {
          node {
            excerpt(pruneLength: 250)
            body
            id
            frontmatter {
              date
              title
              category
              tags
              banner
              # bannerAttribution
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    const allMdx = (result.data as any).allMdx as AllMarkdownRemark
    const posts = allMdx.edges
    posts.forEach(({ node }, index) => {
      const next = index === 0 ? null : posts[index - 1].node
      const prev = index === posts.length - 1 ? null : posts[index + 1].node
      createPage({
        path: `/blog/${generateSlug(node.frontmatter.title)}`,
        component: postTemplate,
        context: {
          prev,
          next,
          id: node.id,
          slug: generateSlug(node.frontmatter.title)
        }
      })
    })
  })
}
exports.createPages = createPages
