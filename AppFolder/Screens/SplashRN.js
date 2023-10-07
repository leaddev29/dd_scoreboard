import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useNavigationComponentDidAppear } from "react-native-navigation-hooks/dist";
import Orientation from "react-native-orientation-locker";
import { AppScreens, pushRoot } from "../General/AppRoutes";
import { splashImg } from "../General/Images";
import { AdEventType, InterstitialAd, RewardedAd, RewardedAdEventType } from "react-native-google-mobile-ads";

const SplashRN = () => {

  const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-2827613882829649/3703741670"
      : "ca-app-pub-2827613882829649/8740445930";

      const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        // keywords: ['fashion', 'clothing'],
        keywords: ["sports"],
      });
  useNavigationComponentDidAppear(() => {
    Orientation.lockToLandscape();

    // console.log(`insest =  ${JSON.stringify(insets)} `);
  }, "");

  useEffect(() => {
    // setTimeout(() => {
    //   pushRoot({
    //     name: AppScreens.ScreenScoreboard,
    //   });
    // }, 3000);


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
        console.log("AdMob Reward Earned!");
        pushRoot({
          name: AppScreens.ScreenScoreboard,
        });
      }
    );

    const unsubscribeError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (reward) => {
        console.log("AdMob Error!");
        pushRoot({
          name: AppScreens.ScreenScoreboard,
        });
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      (reward) => {
        console.log("AdMob Ad Closed!");

        pushRoot({
          name: AppScreens.ScreenScoreboard,
        });
      }
    );

    

    setTimeout(() => {
      rewarded.load();
    }, 100);

    return () => {

      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeError();
      unsubscribeClosed();
    };
    
  }, []);

  return (
    <View style={styles.mainView}>
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
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "purple",
  },
});

export default SplashRN;
