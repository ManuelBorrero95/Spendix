import React from 'react';
import { Footer } from "flowbite-react";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";

const FooterComponent = () => {
  return (
    <Footer container className="bg-[#001845] text-white">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="/"
              src="/path-to-your-logo.svg"
              alt="Spendix Logo"
              name="Spendix"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Informazioni" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Chi siamo</Footer.Link>
                <Footer.Link href="#">Contattaci</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Seguici" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/ManuelBorrero95">Github</Footer.Link>
                <Footer.Link href="https://www.instagram.com/manuel_borrero/">Instagram</Footer.Link>
                <Footer.Link href="https://www.linkedin.com/in/manuelborrero/">LinkedIn</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legale" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Termini e Condizioni</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
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