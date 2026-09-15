# CreatorFlow Proguard Rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.room.* <methods>;
}
-keep class com.creatorflow.app.data.model.** { *; }
-keep class ir.tapsell.plus.** { *; }
-keep class com.farsitel.bazaar.** { *; }
