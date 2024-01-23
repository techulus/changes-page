import groq from "groq";
import { GetServerSidePropsContext } from "next";
import { BlogPost } from ".";
import BlogLayout from "../../components/layout/blog-layout.component";
import cms from "../../utils/cms";

const query = groq`*[_type == "post" && url.current == $slug][0]{
  title,
  description,
  content,
  featuredImage,
  publishedAt,
  author->{fullName, avatar, href}
}`;

export async function getStaticPaths() {
  const paths = await cms.fetch(
    groq`*[_type == "post" && defined(url.current)][].url.current`
  );

  return {
    paths: paths.map((slug: string) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context: GetServerSidePropsContext) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;

  const props: BlogPost = await cms.fetch(query, { slug });

  return {
    props,
  };
}

export default BlogLayout;
