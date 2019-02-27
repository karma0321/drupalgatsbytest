import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Img from 'gatsby-image'

const ArticlesPage = ({data}) => (
  <Layout>
    <SEO title="Articles" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Articles page</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    {data.allNodeArticle.edges.map(({node}, i) => (
      <div className={`list-element`} key={i}>
        <Link
          to={node.fields.slug}>
          <h2>{node.title}</h2>
        </Link>
        {console.log(node.relationships)}
        <p>{node.relationships.field_image.filename}</p>
        {node.relationships.field_image.localFile.childImageSharp !== null &&
          <div>
            {/* <img
              src={node.relationships.field_image.localFile.childImageSharp.fluid.srcSet}
              alt={node.relationships.field_image.filename}
            /> */}
            <Img fluid={node.relationships.field_image.localFile.childImageSharp.fluid} />
          </div>
        }
        {node.relationships.field_tags !== null &&
          <div className={`tags-wrapper`}>
            <p>Tags:</p>
            <ul>
            {node.relationships.field_tags.map((tag, i) => (
                <li>{tag.name}</li>
            ))}
          </ul>
        </div>
        }
      </div>
    ))}
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export const query = graphql`
  query allNodeArticle{
    allNodeArticle{
      totalCount
      edges{
        node{
          id
          title
          created
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
export default ArticlesPage
