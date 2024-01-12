import { sWidth } from "~/constants/layout";

const base_design_width_px = 360;
const base_px_to_pt = Math.round(base_design_width_px / 1.25);

export const fontSize = {
  h1: sWidth * (48 / base_px_to_pt),
  h2: sWidth * (34 / base_px_to_pt),
  body: sWidth * (19 / base_px_to_pt),
  span: sWidth * (19 / base_px_to_pt) * 0.8,
  button: sWidth * (15 / base_px_to_pt),
};
