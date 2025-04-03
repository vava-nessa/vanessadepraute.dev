import { AnimatedTooltip } from "../ui/animated-tooltip";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

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
    <>
      {" "}
      <AnimatedGradientText
        speed={2}
        colorFrom="#4ade80"
        colorTo="#06b6d4"
        className="text-4xl font-semibold tracking-tight"
      >
        Customer work
      </AnimatedGradientText>
      <div className="z-90 flex flex-row items-center justify-center mb-10 w-full">
        <AnimatedTooltip items={people} />
      </div>
      <div className="flex flex-row items-center justify-center gap-2 mb-10"></div>
    </>
  );
}
