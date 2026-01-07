# Full test for WhatsApp conversation
Write-Host "=== WhatsApp Conversation Full Test ===" -ForegroundColor Green

# You need to replace these with actual values
$testToken = "YOUR_BEARER_TOKEN_HERE"
$recipientId = "RECIPIENT_USER_ID_HERE"

if ($testToken -eq "YOUR_BEARER_TOKEN_HERE" -or $recipientId -eq "RECIPIENT_USER_ID_HERE") {
    Write-Host "Please update the token and recipientId in this file" -ForegroundColor Yellow
    return
}

$headers = @{
    'Authorization' = "Bearer $testToken"
    'Content-Type' = 'application/json'
}

# Step 1: Create a test message
Write-Host "`nStep 1: Creating test message..." -ForegroundColor Cyan
try {
    $testMessageBody = @{
        recipientId = $recipientId
        message = "Test message at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    } | ConvertTo-Json
    
    $createResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/create-test" -Method POST -Headers $headers -Body $testMessageBody -StatusCodeVariable 'createStatusCode'
    
    Write-Host "Create Message Status: $createStatusCode"
    Write-Host "Create Message Response:"
    $createResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error creating test message: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 2: Fetch conversation
Write-Host "`nStep 2: Fetching conversation..." -ForegroundColor Cyan
try {
    $url = "https://bcrm.100acress.com/api/messages/conversation/$recipientId"
    Write-Host "URL: $url"
    
    $response = Invoke-RestMethod -Uri $url -Method GET -Headers $headers -StatusCodeVariable 'statusCode'
    
    Write-Host "Conversation Status: $statusCode"
    Write-Host "Conversation Response:"
    $response | ConvertTo-Json -Depth 10
    
    if ($response.success -and $response.data) {
        Write-Host "`nFound $($response.data.Count) messages:" -ForegroundColor Green
        for ($i = 0; $i -lt $response.data.Count; $i++) {
            $msg = $response.data[$i]
            Write-Host "Message $($i + 1):"
            Write-Host "  ID: $($msg._id)"
            Write-Host "  Sender ID: $($msg.senderId)"
            Write-Host "  Sender Name: $($msg.senderName)"
            Write-Host "  Message: $($msg.message)"
            Write-Host "  Timestamp: $($msg.timestamp)"
            Write-Host ""
        }
    } else {
        Write-Host "No messages found or API returned success=false" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error fetching conversation: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error Body: $errorText" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
