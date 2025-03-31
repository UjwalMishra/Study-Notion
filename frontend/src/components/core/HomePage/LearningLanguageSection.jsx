import React from "react";
import HighLightText from "./HighLightText";
import CtaBtn from "../../../components/core/HomePage/CtaBtn";
import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

const features = [
  {
    image: Know_your_progress,
    alt: "Know your progress",
  },
  {
    image: Compare_with_others,
    alt: "Compare with others",
  },
  {
    image: Plan_your_lessons,
    alt: "Plan your lessons",
  },
];

const LearningLanguageSection = () => {
  return (
    <div className="bg-gray-50 py-8 px-6 rounded-2xl shadow-lg border border-gray-200 w-full mx-auto">
      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
          Your swiss knife for <HighLightText text={"learning any language"} />
        </h2>
        <p className="text-gray-700 font-medium text-lg md:text-xl mt-3 leading-relaxed">
          Using Spin makes learning multiple languages easy with 20+ languages,
          realistic voice-over, progress tracking, custom schedules, and more.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 place-items-center">
        {features.map((feature, index) => (
          <img
            key={index}
            src={feature.image}
            alt={feature.alt}
            className="object-contain w-100 h-100 hover:scale-110 transition-transform duration-300"
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-10">
        <CtaBtn active={true} linkto={"/signup"}>
          Learn More
        </CtaBtn>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
