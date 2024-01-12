import { Dimensions } from "react-native";
const { width: sWidth, height: sHeight } = Dimensions.get("screen");

const HEADER_BAR_HEIGHT = sHeight * 0.0764; // 60
const TAB_BAR_HEIGHT = sHeight * 0.09;

export { sWidth, sHeight, TAB_BAR_HEIGHT, HEADER_BAR_HEIGHT };
