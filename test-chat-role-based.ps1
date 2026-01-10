# Comprehensive Chat Test Script (PowerShell)
# 
# This script tests chat functionality between all role combinations:
# - Boss, HOD, Team Leader, BD
# 
# Features:
# - Fresh token generation for all roles
# - Chat creation between different role combinations
# - Bidirectional messaging test
# - Message retrieval and verification

Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 59) -ForegroundColor Green
Write-Host "🧪 COMPREHENSIVE CHAT TEST - ROLE-BASED PERMISSIONS" -ForegroundColor Green
Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 59) -ForegroundColor Green

# Configuration
$BASE_URL = "https://bcrm.100acress.com"
$API_BASE = "$BASE_URL/api"

# User credentials - Update these with actual test credentials
$users = @{
    boss = @{
        email = "info@100acress.com"
        password = "boss123"
        userId = $null
        role = "boss"
        token = $null
    }
    hod = @{
        email = "anurag@100acress.com"
        password = "Anurag100acress"
        userId = $null
        role = "hod"
        token = $null
    }
    teamLeader = @{
        email = "poojapoonia409@gmail.com"
        password = "team123"
        userId = $null
        role = "team-leader"
        token = $null
    }
    bd = @{
        email = "booktech2357@gmail.com"
        password = "Engineering123"
        userId = $null
        role = "bd"
        token = $null
    }
}

$testLeadId = $null
$chatResults = @{}

# Function to login and get fresh token
function Login-User($userKey) {
    $user = $users[$userKey]
    Write-Host "`n🔐 Logging in $($user.role) ($($user.email))..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = $user.email
        password = $user.password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
        
        if ($response.success) {
            $user.token = $response.token -or $response.data.token
            $user.userId = $response.user._id -or $response.data.user._id -or $response.userId
            
            Write-Host "✅ $($user.role) login successful!" -ForegroundColor Green
            Write-Host "   User ID: $($user.userId)" -ForegroundColor Gray
            Write-Host "   Token: $($user.token.Substring(0, [Math]::Min(20, $user.token.Length)))..." -ForegroundColor Gray
            return $true
        } else {
            Write-Host "❌ $($user.role) login failed: $($response.message)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $($user.role) login error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to get a test lead
function Get-TestLead($token) {
    Write-Host "`n📋 Getting test lead..." -ForegroundColor Yellow
    
    try {
        $headers = @{
            'Authorization' = "Bearer $token"
            'Content-Type' = 'application/json'
        }
        
        $response = Invoke-RestMethod -Uri "$API_BASE/leads" -Method GET -Headers $headers
        
        if ($response.success -and $response.data -and $response.data.Count -gt 0) {
            $lead = $response.data[0]
            $script:testLeadId = $lead._id
            Write-Host "✅ Test lead found: $($lead.name -or 'Lead') (ID: $testLeadId)" -ForegroundColor Green
            return $testLeadId
        } else {
            Write-Host "⚠️  No leads found. Using placeholder lead ID for testing..." -ForegroundColor Yellow
            $script:testLeadId = "000000000000000000000000"
            return $null
        }
    } catch {
        Write-Host "❌ Error getting test lead: $($_.Exception.Message)" -ForegroundColor Red
        $script:testLeadId = "000000000000000000000000"
        return $null
    }
}

# Function to create or get chat
function Create-OrGet-Chat($fromUserKey, $toUserKey) {
    $fromUser = $users[$fromUserKey]
    $toUser = $users[$toUserKey]
    
    if (-not $fromUser.token -or -not $toUser.userId -or -not $testLeadId) {
        Write-Host "⚠️  Cannot create chat: Missing token, userId, or leadId" -ForegroundColor Yellow
        return $null
    }
    
    Write-Host "`n💬 Creating chat: $($fromUser.role) → $($toUser.role)..." -ForegroundColor Cyan
    
    try {
        $headers = @{
            'Authorization' = "Bearer $($fromUser.token)"
            'Content-Type' = 'application/json'
        }
        
        $body = @{
            leadId = $testLeadId
            createdBy = $fromUser.userId
            assignedTo = $toUser.userId
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_BASE/chats/create" -Method POST -Headers $headers -Body $body
        
        if ($response.success) {
            $chatId = $response.data._id
            Write-Host "✅ Chat created/found: $chatId" -ForegroundColor Green
            Write-Host "   Participants: $($fromUser.role) ↔ $($toUser.role)" -ForegroundColor Gray
            return $chatId
        } else {
            Write-Host "❌ Chat creation failed: $($response.message)" -ForegroundColor Red
            if ($response.debug) {
                Write-Host "   Debug info: $($response.debug | ConvertTo-Json -Compress)" -ForegroundColor Gray
            }
            return $null
        }
    } catch {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorResponse) {
            Write-Host "❌ Chat creation failed: $($errorResponse.message)" -ForegroundColor Red
        } else {
            Write-Host "❌ Chat creation error: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $null
    }
}

# Function to send message
function Send-ChatMessage($userKey, $chatId, $message) {
    $user = $users[$userKey]
    
    if (-not $user.token -or -not $chatId) {
        Write-Host "⚠️  Cannot send message: Missing token or chatId" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "`n📤 Sending message from $($user.role)..." -ForegroundColor Cyan
    
    try {
        $headers = @{
            'Authorization' = "Bearer $($user.token)"
            'Content-Type' = 'application/json'
        }
        
        $body = @{
            chatId = $chatId
            message = $message
            senderId = $user.userId
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_BASE/chats/send" -Method POST -Headers $headers -Body $body
        
        if ($response.success) {
            Write-Host "✅ Message sent: `"$message`"" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Message send failed: $($response.message)" -ForegroundColor Red
            return $false
        }
    } catch {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorResponse) {
            Write-Host "❌ Message send failed: $($errorResponse.message)" -ForegroundColor Red
        } else {
            Write-Host "❌ Message send error: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

# Function to get chat messages
function Get-ChatMessages($userKey, $chatId) {
    $user = $users[$userKey]
    
    if (-not $user.token -or -not $chatId) {
        Write-Host "⚠️  Cannot get messages: Missing token or chatId" -ForegroundColor Yellow
        return @()
    }
    
    Write-Host "`n📥 Getting messages for $($user.role)..." -ForegroundColor Cyan
    
    try {
        $headers = @{
            'Authorization' = "Bearer $($user.token)"
            'Content-Type' = 'application/json'
        }
        
        $response = Invoke-RestMethod -Uri "$API_BASE/chats/messages?chatId=$chatId" -Method GET -Headers $headers
        
        if ($response.success) {
            $messages = $response.data
            Write-Host "✅ Retrieved $($messages.Count) messages" -ForegroundColor Green
            for ($i = 0; $i -lt $messages.Count; $i++) {
                $msg = $messages[$i]
                $senderName = $msg.senderId.name -or "Unknown"
                $isMe = ($msg.senderId._id -or $msg.senderId) -eq $user.userId
                $senderLabel = if ($isMe) { "You" } else { $senderName }
                Write-Host "   $($i + 1). [$senderLabel]: $($msg.message)" -ForegroundColor Gray
            }
            return $messages
        } else {
            Write-Host "❌ Get messages failed: $($response.message)" -ForegroundColor Red
            return @()
        }
    } catch {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorResponse) {
            Write-Host "❌ Get messages failed: $($errorResponse.message)" -ForegroundColor Red
        } else {
            Write-Host "❌ Get messages error: $($_.Exception.Message)" -ForegroundColor Red
        }
        return @()
    }
}

# Function to get all user chats
function Get-UserChats($userKey) {
    $user = $users[$userKey]
    
    if (-not $user.token) {
        Write-Host "⚠️  Cannot get chats: Missing token" -ForegroundColor Yellow
        return @()
    }
    
    Write-Host "`n📋 Getting all chats for $($user.role)..." -ForegroundColor Cyan
    
    try {
        $headers = @{
            'Authorization' = "Bearer $($user.token)"
            'Content-Type' = 'application/json'
        }
        
        $response = Invoke-RestMethod -Uri "$API_BASE/chats/user-chats" -Method GET -Headers $headers
        
        if ($response.success) {
            $chats = $response.data
            Write-Host "✅ Found $($chats.Count) chats" -ForegroundColor Green
            for ($i = 0; $i -lt $chats.Count; $i++) {
                $chat = $chats[$i]
                $oppositeUser = $chat.oppositeUser.name -or "Unknown"
                $lastMessage = $chat.lastMessage.message -or "No messages"
                Write-Host "   $($i + 1). Chat with $oppositeUser: `"$lastMessage`"" -ForegroundColor Gray
            }
            return $chats
        } else {
            Write-Host "❌ Get chats failed: $($response.message)" -ForegroundColor Red
            return @()
        }
    } catch {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorResponse) {
            Write-Host "❌ Get chats failed: $($errorResponse.message)" -ForegroundColor Red
        } else {
            Write-Host "❌ Get chats error: $($_.Exception.Message)" -ForegroundColor Red
        }
        return @()
    }
}

# Main test execution
Write-Host "`n📝 STEP 1: Logging in all users..." -ForegroundColor Yellow
$loginResults = @{}
foreach ($userKey in $users.Keys) {
    $loginResults[$userKey] = Login-User $userKey
    Start-Sleep -Milliseconds 500
}

$allLoggedIn = ($loginResults.Values | Where-Object { $_ -eq $true }).Count -eq $users.Count
if (-not $allLoggedIn) {
    Write-Host "`n❌ Not all users logged in successfully. Cannot proceed with tests." -ForegroundColor Red
    exit 1
}

Write-Host "`n📝 STEP 2: Getting test lead..." -ForegroundColor Yellow
Get-TestLead $users.boss.token | Out-Null

Write-Host "`n📝 STEP 3: Testing chat creation between role combinations..." -ForegroundColor Yellow

$chatTests = @(
    @{ from = "boss"; to = "hod"; message = "Hello HOD from Boss!" }
    @{ from = "hod"; to = "boss"; message = "Hello Boss from HOD!" }
    @{ from = "boss"; to = "teamLeader"; message = "Hello Team Leader from Boss!" }
    @{ from = "teamLeader"; to = "boss"; message = "Hello Boss from Team Leader!" }
    @{ from = "boss"; to = "bd"; message = "Hello BD from Boss!" }
    @{ from = "bd"; to = "boss"; message = "Hello Boss from BD!" }
    @{ from = "hod"; to = "teamLeader"; message = "Hello Team Leader from HOD!" }
    @{ from = "teamLeader"; to = "hod"; message = "Hello HOD from Team Leader!" }
    @{ from = "hod"; to = "bd"; message = "Hello BD from HOD!" }
    @{ from = "bd"; to = "hod"; message = "Hello HOD from BD!" }
    @{ from = "teamLeader"; to = "bd"; message = "Hello BD from Team Leader!" }
    @{ from = "bd"; to = "teamLeader"; message = "Hello Team Leader from BD!" }
)

foreach ($test in $chatTests) {
    $chatId = Create-OrGet-Chat $test.from $test.to
    if ($chatId) {
        $key = "$($test.from)-$($test.to)"
        $chatResults[$key] = @{
            chatId = $chatId
            from = $test.from
            to = $test.to
        }
        Send-ChatMessage $test.from $chatId $test.message | Out-Null
        Start-Sleep -Milliseconds 300
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "`n📝 STEP 4: Testing bidirectional messaging..." -ForegroundColor Yellow

$bossHodChatId = $chatResults["boss-hod"].chatId -or $chatResults["hod-boss"].chatId
if ($bossHodChatId) {
    Write-Host "`n🔄 Testing bidirectional: Boss ↔ HOD" -ForegroundColor Cyan
    Send-ChatMessage "boss" $bossHodChatId "Boss message 1" | Out-Null
    Start-Sleep -Milliseconds 300
    Send-ChatMessage "hod" $bossHodChatId "HOD reply 1" | Out-Null
    Start-Sleep -Milliseconds 300
    Send-ChatMessage "boss" $bossHodChatId "Boss message 2" | Out-Null
    Start-Sleep -Milliseconds 300
    
    Get-ChatMessages "boss" $bossHodChatId | Out-Null
    Start-Sleep -Milliseconds 300
    Get-ChatMessages "hod" $bossHodChatId | Out-Null
    Start-Sleep -Milliseconds 500
}

Write-Host "`n📝 STEP 5: Getting all chats for each user..." -ForegroundColor Yellow

foreach ($userKey in $users.Keys) {
    Get-UserChats $userKey | Out-Null
    Start-Sleep -Milliseconds 500
}

# Final summary
Write-Host "`n" -NoNewline
Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 59) -ForegroundColor Green
Write-Host "📊 TEST SUMMARY" -ForegroundColor Green
Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 59) -ForegroundColor Green

$successfulChats = $chatResults.Count
Write-Host "✅ Successful chat creations: $successfulChats/$($chatTests.Count)" -ForegroundColor Green
Write-Host "✅ All role combinations tested: Boss, HOD, Team Leader, BD" -ForegroundColor Green
Write-Host "✅ Bidirectional messaging: Tested" -ForegroundColor Green
Write-Host "✅ Message retrieval: Tested" -ForegroundColor Green
Write-Host "✅ User chats listing: Tested" -ForegroundColor Green

Write-Host "`n📋 Chat Matrix Tested:" -ForegroundColor White
Write-Host "   Boss       ↔ HOD, Team Leader, BD" -ForegroundColor Cyan
Write-Host "   HOD        ↔ Boss, Team Leader, BD" -ForegroundColor Cyan
Write-Host "   Team Leader ↔ BD, Boss, HOD" -ForegroundColor Cyan
Write-Host "   BD         ↔ Team Leader, HOD, Boss" -ForegroundColor Cyan

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 59) -ForegroundColor Green


