import React from "react";
import CTAButton from "./CtaBtn";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div
      className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}
    >
      {/* Section 1  */}
      <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
        {heading}

        {/* Sub Heading */}
        <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
          {subheading}
        </div>

        {/* Button Group */}
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <div className="flex items-center gap-2">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Code Snippet Block */}
      <div className="relative bg-richblack-800 text-richblack-200 rounded-lg shadow-lg border border-richblack-700 w-full max-w-[600px] mx-auto overflow-hidden">
        {/* 🔥 Blurred Orange Gradient */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-[300px] h-[300px] bg-orange-500 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* Title Bar (Like a Code Editor) */}
        <div className="flex items-center bg-richblack-700 px-4 py-2 relative z-10">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
        </div>

        {/* Main Code Block */}
        <div className="grid grid-cols-[auto_1fr] text-sm sm:text-base font-mono relative z-10">
          {/* Line Numbers */}
          <div className="text-richblack-400 text-right px-3 py-3 select-none leading-6 font-mono tabular-nums">
            {Array.from({ length: 11 }, (_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>

          {/* Code Content */}
          <div
            className={`w-full px-4 py-3 text-green-400 leading-6 ${codeColor}`}
          >
            <TypeAnimation
              sequence={[codeblock, 1000, ""]}
              cursor={true}
              repeat={Infinity}
              style={{
                whiteSpace: "pre-line",
                display: "block",
              }}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
