import cover1 from "../assets/65e5bb637c43cfb3afa4f453_project-cover-1.webp?url";
import cover2 from "../assets/65e5bb3c355dbdde0cf724f4_project-cover-2.webp?url";
import cover3 from "../assets/65b14192552090b548b00150_project-cover-3.webp?url";
import img1 from "../assets/65e5bb327aafbb862b1f815c_project-image-1.webp?url";
import img2 from "../assets/65b0f9ff77527bf8b98faeed_project-image-2.webp?url";
import img3 from "../assets/65b0f9ffc025e3d164dacf0f_project-image-3.webp?url";
import img4 from "../assets/65e5bb53c5912c71a70c6c00_project-image-4.webp?url";
import img5 from "../assets/65e5bb53e25e798e0e0d5f97_project-image-5.webp?url";
import img6 from "../assets/65e5bb53991b891927a4155f_project-image-6.webp?url";
import img7 from "../assets/65e5bb53d1e4ea4c73307190_project-image-7.webp?url";
import img8 from "../assets/65e5bb533d57a4c9156d7297_project-image-8.webp?url";
import img9 from "../assets/65e5bb7724df93f488011c41_project-image-9.webp?url";
import img10 from "../assets/65e5bb773c69897885b4f648_project-image-10.webp?url";
import img11 from "../assets/65e5bb770c2c1b58bc11c533_project-image-11.webp?url";

export interface Project {
  slug: string;
  title: string;
  city: string;
  year: string;
  cover: string;
  coverAlt: string;
  images: { src: string; alt: string }[];
}

export const projects: Project[] = [
  {
    slug: "niewuwndijk",
    title: "Niewuwndijk",
    city: "Amsterdam",
    year: "2022",
    cover: cover1,
    coverAlt: "Niewuwndijk project interior, Amsterdam",
    images: [
      { src: img9, alt: "Niewuwndijk interior detail 1" },
      { src: img10, alt: "Niewuwndijk interior detail 2" },
      { src: img11, alt: "Niewuwndijk interior detail 3" },
    ],
  },
  {
    slug: "amethiststraat",
    title: "Amethiststraat",
    city: "Groningen",
    year: "2022",
    cover: cover2,
    coverAlt: "Amethiststraat project interior, Groningen",
    images: [
      { src: img4, alt: "Amethiststraat interior detail 1" },
      { src: img5, alt: "Amethiststraat interior detail 2" },
      { src: img6, alt: "Amethiststraat interior detail 3" },
      { src: img7, alt: "Amethiststraat interior detail 4" },
      { src: img8, alt: "Amethiststraat interior detail 5" },
    ],
  },
  {
    slug: "keizergracht",
    title: "Eerste Jan Steenstraat",
    city: "Amsterdam",
    year: "2022",
    cover: cover3,
    coverAlt: "Eerste Jan Steenstraat project interior, Amsterdam",
    images: [
      { src: img1, alt: "Eerste Jan Steenstraat interior detail 1" },
      { src: img2, alt: "Eerste Jan Steenstraat interior detail 2" },
      { src: img3, alt: "Eerste Jan Steenstraat interior detail 3" },
    ],
  },
];
