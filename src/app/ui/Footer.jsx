import Logo from "@/app/components/logo";
import React from "react";

/**
 * `className` exists so `SiteShell` can extend the footer's own bottom padding
 * on the routes that render the fixed action bar. Extra padding on a wrapper div
 * would leave a strip of page background under the bar instead of extending the
 * footer's own background, which reads as a rendering bug rather than spacing.
 */
const Footer = ({ className = '' }) => {
  return (
   
      <footer className={`footer sm:footer-horizontal bg-brand-content-on-dark/86 text-base-content p-10 ${className}`}>
        <Logo />
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      

  );
};

export default Footer;
