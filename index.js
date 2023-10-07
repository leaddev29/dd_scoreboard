import { Navigation } from "react-native-navigation";
import { NavigationProvider } from "react-native-navigation-hooks/dist";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { APP_STACK, AppScreens } from "./AppFolder/General/AppRoutes";
import ScreenScoreboard from "./AppFolder/Screens/ScreenScoreboard";
import ScreenSetTeamName from "./AppFolder/Screens/ScreenSetTeamName";
import ScreenSettings from "./AppFolder/Screens/ScreenSettings";

import FullScreenAdScreen from "./AppFolder/Screens/ScreenScoreboard/FullScreenAdScreen";
import SettingsScreen from "./AppFolder/Screens/Settings/SettingsScreen";
import Splash from "./AppFolder/Screens/Splash";
import SplashRN from "./AppFolder/Screens/SplashRN";
// import { MobileAds } from "react-native-google-mobile-ads";

// AppLovinMAX.initialize("YOUR_SDK_KEY_HERE", (configuration) => {
//     // SDK is initialized, start loading ads
//     console.log("APP LOVIN MAX is being initialized.");
//     console.log(`response`)
// });

// MobileAds()
//   .initialize()
//   .then(adapterStatuses => {
//     // Initialization complete!

//     console.log("Fahad AdMob SDK initilized!");
//   });

// // Your AdMob Application ID (replace with your actual ID)
// const adMobAppId = 'ca-app-pub-2827613882829649~5409335890';

// // Set the AdMob Application ID
// AdMobAppId.setAppId(adMobAppId);

Navigation.setDefaultOptions({
  layout: {
    componentBackgroundColor: "black",
  },
  animations: {
    push: {
      content: {
        alpha: {
          from: 0,
          to: 1,
          duration: 100,
        },
      },
    },
    pop: {
      content: {
        alpha: {
          from: 1,
          to: 0,
          duration: 100,
        },
      },
    },
  },
});

Navigation.registerComponent(AppScreens.Splash, () => Splash);
Navigation.registerComponent(AppScreens.SplashRN, () => SplashRN);

Navigation.registerComponent(AppScreens.ScreenSettings, () => ScreenSettings);
Navigation.registerComponent(AppScreens.SettingsScreen, () => SettingsScreen);
Navigation.registerComponent(
  AppScreens.FullScreenAdScreen,
  () => FullScreenAdScreen
);

Navigation.registerComponent(
  AppScreens.ScreenScoreboard,
  () => (props) => (
    <SafeAreaProvider style={{}}>
      <NavigationProvider value={{ componentId: props.componentId }}>
        <ScreenScoreboard {...props} />
      </NavigationProvider>
    </SafeAreaProvider>
  ),
  () => ScreenScoreboard
);
Navigation.registerComponent(
  AppScreens.ScreenSetTeamName,
  () => ScreenSetTeamName
);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        id: APP_STACK,
        children: [
          {
            component: {
              name: AppScreens.ScreenScoreboard,
              options: {
                layout: {
                  backgroundColor: "black",
                  componentBackgroundColor: "black",
                  orientation: ["landscape"],
                },
                window: {
                  backgroundColor: "black",
                },
                topBar: {
                  visible: false,
                },
                statusBar: {
                  visible: false,
                  drawBehind: "true",
                  backgroundColor: "black",
                  // style: 'light',
                },
              },
            },
          },
        ],
      },
    },
  });
});
