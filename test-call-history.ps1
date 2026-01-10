# Simple Call History API Test
param(
    [string]$Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTUyN2VmNGJhY2VmMzg3ZjI0OWE5Iiwicm9sZSI6IkhSIiwiaWF0IjoxNzYwMzM3OTE2fQ.u8r0ADJe9SK0ykPASyfWlWPet-e2Po6GV4Vt0CGm554",
    [string]$LeadId = "696101e59cf5bae3b0726186"
)

$baseUrl = "http://localhost:5001/api"
$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Call History API Test" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Lead ID: $LeadId" -ForegroundColor Yellow
Write-Host ""

# Test Call History
Write-Host "Testing: GET $baseUrl/leads/$LeadId/calls" -ForegroundColor Green
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/leads/$LeadId/calls" -Method GET -Headers $headers
    
    Write-Host "SUCCESS! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    
    $json = $response.Content | ConvertFrom-Json
    
    if ($json.success) {
        Write-Host "Response: SUCCESS" -ForegroundColor Green
        Write-Host "Call Records Found: $($json.count)" -ForegroundColor Cyan
        Write-Host ""
        
        if ($json.data -and $json.data.Count -gt 0) {
            Write-Host "Recent Calls:" -ForegroundColor Yellow
            $json.data | Select-Object -First 5 | ForEach-Object {
                $durationMin = [math]::Floor($_.duration / 60)
                $durationSec = $_.duration % 60
                Write-Host "  [$($_.status)] $($_.leadName) - $($_.phone)" -ForegroundColor White
                Write-Host "    Duration: ${durationMin}m ${durationSec}s | Date: $($_.callDate)" -ForegroundColor Gray
                Write-Host ""
            }
        } else {
            Write-Host "No call records found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "API returned error: $($json.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        Write-Host ""
        Write-Host "Response Body:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor White
        
        try {
            $errorObj = $responseBody | ConvertFrom-Json
            if ($errorObj.message) {
                Write-Host ""
                Write-Host "Error Message: $($errorObj.message)" -ForegroundColor Red
            }
        } catch {
            # Not JSON, that's okay
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan

