# API Testing Script for Postman Endpoints
# Run this script to test all endpoints

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "API Testing - Localhost Endpoints" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:5001/api"
$token = Read-Host "Enter your JWT token (or press Enter to skip authenticated tests)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "⚠️  No token provided. Some tests will fail." -ForegroundColor Yellow
    Write-Host ""
}

# Headers
$headers = @{
    "Content-Type" = "application/json"
}

if ($token) {
    $headers["Authorization"] = "Bearer $token"
}

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -ErrorAction Stop
    Write-Host "   ✅ Health Check: OK" -ForegroundColor Green
    Write-Host "   Response: $($response.StatusCode)" -ForegroundColor Gray
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
} catch {
    Write-Host "   ❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get Assignable Users
Write-Host "2. Testing Get Assignable Users..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/leads/assignable-users" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   ✅ Get Assignable Users: OK" -ForegroundColor Green
    Write-Host "   Response: $($response.StatusCode)" -ForegroundColor Gray
    $users = $response.Content | ConvertFrom-Json
    if ($users.success -and $users.data) {
        Write-Host "   Found $($users.data.Count) users" -ForegroundColor Cyan
        if ($users.data.Count -gt 0) {
            Write-Host "   First user: $($users.data[0].name) ($($users.data[0].role))" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 3: Get Call History for Specific Lead
if ($token) {
    $leadId = Read-Host "Enter Lead ID to test call history (or press Enter to skip)"
    if ($leadId) {
        Write-Host "3. Testing Get Call History for Lead $leadId..." -ForegroundColor Green
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/leads/$leadId/calls" -Method GET -Headers $headers -ErrorAction Stop
            Write-Host "   ✅ Get Call History: OK" -ForegroundColor Green
            Write-Host "   Response: $($response.StatusCode)" -ForegroundColor Gray
            $callHistory = $response.Content | ConvertFrom-Json
            if ($callHistory.success) {
                Write-Host "   Found $($callHistory.count) call records" -ForegroundColor Cyan
                if ($callHistory.data -and $callHistory.data.Count -gt 0) {
                    $latestCall = $callHistory.data[0]
                    Write-Host "   Latest call:" -ForegroundColor Cyan
                    Write-Host "     - Lead: $($latestCall.leadName)" -ForegroundColor Gray
                    Write-Host "     - Phone: $($latestCall.phone)" -ForegroundColor Gray
                    Write-Host "     - Duration: $($latestCall.duration) seconds" -ForegroundColor Gray
                    Write-Host "     - Status: $($latestCall.status)" -ForegroundColor Gray
                    Write-Host "     - Date: $($latestCall.callDate)" -ForegroundColor Gray
                }
            }
        } catch {
            Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $reader.BaseStream.Position = 0
                $reader.DiscardBufferedData()
                $responseBody = $reader.ReadToEnd()
                Write-Host "   Response: $responseBody" -ForegroundColor Yellow
            }
        }
        Write-Host ""
    }
}

# Test 4: Get All Call Records
if ($token) {
    Write-Host "4. Testing Get All Call Records..." -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/leads/calls" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Get All Call Records: OK" -ForegroundColor Green
        Write-Host "   Response: $($response.StatusCode)" -ForegroundColor Gray
        $calls = $response.Content | ConvertFrom-Json
        if ($calls.success) {
            Write-Host "   Found $($calls.count) total call records" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# Test 5: Create Chat
if ($token) {
    $leadId = Read-Host "Enter Lead ID to test chat creation (or press Enter to skip)"
    if ($leadId) {
        $assignedToId = Read-Host "Enter Assigned To User ID (or press Enter to skip)"
        if ($assignedToId) {
            Write-Host "5. Testing Create Chat..." -ForegroundColor Green
            try {
                $body = @{
                    leadId = $leadId
                    createdBy = "CURRENT_USER_ID_FROM_TOKEN"
                    assignedTo = $assignedToId
                } | ConvertTo-Json
                
                $response = Invoke-WebRequest -Uri "$baseUrl/chats/create" -Method POST -Headers $headers -Body $body -ErrorAction Stop
                Write-Host "   ✅ Create Chat: OK" -ForegroundColor Green
                Write-Host "   Response: $($response.StatusCode)" -ForegroundColor Gray
                $chat = $response.Content | ConvertFrom-Json
                if ($chat.success) {
                    Write-Host "   Chat ID: $($chat.data._id)" -ForegroundColor Cyan
                }
            } catch {
                Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
                if ($_.Exception.Response) {
                    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                    $reader.BaseStream.Position = 0
                    $reader.DiscardBufferedData()
                    $responseBody = $reader.ReadToEnd()
                    Write-Host "   Response: $responseBody" -ForegroundColor Yellow
                }
            }
            Write-Host ""
        }
    }
}

# Test 6: Get User Chats
if ($token) {
    Write-Host "6. Testing Get User Chats..." -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/chats/user-chats" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Get User Chats: OK" -ForegroundColor Green
        Write-Host "   Response: $($response.StatusCode)" -ForegroundColor Gray
        $chats = $response.Content | ConvertFrom-Json
        if ($chats.success) {
            Write-Host "   Found $($chats.data.Count) chats" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

