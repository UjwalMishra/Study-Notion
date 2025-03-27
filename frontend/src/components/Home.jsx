import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
const Home = () => {
  return (
    <div>
      {/* section-1  */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center">
        <Link to={"/signup"}>
          <div className="mt-16 p-1 px-2 border mx-auto rounded-full bg-richblack-800 text-richblack-200 transition-all duration-200 hover:scale-95 hover:bg-richblack-900 w-fit">
            <div className="flex justify-center items-center gap-2">
              <p className="text-white">Become an Instructor</p>
              <FaArrowRightLong className=" text-white mt-0.5" />
            </div>
          </div>
        </Link>
      </div>

      {/* section-2  */}
      <div></div>
    </div>
  );
};

export default Home;
