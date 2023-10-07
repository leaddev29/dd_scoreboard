package com.scoreboard;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

import androidx.annotation.Nullable;

public class MainActivity extends NavigationActivity {


    @Override
   public void onConfigurationChanged(Configuration newConfig) {
           super.onConfigurationChanged(newConfig);
           Intent intent = new Intent("onConfigurationChanged");
           intent.putExtra("newConfig", newConfig);
           this.sendBroadcast(intent);
   }

  

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
