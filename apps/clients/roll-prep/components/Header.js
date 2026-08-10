"use client";

import { Header as SharedHeader } from "@alessandrovaru/ui";
import ButtonSignin from "./ButtonSignin";
import logo from "@/public/logo.png";
import config from "@/config";

const links = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

const Header = () => (
  <SharedHeader
    appName={config.appName}
    logo={logo}
    links={links}
    cta={<ButtonSignin extraStyle="btn-primary" />}
    solid
    sticky={false}
  />
);

export default Header;
