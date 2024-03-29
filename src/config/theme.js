import { Colors } from "@blueprintjs/core";

export const cssKeyToThemeKey = {
  fontSize: "fontSize",
  lineHeight: "fontSize",
  borderRadius: "radius",
  borderTopLeftRadius: "radius",
  borderTopRightRadius: "radius",
  borderBottomLeftRadius: "radius",
  borderBottomRightRadius: "radius",
  boxShadow: "boxShadow",
  color: "color",
  backgroundColor: "color",
  width: "size",
  minWidth: "size",
  maxWidth: "size",
  height: "size",
  minHeight: "size",
  maxHeight: "size",
  top: "size",
  bottom: "size",
  left: "size",
  right: "size",
  marginTop: "size",
  marginBottom: "size",
  marginLeft: "size",
  marginRight: "size",
  paddingTop: "size",
  paddingBottom: "size",
  paddingLeft: "size",
  paddingRight: "size",
  gridGap: "size",
  fontFamily: "fontFamily",
  border: "border",
  borderTop: "border",
  borderRight: "border",
  borderBottom: "border",
  borderLeft: "border",
};

export const theme = {
  radius: { classic: "4px" },
  boxShadow: { classic: "0 0 10px #00000080" },
  size: {
    max: "700px",
  },
  color: {
    black: Colors.DARK_GRAY5,
    lightgray: Colors.LIGHT_GRAY3,
    gray: Colors.GRAY1,
  },
  fontSize: {
    title: "18px",
  },
  border: { classic: "1px solid" },
};

export default theme;
