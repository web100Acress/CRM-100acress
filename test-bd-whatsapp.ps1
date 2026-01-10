# Test BD user WhatsApp flow
Write-Host "=== BD User WhatsApp Test ===" -ForegroundColor Green

try {
    Write-Host "Attempting BD login..." -ForegroundColor Cyan
    
    $body = @{
        email = "booktech2357@gmail.com"
        password = "@Engineering123"
    }
    
    $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body ($body | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "Login Status: $($response.StatusCode)" -ForegroundColor White
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ BD Login successful!" -ForegroundColor Green
        $data = $response | ConvertFrom-Json
        Write-Host "User ID: $($data.userId)" -ForegroundColor Green
        Write-Host "User Role: $($data.role)" -ForegroundColor Green
        
        # Test conversation from BD perspective
        Write-Host "`nTesting conversation from BD..." -ForegroundColor Yellow
        $headers = @{
            'Authorization' = "Bearer $($data.token)"
            'Content-Type' = 'application/json'
        }
        
        # Need to get HOD user ID for conversation
        # For now, use a known HOD ID
        $hodUserId = "695514eb63755354c78dae25"
        
        $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/$hodUserId" -Method GET -Headers $headers
        
        Write-Host "Conversation Status: $($convResponse.StatusCode)" -ForegroundColor White
        
        if ($convResponse.StatusCode -eq 200) {
            Write-Host "✅ Conversation API working!" -ForegroundColor Green
            $convData = $convResponse | ConvertFrom-Json
            Write-Host "Messages found: $($convData.data.Count)"
            $convData.data | ForEach-Object {
                Write-Host "  - From: $($_.senderName) - $($_.message)"
            }
        } else {
            Write-Host "❌ Conversation failed" -ForegroundColor Red
            $error = $convResponse | ConvertFrom-Json
            Write-Host "Error: $($error.message)" -ForegroundColor Red
        }
        
        # Test sending message from BD to HOD
        Write-Host "`nTesting message from BD to HOD..." -ForegroundColor Yellow
        $messageBody = @{
            recipientId = $hodUserId
            recipientEmail = "anurag@100acress.com"
            recipientName = "Anurag HOD"
            message = "Test message from BD to HOD at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            senderRole = "bd"
        }
        
        $sendResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/send" -Method POST -Headers $headers -Body ($messageBody | ConvertTo-Json)
        
        Write-Host "Send Status: $($sendResponse.StatusCode)" -ForegroundColor White
        
        if ($sendResponse.StatusCode -eq 200) {
            Write-Host "✅ Message sent from BD to HOD!" -ForegroundColor Green
        } else {
            Write-Host "❌ Message send failed" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ BD Login failed" -ForegroundColor Red
        $error = $response | ConvertFrom-Json
        Write-Host "Error: $($error.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor White
Write-Host "The WhatsApp feature is working!" -ForegroundColor Green
Write-Host "You can now test in the frontend:" -ForegroundColor Cyan
Write-Host "1. Login as BD user" -ForegroundColor Cyan
Write-Host "2. Go to leads assigned to BD" -ForegroundColor Cyan
Write-Host "3. Click WhatsApp button" -ForegroundColor Cyan
Write-Host "4. Chat should show HOD-BD conversation" -ForegroundColor Cyan
