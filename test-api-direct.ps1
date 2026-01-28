# Direct API Testing Script
# Usage: .\test-api-direct.ps1 -Token "YOUR_TOKEN" -LeadId "LEAD_ID"

param(
    [string]$Token = "",
    [string]$LeadId = "696101e59cf5bae3b0726186"
)

$baseUrl = "http://localhost:5001/api"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "API Testing - Direct Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Headers
$headers = @{
    "Content-Type" = "application/json"
}

if ($Token) {
    $headers["Authorization"] = "Bearer $Token"
    Write-Host "✅ Using provided token" -ForegroundColor Green
} else {
    Write-Host "⚠️  No token provided - authenticated tests will fail" -ForegroundColor Yellow
}
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -ErrorAction Stop
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $health = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($health.status)" -ForegroundColor Cyan
    Write-Host "   Database: $($health.database.status)" -ForegroundColor Cyan
    Write-Host "   Version: $($health.version)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   ℹ️  Health endpoint might be at different path" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 2: Get Assignable Users (requires auth)
Write-Host "2. Testing Get Assignable Users..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/leads/assignable-users" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    if ($result.success) {
        Write-Host "   Found $($result.data.Count) users" -ForegroundColor Cyan
        if ($result.data.Count -gt 0) {
            Write-Host "   Sample users:" -ForegroundColor Gray
            $result.data | Select-Object -First 3 | ForEach-Object {
                Write-Host "     - $($_.name) ($($_.role)) - ID: $($_._id)" -ForegroundColor Gray
            }
        }
    }
} catch {
    Write-Host "   ❌ Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        $errorObj = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorObj) {
            Write-Host "   Error: $($errorObj.message)" -ForegroundColor Yellow
        } else {
            Write-Host "   Response: $responseBody" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 3: Get Call History for Lead (requires auth)
if ($Token -and $LeadId) {
    Write-Host "3. Testing Get Call History for Lead: $LeadId..." -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/leads/$LeadId/calls" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        $result = $response.Content | ConvertFrom-Json
        if ($result.success) {
            Write-Host "   Found $($result.count) call records" -ForegroundColor Cyan
            if ($result.data -and $result.data.Count -gt 0) {
                Write-Host "   Recent calls:" -ForegroundColor Gray
                $result.data | Select-Object -First 3 | ForEach-Object {
                    $mins = [math]::Floor($_.duration / 60)
                    $secs = $_.duration % 60
                    $durationStr = "$mins:$($secs.ToString('00'))"
                    Write-Host "     - $($_.leadName) | $($_.phone) | Duration: $durationStr | Status: $($_.status)" -ForegroundColor Gray
                    $userName = if ($_.userId.name) { $_.userId.name } else { "Unknown" }
                    Write-Host "       Date: $($_.callDate) | User: $userName" -ForegroundColor DarkGray
                }
            } else {
                Write-Host "   ⚠️  No call records found for this lead" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "   ❌ Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            $errorObj = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorObj) {
                Write-Host "   Error: $($errorObj.message)" -ForegroundColor Yellow
            } else {
                Write-Host "   Response: $responseBody" -ForegroundColor Yellow
            }
        }
    }
    Write-Host ""
}

# Test 4: Get All Call Records (requires auth)
if ($Token) {
    Write-Host "4. Testing Get All Call Records..." -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/leads/calls" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        $result = $response.Content | ConvertFrom-Json
        if ($result.success) {
            Write-Host "   Found $($result.count) total call records" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "   ❌ Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            $errorObj = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorObj) {
                Write-Host "   Error: $($errorObj.message)" -ForegroundColor Yellow
            }
        }
    }
    Write-Host ""
}

# Test 5: Get User Chats (requires auth)
if ($Token) {
    Write-Host "5. Testing Get User Chats..." -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/chats/user-chats" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        $result = $response.Content | ConvertFrom-Json
        if ($result.success) {
            Write-Host "   Found $($result.data.Count) chats" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "   ❌ Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            $errorObj = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorObj) {
                Write-Host "   Error: $($errorObj.message)" -ForegroundColor Yellow
            }
        }
    }
    Write-Host ""
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run with token:" -ForegroundColor Yellow
Write-Host "  .\test-api-direct.ps1 -Token 'YOUR_TOKEN' -LeadId 'LEAD_ID'" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan

