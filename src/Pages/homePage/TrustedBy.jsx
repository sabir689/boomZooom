import React from "react";

import Casio from "../../assets/brands/casio.png";
import Amazon from "../../assets/brands/amazon.png";
import Moonstar from "../../assets/brands/moonstar.png";
import Star from "../../assets/brands/star.png";
import StartPeople from "../../assets/brands/start_people.png";
import Randstad from "../../assets/brands/randstad.png";

const TrustedBy = () => {
  const logos = [
    { name: "Casio", img: Casio },
    { name: "Amazon", img: Amazon },
    { name: "Moonstar", img: Moonstar },
    { name: "Star+", img: Star },
    { name: "StartPeople", img: StartPeople },
    { name: "Randstad", img: Randstad },
  ];

  return (
    <section className="bg-[#f8f9fa] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Divider */}
        <div className="border-y border-blue-200/50 py-10 text-2xl">
          {/* Heading */}
          <h2 className="text-center text-[#022c22] text-sm sm:text-base md:text-xl font-semibold mb-8 sm:mb-12 ">
            We’ve helped thousands of sales teams
          </h2>

          {/* Logos */}
          <div className="flex h-10 flex-wrap items-center justify-center gap-4 sm:gap-10 md:gap-12 lg:gap-16">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex justify-center items-center w-24 sm:w-28 md:w-32 "
              >
                <img
                  src={logo.img}
                  alt={`${logo.name} logo`}
                  loading="lazy"
                  className="w-full h-6 object-contain  hover:grayscale-0 hover:opacity-100 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
