"use client";

import { Header as SharedHeader } from "@alessandrovaru/ui";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";

const links = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

// Thin wrapper sobre `@alessandrovaru/ui` Header. Cada proyecto cliente solo aporta:
//  - logo, appName y links (data)
//  - cta (su botón de auth — Supabase / NextAuth / lo que sea)
//  - el flag `solid` si quiere el fondo fijo en lugar del scroll transparente.
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
