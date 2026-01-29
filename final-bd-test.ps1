# Final BD user test
Write-Host "=== Final BD User Test ===" -ForegroundColor Green

try {
    Write-Host "Attempting BD login..." -ForegroundColor Cyan
    
    # Create JSON body manually to avoid encoding issues
    $jsonBody = "{
        `"email`": `"booktech2357@gmail.com`",
        `"password`": `"Engineering123`"
    }"
    
    $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body $jsonBody -ContentType "application/json"
    
    Write-Host "Login Status: $($response.StatusCode)" -ForegroundColor White
    Write-Host "Response Body: $($response.Content)" -ForegroundColor White
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ BD Login successful!" -ForegroundColor Green
        $data = $response | ConvertFrom-Json
        Write-Host "User ID: $($data.userId)" -ForegroundColor Green
        Write-Host "User Role: $($data.role)" -ForegroundColor Green
        Write-Host "Token: $($data.token.Substring(0, 50))..." -ForegroundColor Green
        
        # Save token for frontend testing
        $data.token | Out-File -FilePath "bd-token.txt" -Encoding UTF8
        Write-Host "Token saved to bd-token.txt" -ForegroundColor Green
        
    } else {
        Write-Host "❌ BD Login failed" -ForegroundColor Red
        try {
            $error = $response | ConvertFrom-Json
            Write-Host "Error: $($error.message)" -ForegroundColor Red
        } catch {
            Write-Host "Response parsing failed" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
