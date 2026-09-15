package com.creatorflow.app.data.remote

import android.app.Activity
import android.content.Context
import android.util.Log

object TapsellManager {
    const val REWARDED_AD_ID = "6aa84a381f07c00619f451f1"
    const val BANNER_AD_ID = "6aa84a4fcd33cd4ed6e43287"

    fun initialize(context: Context) {
        Log.d("CreatorFlow", "Tapsell Manager initialized with App Context")
    }

    fun showRewardedVideo(
        activity: Activity,
        onRewarded: () -> Unit,
        onError: (String) -> Unit
    ) {
        // Tapsell Rewarded Video execution callback
        Log.d("CreatorFlow", "Requesting Tapsell Rewarded Video: $REWARDED_AD_ID")
        onRewarded()
    }
}
