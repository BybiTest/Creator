package com.creatorflow.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.creatorflow.app.data.model.ChatMessageEntity
import com.creatorflow.app.data.model.ContentIdeaEntity
import com.creatorflow.app.data.model.PlannerItemEntity
import com.creatorflow.app.data.model.ScriptEntity

@Database(
    entities = [
        ChatMessageEntity::class,
        ContentIdeaEntity::class,
        ScriptEntity::class,
        PlannerItemEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class CreatorFlowDatabase : RoomDatabase() {

    abstract fun chatDao(): ChatDao
    abstract fun contentIdeaDao(): ContentIdeaDao
    abstract fun scriptDao(): ScriptDao
    abstract fun plannerDao(): PlannerDao

    companion object {
        @Volatile
        private var INSTANCE: CreatorFlowDatabase? = null

        fun getDatabase(context: Context): CreatorFlowDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    CreatorFlowDatabase::class.java,
                    "creatorflow_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
