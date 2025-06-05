import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  return <img src="/tsd-icon.png" alt="App Logo" {...props} />;
}
