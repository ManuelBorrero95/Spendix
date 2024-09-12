import React from 'react';
import { Footer } from "flowbite-react";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";

const FooterComponent = () => {
  return (
    <Footer container className="bg-[#001845] text-white">
      <div className="w-full">
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Spendix" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="https://github.com/ManuelBorrero95" icon={BsGithub} />
            <Footer.Icon href="https://www.instagram.com/manuel_borrero/" icon={BsInstagram} />
            <Footer.Icon href="https://www.linkedin.com/in/manuelborrero/" icon={BsLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;