# Test with real HOD token
$hodToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU1MTRlYjYzNzU1MzU0Yzc4ZGFlMjUiLCJyb2xlIjoiaG9kIiwiZW1haWwiOiJhbnVyYWdAMTAwYWNyZXNzLmNvbSIsImlhdCI6MTc2Nzc4NDkwMCwiZXhwIjoxNzY4Mzg5NzAwfQ.iHLfkFU-1K1XOcjI5pPLXXr1ujbICSWBu6RxubZiHKw"

$headers = @{
    'Authorization' = "Bearer $hodToken"
    'Content-Type' = 'application/json'
}

Write-Host "Testing conversation with HOD token..." -ForegroundColor Green

# Test with BD user ID (need to get actual BD user ID)
try {
    # First, let's get all users to find BD user ID
    $usersResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/users" -Method GET -Headers $headers
    Write-Host "Users found:"
    $usersResponse.data | ForEach-Object {
        Write-Host "  $($_.name) - $($_.email) - $($_._id) - Role: $($_.role)"
    }
    
    # Find BD user
    $bdUser = $usersResponse.data | Where-Object { $_.email -eq "booktech2357@gmail.com" }
    if ($bdUser) {
        Write-Host "`nFound BD user: $($bdUser.name) with ID: $($bdUser._id)" -ForegroundColor Green
        
        # Test conversation with BD user
        $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/$($bdUser._id)" -Method GET -Headers $headers
        Write-Host "Conversation Response:"
        $convResponse | ConvertTo-Json -Depth 10
    } else {
        Write-Host "BD user not found in users list" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error Body: $errorText" -ForegroundColor Red
    }
}
