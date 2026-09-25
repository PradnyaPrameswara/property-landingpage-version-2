import m3 from "../assets/65b26ba22fd03ce5743853d0_team-image-3.webp?url";
import m2 from "../assets/65b26b8acdd88605d583631a_team-image-2.webp?url";
import m1 from "../assets/65b26b78d55e2546b6c1f3d4_team-image-1.webp?url";

export interface Member {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
}

export const team: Member[] = [
  {
    name: "Kristie Dekker",
    role: "Interior Designer",
    image: m3,
    imageAlt: "Portrait of Kristie Dekker, Interior Designer",
  },
  {
    name: "Natalia Von Falk",
    role: "Founder & Art Director",
    image: m2,
    imageAlt: "Portrait of Natalia Von Falk, Founder & Art Director",
  },
  {
    name: "Theresa Jaasma",
    role: "Interior Designer",
    image: m1,
    imageAlt: "Portrait of Theresa Jaasma, Interior Designer",
  },
];
