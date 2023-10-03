package com.deelzat;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import io.branch.rnbranch.RNBranchModule;
import android.content.Intent;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Deelzat";
  }

 @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.id.lottie);  // here
        SplashScreen.setAnimationFinished(true);
        super.onCreate(null);
    }


       @Override
          protected void onStart() {
              super.onStart();
              RNBranchModule.initSession(getIntent().getData(), this);
          }

          @Override
          public void onNewIntent(Intent intent) {
              super.onNewIntent(intent);
              RNBranchModule.onNewIntent(intent);
          }
}
