package com.creatorflow.app.data.local

import androidx.room.*
import com.creatorflow.app.data.model.ChatMessageEntity
import com.creatorflow.app.data.model.ContentIdeaEntity
import com.creatorflow.app.data.model.PlannerItemEntity
import com.creatorflow.app.data.model.ScriptEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ChatDao {
    @Query("SELECT * FROM chat_messages ORDER BY timestamp ASC")
    fun getAllMessages(): Flow<List<ChatMessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ChatMessageEntity)

    @Query("DELETE FROM chat_messages")
    suspend fun clearAll()
}

@Dao
interface ContentIdeaDao {
    @Query("SELECT * FROM saved_ideas ORDER BY savedAt DESC")
    fun getAllIdeas(): Flow<List<ContentIdeaEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIdea(idea: ContentIdeaEntity)

    @Delete
    suspend fun deleteIdea(idea: ContentIdeaEntity)
}

@Dao
interface ScriptDao {
    @Query("SELECT * FROM saved_scripts ORDER BY savedAt DESC")
    fun getAllScripts(): Flow<List<ScriptEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertScript(script: ScriptEntity)

    @Delete
    suspend fun deleteScript(script: ScriptEntity)
}

@Dao
interface PlannerDao {
    @Query("SELECT * FROM planner_items ORDER BY dueDate ASC")
    fun getAllPlannerItems(): Flow<List<PlannerItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlannerItem(item: PlannerItemEntity)

    @Update
    suspend fun updatePlannerItem(item: PlannerItemEntity)

    @Delete
    suspend fun deletePlannerItem(item: PlannerItemEntity)
}
