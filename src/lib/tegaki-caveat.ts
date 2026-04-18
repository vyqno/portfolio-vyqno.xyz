import { createBundle } from "tegaki/core";
import glyphData from "../../public/fonts/glyphData.json";

const bundle = createBundle({
  family: "Caveat",
  fontUrl: "/fonts/caveat-3dc76002.ttf",
  fullFamily: "Caveat Full",
  fullFontUrl: "/fonts/caveat.ttf",
  glyphData,
  lineCap: "round",
  unitsPerEm: 1000,
  ascender: 960,
  descender: -300,
});

export default bundle;
