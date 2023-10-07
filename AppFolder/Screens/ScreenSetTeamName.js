import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Navigation } from "react-native-navigation";
import { useNavigationComponentDidAppear } from "react-native-navigation-hooks/dist";
import Orientation from "react-native-orientation-locker";
import Ioicon from "react-native-vector-icons/Ionicons";
import ColorPicker from "react-native-wheel-color-picker";
// import ColorPanel from 'react-native-color-panel';

import { APP_STACK } from "../General/AppRoutes";
import MobxGameState, { KEYS_GAME_STATE } from "../General/GameState";

const ScreenSetTeamName = (props) => {
  const [teamANameOrg, setTeamANameOrg] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamAName)
  );
  const [teamBNameOrg, setTeamBNameOrg] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamBName)
  );
  const [teamAColorOrg, setTeamAColorOrg] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamAColor)
  );
  const [teamBColorOrg, setTeamBColorOrg] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamBColor)
  );

  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAColor, setTeamAColor] = useState("");
  const [teamBColor, setTeamBColor] = useState("");

  const [openColorPalette, setOpenColorPalette] = useState(false);
  const [myCurrentOrientation, setMyCurrentOrientation] = useState("");

  const paletteColor = useRef(null);
  const setPaletteColor = useRef(null);

  const isAnythingChanged = () => {
    return !(
      teamANameOrg === teamAName &&
      teamBNameOrg === teamBName &&
      teamAColorOrg === teamAColor &&
      teamBColorOrg === teamBColor
    );
  };

  useNavigationComponentDidAppear(() => {
    // Orientation.lockToLandscape();

    Orientation.unlockAllOrientations();

    // var updatedSettings = JSON.parse(JSON.stringify(SettingOptions));

    // updatedSettings.map((obj) => {
    //   if (obj.id === "teamname_visibility") {
    //     obj.currentValue = visibilityData;
    //   }
    // });

    // setSettingOptions(updatedSettings);
  }, props.componentId);

  function openPalette(team) {
    if (team == "team_a") {
      paletteColor.current = teamAColor;
      setPaletteColor.current = setTeamAColor;
    } else {
      paletteColor.current = teamBColor;
      setPaletteColor.current = setTeamBColor;
    }
    setOpenColorPalette(true);
  }
  function reset() {
    // Navigation.dismissOverlay(props.componentId)
    setTeamAName(MobxGameState.getKey(KEYS_GAME_STATE.TeamAName));
    setTeamBName(MobxGameState.getKey(KEYS_GAME_STATE.TeamBName));
    setTeamAColor(MobxGameState.getKey(KEYS_GAME_STATE.TeamAColor));
    setTeamBColor(MobxGameState.getKey(KEYS_GAME_STATE.TeamBColor));
    return;
    Alert.alert(
      "Reset",
      "Are You Sure to Reset",
      [
        {
          text: "Reset",
          onPress: async () => {
            MobxGameState.reset();
            setTeamAColor(MobxGameState.teamAColor);
            setTeamBColor(MobxGameState.teamBColor);
            setTeamAName(MobxGameState.teamAName);
            setTeamBName(MobxGameState.teamBName);
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
  }

  function save() {
    MobxGameState.setKey(KEYS_GAME_STATE.TeamAColor, teamAColor);
    MobxGameState.setKey(KEYS_GAME_STATE.TeamBColor, teamBColor);
    MobxGameState.setKey(KEYS_GAME_STATE.TeamAName, teamAName);
    MobxGameState.setKey(KEYS_GAME_STATE.TeamBName, teamBName);
    MobxGameState.saveAsync();
    setTimeout(() => {
      //Navigation.dismissOverlay(props.componentId);
      Navigation.pop(APP_STACK);
    }, 500);
    console.log(`After Saving => teamA Color = ${MobxGameState.teamAColor}`);
  }

  const _onOrientationDidChange = (or) => {
    console.log("fahad or: ", or);
    setMyCurrentOrientation(or);
  };

  useEffect(() => {
    Orientation.getDeviceOrientation((deviceOrientation) => {
      console.log("Current Device Orientation: ", deviceOrientation);
      setMyCurrentOrientation(deviceOrientation);
    });

    Orientation.addOrientationListener(_onOrientationDidChange);

    if (!!teamANameOrg) {
      setTeamAName(teamANameOrg);
      setTeamBName(teamBNameOrg);
      setTeamAColor(teamAColorOrg);
      setTeamBColor(teamBColorOrg);
    }
    return () => {
      Orientation.removeOrientationListener(_onOrientationDidChange);
    };
  }, []);

  return (
    <Animatable.View
      animation={"slideInRight"}
      duration={500}
      delay={0}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{ flex: 1, paddingTop: 2, backgroundColor: "black" }}
      >
        {/* <StatusBar hidden={true} backgroundColor={"black"} /> */}
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <View
            style={{
              backgroundColor: "black",
              marginVertical: 4,
              width: "100%",
              alignItems: "center",
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
              Edit Teams
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Navigation.dismissOverlay(props.componentId);
                Navigation.pop(APP_STACK);
              }}
              style={{ position: "absolute", left: 10 }}
            >
              <Ioicon
                name={"arrow-back-outline"}
                size={30}
                color={"white"}
                style={{ marginEnd: 15 }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: myCurrentOrientation?.includes("PORTRAIT")
                ? "column"
                : "row",
              marginVertical: 5,
              // backgroundColor: "#FFF"
            }}
          >
            <View
              style={{
                flex: 0.5,
                // backgroundColor: '#907878'
              }}
            >
              <Cell
                title={"Team A"}
                placeholder={"Team 1 name"}
                placeholderTextColor={"#787878"}
                score={MobxGameState.getKey(KEYS_GAME_STATE.TeamAScore)}
                color={teamAColor}
                setColor={setTeamAColor}
                setTeamName={setTeamAName}
                teamName={teamAName}
                mOrientation={myCurrentOrientation}
                onPressColor={() => {
                  openPalette("team_a");
                }}
                index={1}
              />
            </View>

            <View
              style={{
                height: myCurrentOrientation?.includes("PORTRAIT") ? 1 : "90%",
                width: myCurrentOrientation?.includes("PORTRAIT") ? "90%" : 1,
                alignSelf: "center",
                backgroundColor: "white",
              }}
            />

            <View
              style={{
                flex: 0.5,
                // backgroundColor: 'white'
              }}
            >
              <Cell
                title={"Team B"}
                placeholder={"Team 2 name"}
                placeholderTextColor={"#787878"}
                score={MobxGameState.getKey(KEYS_GAME_STATE.TeamBScore)}
                color={teamBColor}
                setColor={setTeamBColor}
                setTeamName={setTeamBName}
                teamName={teamBName}
                mOrientation={myCurrentOrientation}
                onPressColor={() => {
                  openPalette("team_b");
                }}
                index={2}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              // marginVertical: 20,
              alignSelf: "center",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: "#881122"
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setTimeout(() => {
                  //Navigation.dismissOverlay(props.componentId);
                  Navigation.pop(APP_STACK);
                }, 500);
              }}
              style={{
                width: 110,
                height: 40,
                // marginStart: 5,
                borderWidth: 1,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <View
              style={{
                width: 20,
              }}
            ></View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={save}
              style={{
                width: 110,
                height: 40,
                marginStart: 5,
                borderWidth: 1,
                borderColor: isAnythingChanged() ? "#f2b758" : "white",
                backgroundColor: isAnythingChanged() ? "#f2b758" : "black",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: isAnythingChanged() ? "#000" : "white" }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animatable.View>
  );
};

const Cell = ({
  title = "",
  placeholder = "",
  placeholderTextColor = "",
  score = 0,
  color = "",
  setColor,
  setTeamName,
  teamName = {},
  onPressColor,
  mOrientation,
  index,
}) => {
  let isAndroid = Platform.OS == "android";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: mOrientation?.includes("PORTRAIT") ? 10 : 10,
        // padding: 2
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          // marginHorizontal: 10,
          // paddingVertical: 2,
          backgroundColor: "#2b2e37",
          borderRadius: 5,
          // height: 35,
          borderWidth: 0.2,
          borderColor: "white",
        }}
      >
        <TextInput
          value={teamName}
          onChangeText={(t) => setTeamName(t)}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={{
            // backgroundColor: "#778822",
            width: "100%",
            padding: Platform.OS === "ios" ? 10 : 0,
            color: isAndroid ? "lightgrey" : "white",
            fontSize: 20,
            textAlign: "center",
          }}
        />
      </View>
      <View
        style={[
          mOrientation?.includes("PORTRAIT")
            ? {}
            : {
                flex: 1,
              },
          {
            justifyContent: "center",
            // alignItems: 'center',
            // backgroundColor: "#990011"
          },
        ]}
      >
        <CustomColorPallete
          color={color}
          setColor={setColor}
          mOrientation={mOrientation}
          cellInd={index}
        />
        {/* <SecondColorPallete
          color={color}
          setColor={setColor}
          mOrientation={mOrientation}
          cellInd={index}
        /> */}
      </View>
    </View>
  );
};

const SecondColorPallete = ({
  color,
  setColor,
  visible,
  setVisible,
  mOrientation,
  cellInd,
}) => {
  const [swatchesOnly, setSwatchesOnly] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSwatchesOnly(false);
    }, 500);
  }, []);

  return (
    // <View style={{
    //   // flex: 1,
    //   backgroundColor: (cellInd === 1)?('#806545'):('#901122')
    // }}>
    <View
      style={{
        // flex: 1,
        width: "100%",
        height: "100%",
        padding: 20,
        alignSelf: "center",
        // alignItems: "center",
        // justifyContent: "center",
        // position: "absolute",
        bottom: 0,
        // backgroundColor: "#667755"
      }}
    >
      {/* <ColorPanel
  style={{ flex: 1 }}
  fullColor={true}
  color={color}
  brightnessLowerLimit={0}
  onColorChange={color =>           setColor(color)
  }
/> */}
      <ColorPicker
        style={
          {
            // flex: 1,
            // // position: "absolute",
            // left: 0,
            // // width: 150,
            // // height: 150,
            // top:
            //   Platform.OS === "android"
            //     ? mOrientation === OrientationType["LANDSCAPE-LEFT"] ||
            //       mOrientation === OrientationType["LANDSCAPE-RIGHT"]
            //       ? -60
            //       : 0
            //     : 0,
            // alignItems: 'center'
          }
        }
        color={color}
        swatchesOnly={false}
        onColorChange={(c) => {
          console.log(`color change complete = ${c}`);
          setColor(c);
        }}
        onColorChangeComplete={(c) => {
          console.log(`color change complete = ${c}`);
          setColor(c);
        }}
        thumbSize={40}
        sliderSize={0}
        gapSize={10}
        sliderHidden={true}
        noSnap={true}
        row={mOrientation?.includes("PORTRAIT") ? false : true}
        swatchesLast={mOrientation?.includes("PORTRAIT") ? true : false}
        swatches={true}
        palette={["#3066ff", "#ff3636", "#9ef593", "#edabe4", "#ebf5c4"]}

        // ref={r => { this.picker = r }}
        // 	color={color}

        // 	onColorChange={(c) => {
        //   console.log(`color change complete = ${c}`);
        //   setColor(c);
        // }}
        // onColorChangeComplete={(c) => {
        //   console.log(`color change complete = ${c}`);
        //   setColor(c);
        // }}
        // 	thumbSize={40}
        // 	sliderSize={40}
        //   sliderHidden={true}
        // 	noSnap={true}
        // 	row={true}
        // 	swatchesLast={false}
        // 	swatches={true}
        // 	discrete={true}
        //   swatchesOnly={true}
      />
    </View>
    // </View>
  );
};

const CustomColorPallete = ({
  color,
  setColor,
  visible,
  setVisible,
  mOrientation,
  cellInd,
}) => {
  return (
    <View
      style={{
        // flex: 1,
        width: "100%",
        // height: "100%",
        padding: 10,
        alignSelf: "center",
        // alignItems: "center",
        // justifyContent: "center",
        // position: "absolute",
        bottom: 0,
        marginVertical: 10,
        backgroundColor: "#2b2e37",
        borderRadius: 5,
        // height: 35,
        borderWidth: 0.2,
        borderColor: "white",
        // justifyContent: 'center'
      }}
    >
      <FlatList
        style={
          {
            // backgroundColor: "#FFF",
          }
        }
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        data={[
          { id: 1, color: "#f5949a" },
          { id: 2, color: "#f7c986" },
          { id: 3, color: "#f3e886" },
          { id: 4, color: "#9fd190" },
          { id: 5, color: "#9ad7d9" },
          { id: 6, color: "#92b1dd" },
          { id: 7, color: "#9284be" },
          { id: 8, color: "#d097c3" },
          { id: 9, color: "#e9a7cb" },

          { id: 10, color: "#f15758" },
          { id: 11, color: "#f6b752" },
          { id: 12, color: "#f1e912" },
          { id: 13, color: "#6fc16e" },
          { id: 14, color: "#6cc9ca" },
          { id: 15, color: "#6182c1" },
          { id: 16, color: "#7968ae" },
          { id: 17, color: "#b774b1" },
          { id: 18, color: "#db85b8" },

          { id: 19, color: "#ff3636" },
          { id: 20, color: "#fbac21" },
          { id: 21, color: "#f4df44" },
          { id: 22, color: "#31b44a" },
          { id: 23, color: "#33b2b1" },
          { id: 24, color: "#3066ff" },
          { id: 25, color: "#634fa1" },
          { id: 26, color: "#a156a2" },
          { id: 27, color: "#ce5aa1" },

          { id: 28, color: "#e82025" },
          { id: 29, color: "#d07628" },
          { id: 30, color: "#e2ca21" },
          { id: 31, color: "#179346" },
          { id: 32, color: "#0e8e8b" },
          { id: 33, color: "#17479c" },
          { id: 34, color: "#543795" },
          { id: 35, color: "#8d3293" },
          { id: 36, color: "#d12c91" },
        ]}
        keyExtractor={(_, index) => String(index)}
        numColumns={9}
        renderItem={({ index, item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setColor(item.color);
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: item.color,
                  borderWidth: color === item.color ? 5 : 0,
                  borderColor: "#FFF",
                  // borderColor: wc_hex_is_light(item.color)? '#000':'#FFF'
                  // borderColor: index > 15? '#FFF':'#000'
                }}
              ></View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ScreenSetTeamName;
