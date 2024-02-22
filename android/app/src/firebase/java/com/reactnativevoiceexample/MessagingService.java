package com.exolve.demoapp;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.exolvereactnative.ExolveReactNativeModule;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MessagingService extends FirebaseMessagingService {

    private static final String NAME = "MessagingService";

    @Override
    public void onNewToken(@NonNull String token) {
        Log.d(NAME, String.format("Got new token: %s", token));
        updateToken(this, token);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);
        Log.d(NAME, String.format("Got message: %s", message.getData()));
        ExolveReactNativeModule.processPushNotification(this, message.getData().toString());
    }

    static void requestToken(Context context) {
        Log.d(NAME, "requestToken");
        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                String token = task.getResult();
                updateToken(context, token);
                Log.d(NAME, "Received token: " + token);
            } else {
                Log.w(NAME, "Fetching FCM registration token failed", task.getException());
            }
        });
    }

    static void updateToken(Context context, String token) {
        ExolveReactNativeModule.setPushToken(context, token, ExolveReactNativeModule.PushServiceProvider.FIREBASE);
    }
}
