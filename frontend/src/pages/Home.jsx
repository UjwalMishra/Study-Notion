import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import HighLightText from "../components/core/HomePage/HighLightText";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import CtaBtn from "../components/core/HomePage/CtaBtn";
import Banner from "../assets/Images/banner.mp4";
import Footer from "../components/common/Footer";
const Home = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div className="text-white">
      {/* Blurred Cursor Effect */}
      <div
        className="fixed top-0 left-0 w-32 h-32 bg-gradient-to-r from-orange-500 via-blue-400 to-teal-500 blur-3xl opacity-50 pointer-events-none"
        style={{
          transform: `translate(${cursorPosition.x - 64}px, ${
            cursorPosition.y - 64
          }px)`,
        }}
      ></div>
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

        <div className="text-4xl font-semibold flex justify-center mt-6">
          <p>Empower Your Future with</p>
          <HighLightText text={"Coding Skills"} />
        </div>

        <div className="w-[90%] text-center text-lg  text-richblack-200 mt-4 mx-auto max-w-4xl">
          <p>
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </p>
        </div>

        <div className="flex gap-8 mt-4">
          <CtaBtn active={true} linkto={"/signup"}>
            Learn More
          </CtaBtn>
          <CtaBtn active={false} linkto={"/login"}>
            Book a Demo
          </CtaBtn>
        </div>

        <div className="w-[70%] mt-10 mb-4">
          <video src="" autoPlay muted loop>
            {" "}
            <source src={Banner} />
          </video>
        </div>

        {/* Code Section 1  */}
        <div className="w-[80%] flex justify-center mt-4 mx-auto">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighLightText text={"coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div className="w-[80%] flex justify-center mt-4 mx-auto">
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighLightText text={"coding in seconds"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
      </div>
      {/* section-2  */}

      <div></div>

      {/* footer  */}
      <Footer></Footer>
    </div>
  );
};

export default Home;
