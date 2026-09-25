import coverA from "../assets/65b28a50f69f76ddafb94648_blog-cover-image-1.webp?url";
import coverB from "../assets/65b3ae0d4045c37d94e4967b_blog-cover-image-2.webp?url";
import team1 from "../assets/65b26b78d55e2546b6c1f3d4_team-image-1.webp?url";

export interface BlogPost {
  slug: string;
  title: string;
  cover: string;
  coverAlt: string;
}

export const posts: BlogPost[] = [
  {
    slug: "dry-floral-compositions-guide-to-match-the-interior",
    title: "Dry floral compositions: guide to match the interior",
    cover: coverA,
    coverAlt: "Cover image for Dry floral compositions: guide to match the interior",
  },
  {
    slug: "concrete-coating-in-interior",
    title: "Concrete coating in interior",
    cover: coverB,
    coverAlt: "Cover image for Concrete coating in interior",
  },
  {
    slug: "meet-theresa-the-new-team-member",
    title: "Meet Theresa, the new team member",
    cover: team1,
    coverAlt: "Cover image for Meet Theresa, the new team member",
  },
];
