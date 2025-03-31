import React from "react";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";

const TimeLine = [
  {
    Logo: Logo1,
    Heading: "Leadership",
    Description: "Fully committed to the success of the company",
  },
  {
    Logo: Logo2,
    Heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    Heading: "Flexibility",
    Description: "The ability to switch is an important skill",
  },
  {
    Logo: Logo4,
    Heading: "Problem-Solving",
    Description: "Code your way to a solution",
  },
];

const TimelineSection = () => {
  return (
    <div className="bg-gray-50 py-8 px-6  rounded-2xl shadow-lg border border-gray-200 w-full mx-auto">
      {/* Step Indicator */}
      <div className="bg-yellow-200 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full w-fit">
        Steps
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-center justify-center mt-4">
        {/* Timeline List */}
        <div className="lg:w-[45%] flex flex-col gap-8">
          {TimeLine.map((ele, i) => (
            <div
              key={i}
              className="flex items-center gap-6 p-4 rounded-lg bg-white shadow-md  border-gray-300 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-[60px] h-[60px] bg-gray-100 rounded-full flex justify-center items-center shadow-lg">
                <img src={ele.Logo} alt={ele.Heading} className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {ele.Heading}
                </h3>
                <p className="text-gray-600 text-lg">{ele.Description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Image Section */}
        <div className="relative group w-fit h-fit">
          <div className="absolute inset-0  opacity-10 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
          <img
            src={TimeLineImage}
            alt="Timeline"
            className="shadow-lg rounded-lg object-cover h-[400px] lg:h-auto group-hover:scale-95 transition-transform duration-300"
          />

          {/* Overlay Stats Box */}
          <div className="absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-green-600 text-white uppercase py-6 px-8 flex gap-8 rounded-lg shadow-lg">
            <div className="flex gap-4 items-center border-r pr-6 border-white">
              <h1 className="text-4xl font-extrabold">10</h1>
              <p className="text-sm text-green-200">Years Experience</p>
            </div>
            <div className="flex gap-4 items-center">
              <h1 className="text-4xl font-extrabold">250</h1>
              <p className="text-sm text-green-200">Types of Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
