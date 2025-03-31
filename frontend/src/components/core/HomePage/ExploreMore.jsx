import React from "react";
import { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighLightText from "./HighLightText";
const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skill paths",
  "Career paths",
];

export default function Exploremore() {
  const [curentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setCard = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };
  return (
    <div>
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Unlock the
          <HighLightText text={"Power of Code"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>
      {/* tab-selection section  */}
      <div className="flex bg-richblack-800 rounded-full m-4 border border-richblack-700">
        {tabsName.map((element, idx) => {
          return (
            <div
              className={`text-[16px]  flex items-center  ${
                curentTab === element
                  ? "bg-richblack-900 text-richblack-5 font-medium border"
                  : "text-richblack-200 "
              } rounded-full transition-all cursor-pointer hover:bg-richblack-900 hover:text-richblack-5  hover:border hover:border-richblack-100 px-5 py-2`}
              key={idx}
              onClick={() => setCard(element)}
            >
              {element}
            </div>
          );
        })}
      </div>
    </div>
  );
}
