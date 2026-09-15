package com.creatorflow.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.creatorflow.app.ui.theme.CreatorFlowTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CreatorFlowTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CreatorFlowApp()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreatorFlowApp() {
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf("داشبورد", "دستیار AI", "ایده‌ها", "فیلم‌نامه", "تامبنیل", "تنظیمات")

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "CreatorFlow",
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFFF97316),
                            fontSize = 20.sp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "PRO STUDIO",
                            fontSize = 10.sp,
                            color = Color(0xFF38BDF8),
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                tabs.forEachIndexed { index, title ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        label = { Text(text = title, fontSize = 11.sp) },
                        icon = {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .background(
                                        if (selectedTab == index) Color(0xFFF97316) else Color.Transparent
                                    )
                            )
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            when (selectedTab) {
                0 -> DashboardSection()
                1 -> AiAssistantSection()
                2 -> IdeasSection()
                3 -> ScriptsSection()
                4 -> ThumbnailSection()
                else -> SettingsSection()
            }
        }
    }
}

@Composable
fun DashboardSection() {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "به استودیوی CreatorFlow خوش آمدید",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 18.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "توسعه‌دهنده: سیدحمیدموسوی زاده",
                        color = Color(0xFF94A3B8),
                        fontSize = 12.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "پیشرفت مانیتایز: ۴۰۰۰ ساعت واچ‌تایم و ۱۰۰۰ سابسکرایبر",
                        color = Color(0xFF38BDF8),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "Tapsell Banner Slot (Ad ID: 6aa84a4fcd33cd4ed6e43287)",
                        fontSize = 11.sp,
                        color = Color(0xFFF59E0B),
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun AiAssistantSection() {
    Column {
        Text("دستیار هوشمند CreatorFlow AI", fontWeight = FontWeight.Bold, color = Color.White)
        Text("متصل به مدل Gemini 3.8 Flash با درک چندمرحله‌ای متن", fontSize = 12.sp, color = Color.Gray)
    }
}

@Composable
fun IdeasSection() {
    Column {
        Text("استودیو تولید ایده‌های وایرال یوتیوب", fontWeight = FontWeight.Bold, color = Color.White)
    }
}

@Composable
fun ScriptsSection() {
    Column {
        Text("استودیو قلاب و فیلم‌نامه نویسی با ساختار ریتنشن بالا", fontWeight = FontWeight.Bold, color = Color.White)
    }
}

@Composable
fun ThumbnailSection() {
    Column {
        Text("استودیو طراحی تامبنیل ۱۶:۹ یوتیوب", fontWeight = FontWeight.Bold, color = Color.White)
    }
}

@Composable
fun SettingsSection() {
    Column {
        Text("تنظیمات CreatorFlow", fontWeight = FontWeight.Bold, color = Color.White)
        Spacer(modifier = Modifier.height(8.dp))
        Text("توسعه‌دهنده رسمی: سیدحمیدموسوی زاده", color = Color(0xFF94A3B8), fontSize = 13.sp)
        Text("نسخه: 1.0.0 (versionCode 1)", color = Color(0xFF94A3B8), fontSize = 13.sp)
        Text("Package Name: com.creatorflow.app", color = Color(0xFF38BDF8), fontSize = 12.sp)
    }
}
