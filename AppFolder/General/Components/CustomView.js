import React from "react";

import {
  DeviceEventEmitter,
  findNodeHandle,
  requireNativeComponent,
  UIManager,
} from "react-native";

const RCTCustomView = requireNativeComponent(
  "MyCustomReactViewManager",
  CustomView,
  {}
);

class CustomView extends React.PureComponent {
  myRef = React.createRef();

  componentWillMount() {
    DeviceEventEmitter.addListener("onPageScroll", this?.props?.onPageScroll);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(
      "onPageScroll",
      this?.props?.onPageScroll
    );
  }

  setPage = (number) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      "setPage",
      [number]
    );
  };

  updateBg = (bgColor) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      "updateBg",
      [bgColor]
    );
  };

  updateTeamName = (teamName) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      "updateTeamName",
      [teamName]
    );
  };

  updateTeamNameVisibility = (teamNameVisibility) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      "updateTeamNameVisibility",
      [teamNameVisibility]
    );
  };

  render() {
    console.log("Fahad Android Props: ", this.props);
    return (
      <RCTCustomView
        ref={this.myRef}
        {...this.props}
        onPageScroll={this?.props?.onPageScroll}
      />
    );
  }
}
export default CustomView;
