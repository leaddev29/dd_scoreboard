import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { openComposer } from "react-native-email-link";
import {
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { Navigation } from "react-native-navigation";
import { useNavigationComponentDidAppear } from "react-native-navigation-hooks/dist";
import Orientation from "react-native-orientation-locker";
import Ioicon from "react-native-vector-icons/Ionicons";
import SwitchIconSVG from "../../Assets/Images/SwitchIconSVG";
import { APP_STACK, AppScreens, pushNewScreen } from "../../General/AppRoutes";
import MobxGameState, { KEYS_GAME_STATE } from "../../General/GameState";
import { splashImg } from "../../General/Images";
import { ACTIONS } from "../ScreenScoreboard/exports";

const SettingsScreen = (props) => {
  // const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2827613882829649/8740445930';
  const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-2827613882829649/3703741670"
      : "ca-app-pub-2827613882829649/8740445930";

  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    // keywords: ['fashion', 'clothing'],
    keywords: ["sports"],
  });

  let isIOS = Platform.OS === "ios";
  const [loadScreen, setLoadScreen] = useState(false);
  const [teamNameVisibility, setTeamNameVisibility] = useState(false);
  const [switchScoreMode, setSwitchScoreMode] = useState(false);
  const [myCurrentOrientation, setMyCurrentOrientation] = useState("");

  const _onOrientationDidChange = (or) => {
    console.log("fahad or: ", or);
    setMyCurrentOrientation(or);
  };

  // const [SettingOptions, setSettingOptions] = useState([
  //   {
  //     title: "Reset Score",
  //     id: "reset_score",
  //     icon: "refresh-outline",
  //     type: "button",
  //     subTitle: "",
  //     enabled: false,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },
  //   {
  //     title: "Share Score",
  //     id: "share_score",
  //     icon: "share-social",
  //     type: "button",
  //     subTitle: "",
  //     enabled: true,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },
  //   {
  //     title: "Sound Effects",
  //     id: "sound_effects",
  //     icon: "volume-mute-outline",
  //     type: "button",
  //     subTitle: "",
  //     enabled: false,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },

  //   { title: "Customize Scoreboard", id: "", icon: "", type: "heading" },
  //   {
  //     title: "TeamName Visibility",
  //     id: "teamname_visibility",
  //     icon: "text-outline",
  //     type: "button",
  //     subTitle: "",
  //     currentValue: false,
  //     enabled: false,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },
  //   {
  //     title: "Edit Team Names",
  //     id: "edit_team_names",
  //     icon: "text-outline",
  //     type: "button",
  //     subTitle: "",
  //     enabled: true,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },
  //   {
  //     title: "Team Colors",
  //     id: "team_colors",
  //     icon: "color-palette",
  //     type: "button",
  //     subTitle: "",
  //     enabled: true,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },

  //   { title: "Information", id: "", icon: "", type: "heading" },
  //   // { title: "Support", id: "support", icon: "mail-outline", type: "button", subTitle: "Our team will get back to you within 48 hours.", enabled: true, onPress: (index) => { cOnpress(index) } },
  //   {
  //     title: "Rate",
  //     id: "rate",
  //     icon: "star-outline",
  //     type: "button",
  //     subTitle:
  //       "We know it's a hastle to rate the app, but if you like the app it would mean the world to us.",
  //     enabled: true,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },
  //   {
  //     title: "Remove Ads",
  //     id: "remove_ads",
  //     icon: "receipt-outline",
  //     type: "button",
  //     subTitle:
  //       "We know ... ads sucks, But ads help us to pay our team to continue improving this app.",
  //     enabled: true,
  //     onPress: (index) => {
  //       cOnpress(index);
  //     },
  //   },
  // ]);

  var SettingOptions = [
    {
      title: "Reset Score",
      id: "reset_score",
      icon: "refresh-outline",
      type: "button",
      subTitle: "",
      enabled: false,
      onPress: (index) => {
        cOnpress(index);
      },
    },
    {
      title: "Switch Scores",
      id: "switch_score",
      // icon: "refresh-outline",
      type: "button",
      subTitle: "",
      enabled: false,
      currentValue: switchScoreMode,
      onPress: (index, obj) => {
        cOnpress(index, obj);
      },
    },

    {
      title: "Share Score",
      id: "share_score",
      icon: "share-social",
      type: "button",
      subTitle: "",
      enabled: true,
      onPress: (index) => {
        cOnpress(index);
      },
    },
    // {
    //   title: "Share",
    //   id: "share_app",
    //   icon: "share-social",
    //   type: "button",
    //   subTitle: "",
    //   enabled: true,
    //   onPress: (index) => {
    //     cOnpress(index);
    //   },
    // },
    {
      title: "Sound Effects",
      id: "sound_effects",
      icon: "volume-mute-outline",
      type: "button",
      subTitle: "",
      enabled: false,
      onPress: (index) => {
        cOnpress(index);
      },
    },

    { title: "Customize Scoreboard", id: "", icon: "", type: "heading" },
    {
      title: "Team Name Visibility",
      id: "teamname_visibility",
      icon: "text-outline",
      type: "button",
      subTitle: "",
      currentValue: teamNameVisibility,
      enabled: false,
      onPress: (index, obj) => {
        cOnpress(index, obj);
      },
    },
    {
      title: "Edit Team Names",
      id: "edit_team_names",
      icon: "text-outline",
      type: "button",
      subTitle: "",
      enabled: true,
      onPress: (index) => {
        cOnpress(index);
      },
    },
    {
      title: "Team Colors",
      id: "team_colors",
      icon: "color-palette",
      type: "button",
      subTitle: "",
      enabled: true,
      onPress: (index) => {
        cOnpress(index);
      },
    },

    { title: "Information", id: "", icon: "", type: "heading" },
    // { title: "Support", id: "support", icon: "mail-outline", type: "button", subTitle: "Our team will get back to you within 48 hours.", enabled: true, onPress: (index) => { cOnpress(index) } },
    {
      title: "Rate",
      id: "rate",
      icon: "star-outline",
      type: "button",
      subTitle:
        "We know it's a hastle to rate the app, but if you like the app it would mean the world to us.",
      enabled: true,
      onPress: (index) => {
        cOnpress(index);
      },
    },
    // {
    //   title: "Remove Ads",
    //   id: "remove_ads",
    //   icon: "receipt-outline",
    //   type: "button",
    //   subTitle:
    //     "We know ads sucks, but ads help us to pay our team to continue improving this app.",
    //   enabled: true,
    //   onPress: (index) => {
    //     cOnpress(index);
    //   },
    // },
  ];

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoadScreen(true);
    }, 200);

    // const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    //   setLoaded(true);

    // });

    // const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    //   setLoaded(false);

    //   interstitial.load();
    // });

    // // Start loading the interstitial straight away
    // interstitial.load();

    // // Unsubscribe from events on unmount
    // return () => {
    //   unsubscribe();
    //   unsubscribeClosed();
    // };

    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ["sports"],
    });

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewarded.show();
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("Callback called!");
      }
    );

    // setTimeout(() => {
    //   rewarded.load();
    // }, 100);

    // showAd();

    Orientation.getDeviceOrientation((deviceOrientation) => {
      console.log("Current Device Orientation: ", deviceOrientation);
      setMyCurrentOrientation(deviceOrientation);
    });

    Orientation.addOrientationListener(_onOrientationDidChange);

    return () => {
      Orientation.removeOrientationListener(_onOrientationDidChange);
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const showAd = () => {
    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ["fashion", "clothing"],
    });

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewarded.show();
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("Callback called!");
      }
    );

    rewarded.load();
  };

  useNavigationComponentDidAppear(() => {
    // Orientation.lockToLandscape();

    Orientation.unlockAllOrientations();

    var visibilityData = MobxGameState.getKey(
      KEYS_GAME_STATE.TeamNameVisibility
    );
    visibilityData = !!visibilityData ? true : false;

    setTeamNameVisibility(visibilityData);

    var switchScoreData = MobxGameState.getKey(KEYS_GAME_STATE.SwitchScoreMode);
    switchScoreData = !!switchScoreData ? true : false;
    setSwitchScoreMode(switchScoreData);

    // var updatedSettings = JSON.parse(JSON.stringify(SettingOptions));

    // updatedSettings.map((obj) => {
    //   if (obj.id === "teamname_visibility") {
    //     obj.currentValue = visibilityData;
    //   }
    // });

    // setSettingOptions(updatedSettings);

    SettingOptions.map((obj) => {
      if (obj.id === "teamname_visibility") {
        obj.currentValue = visibilityData;
      }
    });

    console.log("\n\nfahad visibility Data: ", visibilityData);
    console.log("\n\nfahad data: ", SettingOptions);
  }, props.componentId);

  function cOnpress(id, objData) {
    console.log(`Id => ${id}`);
    if (id == undefined) {
      return;
    }
    switch (id) {
      case "reset_score":
        // showAd();

        Alert.alert(
          "Reset",
          "Reset will delete all scores",
          [
            {
              text: "Confirm",
              onPress: async () => {
                Navigation.dismissOverlay(props.componentId);
                setTimeout(() => {
                  if (props?.EventHandler != undefined) {
                    props.EventHandler({ event: ACTIONS.RESET_GAME });
                    Navigation.pop(APP_STACK);
                  } else {
                    console.log(`Event-Handler == udenfined.`);
                  }
                }, 500);
              },
            },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        break;
      case "switch_score":
        // Alert.alert(
        //   "Switch",
        //   "Are you sure?",
        //   [
        //     {
        //       text: "Confirm",
        //       onPress: async () => {

        //       },
        //     },
        //     {
        //       text: "Cancel",
        //       onPress: () => console.log("Cancel Pressed"),
        //       style: "cancel",
        //     },
        //   ],
        //   { cancelable: false }
        // );

        SettingOptions.map((obj) => {
          if (obj.id === "switch_score") {
            obj.currentValue = objData;
          }
        });

        MobxGameState.setKey(KEYS_GAME_STATE.SwitchScoreMode, objData);

        Navigation.dismissOverlay(props.componentId);
        setTimeout(() => {
          if (props?.EventHandler != undefined) {
            props.EventHandler({ event: ACTIONS.SWITCH_SCORES });
            // Navigation.pop(APP_STACK);
          } else {
            console.log(`Event-Handler == udenfined.`);
          }
        }, 500);
        break;
      case "share_score":
        let message =
          MobxGameState.getKey(KEYS_GAME_STATE.TeamAName) +
          ": " +
          MobxGameState.getKey(KEYS_GAME_STATE.TeamAScore) +
          "\n" +
          MobxGameState.getKey(KEYS_GAME_STATE.TeamBName) +
          ": " +
          MobxGameState.getKey(KEYS_GAME_STATE.TeamBScore) +
          "\n \n " +
          "Get The App: " +
          "\n" +
          "iOS: https://apps.apple.com/us/app/the-best-scoreboard-ever/id6444043705" +
          "\n" +
          "Android: https://play.google.com/store/apps/details?id=com.vuproductionsmedia.scoreboard" +
          "\n \n" +
          "#bestscoreboardever";
        Share.share({
          title: "The Best Scoreboard Ever",
          message: message,
        });
        break;
      case "share_app":
        Share.share({
          title: "The Best Scoreboard Ever",
          message: isIOS
            ? "https://apps.apple.com/us/app/the-best-scoreboard-ever/id6444043705"
            : "https://play.google.com/store/apps/details?id=com.vuproductionsmedia.scoreboard",
        });
        break;
      case "sound_effects":
        break;
      case "teamname_visibility":
        console.log("Fahad Onpress new value: ", objData);

        // var updatedSettings = JSON.parse(JSON.stringify(SettingOptions));

        // updatedSettings.map((obj) => {
        //   if (obj.id === "teamname_visibility") {
        //     obj.currentValue = objData;
        //   }
        // });

        // setSettingOptions(updatedSettings);

        SettingOptions.map((obj) => {
          if (obj.id === "teamname_visibility") {
            obj.currentValue = objData;
          }
        });
        MobxGameState.setKey(KEYS_GAME_STATE.TeamNameVisibility, objData);

        setTimeout(() => {
          if (props?.EventHandler != undefined) {
            props.EventHandler({
              event: ACTIONS.TEAMNAME_VISIBILITY_CHANGED,
              newValue: objData,
            });
          } else {
            console.log(`Event-Handler == udenfined.`);
          }
        }, 500);

        break;
      case "edit_team_names":
        pushNewScreen({
          name: AppScreens.ScreenSetTeamName,
          title: "Edit Teams",
        });
        // pushTransparentScreen({ name: AppScreens.ScreenSetTeamName });
        break;
      case "team_colors":
        pushNewScreen({
          name: AppScreens.ScreenSetTeamName,
          title: "Edit Teams",
        });
        // pushTransparentScreen({ name: AppScreens.ScreenSetTeamName });
        break;
      case "support":
        openComposer({
          to: "support@mail.com",
          message: "Please Contact Support.",
        });
        break;
      case "rate":
        if (Platform.OS === "android") {
          Linking.openURL(
            "https://play.google.com/store/apps/details?id=com.vuproductionsmedia.scoreboard"
          );
        } else {
          // const link =
          //   "itms-apps://apps.apple.com/us/app/the-best-scoreboard-ever/id6444043705=id";

          const link =
            "https://apps.apple.com/us/app/the-best-scoreboard-ever/id6444043705";

          Linking.openURL(link);
          // Linking.canOpenURL(link).then(
          //   (supported) => {
          //     supported && Linking.openURL(link);
          //   },
          //   (err) => console.log(err)
          // );

          // Linking.openURL(
          //   "https://"
          // );
        }

        // const options = {
        //   AppleAppID:"2193813192",
        //   GooglePackageName:"com.vuproductionsmedia.scoreboard",
        //   AmazonPackageName:"com.vuproductionsmedia.scoreboard",
        //   OtherAndroidURL:"http://www.randomappstore.com/app/47172391",
        //   preferredAndroidMarket: AndroidMarket.Google,
        //   preferInApp:true,
        //   openAppStoreIfInAppFails:true,
        //   fallbackPlatformURL:"http://www.mywebsite.com/myapp.html",
        // }
        // Rate.rate(options, (success, errorMessage)=>{
        //   if (success) {
        //     // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
        //     // this.setState({rated:true})

        //     console.log(`Fahad Success: ${success}`);
        //   }
        //   if (errorMessage) {
        //     // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
        //     console.error(`Example page Rate.rate() error: ${errorMessage}`)
        //   }
        // })

        // // Give you result if version of device supported to rate app or not!
        //           console.log("fahad review available: ", InAppReview.isAvailable());

        // // trigger UI InAppreview
        // InAppReview.RequestInAppReview();
        // // InAppReview.RequestInAppReview()
        // //   .then((hasFlowFinishedSuccessfully) => {
        // //     // when return true in android it means user finished or close review flow
        // //     console.log('InAppReview in android', hasFlowFinishedSuccessfully);

        // //     // when return true in ios it means review flow lanuched to user.
        // //     console.log(
        // //       'InAppReview in ios has launched successfully',
        // //       hasFlowFinishedSuccessfully,
        // //     );

        // //     // 1- you have option to do something ex: (navigate Home page) (in android).
        // //     // 2- you have option to do something,
        // //     // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

        // //     // 3- another option:
        // //     if (hasFlowFinishedSuccessfully) {
        // //       // do something for ios
        // //       // do something for android
        // //     }

        // //     // for android:
        // //     // The flow has finished. The API does not indicate whether the user
        // //     // reviewed or not, or even whether the review dialog was shown. Thus, no
        // //     // matter the result, we continue our app flow.

        // //     // for ios
        // //     // the flow lanuched successfully, The API does not indicate whether the user
        // //     // reviewed or not, or he/she closed flow yet as android, Thus, no
        // //     // matter the result, we continue our app flow.
        // //   })
        // //   .catch((error) => {
        // //     //we continue our app flow.
        // //     // we have some error could happen while lanuching InAppReview,
        // //     // Check table for errors and code number that can return in catch.
        // //     console.log(error);
        // //   });

        break;
      case "remove_ads":
        break;
    }
  }

  return (
    <Animatable.View animation={"fadeIn"} duration={200} delay={0}>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          // backgroundColor: "#990011"
        }}
      >
        <Image
          style={{
            height: "100%",
            width: "100%",
            resizeMode: myCurrentOrientation?.includes("PORTRAIT")
              ? "stretch"
              : "cover",
            opacity: 0.1,
            // borderRadius: RFValue(10),
          }}
          imageStyle={{
            height: "100%",
            width: "100%",
            resizeMode: "cover",
            // borderRadius: RFValue(10),
          }}
          source={splashImg}
        />
      </View>
      <SafeAreaView
        style={{
          // backgroundColor: "#991122",
          //   width: Dimensions.get("window").width,
          //   height: Dimensions.get("window").height,
          width: "100%",
          height: "100%",
          paddingTop: 10,
        }}
      >
        {/* <StatusBar hidden={true} backgroundColor={"black"} /> */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              // backgroundColor: "black",
              paddingVertical: 25,
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              Settings
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Navigation.dismissOverlay(props.componentId);
                Navigation.pop(APP_STACK);
              }}
              style={{ position: "absolute", top: 10, right: 10 }}
            >
              <Ioicon
                name={"close"}
                size={30}
                color={"white"}
                style={{ marginEnd: 15 }}
              />
            </TouchableOpacity>
          </View>

          {/* <RNCAdMobBanner
            adSize="banner"
            adUnitID={'111'}
            testDevices={[RNCAdMobBanner.simulatorId]}
            onAdFailedToLoad={(error) => console.error(error)}
          /> */}

          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            {/* <BannerAd size={BannerAdSize.BANNER} unitId={TestIds.BANNER} /> */}
          </View>

          {loadScreen == true && (
            <FlatList
              keyExtractor={(_, index) => String(index)}
              data={SettingOptions}
              renderItem={({ index, item }) => {
                return Cell({
                  index,
                  item,
                  teamNameVisibility: teamNameVisibility,
                  switchScoreMode: switchScoreMode,
                });
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </Animatable.View>
  );
};

const Cell = ({
  item,
  index,
  RightView = null,
  cOnPress,
  teamNameVisibility,
  switchScoreMode,
}) => {
  const ViewWithBtn = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          item?.onPress(item?.id);
        }}
        activeOpacity={0.8}
        style={{
          width: 75,
          paddingVertical: 5,
          borderRadius: 5,
          borderWidth: 0.5,
          borderColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {props.btnText}
        </Text>
      </TouchableOpacity>
    );
  };
  const ViewLogos = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ioicon
          name={"logo-facebook"}
          size={40}
          color={"white"}
          style={{ marginEnd: 15, borderRadius: 5 }}
        />
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 5,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ioicon name={"logo-twitter"} size={25} color={"black"} style={{}} />
        </View>
      </View>
    );
  };

  const ViewSoundEffect = (props) => {
    const [onn, setOnn] = useState(false);
    const title = onn ? "On" : "Off";
    const titleColor = onn ? "black" : "white";
    const bgColor = onn ? "white" : "black";
    const borderWidth = onn ? 0 : 1;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          item?.onPress(item?.id, !onn);
          setOnn(!onn);
        }}
        style={{
          width: 75,
          paddingVertical: 5,
          backgroundColor: bgColor,
          borderWidth: borderWidth,
          borderColor: "white",
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: titleColor, fontWeight: "bold" }}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const ViewSwitchScore = (obj) => {
    const [onn, setOnn] = useState(
      !!obj && !!obj.currentValue ? obj.currentValue : false
    );
    const title = onn ? "On" : "Off";
    const titleColor = onn ? "black" : "white";
    const bgColor = onn ? "white" : "black";
    const borderWidth = onn ? 0 : 1;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          console.log("fahad click value: ", !onn);
          item?.onPress(item?.id, !onn);
          setOnn(!onn);
        }}
        style={{
          width: 75,
          paddingVertical: 5,
          backgroundColor: bgColor,
          borderWidth: borderWidth,
          borderColor: "white",
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: titleColor, fontWeight: "bold" }}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const ViewTeamNameVisibility = (obj) => {
    console.log("\n\n\n\n");
    console.log("Fahad cuValue in component: ", obj);
    console.log("\n\n\n\n");
    const [onn, setOnn] = useState(
      !!obj && !!obj.currentValue ? obj.currentValue : false
    );
    const title = onn ? "On" : "Off";
    const titleColor = onn ? "black" : "white";
    const bgColor = onn ? "white" : "black";
    const borderWidth = onn ? 0 : 1;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          console.log("fahad click value: ", !onn);
          item?.onPress(item?.id, !onn);
          setOnn(!onn);
        }}
        style={{
          width: 75,
          paddingVertical: 5,
          backgroundColor: bgColor,
          borderWidth: borderWidth,
          borderColor: "white",
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: titleColor, fontWeight: "bold" }}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const ViewResetAds = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          item?.onPress(item?.id);
        }}
        activeOpacity={0.8}
        style={{
          width: 75,
          paddingVertical: 5,
          borderRadius: 5,
          borderWidth: 0.5,
          borderColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Restore</Text>
      </TouchableOpacity>
    );
  };

  console.log("fahad item: ", item);
  return (
    <Animatable.View animation={"slideInUp"} duration={300} delay={index * 100}>
      {item?.type == "button" ? (
        <TouchableOpacity
          onPress={() => {
            !item.enabled ? null : item?.onPress(item?.id);
          }}
          activeOpacity={item?.enabled ? 0.8 : 1}
          style={{
            paddingVertical: 10,
            borderTopWidth: 0.2,
            borderBottomWidth: 0.2,
            borderColor: "lightgrey",
            height: 65,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            paddingHorizontal: 15,
          }}
        >
          {!!item?.icon ? (
            <Ioicon
              name={item?.icon}
              size={30}
              color={"white"}
              style={{ marginEnd: 15 }}
            />
          ) : (
            <View
              style={{
                width: 30,
                height: 30,
                marginEnd: 15,
              }}
            >
              <SwitchIconSVG />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontWeight: "600" }}>
              {item?.title}
            </Text>
            {item.subTitle != "" && (
              <Text numberOfLines={3} style={{ color: "white", fontSize: 12 }}>
                {item?.subTitle}
              </Text>
            )}
          </View>
          {index == 0 ? (
            <ViewWithBtn btnText={"Reset"} />
          ) : // : index == 1 ? <ViewLogos />
          index == 1 ? (
            <ViewSwitchScore currentValue={item.currentValue} indF={index} />
          ) : index == 3 ? (
            <ViewSoundEffect />
          ) : index == 5 ? (
            <ViewTeamNameVisibility
              currentValue={item.currentValue}
              indF={index}
            />
          ) : index == 6 || index == 6 || index == 9 ? (
            <Ioicon
              name={"chevron-forward-outline"}
              size={40}
              color={"white"}
            />
          ) : index == 11 ? (
            <ViewResetAds />
          ) : null}
          {RightView != null && <RightView />}
        </TouchableOpacity>
      ) : (
        <View
          style={{
            paddingVertical: 5,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Text>{item?.title}</Text>
        </View>
      )}
    </Animatable.View>
  );
};

export default SettingsScreen;
