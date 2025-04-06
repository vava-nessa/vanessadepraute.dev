import { AnimatedTooltip } from "../ui/animated-tooltip";

import Star from "@/components/Star/Star";
// Import images
import orange from "../../assets/orange.png";
import livee from "../../assets/livee.jpg";
import caisse from "../../assets/caisse.png";
import kogama from "../../assets/kogama.jpg";
import airbus from "../../assets/airbus.png";
import loreal from "../../assets/loreal.png";

const people = [
  {
    id: 1,
    name: "Orange",
    designation: "UI / UX Designer",
    image: orange,
  },
  {
    id: 2,
    name: "LiveE",
    designation: "Full Stack Developer",
    image: livee,
  },
  {
    id: 3,
    name: "Airbus",
    designation: "Frontend Developer",
    image: airbus,
  },
  {
    id: 4,
    name: "Loréal",
    designation: "UI/UX Designer",
    image: loreal,
  },
  {
    id: 5,
    name: "Kogama",
    designation: "React Developer",
    image: kogama,
  },
  {
    id: 6,
    name: "Caisse des dépôts",
    designation: "Video Technician",
    image: caisse,
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
