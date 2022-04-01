import Head from "next/head";

import "../styles/globals.css";

const metaData = {
  name: "data-scale",
  description:
    "A template for making art with data, using google sheets, tone.js and p5.js.",
  image: "https://inside-looking-out.vercel.app/img/meta-image.png",
  url: "https://inside-looking-out.vercel.app/",
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Inside Looking Out</title>

        <meta name="description" content={metaData.description} />

        {/* Google / Search Engine Tags */}
        <meta itemProp="name" content={metaData.name}></meta>
        <meta itemProp="description" content={metaData.description} />
        <meta itemProp="image" content={metaData.image} />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content={metaData.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaData.name} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:image" content={metaData.image} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaData.name} />
        <meta name="twitter:description" content={metaData.description} />
        <meta name="twitter:image" content={metaData.image}></meta>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
