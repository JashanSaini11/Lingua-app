// Lets TypeScript understand `import img from "@/assets/images/x.png"`.
declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";

  const source: ImageSourcePropType;
  export default source;
}

// SVG files are plain assets here (no transformer). Render them with
// `Image` from "expo-image", which can draw SVG.
declare module "*.svg" {
  import type { ImageSourcePropType } from "react-native";

  const source: ImageSourcePropType;
  export default source;
}
