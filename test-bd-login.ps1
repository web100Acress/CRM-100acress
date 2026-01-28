# Test BD user login
Write-Host "=== BD User Login Test ===" -ForegroundColor Green

try {
    Write-Host "Attempting BD login..." -ForegroundColor Cyan
    
    $body = @{
        email = "booktech2357@gmail.com"
        password = "Engineering123"
    }
    
    $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body ($body | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor White
    Write-Host "Response Body: $($response.Content)" -ForegroundColor White
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ BD Login successful!" -ForegroundColor Green
        $data = $response | ConvertFrom-Json
        Write-Host "User ID: $($data.userId)" -ForegroundColor Green
    } else {
        Write-Host "❌ BD Login failed" -ForegroundColor Red
        $error = $response | ConvertFrom-Json
        Write-Host "Error: $($error.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
