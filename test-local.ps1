# Test local WhatsApp conversation
Write-Host "=== Local WhatsApp Test ===" -ForegroundColor Green

# Test with local backend
$baseUrl = "http://localhost:5001"
$bdUserId = "69561b5f01682a57e6ead75d"

Write-Host "Testing local backend at: $baseUrl" -ForegroundColor Cyan

try {
    # Test conversation endpoint without auth first
    Write-Host "`n1. Testing without authentication..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/messages/conversation/$bdUserId" -Method GET
        Write-Host "No auth response: $($response.StatusCode)" -ForegroundColor White
    } catch {
        Write-Host "No auth error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test with a simple auth header
    Write-Host "`n2. Testing with simple auth..." -ForegroundColor Yellow
    $headers = @{
        'Authorization' = 'Bearer test-token'
        'Content-Type' = 'application/json'
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/messages/conversation/$bdUserId" -Method GET -Headers $headers
        Write-Host "Simple auth response: $($response.StatusCode)" -ForegroundColor White
        if ($response.StatusCode -eq 200) {
            Write-Host "Response content:"
            $response | ConvertTo-Json -Depth 5
        }
    } catch {
        Write-Host "Simple auth error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test with HOD token
    Write-Host "`n3. Testing with HOD token..." -ForegroundColor Yellow
    $hodToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU1MTRlYjYzNzU1MzU0Yzc4ZGFlMjUiLCJyb2xlIjoiaG9kIiwiZW1haWwiOiJhbnVyYWdAMTAwYWNyZXNzLmNvbSIsImlhdCI6MTc2Nzc4NDkwMCwiZXhwIjoxNzY4Mzg5NzAwfQ.iHLfkFU-1K1XOcjI5pPLXXr1ujbICSWBu6RxubZiHKw"
    
    $headers = @{
        'Authorization' = "Bearer $hodToken"
        'Content-Type' = 'application/json'
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/messages/conversation/$bdUserId" -Method GET -Headers $headers
        Write-Host "HOD token response: $($response.StatusCode)" -ForegroundColor Green
        if ($response.StatusCode -eq 200) {
            Write-Host "Success! Messages found:"
            $data = $response | ConvertFrom-Json
            if ($data.success -and $data.data) {
                Write-Host "  Found $($data.data.Count) messages"
                $data.data | ForEach-Object {
                    Write-Host "    - $($_.message)"
                }
            }
        }
    } catch {
        Write-Host "HOD token error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Test error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Instructions ===" -ForegroundColor White
Write-Host "1. Make sure backend is running on localhost:5001" -ForegroundColor Cyan
Write-Host "2. Check if local test works" -ForegroundColor Cyan
Write-Host "3. Then test in frontend" -ForegroundColor Cyan
