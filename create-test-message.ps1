# Create a test message between HOD and BD
$hodToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU1MTRlYjYzNzU1MzU0Yzc4ZGFlMjUiLCJyb2xlIjoiaG9kIiwiZW1haWwiOiJhbnVyYWdAMTAwYWNyZXNzLmNvbSIsImlhdCI6MTc2Nzc4NDkwMCwiZXhwIjoxNzY4Mzg5NzAwfQ.iHLfkFU-1K1XOcjI5pPLXXr1ujbICSWBu6RxubZiHKw"

$bdUserId = "69561b5f01682a57e6ead75d"

$headers = @{
    'Authorization' = "Bearer $hodToken"
    'Content-Type' = 'application/json'
}

Write-Host "Creating test message from HOD to BD..." -ForegroundColor Green

try {
    $messageBody = @{
        recipientId = $bdUserId
        message = "Test message from HOD to BD at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    } | ConvertTo-Json
    
    $createResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/create-test" -Method POST -Headers $headers -Body $messageBody
    Write-Host "Message created successfully!" -ForegroundColor Green
    Write-Host "Message ID: $($createResponse.data._id)"
    
    # Now test conversation
    Write-Host "`nTesting conversation after creating message..." -ForegroundColor Cyan
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
