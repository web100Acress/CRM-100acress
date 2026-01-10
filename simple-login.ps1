# Simple login test
Write-Host "=== Simple Login Test ===" -ForegroundColor Green

try {
    Write-Host "Attempting HOD login..." -ForegroundColor Cyan
    
    $body = @{
        email = "anurag@100acress.com"
        password = "Anurag100acress"
    }
    
    $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body ($body | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor White
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Login successful!" -ForegroundColor Green
        $token = ($response | ConvertFrom-Json).token
        Write-Host "Token received: $($token.Substring(0, 50))..." -ForegroundColor Green
        
        # Test conversation
        Write-Host "`nTesting conversation..." -ForegroundColor Yellow
        $headers = @{
            'Authorization' = "Bearer $token"
            'Content-Type' = 'application/json'
        }
        
        $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/69561b5f01682a57e6ead75d" -Method GET -Headers $headers
        
        Write-Host "Conversation Status: $($convResponse.StatusCode)" -ForegroundColor White
        
        if ($convResponse.StatusCode -eq 200) {
            Write-Host "✅ Conversation working!" -ForegroundColor Green
            $data = $convResponse | ConvertFrom-Json
            Write-Host "Messages: $($data.data.Count)"
        } else {
            Write-Host "❌ Conversation failed" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Login failed" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
