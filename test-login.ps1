# Test login and get real JWT token
Write-Host "=== Testing Login ===" -ForegroundColor Green

# Test BD login
$bdLoginBody = @{
    email = "booktech2357@gmail.com"
    password = "Engineering123"
} | ConvertTo-Json

try {
    $bdResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body $bdLoginBody -ContentType "application/json"
    Write-Host "BD Login Success!" -ForegroundColor Green
    Write-Host "BD Token:"
    Write-Host $bdResponse.token
    
    # Test conversation with BD token
    $bdHeaders = @{
        'Authorization' = "Bearer $($bdResponse.token)"
        'Content-Type' = 'application/json'
    }
    
    Write-Host "`nTesting BD conversation..." -ForegroundColor Cyan
    $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/654321fedcba9876543210cd" -Method GET -Headers $bdHeaders
    Write-Host "BD Conversation Response:"
    $convResponse | ConvertTo-Json -Depth 5
    
} catch {
    Write-Host "BD Login Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error Body: $errorText" -ForegroundColor Red
    }
}

# Test HOD login
$hodLoginBody = @{
    email = "anurag@100acress.com"
    password = "Anurag100acress"
} | ConvertTo-Json

try {
    $hodResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body $hodLoginBody -ContentType "application/json"
    Write-Host "`nHOD Login Success!" -ForegroundColor Green
    Write-Host "HOD Token:"
    Write-Host $hodResponse.token
    
    # Test conversation with HOD token
    $hodHeaders = @{
        'Authorization' = "Bearer $($hodResponse.token)"
        'Content-Type' = 'application/json'
    }
    
    Write-Host "`nTesting HOD conversation..." -ForegroundColor Cyan
    $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/654321fedcba9876543210ab" -Method GET -Headers $hodHeaders
    Write-Host "HOD Conversation Response:"
    $convResponse | ConvertTo-Json -Depth 5
    
} catch {
    Write-Host "HOD Login Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error Body: $errorText" -ForegroundColor Red
    }
}
