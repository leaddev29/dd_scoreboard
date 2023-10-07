import { UIManager } from "react-native";

export function getViewManagerConfig(viewManagerName = "RCTMyCustomView") {
    return UIManager.getViewManagerConfig(viewManagerName);
}