import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SwitchIconSVG = (props) => (
  <Svg
    {...props}
    fill="none"
    stroke="#fff"
    viewBox="0 0 24 24"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m18 10 3-3m0 0-3-3m3 3H7m-1 7-3 3m0 0 3 3m-3-3h14"
    />
  </Svg>
)
export default SwitchIconSVG;
