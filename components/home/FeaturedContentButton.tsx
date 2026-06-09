import Link from "next/dist/client/link";

/**
 * "Featured Content" hero CTA.
 *
 * PARKED — not currently rendered. The link targets "#featured", but there's
 * no featured section on the home page yet. Revisit once a real featured-posts
 * section exists to anchor to (or a /featured route), then drop this back into
 * the HeroSection button row.
 */
const FeaturedContentButton = () => {
  return (
    <Link
      href="#featured"
      className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-600 hover:text-white transition-colors duration-300"
    >
      Featured Content
    </Link>
  );
};

export default FeaturedContentButton;
