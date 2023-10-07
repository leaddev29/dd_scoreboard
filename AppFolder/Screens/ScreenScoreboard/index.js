import KeepAwake from "@sayem314/react-native-keep-awake";
import { observer } from "mobx-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RewardedAd } from "react-native-google-mobile-ads";
import { useNavigationComponentDidAppear } from "react-native-navigation-hooks/dist";
import Orientation from "react-native-orientation-locker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppScreens, pushNewScreen } from "../../General/AppRoutes";
import CustomView from "../../General/Components/CustomView.js";
import MyCustomView from "../../General/Components/MyCustomComponent";
import MobxGameState, {
  ContextGameState,
  KEYS_GAME_STATE,
} from "../../General/GameState";
import { settingsIcon, splashImg } from "../../General/Images";
import ModalCongrats from "./ModalCongrats";
import ModalTeamName from "./ModalTeamName";
import { ACTIONS } from "./exports";

const isDeveloping = false;
const ScreenScoreboard = observer((props) => {
  // const { RCTMyCustomViewManager } = NativeModules;

  const [cellState, setCellState] = useState([0, 1, 2]);
  let isIOS = Platform.OS == "ios";
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const WINNING_SCORE = 200;

  const GameState = useContext(ContextGameState);
  const ArrayPoints = range(-10, 200, 1);
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const ScreenWidth = width > height ? width : height;
  const ScreenHeight = height - insets.top - insets.bottom;
  const opacitySetsView = useRef(new Animated.Value(1));
  const scoreTeamA = GameState.teamAScore;
  const setScoreTeamA = (score) =>
    GameState.setKey(KEYS_GAME_STATE.TeamAScore, score);
  const scoreTeamB = GameState.teamBScore;
  const setScoreTeamB = (score) =>
    GameState.setKey(KEYS_GAME_STATE.TeamBScore, score);
  const setsScore = GameState.setsScore;
  const setSetsScore = (score) =>
    GameState.setKey(KEYS_GAME_STATE.SetsScore, score);
  const teamAName = GameState.teamAName;
  const teamBName = GameState.teamBName;
  const teamAColor = GameState.teamAColor;
  const teamBColor = GameState.teamBColor;
  const teamNameVisibility = GameState.teamNameVisibility;

  const [modalSettings, setModalSettings] = useState(false);
  const [isMainTouch, setIsMainTouch] = useState(true);
  const [pageLoad, setPageLoad] = useState(false);
  const [winnerTeam, setWinnerTeam] = useState(false);
  const [modalCongrats, setModalCongrats] = useState(false);

  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // const [teamNameVisibility, setTeamNameVisibility] = useState(
  //   GameState.teamNameVisibility
  // );
  const refPagerTeamA_1 = useRef(null);
  const refPagerTeamA_2 = useRef(null);
  const refPagerTeamB = useRef(null);

  const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-2827613882829649/3703741670"
      : "ca-app-pub-2827613882829649/8740445930";

  var rewarded = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["sports"],
  });

  const [adCounterA, setAdCounterA] = useState(0);
  const [adCounterB, setAdCounterB] = useState(0);

  const [adLoaded, setAdLoaded] = useState(false);

  // APPLOVING ADD ON.
  // 1-RESET.
  // 2-NEW_SET.

  useNavigationComponentDidAppear(() => {
    Orientation.unlockAllOrientations();
    Orientation.lockToLandscape();

    console.log("fahad Orientation lock to landscape!");
    console.log(`insest =  ${JSON.stringify(insets)} `);
  }, "");

  useEffect(() => {
    // const unsubscribe = navigation.addListener("focus", () => {
    //   // The screen is focused
    //   // Call any action
    //   Orientation.unlockAllOrientations();
    //   Orientation.lockToLandscape();

    //   console.log("fahad Orientation lock to landscape!");
    // console.log(`insest =  ${JSON.stringify(insets)} `);
    // });

    Orientation.lockToLandscape();

    console.log("Init CustomFlipPage scoreTeamA " + scoreTeamA);
    console.log("Init CustomFlipPage scoreTeamB" + scoreTeamB);

    setTimeout(() => {
      setPageLoad(true);
    }, 100);

    //

    setTimeout(
      () => {
        refPagerTeamA_1.current.setPage(scoreTeamA + 10);
        refPagerTeamA_2.current.setPage(scoreTeamA + 10);
        refPagerTeamB.current.setPage(scoreTeamB + 10);

        pushNewScreen({
          name: AppScreens.FullScreenAdScreen,
          title: "FullScreenAdScreen",
          passProps: {
            onComplete: () => {
              setShowSplashScreen(false);
            },
          },
        });
      },
      isIOS ? 1000 : 2000
    );

    // // Return the function to unsubscribe from the event so it gets removed on unmount
    // return unsubscribe;
  }, []);

  useEffect(() => {
    if (Math.abs(adCounterA) + Math.abs(adCounterB) >= 20) {
      console.log("Ad show!");

      pushNewScreen({
        name: AppScreens.FullScreenAdScreen,
        title: "FullScreenAdScreen",
        passProps: {
          onComplete: () => {
            setShowSplashScreen(false);
          },
        },
      });

      setAdCounterA(0);
      setAdCounterB(0);
    }
  }, [adCounterA, adCounterB]);

  function changeSetsViewOpacity(toVal) {
    Animated.spring(opacitySetsView.current, {
      toValue: toVal,
      useNativeDriver: true,
    }).start();
  }
  useEffect(() => {
    EventHandler({ event: ACTIONS.CHECK_WINNER });
  }, [scoreTeamA, scoreTeamB]);

  useEffect(() => {
    if (pageLoad) {
      refPagerTeamA_1.current.updateBg(teamAColor);
      refPagerTeamB.current.updateBg(teamBColor);
    }
  }, [teamAColor, teamBColor]);

  useEffect(() => {
    if (pageLoad) {
      refPagerTeamA_1.current.updateTeamName(teamAName);
      refPagerTeamB.current.updateTeamName(teamBName);
    }
  }, [teamAName, teamBName]);

  useEffect(() => {
    console.log("\n\n\n\n\n\n");
    console.log("fahad Visibility useeffect: ", teamNameVisibility);
    console.log("\n\n\n\n\n\n");
    if (pageLoad) {
      console.log("\n\n\n\n\n\n");
      console.log("fahad Visibility useeffect PageLoad: ", teamNameVisibility);
      console.log("\n\n\n\n\n\n");

      // RCTMyCustomViewManager.updateTeamNameVisibility(1, teamNameVisibility);
      // RCTMyCustomViewManager.updateTeamNameVisibility(2, teamNameVisibility);

      refPagerTeamA_1.current.updateTeamNameVisibility(teamNameVisibility);
      refPagerTeamB.current.updateTeamNameVisibility(teamNameVisibility);

      // refPagerTeamA_1.current.updateTeamNameVisibility(false);
      // refPagerTeamB.current.updateTeamNameVisibility(false);
    }
  }, [teamNameVisibility]);

  useEffect(() => {
    if (pageLoad === true) {
      console.log("\n\n\n\n\n\n");
      console.log(
        "fahad Visibility useeffect PageLoad 2: ",
        teamNameVisibility
      );
      console.log("\n\n\n\n\n\n");
      // RCTMyCustomViewManager.updateTeamNameVisibility(1, teamNameVisibility);
      // RCTMyCustomViewManager.updateTeamNameVisibility(2, teamNameVisibility);

      refPagerTeamA_1.current.updateTeamNameVisibility(teamNameVisibility);
      refPagerTeamB.current.updateTeamNameVisibility(teamNameVisibility);

      // refPagerTeamA_1.current.updateTeamNameVisibility(false);
      // refPagerTeamB.current.updateTeamNameVisibility(false);

      // refPagerTeamA_1.current.onClick(teamNameVisibility)

      // setTimeout(() => {
      //   refPagerTeamA_1.current.setPage(20);
      // }, 5000);
    }
  }, [pageLoad]);

  function EventHandler(options) {
    console.log(`Event::::${options?.event}`);
    let event = options?.event;
    let team = options?.team;
    let updatedFlagValue = options?.newValue;
    console.log(`Team = ${team}`);
    let isTeamA = team == ACTIONS.TEAM_A;
    console.log(`EVENT CALLED with options = ${JSON.stringify(options)}`);
    switch (event) {
      case ACTIONS.TEAMNAME_VISIBILITY_CHANGED:
        // setTeamNameVisibility(updatedFlagValue);

        setTimeout(() => {
          console.log(`Score Refreshed!`);

          refPagerTeamA_1.current.setPage(scoreTeamA + 10);
          refPagerTeamB.current.setPage(scoreTeamB + 10);
          refPagerTeamA_2.current.setPage(scoreTeamA + 10);
          setSetsScore(0);
          setScoreTeamA(scoreTeamA);
          setScoreTeamB(scoreTeamB);

          MobxGameState.saveAsync();

          //   setTimeout(() => {
          //   console.log(
          //     `After Saving => teamA Color = ${MobxGameState.teamAColor}`
          //   );

          //   refPagerTeamA_1.current.setPage(scoreTeamB + 10);
          //   refPagerTeamB.current.setPage(scoreTeamA + 10);
          //   refPagerTeamA_2.current.setPage(scoreTeamB + 10);
          //   setSetsScore(0);
          //   setScoreTeamA(scoreTeamB);
          //   setScoreTeamB(scoreTeamA);

          //   MobxGameState.saveAsync();

          // }, 2000);
        }, 100);

        break;
      case ACTIONS.PAGE_REFRESH:
        setPageLoad(false);
        setPageLoad(true);
        break;
      case ACTIONS.TOUCH_START:
        console.log("::TOUCH_START:" + options?.isTouch);
        setIsMainTouch(!options?.isTouch);
        break;
      case ACTIONS.OPEN_MODAL_SETTING:
        setModalSettings(true);
        break;
      case ACTIONS.RESET_GAME:
        setTimeout(() => {
          console.log(`Score Reverted Back`);
          refPagerTeamA_1.current.setPage(10);
          refPagerTeamB.current.setPage(10);
          refPagerTeamA_2.current.setPage(10);
          setSetsScore(0);
          setAdCounterA(0);
          setAdCounterB(0);
          setScoreTeamA(0);
          setScoreTeamB(0);
        }, 500);
        break;
      case ACTIONS.SWITCH_SCORES:
        setTimeout(() => {
          console.log(`Score Swicthed`);

          MobxGameState.setKey(KEYS_GAME_STATE.TeamAColor, teamBColor);
          MobxGameState.setKey(KEYS_GAME_STATE.TeamBColor, teamAColor);
          MobxGameState.setKey(KEYS_GAME_STATE.TeamAName, teamBName);
          MobxGameState.setKey(KEYS_GAME_STATE.TeamBName, teamAName);

          refPagerTeamA_1.current.setPage(scoreTeamB + 10);
          refPagerTeamB.current.setPage(scoreTeamA + 10);
          refPagerTeamA_2.current.setPage(scoreTeamB + 10);
          setSetsScore(0);
          setAdCounterA(0);
          setAdCounterB(0);
          setScoreTeamA(scoreTeamB);
          setScoreTeamB(scoreTeamA);

          MobxGameState.saveAsync();

          console.log(
            `After Saving => teamA Color = ${MobxGameState.teamAColor}`
          );
        }, 500);
        break;
      case ACTIONS.CHECK_WINNER:
        if (scoreTeamA > WINNING_SCORE) {
          setWinnerTeam(teamAName);

          //TODO Toan asked to remove this modal.
          setModalCongrats(true);
        } else if (scoreTeamB > WINNING_SCORE) {
          setWinnerTeam(teamBName);

          //TODO Toan asked to remove this modal.
          setModalCongrats(true);
        }
        break;
      case ACTIONS.NEW_SET:
        // ANY_TEAM_WON_SET.
        console.log(`Action new Set`);
        console.log(`Score Team A = ${scoreTeamA}`);
        console.log(`Score Team B = ${scoreTeamB}`);
        if (scoreTeamA > WINNING_SCORE) {
          refPagerTeamA_1.current.setPage(10);
          refPagerTeamB.current.setPage(10);
          refPagerTeamA_2.current.setPage(10);
          setSetsScore(setsScore + 1);
          setAdCounterA(0);
          setAdCounterB(0);
          setScoreTeamA(0);
          setScoreTeamB(0);
          // ALSO_PLAY_AD.
        } else if (scoreTeamB > WINNING_SCORE) {
          refPagerTeamA_1.current.setPage(10);
          refPagerTeamB.current.setPage(10);
          refPagerTeamA_2.current.setPage(10);
          setSetsScore(setsScore + 1);
          setAdCounterA(0);
          setAdCounterB(0);
          setScoreTeamA(0);
          setScoreTeamB(0);
          // ALSO_PLAY_AD.
        }
        break;
      case ACTIONS.PAGE_FLIPPED:
        let scoreCardIndex = options?.index;
        let pageNumber = options?.page;
        let score = pageNumber - 10;
        if (isTeamA) {
          if (score < scoreTeamA) {
            setAdCounterA(adCounterA - 1);
          } else {
            setAdCounterA(adCounterA + 1);
          }
          setScoreTeamA(score);
          if (scoreCardIndex == 0) {
            refPagerTeamA_2.current.setPage(pageNumber);
          } else if (scoreCardIndex == 2) {
            refPagerTeamA_1.current.setPage(pageNumber);
          }
        } else {
          if (score < scoreTeamB) {
            setAdCounterB(adCounterB - 1);
          } else {
            setAdCounterB(adCounterB + 1);
          }
          setScoreTeamB(score);
        }
        break;
      case ACTIONS.GO_TO_SETTINGS:
        pushNewScreen({
          name: AppScreens.SettingsScreen,
          title: "Settings",
          passProps: {
            EventHandler: (action) => {
              EventHandler(action);
            },
          },
        });

        // pushTransparentScreen({
        //   name: AppScreens.ScreenSettings,
        //   passProps: {
        //     EventHandler: (action) => {
        //       EventHandler(action);
        //     },
        //   },
        // });
        break;
      case ACTIONS.EVENT_ONE_TAP:
        if (isTeamA) {
          console.log(`isTeamA == true and index ${scoreCardIndex}`);
          let pageIndex = scoreTeamA + 1 + 10;
          setScoreTeamA(scoreTeamA + 1);
          setAdCounterA(adCounterA + 1);

          console.log(":::Manish::EVENT_ONE_TAP::pageIndex" + pageIndex);
          refPagerTeamA_2.current.setPage(pageIndex);
          refPagerTeamA_1.current.setPage(pageIndex);
        } else {
          let pageIndex = scoreTeamB + 1 + 10;
          setScoreTeamB(scoreTeamB + 1);
          setAdCounterB(adCounterB + 1);
          console.log(":::Manish::EVENT_ONE_TAP::pageIndex" + pageIndex);
          refPagerTeamB.current.setPage(pageIndex);
        }
        break;
    }
  }

  function onScrollDragStart(e) {
    console.log("Fahad Drag", e);
    changeSetsViewOpacity(0);
  }
  function onScrollDragEnd(e) {
    console.log(`nativeEvent = > ${JSON.stringify(e?.nativeEvent)}`);
  }
  function onScrollAnimationEnd(e) {
    console.log("On Scroll Animation End");
    console.log(`nativeEvent = > ${JSON.stringify(e?.nativeEvent)}`);
  }
  function onMomentumScrollEnd(e) {
    console.log("onMomentumScrollEnd");
    console.log(`nativeEvent = > ${JSON.stringify(e?.nativeEvent)}`);
    setTimeout(() => {
      changeSetsViewOpacity(1);
    }, 300);
  }

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: "#331199"
      }}
    >
      <KeepAwake />
      <View
        style={{
          flex: 1,
          backgroundColor: isDeveloping ? "transparent" : "black",
          // backgroundColor: "#889911",
          backgroundColor: "black",
        }}
      >
        {pageLoad == true && (
          <View
            // animation={"zoomIn"}
            // duration={500}
            style={{
              flex: 1,
              backgroundColor: isDeveloping ? "pink" : "transparent",
              flexDirection: "row",
              // paddingHorizontal: 10,

              // opacity: (showScoreBoards)?(1):(0)
            }}
          >
            <ScrollView
              horizontal
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={onScrollDragStart}
              onScrollEndDrag={onScrollDragEnd}
              onScrollAnimationEnd={onScrollAnimationEnd}
              onMomentumScrollEnd={onMomentumScrollEnd}
              pagingEnabled
              scrollEventThrottle={1}
            >
              {cellState.map((item, index) => (
                <CellScoreboard
                  key={String(index)}
                  index={index}
                  color={index == 1 ? teamBColor : teamAColor}
                  scoreBoardStyle={{
                    backgroundColor: index == 1 ? teamBColor : teamAColor,
                  }}
                  EventHandler={EventHandler}
                  width={ScreenWidth * 0.5}
                  SetsViewVisible={index == 0 ? false : true}
                  widthSetsView={0}
                  marginSetsView={0}
                  opacitySetsView={opacitySetsView}
                  setsScore={setsScore}
                  team={index == 1 ? ACTIONS.TEAM_B : ACTIONS.TEAM_A}
                  score={index == 1 ? scoreTeamB : scoreTeamA}
                  teamName={index == 1 ? teamBName : teamAName}
                  teamNameVisibility={teamNameVisibility}
                  refPager={
                    index == 0
                      ? refPagerTeamA_1
                      : index == 1
                      ? refPagerTeamB
                      : index == 2
                      ? refPagerTeamA_2
                      : null
                  }
                  ArrayPoints={ArrayPoints}
                  startIndex={index == 1 ? scoreTeamB + 10 : scoreTeamA + 10}
                  ScreenWidth={ScreenWidth}
                />
              ))}
            </ScrollView>
            {/* <StatusBar hidden={true} backgroundColor={"black"} /> */}
          </View>
        )}

        <View
          style={{
            position: "absolute",
            // alignSelf: "center",
            width: "100%",
            // marginTop: 20,
            backgroundColor: teamNameVisibility ? "#000000CC" : "transparent",
          }}
        >
          <View
            style={{
              // width: 100,
              // height: 60,
              // marginHorizontal: 10,
              flexDirection: "row",
              flex: 1,
              // paddingVertical: 20,
              // marginTop: 20,

              backgroundColor: isDeveloping ? "pink" : "transparent",
              // justifyContent: "space-between",
              alignItems: "center",
              // opacity: opacitySetsView.current,
              // marginLeft: ScreenWidth * 0.04 * -1,
              zIndex: 999,
            }}
          >
            {/* <View
              style={{
                backgroundColor: "grey",
                height: "30%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 40, fontWeight: "bold" }}
                adjustsFontSizeToFit={true}
              >
                {setsScore}
              </Text>
            </View> */}

            {teamNameVisibility && (
              <View
                style={{
                  flex: 0.5,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 30,
                  paddingVertical: 15,
                  // backgroundColor: "#891122"
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 25,
                    fontFamily: "AvenirNextLTPro-Regular",
                  }}
                  // adjustsFontSizeToFit={true}
                  numberOfLines={1}
                >
                  {teamAName}
                </Text>
              </View>
            )}

            {teamNameVisibility && (
              <View
                style={{
                  flex: 0.5,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 25,
                    fontFamily: "AvenirNextLTPro-Regular",
                  }}
                  // adjustsFontSizeToFit={true}
                  numberOfLines={1}
                >
                  {teamBName}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            // alignSelf: "center",
            width: "100%",
            // marginTop: 20,
            // backgroundColor: teamNameVisibility ? "#000000CC" : "transparent",
          }}
        >
          <View
            style={{
              // width: 100,
              // height: 60,
              // marginHorizontal: 10,
              flexDirection: "row",
              flex: 1,
              // paddingVertical: 20,
              // marginTop: 20,

              backgroundColor: isDeveloping ? "pink" : "transparent",
              // justifyContent: "space-between",
              alignItems: "center",
              // opacity: opacitySetsView.current,
              // marginLeft: ScreenWidth * 0.04 * -1,
              zIndex: 999,
            }}
          >
            <View
              style={{
                // position: "absolute",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: 'white'
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  console.log("Settings Called..");
                  EventHandler({ event: ACTIONS.GO_TO_SETTINGS });
                }}
                style={{
                  // marginBottom: 5,
                  // padding: 10,
                  // flex: 0.1,
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  // borderTopLeftRadius: 10,
                  // borderTopRightRadius: 10,
                  // backgroundColor: 'white'
                }}
              >
                {/* <Ioicon name={"chevron-up"} size={60} color={"white"} /> */}
                <Image
                  style={{
                    height: 60,
                    width: 60,
                    resizeMode: "cover",
                    transform: [{ rotate: "180deg" }],
                    // borderRadius: RFValue(10),
                    // backgroundColor: 'white'
                  }}
                  imageStyle={{
                    height: 60,
                    width: 60,
                    resizeMode: "cover",
                    // borderRadius: RFValue(10),
                  }}
                  source={settingsIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ModalCongrats
          setVisible={setModalCongrats}
          visible={modalCongrats}
          WinnerTeam={winnerTeam}
          EventHandler={EventHandler}
        />
      </View>
      <ModalTeamName
        visible={modalSettings}
        setVisible={setModalSettings}
        onPress={() => {
          setModalSettings(false);
          setTimeout(() => {
            EventHandler({ event: ACTIONS.GO_TO_SETTINGS });
          }, 500);
        }}
      />

      {showSplashScreen && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
          }}
        >
          <Image
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "cover",
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
      )}
    </View>
  );
});

const CellScoreboard = ({
  style,
  scoreBoardStyle,
  EventHandler,
  width,
  SetsViewVisible,
  marginSetsView,
  widthSetsView,
  opacitySetsView,
  team,
  score,
  setsScore,
  teamName,
  teamNameVisibility,
  ArrayPoints = [0, 1, 2, 3],
  color,
  refPager,
  index,
  startIndex,
  ScreenWidth,
}) => {
  const isIOS = Platform.OS == "ios";

  useEffect(() => {
    console.log(":::::CellScoreboard::::useEffect::::");
  }, []);

  return (
    <View
      style={{
        marginLeft: index === 2 ? 30 : 0,
        height: "100%",
        backgroundColor: isDeveloping ? "lightgrey" : "transparent",
        // backgroundColor: "#009911",
        flexDirection: "row",
        overflow: "visible",
        ...style,
      }}
    >
      {/* {SetsViewVisible && false && (
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            marginHorizontal: 0,
            backgroundColor: isDeveloping ? "pink" : "transparent",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: opacitySetsView.current,
            // marginLeft: ScreenWidth * 0.04 * -1,
            zIndex: 999,
            backgroundColor: "#881122"
          }}
        >
          <View
            style={{
              backgroundColor: "grey",
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 40, fontWeight: "bold" }}
              adjustsFontSizeToFit={true}
            >
              {setsScore}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              console.log("Settings Called..");
              EventHandler({ event: ACTIONS.GO_TO_SETTINGS });
            }}
            style={{ marginBottom: 50 }}
          >
            <Ioicon name={"settings-outline"} size={35} color={"white"} />
          </TouchableOpacity>
        </Animated.View>
      )} */}
      <View style={{ marginVertical: 0, overflow: "visible" }}>
        {isIOS ? (
          <MyCustomView
            ref={refPager}
            data={ArrayPoints}
            color={color}
            teamName={teamName}
            teamNameVisibility={false}
            status={false}
            style={{
              flex: 1,
              width: width,
              backgroundColor: color,
              ...scoreBoardStyle,
              alignItems: "center",
              justifyContent: "center",
            }}
            initialPage={0}
            onClick={() => {
              EventHandler({
                event: ACTIONS.EVENT_ONE_TAP,
                team: team,
                index: index,
              });
            }}
            onPageScroll={(e) => {
              EventHandler({
                event: ACTIONS.PAGE_FLIPPED,
                team: team,
                index: index,
                page: e.nativeEvent.page,
              });
            }}
          />
        ) : (
          <View
            style={[
              {
                width: width,
                flex: 1,
                overflow: "visible",
              },
              index === 0
                ? {
                    marginLeft: 0,
                  }
                : {
                    marginLeft: 0,
                  },
            ]}
          >
            <CustomView
              ref={refPager}
              bgColor={color}
              teamName={teamName}
              teamNameVisibility={false}
              data={ArrayPoints}
              onClick={(e) => {
                console.log(
                  ":::Manish:::CallbackFromNative::" + e.nativeEvent.from
                );
                if (e.nativeEvent.from == "click") {
                  EventHandler({
                    event: ACTIONS.PAGE_FLIPPED,
                    team: team,
                    index: index,
                    page: e.nativeEvent.page,
                  });
                } else if (e.nativeEvent.from == "scroll") {
                  console.log(":::Manish:::Scroll::" + e.nativeEvent.isTouch);
                  EventHandler({
                    event: ACTIONS.TOUCH_START,
                    isTouch: e.nativeEvent.isTouch,
                  });
                }
              }}
              style={{
                flex: 1,
                width: width,
                ...scoreBoardStyle,
                backgroundColor: "transparent",
                // alignItems: "center",
                // justifyContent: "center",
              }}
            ></CustomView>
          </View>
        )}

        {/* <TouchableOpacity
          onPress={() => {
            EventHandler({
              event: ACTIONS.OPEN_MODAL_SETTING,
              team: team,
              index: index,
            });
          }}
          activeOpacity={0.85}
          style={{
            height: isIOS ? 40 : 30,
            marginBottom: isIOS ? 0 : 10,
            width: "70%",
            alignSelf: "center",
            borderRadius: 20,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginLeft: ScreenWidth * 0.05 * -1,
          }}
        >
          <Text
            style={{
              fontSize: isIOS ? 24 : 18,
              fontFamily: "AvenirNextLTPro-Regular",
            }}
          >
            {teamName}
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ScreenScoreboard;
