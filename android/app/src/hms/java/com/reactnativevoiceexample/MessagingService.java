package com.exolve.demoapp;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.exolvereactnative.ExolveReactNativeModule;
import com.huawei.agconnect.AGConnectOptionsBuilder;
import com.huawei.hms.aaid.HmsInstanceId;
import com.huawei.hms.common.ApiException;
import com.huawei.hms.push.HmsMessageService;
import com.huawei.hms.push.HmsMessaging;
import com.huawei.hms.push.RemoteMessage;

public class MessagingService extends HmsMessageService {

    public static final String NAME = "MessagingService";

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        Log.d(NAME, String.format("Got new token: %s", token));
        updateToken(this, token);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Log.d(NAME, String.format("Got message: %s", remoteMessage.getData()));
        ExolveReactNativeModule.processPushNotification(this, remoteMessage.getData());
    }

    @Override
    public void onTokenError(Exception e, Bundle bundle) {
        super.onTokenError(e, bundle);
        Log.d(NAME, String.format("onTokenError: %s", e.getMessage()));
    }

    public static void requestToken(Context context) {
        Log.d(NAME, "requestToken");
        new Thread(() -> {
            try {
                String token = HmsInstanceId.getInstance(context)
                        .getToken(BuildConfig.HUAWEI_APP_ID, HmsMessaging.DEFAULT_TOKEN_SCOPE);
                if (token != null && !token.isEmpty()) {
                    updateToken(context, token);
                    Log.d(NAME, "Received token: " + token);
                }
            } catch (ApiException e) {
                Log.e(NAME, "request token failed, " + e);            }
        }).start();
    }

    public static void updateToken(Context context, String token) {
        ExolveReactNativeModule.setPushToken(context, token, ExolveReactNativeModule.PushServiceProvider.HMS);
    }
}
