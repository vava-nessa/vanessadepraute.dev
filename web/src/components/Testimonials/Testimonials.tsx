import { AnimatedTooltip } from "../ui/animated-tooltip";

import Star from "@/components/Star/Star";
// Import images
import orange from "@/assets/orange.webp";
import livee from "@/assets/livee.webp";
import caisse from "@/assets/caisse.webp";
import kogama from "@/assets/kogama.webp";
import airbus from "@/assets/airbus.webp";
import loreal from "@/assets/loreal.webp";
import radiofrance from "@/assets/radiofrance.webp";
import spie from "@/assets/spie.webp";
import carrefour from "@/assets/carrefour.webp";
import vinci from "@/assets/vinci.webp";

const people = [
  {
    id: 5,
    name: "Radio France",
    designation: "UI/UX Designer",
    image: radiofrance,
  },
  {
    id: 10,
    name: "Orange",
    designation: "UI / UX Designer",
    image: orange,
  },
  {
    id: 15,
    name: "Carrefour",
    designation: "React Developer",
    image: carrefour,
  },
  {
    id: 20,
    name: "LiveE",
    designation: "Full Stack Developer",
    image: livee,
  },
  {
    id: 30,
    name: "Airbus",
    designation: "Frontend Developer",
    image: airbus,
  },
  {
    id: 35,
    name: "Vinci",
    designation: "React Developer",
    image: vinci,
  },
  {
    id: 40,
    name: "Loréal",
    designation: "UI/UX Designer",
    image: loreal,
  },
  {
    id: 50,
    name: "Kogama",
    designation: "React Developer",
    image: kogama,
  },
  {
    id: 60,
    name: "Caisse des dépôts",
    designation: "Video Technician",
    image: caisse,
  },
  {
    id: 65,
    name: "Spie",
    designation: "Mobile Developer",
    image: spie,
  },
];

export function Testimonials() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="z-90 flex flex-row items-center justify-center mb-10 ">
        <AnimatedTooltip items={people} />
      </div>

      <div className="flex justify-center items-center mb-4">
        <Star delay={1800} color="rgb(255, 189, 9)" />
        <Star delay={2100} color="rgb(255, 189, 9)" />
        <Star delay={2400} color="rgb(255, 189, 9)" />
        <Star delay={2700} color="rgb(255, 189, 9)" />
        <Star delay={3000} color="rgb(255, 189, 9)" />
      </div>
    </div>
  );
}
