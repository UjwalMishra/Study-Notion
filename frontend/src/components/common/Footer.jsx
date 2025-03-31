import React from "react";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const FooterLinks = [
  {
    title: "Company",
    links: ["About", "Careers", "Affiliates"],
  },
  {
    title: "Resources",
    links: ["Articles", "Blog", "Docs", "Videos"],
  },
  {
    title: "Support",
    links: ["Help Center"],
  },
];

const BottomFooter = ["Privacy Policy", "Terms of Service"];

const Footer = () => {
  return (
    <div className="bg-richblack-800 text-richblack-400">
      <div className="flex flex-wrap justify-between w-11/12 max-w-6xl mx-auto py-10">
        {/* Left Section */}
        <div className="flex flex-col gap-4 w-[30%]">
          <img src={Logo} alt="Logo" className="w-36" />
          <div className="flex gap-3 text-lg">
            <FaFacebook className="hover:text-richblack-50 cursor-pointer" />
            <FaGoogle className="hover:text-richblack-50 cursor-pointer" />
            <FaTwitter className="hover:text-richblack-50 cursor-pointer" />
            <FaYoutube className="hover:text-richblack-50 cursor-pointer" />
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-wrap w-[60%] justify-between">
          {FooterLinks.map((section, index) => (
            <div key={index} className="mb-6">
              <h1 className="text-richblack-50 font-semibold">
                {section.title}
              </h1>
              <ul className="mt-2 space-y-2">
                {section.links.map((link, i) => (
                  <li
                    key={i}
                    className="text-sm hover:text-richblack-50 cursor-pointer"
                  >
                    <Link to={link.toLowerCase().replace(/\s+/g, "-")}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-richblack-700 py-5 text-center text-sm">
        <div className="flex justify-center gap-6">
          {BottomFooter.map((item, i) => (
            <Link
              key={i}
              to={item.toLowerCase().replace(/\s+/g, "-")}
              className="hover:text-richblack-50"
            >
              {item}
            </Link>
          ))}
        </div>
        <p className="mt-2">Made by Ujwal Mishra © 2025 Studynotion</p>
      </div>
    </div>
  );
};

export default Footer;
