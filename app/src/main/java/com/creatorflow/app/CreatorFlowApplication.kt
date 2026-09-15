package com.creatorflow.app

import android.app.Application
import com.creatorflow.app.data.local.CreatorFlowDatabase
import com.creatorflow.app.data.remote.TapsellManager

class CreatorFlowApplication : Application() {

    val database by lazy { CreatorFlowDatabase.getDatabase(this) }

    override fun onCreate() {
        super.onCreate()
        // Initialize Tapsell SDK with official application configuration
        TapsellManager.initialize(this)
    }
}
