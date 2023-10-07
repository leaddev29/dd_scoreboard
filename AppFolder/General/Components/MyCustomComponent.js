import React from "react";
import {
  DeviceEventEmitter,
  findNodeHandle,
  requireNativeComponent,
  UIManager,
} from "react-native";
import { getViewManagerConfig } from "./MyCustomComponentConfig";

const RCTCustomView = requireNativeComponent(
  "RCTMyCustomView",
  MyCustomView,
  {}
);

class MyCustomView extends React.PureComponent {
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

  _onClick = (event) => {
    if (!this.props.onClick) {
      return;
    }

    // process raw event
    this.props.onClick(event.nativeEvent);
  };

  setPage = (number) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      getViewManagerConfig().Commands.setPage,
      [number]
    );
  };

  updateBg = (bgColor) => {

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      getViewManagerConfig().Commands.updateBg,
      [bgColor]
    );
  };

  updateTeamName = (teamName) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      getViewManagerConfig().Commands.updateTeamName,
      [teamName]
    );
  };

  updateTeamNameVisibility = (teamNameVisibility) => {

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.myRef.current),
      getViewManagerConfig().Commands.updateTeamNameVisibility,
      [teamNameVisibility]
    );
  };

  render() {
    return (
      <RCTCustomView
        ref={this.myRef}
        {...this.props}
        onClick={this._onClick}
        onPageScroll={this?.props?.onPageScroll}
      />
    );
  }
}
export default MyCustomView;
