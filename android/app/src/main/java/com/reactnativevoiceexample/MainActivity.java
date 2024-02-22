package com.exolve.demoapp;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.exolvereactnative.ExolveReactNativeModule;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ReactNativeVoiceExample";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.d("MainActivity", "onCreate");
    //Handle Android 12 (API 31) trampoline restrictions
    // https://developer.android.com/about/versions/12/behavior-changes-12#notification-trampolines
    ExolveReactNativeModule.broadcastCallIntent(this, getIntent());
    requestToken();
  }

  private void requestToken() {
    Intent intent = new Intent();
    intent.setAction(ExolveReactNativeModule.ACTION_TOKEN_REQUEST);
    sendBroadcast(intent);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    //Handle Android 12 (API 31) trampoline restrictions
    // https://developer.android.com/about/versions/12/behavior-changes-12#notification-trampolines
    ExolveReactNativeModule.broadcastCallIntent(this, intent);
  }
}
