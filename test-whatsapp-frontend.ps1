# Test WhatsApp frontend
Write-Host "=== WhatsApp Frontend Test ===" -ForegroundColor Green

# Get HOD token
$hodToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU1MTRlYjYzNzU1MzU0Yzc4ZGFlMjUiLCJyb2xlIjoiaG9kIiwiZW1haWwiOiJhbnVyYWdAMTAwYWNyZXNzLmNvbSIsImlhdCI6MTc2Nzc4NDkwMCwiZXhwIjoxNzY4Mzg5NzAwfQ.iHLfkFU-1K1XOcjI5pPLXXr1ujbICSWBu6RxubZiHKw"

# BD user ID
$bdUserId = "69561b5f01682a57e6ead75d"

$headers = @{
    'Authorization' = "Bearer $hodToken"
    'Content-Type' = 'application/json'
}

Write-Host "Testing conversation API..." -ForegroundColor Cyan

try {
    # Test conversation endpoint
    $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/$bdUserId" -Method GET -Headers $headers
    
    Write-Host "Conversation API Status: 200" -ForegroundColor Green
    Write-Host "Conversation Response:"
    $convResponse | ConvertTo-Json -Depth 10
    
    if ($convResponse.success -and $convResponse.data) {
        Write-Host "`nFound $($convResponse.data.Count) messages" -ForegroundColor Green
        $convResponse.data | ForEach-Object {
            Write-Host "  Message: $($_.message)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "No messages found or API error" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`n=== Instructions ===" -ForegroundColor White
Write-Host "1. Open WhatsApp modal in frontend" -ForegroundColor Cyan
Write-Host "2. Check if messages appear in the chat" -ForegroundColor Cyan
Write-Host "3. If no messages, send a test message first" -ForegroundColor Cyan
Write-Host "4. Check browser console for any errors" -ForegroundColor Cyan
