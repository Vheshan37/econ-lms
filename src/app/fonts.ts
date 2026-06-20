import localFont from "next/font/local";

export const fmGemunu = localFont({
  src: [
    {
      path: "../../public/fonts/GemunuLibre-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/GemunuLibre-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GemunuLibre-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GemunuLibre-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GemunuLibre-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GemunuLibre-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GemunuLibre-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-fm-gemunu",
  display: "swap",
});

export const impact = localFont({
  src: [
    {
      path: "../../public/fonts/impact.ttf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-impact",
  display: "swap",
});

export const rubikDoodle = localFont({
    src: [
        {
            path: "../../public/fonts/RubikDoodleShadow-Regular.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-doodle",
    display: "swap",
});

export const sinhalaFont = localFont({
    src: [
        {
            path: "../../public/fonts/fm_bindu.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-sinhala",
    display: "swap",
});