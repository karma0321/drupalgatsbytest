import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <span>{props.text}</span>
  }
}

const BlogPage = ({ pageContext }) => {
  console.log(pageContext)
  const { group, index, first, last, pageCount, pathPrefix } = pageContext
  const previousUrl = index - 1 === 1 ? 'blog/' : `${pathPrefix}/${index - 1}`
  const nextUrl = `${pathPrefix}/${index + 1}`

  const Paginator = () => (
    <div className="paginator">
      {index > 1 &&
        <NavLink className="previousLink" test={first} url={previousUrl} text="Go to Previous Page" />
      }
      {index > 1 && index < pageCount &&
        <span> | </span>
      }
      { index < pageCount &&
        <NavLink className="nextLink" test={last} url={nextUrl} text="Go to Next Page" />
      }
    </div>
  )

  return (
    <Layout>
      <SEO title="Blog" keywords={[`drupal`, `gatsby`, `blog`]} />
      <h1>Blog</h1>
      <p><i>Page {index} | {pageCount} pages</i></p>

      {group.map(({node}, i) => (
        <div className={`list-element`} key={i}>
          <Link
            to={node.fields.slug}>
            <h2>{node.title}</h2>
          </Link>

          <p><i>{ node.created }</i></p>
          <p dangerouslySetInnerHTML={{ __html: node.body.processed.slice(0, 500).concat('...') }} />
          { node.relationships.field_tags &&
            <ul>
              {node.relationships.field_tags.map(({ name }, k) => (
                <li key={k}>#{name} </li>
              ))}
            </ul>
          }
        </div>
      ))}

      <Paginator />

      <Link to="/">Go to Homepage</Link>
    </Layout>
  )
}

export const query = graphql`
  query allNodeArticle {
    allNodeArticle(
      limit: 10
      skip: 0
      sort: { fields: [created], order: DESC }
    ){
      totalCount
      edges{
        node{
          id
          title
          created(formatString: "MMM DD, YYYY")
          fields {
            slug
          }
          path{
            alias
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
          	field_image{
              filename
              localFile{
                childImageSharp{
                  fluid(sizes: "(max-width: 1200px) 100vw, 800px") {
                  	src
                    ...GatsbyImageSharpFluid_noBase64
                  }
                }
                relativePath
                absolutePath
              }
            }
          }
        }
      }
    }
}`
export default BlogPage
