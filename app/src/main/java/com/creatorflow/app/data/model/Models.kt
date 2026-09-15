package com.creatorflow.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "chat_messages")
data class ChatMessageEntity(
    @PrimaryKey val id: String,
    val role: String, // "user" or "assistant"
    val content: String,
    val timestamp: Long
)

@Entity(tableName = "saved_ideas")
data class ContentIdeaEntity(
    @PrimaryKey val id: String,
    val title: String,
    val hook: String,
    val format: String,
    val targetAudience: String,
    val viralScore: Int,
    val cta: String,
    val savedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "saved_scripts")
data class ScriptEntity(
    @PrimaryKey val id: String,
    val title: String,
    val topic: String,
    val videoType: String,
    val fullScriptJson: String,
    val savedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "planner_items")
data class PlannerItemEntity(
    @PrimaryKey val id: String,
    val title: String,
    val platform: String,
    val stage: String,
    val dueDate: String,
    val priority: String,
    val notes: String
)

data class VIPStatus(
    val isVIP: Boolean,
    val expiryDate: String?,
    val cafeBazaarToken: String?
)
