# Fresh login to get new token
Write-Host "=== Fresh Login Test ===" -ForegroundColor Green

# Test HOD login
$hodLogin = @{
    email = "anurag@100acress.com"
    password = "Anurag100acress"
} | ConvertTo-Json

try {
    Write-Host "Logging in HOD..." -ForegroundColor Cyan
    $loginResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body $hodLogin -ContentType "application/json"
    
    Write-Host "Login Status: $($loginResponse.StatusCode)" -ForegroundColor White
    
    if ($loginResponse.StatusCode -eq 200) {
        $data = $loginResponse | ConvertFrom-Json
        Write-Host "✅ HOD Login successful!" -ForegroundColor Green
        Write-Host "New Token: $($data.token.Substring(0, 50))..." -ForegroundColor Green
        
        # Save new token to file for testing
        $data.token | Out-File -FilePath "hod-token.txt" -Encoding UTF8
        Write-Host "Token saved to hod-token.txt" -ForegroundColor Green
        
        # Test conversation with new token
        Write-Host "`nTesting conversation with new token..." -ForegroundColor Yellow
        $headers = @{
            'Authorization' = "Bearer $($data.token)"
            'Content-Type' = 'application/json'
        }
        
        $bdUserId = "69561b5f01682a57e6ead75d"
        $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/$bdUserId" -Method GET -Headers $headers
        
        Write-Host "Conversation Status: $($convResponse.StatusCode)" -ForegroundColor White
        
        if ($convResponse.StatusCode -eq 200) {
            $convData = $convResponse | ConvertFrom-Json
            Write-Host "✅ Conversation API working!" -ForegroundColor Green
            Write-Host "Messages found: $($convData.data.Count)"
            $convData.data | ForEach-Object {
                Write-Host "  - $($_.message)"
            }
        } else {
            Write-Host "❌ Conversation API failed" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ HOD Login failed" -ForegroundColor Red
        Write-Host "Error: $($loginResponse | ConvertFrom-Json)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Login error: $($_.Exception.Message)" -ForegroundColor Red
}
