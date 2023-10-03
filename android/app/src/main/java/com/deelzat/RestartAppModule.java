package com.deelzat;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;
//import com.jakewharton:process-phoenix;

import androidx.annotation.NonNull;
import com.jakewharton.processphoenix.ProcessPhoenix;
import androidx.core.content.IntentCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;

public class RestartAppModule extends ReactContextBaseJavaModule {

    Context context;

    RestartAppModule(ReactApplicationContext context) {
        super(context);
        this.context = context.getApplicationContext(); // This is where you get the context
    }



    @NonNull
    @Override
    public String getName() {
        return "RestartAppModule";
    }

    @ReactMethod
    public void restartApp() {
       ProcessPhoenix.triggerRebirth(context);
    }

}
