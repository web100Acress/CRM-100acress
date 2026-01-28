# Generate JWT tokens for testing
Write-Host "=== Generating JWT Tokens ===" -ForegroundColor Green

# BD User Token
$bdPayload = @{
    email = "booktech2357@gmail.com"
    role = "bd"
    userId = "654321fedcba9876543210ab"
    name = "BD User"
} | ConvertTo-Json -Compress

# HOD User Token  
$hodPayload = @{
    email = "anurag@100acress.com"
    role = "hod"
    userId = "654321fedcba9876543210cd"
    name = "Anurag HOD"
} | ConvertTo-Json -Compress

# Simple token generation (base64 encoded for testing)
# Note: This is not a real JWT, just for testing the API structure
$bdToken = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($bdPayload))
$hodToken = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($hodPayload))

Write-Host "`nBD User Token (booktech2357@gmail.com):" -ForegroundColor Cyan
Write-Host $bdToken

Write-Host "`nHOD User Token (anurag@100acress.com):" -ForegroundColor Cyan
Write-Host $hodToken

Write-Host "`n=== Test with BD Token ===" -ForegroundColor Yellow
$headers = @{
    'Authorization' = "Bearer $bdToken"
    'Content-Type' = 'application/json'
}

try {
    $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/654321fedcba9876543210cd" -Method GET -Headers $headers
    Write-Host "BD to HOD Conversation Response:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "BD Test Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`n=== Test with HOD Token ===" -ForegroundColor Yellow
$headers = @{
    'Authorization' = "Bearer $hodToken"
    'Content-Type' = 'application/json'
}

try {
    $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/654321fedcba9876543210ab" -Method GET -Headers $headers
    Write-Host "HOD to BD Conversation Response:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "HOD Test Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`n=== Instructions ===" -ForegroundColor Green
Write-Host "1. Check the backend console for debug logs"
Write-Host "2. Look for 'Sample messages in database' and 'User ID extraction'"
Write-Host "3. If no messages exist, the API should return empty array"
