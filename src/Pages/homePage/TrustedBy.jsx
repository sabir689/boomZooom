import React from "react";

import Casio from "../../assets/brands/casio.png";
import Amazon from "../../assets/brands/amazon.png";
import Moonstar from "../../assets/brands/moonstar.png";
import Star from "../../assets/brands/star.png";
import StartPeople from "../../assets/brands/start_people.png";
import Randstad from "../../assets/brands/randstad.png";
import Marquee from "react-fast-marquee";

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
    <section className="bg-[#eef2f3] py-12 sm:py-16 ">
      <div className="max-w-6xl mx-auto px-4">
        <div className=" py-10 ">
          
      
          <h2 className="text-center text-[#022c22] text-sm sm:text-base md:text-3xl  font-semibold mb-8 sm:mb-12">
            We’ve helped thousands of sales teams
          </h2>

          {/* Marquee */}
          <Marquee
            speed={120}
            pauseOnHover
            gradient
            gradientColor={[248, 249, 250]}
          >
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="mx-6 sm:mx-10 md:mx-14 mt-10 flex items-center"
              >
                <img
                  src={logo.img}
                  alt={`${logo.name} logo`}
                  loading="lazy"
                  className="h-6 sm:h-7 md:h-6 object-contain hover:opacity-100 transition"
                />
              </div>
            ))}
          </Marquee>

        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
