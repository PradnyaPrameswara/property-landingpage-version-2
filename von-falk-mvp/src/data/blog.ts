import coverA from "../assets/65b28a50f69f76ddafb94648_blog-cover-image-1.webp?url";
import coverB from "../assets/65b3ae0d4045c37d94e4967b_blog-cover-image-2.webp?url";
import team1 from "../assets/65b26b78d55e2546b6c1f3d4_team-image-1.webp?url";
import detail2 from "../assets/65b28a63c60c0ad90ff10fc3_blog-post-image-2.webp?url";
import detail3 from "../assets/65b28a632b2489e8930f47f4_blog-post-image-3.webp?url";

export interface BlogPost {
  slug: string;
  title: string;
  cover: string;
  coverAlt: string;
  excerpt: string;
  images: string[];
  paragraphs: string[];
}

export const posts: BlogPost[] = [
  {
    slug: "dry-floral-compositions-guide-to-match-the-interior",
    title: "Dry floral compositions: guide to match the interior",
    cover: coverA,
    coverAlt: "Dried botanical arrangement in a natural interior",
    excerpt: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque.",
    images: [detail2],
    paragraphs: [
      "Dried arrangements bring texture and shape to an interior without needing to compete with the surrounding materials. A few carefully selected stems can have more presence than a crowded arrangement.",
      "Look to the room's palette first. Muted greens, warm neutrals and organic shapes make it easier for a composition to feel part of the space rather than a separate decoration.",
    ],
  },
  {
    slug: "concrete-coating-in-interior",
    title: "Concrete coating in interior",
    cover: coverB,
    coverAlt: "Minimalist interior with a sculptural lamp and neutral finishes",
    excerpt: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque.",
    images: [detail2, detail3],
    paragraphs: [
      "A continuous surface can make even a compact room feel composed. Concrete-like finishes offer a restrained backdrop for furnishings, artwork and the play of natural light.",
      "Consider how the material interacts with the rest of the room. Texture, tone and the treatment of adjoining surfaces have a stronger effect than colour alone.",
    ],
  },
  {
    slug: "meet-theresa-the-new-team-member",
    title: "Meet Theresa, the new team member",
    cover: team1,
    coverAlt: "Portrait of Theresa Jaasma",
    excerpt: "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque.",
    images: [],
    paragraphs: [
      "Theresa Jaasma is part of the Von Falk interior design team. Our team brings together complementary perspectives on thoughtful interiors.",
      "The studio's work is guided by a shared attention to spatial balance, material choices and details that support everyday life.",
    ],
  },
];
