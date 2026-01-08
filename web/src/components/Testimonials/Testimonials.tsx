import { AnimatedTooltip } from "../ui/animated-tooltip";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

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

// Designation key mapping
type DesignationKey = "uiUxDesigner" | "reactDeveloper" | "fullStackDeveloper" | "frontendDeveloper" | "mobileDeveloper" | "videoTechnician";

const peopleData: Array<{
  id: number;
  name: string;
  designationKey: DesignationKey;
  image: string;
}> = [
    {
      id: 5,
      name: "Radio France",
      designationKey: "uiUxDesigner",
      image: radiofrance,
    },
    {
      id: 10,
      name: "Orange",
      designationKey: "uiUxDesigner",
      image: orange,
    },
    {
      id: 15,
      name: "Carrefour",
      designationKey: "reactDeveloper",
      image: carrefour,
    },
    {
      id: 20,
      name: "LiveE",
      designationKey: "fullStackDeveloper",
      image: livee,
    },
    {
      id: 30,
      name: "Airbus",
      designationKey: "frontendDeveloper",
      image: airbus,
    },
    {
      id: 35,
      name: "Vinci",
      designationKey: "reactDeveloper",
      image: vinci,
    },
    {
      id: 40,
      name: "Loréal",
      designationKey: "uiUxDesigner",
      image: loreal,
    },
    {
      id: 50,
      name: "Kogama",
      designationKey: "reactDeveloper",
      image: kogama,
    },
    {
      id: 60,
      name: "Caisse des dépôts",
      designationKey: "videoTechnician",
      image: caisse,
    },
    {
      id: 65,
      name: "Spie",
      designationKey: "mobileDeveloper",
      image: spie,
    },
  ];

export function Testimonials() {
  const { t } = useTranslation();

  // Translate designations using useMemo
  const people = useMemo(() => {
    return peopleData.map((person) => ({
      id: person.id,
      name: person.name,
      designation: t(`testimonials.designations.${person.designationKey}`),
      image: person.image,
    }));
  }, [t]);

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
