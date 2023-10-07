import { Platform } from "react-native";
import AppLovinMAX from "react-native-applovin-max";

const ADMOB_IOS_APP_ID = "ca-app-pub-3629298478872873~2887104631"
const ADMOB_IOS_INTERSTITIAL_UNIT_ID = "ca-app-pub-3629298478872873/6572280346"

class Applovin {

    INTERSTITIAL_AD_UNIT_ID = Platform.select({
        android: 'YOUR_ANDROID_INTERSTITIAL_AD_UNIT_ID',
        ios: ADMOB_IOS_INTERSTITIAL_UNIT_ID,
    });

    init() {
        // AppLovinMAX.initialize("YOUR_SDK_KEY_HERE", (configuration) => {
        //     // SDK is initialized, start loading ads
        // });
    }
    // const[retryAttempt, setRetryAttempt] = useState(0);

    initializeInterstitialAds() {
        AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', () => {
            // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'

            // Reset retry attempt
            setRetryAttempt(0)
        });
        AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', () => {
            // Interstitial ad failed to load 
            // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)

            setRetryAttempt(retryAttempt + 1);
            var retryDelay = Math.pow(2, Math.min(6, retryAttempt));

            console.log('Interstitial ad failed to load - retrying in ' + retryDelay + 's');

            setTimeout(function () {
                loadInterstitial();
            }, retryDelay * 1000);
        });
        AppLovinMAX.addEventListener('OnInterstitialClickedEvent', () => { });
        AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', () => { });
        AppLovinMAX.addEventListener('OnInterstitialAdFailedToDisplayEvent', () => {
            // Interstitial ad failed to display. We recommend loading the next ad
            loadInterstitial();
        });


        AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', () => {
            loadInterstitial();
        });

        // Load the first interstitial
        // loadInterstitial();
    }

    loadInterstitial() {
        AppLovinMAX.loadInterstitial(this.INTERSTITIAL_AD_UNIT_ID);
    }
    showInterstitial() {
        if (AppLovinMAX.isInterstitialReady(this.INTERSTITIAL_AD_UNIT_ID)) {
            AppLovinMAX.showInterstitial(this.INTERSTITIAL_AD_UNIT_ID);
        }
    }
}
const AdManager = new Applovin();
export default AdManager;