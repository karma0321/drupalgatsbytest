import { Link, graphql } from "gatsby"
import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Img from 'gatsby-image'

const BlogPost = ({ data }) => {
console.log(data);
 return (
  <Layout>
    <SEO title="Articles" keywords={[`drupal`, `gatsby`, `article`]} />
    <h1>{data.nodeArticle.title}</h1>
    <article>
      <p className="publication-date"><i>{data.nodeArticle.created}</i></p>
      <p><Img fluid={data.nodeArticle.relationships.field_image.localFile.childImageSharp.fluid} /></p>
      <p dangerouslySetInnerHTML={{__html: data.nodeArticle.body.processed}} />
      { data.nodeArticle.relationships.field_tags &&
        <ul>
          {data.nodeArticle.relationships.field_tags.map(({ name }, k) => (
            <li key={k}>#{name} </li>
          ))}
        </ul>
      }
    </article>
    <Link to="/articles/">Go to Article</Link><br />
    <Link to="/">Go to Homepage</Link>
  </Layout>)
}
export default BlogPost

export const query = graphql`
  query($slug: String!) {
    nodeArticle (fields: { slug: { eq: $slug } }) {
      title
      created(formatString: "MMM DD, YYYY")
      changed
      body {
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
`
