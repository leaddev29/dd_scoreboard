import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Navigation } from "react-native-navigation";
import { useNavigationComponentDidAppear } from "react-native-navigation-hooks/dist";
import Orientation, { OrientationType } from "react-native-orientation-locker";
import Ioicon from "react-native-vector-icons/Ionicons";
import ColorPicker from "react-native-wheel-color-picker";
import { APP_STACK } from "../General/AppRoutes";
import MobxGameState, { KEYS_GAME_STATE } from "../General/GameState";

const ScreenSetTeamName = (props) => {
  const [teamAName, setTeamAName] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamAName)
  );
  const [teamBName, setTeamBName] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamBName)
  );
  const [teamAColor, setTeamAColor] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamAColor)
  );
  const [teamBColor, setTeamBColor] = useState(
    MobxGameState.getKey(KEYS_GAME_STATE.TeamBColor)
  );
  const [openColorPalette, setOpenColorPalette] = useState(false);
  const [myCurrentOrientation, setMyCurrentOrientation] = useState(false);

  const paletteColor = useRef(null);
  const setPaletteColor = useRef(null);

  useNavigationComponentDidAppear(() => {
    // Orientation.lockToLandscape();
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
        style={{ flex: 1, paddingTop: 10, backgroundColor: "black" }}
      >
        {/* <StatusBar hidden={true} backgroundColor={"black"} /> */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "black",
              marginVertical: 15,
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

          <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
            <Cell
              title={"Team A"}
              score={MobxGameState.getKey(KEYS_GAME_STATE.TeamAScore)}
              color={teamAColor}
              setColor={setTeamAColor}
              setTeamName={setTeamAName}
              teamName={teamAName}
              mOrientation={myCurrentOrientation}
              onPressColor={() => {
                openPalette("team_a");
              }}
            />
            <View
              style={{ height: "90%", width: 2, backgroundColor: "white" }}
            />
            <Cell
              title={"Team B"}
              score={MobxGameState.getKey(KEYS_GAME_STATE.TeamBScore)}
              color={teamBColor}
              setColor={setTeamBColor}
              setTeamName={setTeamBName}
              teamName={teamBName}
              mOrientation={myCurrentOrientation}
              onPressColor={() => {
                openPalette("team_b");
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              // marginVertical: 20,
              alignSelf: "center",
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: "#881122"
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={save}
              style={{
                width: 110,
                height: 40,
                marginStart: 5,
                borderWidth: 1,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animatable.View>
  );
};

const Cell = ({
  title = "",
  score = 0,
  color = "",
  setColor,
  setTeamName,
  teamName = {},
  onPressColor,
  mOrientation,
}) => {
  let isAndroid = Platform.OS == "android";

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <Text
        style={{
          alignSelf: "center",
          fontSize: 18,
          color: "white",
          fontWeight: "bold",
          marginBottom: 15,
        }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 15, color: "white" }}>Name : </Text>
        <TextInput
          value={teamName}
          onChangeText={(t) => setTeamName(t)}
          placeholder="Name"
          placeholderTextColor={"white"}
          style={{
            flex: 1,
            paddingHorizontal: 5,
            borderRadius: 5,
            height: 35,
            borderWidth: 1,
            borderColor: "white",
            color: isAndroid ? "lightgrey" : "white",
            fontSize: 12,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text style={{ fontSize: 15, color: "white", marginEnd: 7 }}>
          Color :{" "}
        </Text>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 5,
            backgroundColor: color,
          }}
        />
      </View>
      <View style={{}}>
        <SecondColorPallete
          color={color}
          setColor={setColor}
          mOrientation={mOrientation}
        />
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
}) => {
  const [swatchesOnly, setSwatchesOnly] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSwatchesOnly(false);
    }, 500);
  }, []);

  return (
    <View
      style={{
        width: 150,
        height: 150,
        alignSelf: "center",
        // alignItems: "center",
        // justifyContent: "center",
        // position: "absolute",
        bottom: 0,
        // backgroundColor: "#667755"
      }}
    >
      <ColorPicker
        style={{
          // position: "absolute",
          left: 0,
          // width: 150,
          // height: 150,
          top:
            Platform.OS === "android"
              ? mOrientation === OrientationType["LANDSCAPE-LEFT"] ||
                mOrientation === OrientationType["LANDSCAPE-RIGHT"]
                ? -60
                : 0
              : 0,
        }}
        color={color}
        swatchesOnly={swatchesOnly}
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
        sliderHidden={true}
        noSnap={true}
        row={false}
        swatchesLast={false}
        swatches={false}
      />
    </View>
  );
};

export default ScreenSetTeamName;
