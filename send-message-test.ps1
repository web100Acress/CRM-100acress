# Send a test message using the send endpoint
$hodToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU1MTRlYjYzNzU1MzU0Yzc4ZGFlMjUiLCJyb2xlIjoiaG9kIiwiZW1haWwiOiJhbnVyYWdAMTAwYWNyZXNzLmNvbSIsImlhdCI6MTc2Nzc4NDkwMCwiZXhwIjoxNzY4Mzg5NzAwfQ.iHLfkFU-1K1XOcjI5pPLXXr1ujbICSWBu6RxubZiHKw"
$bdUserId = "69561b5f01682a57e6ead75d"

$headers = @{
    'Authorization' = "Bearer $hodToken"
    'Content-Type' = 'application/json'
}

Write-Host "Sending test message from HOD to BD..." -ForegroundColor Green

try {
    $messageBody = @{
        recipientId = $bdUserId
        recipientEmail = "booktech2357@gmail.com"
        recipientName = "Test BD User"
        message = "Test message from HOD to BD at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        senderRole = "hod"
    } | ConvertTo-Json
    
    $sendResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/send" -Method POST -Headers $headers -Body $messageBody
    Write-Host "Message sent successfully!" -ForegroundColor Green
    Write-Host "Response:"
    $sendResponse | ConvertTo-Json -Depth 5
    
    # Now test conversation
    Write-Host "`nTesting conversation after sending message..." -ForegroundColor Cyan
    $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/$bdUserId" -Method GET -Headers $headers
    Write-Host "Conversation Response:"
    $convResponse | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error Body: $errorText" -ForegroundColor Red
    }
}
