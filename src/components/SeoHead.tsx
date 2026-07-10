import { Helmet } from "react-helmet-async";

type SeoHeadProps = {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  robots?: string;
  image?: string;
  type?: "website" | "article";
  schema?: Record<string, any> | Record<string, any>[];
};

const SITE_URL = "https://xyphx.com";
const DEFAULT_IMAGE_PATH = "/logo.jpg";

export default function SeoHead({
  title,
  description,
  canonicalPath,
  keywords,
  robots = "index, follow",
  image = DEFAULT_IMAGE_PATH,
  type = "website",
  schema,
}: SeoHeadProps) {
  // Ensure canonical URL has no trailing slash unless it's a specific route that needs it, but we prefer clean URLs
  const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <meta name="author" content="XyphX" />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="XyphX" />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@xyphx" />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}