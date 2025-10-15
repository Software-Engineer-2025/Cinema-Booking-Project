import { Annapurna_SIL, Hind, Anton } from "next/font/google";

export const annapurna = Annapurna_SIL({
  variable: "--font-annapurna",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

export const fonts = {
  body: hind,
  heading: anton,
  special: annapurna,
} as const;

export const fontClasses = {
  body: "font-hind",
  heading: "font-anton",
  special: "font-annapurna",
} as const;

export const allFontVariables = `${hind.variable} ${anton.variable} ${annapurna.variable}`;
