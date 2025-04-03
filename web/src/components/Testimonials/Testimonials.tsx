import { AnimatedTooltip } from "../ui/animated-tooltip";

// Import images
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";
import img4 from "../../assets/4.png";

const people = [
  {
    id: 1,
    name: "Orange",
    designation: "UI / UX Designer",
    image: img1,
  },
  {
    id: 2,
    name: "LiveE",
    designation: "Full Stack Developer",
    image: img2,
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image: img3,
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image: img4,
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

export function Testimonials() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
