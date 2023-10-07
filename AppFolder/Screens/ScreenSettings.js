import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { openComposer } from "react-native-email-link";
import { Navigation } from "react-native-navigation";
import { useNavigationComponentDidAppear } from "react-native-navigation-hooks/dist";
import Orientation from "react-native-orientation-locker";
import Rate, { AndroidMarket } from "react-native-rate";
import Ioicon from "react-native-vector-icons/Ionicons";
import { AppScreens, pushTransparentScreen } from "../General/AppRoutes";
import MobxGameState, { KEYS_GAME_STATE } from "../General/GameState";
import { ACTIONS } from "./ScreenScoreboard/exports";

const ScreenSettings = (props) => {
  const [loadScreen, setLoadScreen] = useState(false);
  const [teamNameVisibility, setTeamNameVisibility] = useState(false);

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
    {
      title: "Remove Ads",
      id: "remove_ads",
      icon: "receipt-outline",
      type: "button",
      subTitle:
        "We know ads sucks, but ads help us to pay our team to continue improving this app.",
      enabled: true,
      onPress: (index) => {
        cOnpress(index);
      },
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoadScreen(true);
    }, 200);
  }, []);

  useNavigationComponentDidAppear(() => {
    // Orientation.lockToLandscape();

    var visibilityData = MobxGameState.getKey(
      KEYS_GAME_STATE.TeamNameVisibility
    );
    visibilityData = !!visibilityData ? true : false;

    setTeamNameVisibility(visibilityData);
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
      case "share_score":
        let message =
          MobxGameState.getKey(KEYS_GAME_STATE.TeamAName) +
          "  : " +
          MobxGameState.getKey(KEYS_GAME_STATE.TeamAScore) +
          "\n" +
          MobxGameState.getKey(KEYS_GAME_STATE.TeamBName) +
          "  : " +
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
        pushTransparentScreen({ name: AppScreens.ScreenSetTeamName });
        break;
      case "team_colors":
        pushTransparentScreen({ name: AppScreens.ScreenSetTeamName });
        break;
      case "support":
        openComposer({
          to: "support@mail.com",
          message: "Please Contact Support.",
        });
        break;
      case "rate":
        const options = {
          AppleAppID: "2193813192",
          GooglePackageName: "com.vuproductionsmedia.scoreboard",
          AmazonPackageName: "com.vuproductionsmedia.scoreboard",
          OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
          preferredAndroidMarket: AndroidMarket.Google,
          preferInApp: false,
          openAppStoreIfInAppFails: true,
          fallbackPlatformURL: "http://www.mywebsite.com/myapp.html",
        };
        Rate.rate(options, (success, errorMessage) => {
          if (success) {
            // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
            // this.setState({rated:true})

            console.log(`Fahad Success: ${success}`);
          }
          if (errorMessage) {
            // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
            console.error(`Example page Rate.rate() error: ${errorMessage}`);
          }
        });
        break;
      case "remove_ads":
        break;
    }
  }

  return (
    <Animatable.View animation={"fadeIn"} duration={200} delay={0}>
      <SafeAreaView
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        {/* <StatusBar hidden={true} backgroundColor={"black"} /> */}
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
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
                Navigation.dismissOverlay(props.componentId);
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
          {loadScreen == true && (
            <FlatList
              keyExtractor={(_, index) => String(index)}
              data={SettingOptions}
              renderItem={({ index, item }) => {
                return Cell({
                  index,
                  item,
                  teamNameVisibility: teamNameVisibility,
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
}) => {
  const ViewReset = () => {
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
        <Text style={{ color: "white", fontWeight: "bold" }}>Reset</Text>
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

  const ViewSoundEffect = () => {
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
          <Ioicon
            name={item?.icon}
            size={30}
            color={"white"}
            style={{ marginEnd: 15 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontWeight: "600" }}>
              {item?.title}
            </Text>
            {item.subTitle != "" && (
              <Text numberOfLines={2} style={{ color: "white", fontSize: 12 }}>
                {item?.subTitle}
              </Text>
            )}
          </View>
          {index == 0 ? (
            <ViewReset />
          ) : // : index == 1 ? <ViewLogos />
          index == 2 ? (
            <ViewSoundEffect />
          ) : index == 4 ? (
            <ViewTeamNameVisibility
              currentValue={item.currentValue}
              indF={index}
            />
          ) : index == 5 || index == 6 || index == 8 ? (
            <Ioicon
              name={"chevron-forward-outline"}
              size={40}
              color={"white"}
            />
          ) : index == 9 ? (
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

export default ScreenSettings;
