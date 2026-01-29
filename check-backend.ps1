# Check if backend is accessible
Write-Host "=== Checking Backend Access ===" -ForegroundColor Green

$urls = @(
    "http://localhost:5001/api/leads",
    "https://bcrm.100acress.com/api/leads"
)

foreach ($url in $urls) {
    Write-Host "`nTesting: $url" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor White
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ Backend is accessible" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Backend not accessible" -ForegroundColor Red
            Write-Host "  Response: $($response.StatusDescription)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor White
Write-Host "1. If localhost:5001 works, backend is running locally" -ForegroundColor Cyan
Write-Host "2. If bcrm.100acress.com works, backend is running in production" -ForegroundColor Cyan
Write-Host "3. Check which one you want to test" -ForegroundColor Cyan
