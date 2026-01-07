# Quick test - replace YOUR_TOKEN_HERE with actual token
$token = "YOUR_TOKEN_HERE"
$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}

# Test conversation endpoint
try {
    $response = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/000000000000000000000000" -Method GET -Headers $headers
    Write-Host "API Response:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
    }
}
