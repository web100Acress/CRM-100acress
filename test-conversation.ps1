# Test WhatsApp conversation API
Write-Host "Testing WhatsApp conversation API..."

# You need to replace these with actual values
$testToken = "YOUR_BEARER_TOKEN_HERE"  # Get from browser localStorage
$recipientId = "RECIPIENT_USER_ID_HERE"  # Get from browser console when WhatsApp opens

if ($testToken -eq "YOUR_BEARER_TOKEN_HERE" -or $recipientId -eq "RECIPIENT_USER_ID_HERE") {
    Write-Host "Please update the token and recipientId in this file with actual values" -ForegroundColor Yellow
    Write-Host "Get token from: localStorage.getItem('token') in browser console" -ForegroundColor Yellow
    Write-Host "Get recipientId from: window.recipient._id when WhatsApp modal is open" -ForegroundColor Yellow
    return
}

try {
    $headers = @{
        'Authorization' = "Bearer $testToken"
        'Content-Type' = 'application/json'
    }
    
    $url = "https://bcrm.100acress.com/api/messages/conversation/$recipientId"
    Write-Host "Testing URL: $url"
    
    $response = Invoke-RestMethod -Uri $url -Method GET -Headers $headers -StatusCodeVariable 'statusCode'
    
    Write-Host "API Response Status: $statusCode"
    Write-Host "API Response Data:"
    $response | ConvertTo-Json -Depth 10
    
    if ($response.success -and $response.data) {
        Write-Host "Found $($response.data.Count) messages"
        for ($i = 0; $i -lt $response.data.Count; $i++) {
            $msg = $response.data[$i]
            Write-Host "Message $($i + 1):"
            Write-Host "  ID: $($msg._id)"
            Write-Host "  Sender ID: $($msg.senderId)"
            Write-Host "  Message: $(if ($msg.message) { $msg.message.Substring(0, [Math]::Min(50, $msg.message.Length)) + '...' } else { 'No message' })"
            Write-Host "  Timestamp: $($msg.timestamp)"
            Write-Host "  Sender Name: $($msg.senderName)"
            Write-Host ""
        }
    }
} catch {
    Write-Host "API Call Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
