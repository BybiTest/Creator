package com.creatorflow.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = OrangePrimary,
    secondary = CyanAccent,
    tertiary = AmberGold,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = TextWhite,
    onBackground = TextWhite,
    onSurface = TextWhite
)

@Composable
fun CreatorFlowTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
