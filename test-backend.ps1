# Test if backend is running
Write-Host "Testing backend connection..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "https://bcrm.100acress.com/api/leads" -Method GET -TimeoutSec 10
    Write-Host "Backend Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "Backend connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check if backend is running on port 5000" -ForegroundColor Yellow
}

# Now test the messages endpoint
Write-Host "`nTesting messages endpoint..." -ForegroundColor Green

# You need to replace this with actual token
$testToken = "YOUR_BEARER_TOKEN_HERE"

if ($testToken -eq "YOUR_BEARER_TOKEN_HERE") {
    Write-Host "Please update the token in this script" -ForegroundColor Yellow
    Write-Host "Get token from: localStorage.getItem('token') in browser console" -ForegroundColor Yellow
} else {
    try {
        $headers = @{
            'Authorization' = "Bearer $testToken"
            'Content-Type' = 'application/json'
        }
        
        # Test with a dummy recipient ID
        $dummyRecipientId = "000000000000000000000000"
        $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/$dummyRecipientId" -Method GET -Headers $headers
        
        Write-Host "Messages API Status: 200" -ForegroundColor Green
        Write-Host "Messages API Response:"
        $response | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "Messages API Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
    }
}
