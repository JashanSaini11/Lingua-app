// Lets TypeScript understand `import img from "@/assets/images/x.png"`.
declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";

  const source: ImageSourcePropType;
  export default source;
}
