import s1 from "../assets/65e5becd0bc94a2385b5f6ef_services-image-1.webp?url";
import s2 from "../assets/65e5becd3c69897885b67bc2_services-image-2-v2.webp?url";
import s3 from "../assets/65b0f4adb16f3335ac8706f6_services-image-3.webp?url";
import s4 from "../assets/65e5becda2c4d171b7ba627d_services-image-4.webp?url";
import s5 from "../assets/65b0f4ade3e8909ec34bac58_services-image-5.webp?url";
import s6 from "../assets/65b0f4ad206196c4fe490811_services-image-6.webp?url";
import s7 from "../assets/65e5becd102e2387a32aebff_services-image-7.webp?url";

export interface Service {
  name: string;
  image: string;
  imageAlt: string;
}

export const services: Service[] = [
  {
    name: "Design concept and layout",
    image: s1,
    imageAlt: "Design concept and layout interior styling example",
  },
  {
    name: "3D visualisation",
    image: s2,
    imageAlt: "3D visualisation interior styling example",
  },
  {
    name: "Furniture and appliances styling",
    image: s3,
    imageAlt: "Furniture and appliances styling interior styling example",
  },
  {
    name: "Art consultancy",
    image: s4,
    imageAlt: "Art consultancy interior styling example",
  },
  {
    name: "Lighting design",
    image: s5,
    imageAlt: "Lighting design interior styling example",
  },
  {
    name: "Project management",
    image: s6,
    imageAlt: "Project management interior styling example",
  },
  {
    name: "Procurement and installation",
    image: s7,
    imageAlt: "Procurement and installation interior styling example",
  },
];
