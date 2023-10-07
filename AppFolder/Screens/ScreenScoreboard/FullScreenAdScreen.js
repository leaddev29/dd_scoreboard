import React, { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { AdEventType, RewardedAd, RewardedAdEventType } from "react-native-google-mobile-ads";
import { Navigation } from "react-native-navigation";
import { APP_STACK } from "../../General/AppRoutes";

const FullScreenAdScreen = (props) => {
  // const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2827613882829649/8740445930';


      const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-2827613882829649/3703741670"
      : "ca-app-pub-2827613882829649/8740445930";

  var rewarded = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["sports"],
  });;


  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          console.log("Ad loaded!");
          rewarded.show()
        }
      );
  
      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log("Ad Rewarded!", reward);
          props.onComplete();
          Navigation.pop(APP_STACK);
        }
      );
  
      const unsubscribeError = rewarded.addAdEventListener(
        AdEventType.ERROR,
        (reward) => {
          console.log("Ad Error!", reward);

          setTimeout(() => {
            props.onComplete();
            Navigation.pop(APP_STACK);
          }, 500);
          
        }
      );
  
      const unsubscribeClosed = rewarded.addAdEventListener(
        AdEventType.CLOSED,
        (reward) => {
          console.log("Ad Closed!", reward);
          props.onComplete();
          Navigation.pop(APP_STACK);

        }
      );
  
      rewarded.load();
  
      return () => {
  
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeError();
        unsubscribeClosed();
      };
  
      // // Return the function to unsubscribe from the event so it gets removed on unmount
      // return unsubscribe;
    
  }, []);

  return (<View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#000"
  }}>
    <ActivityIndicator />
  </View>)
};

export default FullScreenAdScreen;
