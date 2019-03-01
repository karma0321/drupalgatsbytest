/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`)
const transliteration = require('transliteration')
const createPaginatedPages = require('gatsby-paginate')

// Create a slug for each article and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `node__article`) {
    const slugFragment = transliteration.slugify(node.title)
    const slug = `/blog/${slugFragment}/`
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve(`src/templates/BlogPost.js`)
    // Query for article nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allNodeArticle(
              sort: { fields: [created], order: DESC }
            ) {
              edges {
                node {
                  title
                  created(formatString: "MMM DD, YYYY")
                  fields {
                    slug
                  }
                  body{
                    value
                    format
                    processed
                    summary
                  }
                  relationships{
                  	field_tags{
                      name
                    }
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        // Create pages for each article.
        createPaginatedPages({
          edges: result.data.allNodeArticle.edges,
          createPage: createPage,
          pageTemplate: 'src/templates/blog.js',
          pageLength: 10, // This is optional and defaults to 10 if not used
          pathPrefix: 'blog', // This is optional and defaults to an empty string if not used
          buildPath: (index, pathPrefix) =>
            index > 1 ? `${pathPrefix}/${index}` : `/${pathPrefix}`, // This is optional and this is the default
        })
        result.data.allNodeArticle.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug,
            component: postTemplate,
            context: {
              slug: node.fields.slug,
            },
          })
        })
      })
    )
  })
}
