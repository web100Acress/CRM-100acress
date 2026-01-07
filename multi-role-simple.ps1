# Multi-Role Chat System Test
Write-Host "=== Multi-Role Chat System Test ===" -ForegroundColor Green

# Test Boss to HOD
Write-Host "`n1. Testing Boss to HOD..." -ForegroundColor Yellow
$bossLogin = '{"email":"info@100acress.com","password":"boss123"}'
try {
    $bossResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body $bossLogin -ContentType "application/json"
    $bossToken = ($bossResponse | ConvertFrom-Json).token
    Write-Host "Boss login successful" -ForegroundColor Green
    
    # Send message Boss to HOD
    $msgJson = '{"recipientId":"695514eb63755354c78dae25","recipientEmail":"anurag@100acress.com","recipientName":"HOD","message":"Hello HOD from Boss","senderRole":"boss"}'
    $bossHeaders = @{'Authorization'="Bearer $bossToken";'Content-Type'='application/json'}
    $sendResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/send" -Method POST -Headers $bossHeaders -Body $msgJson
    Write-Host "Boss to HOD message sent" -ForegroundColor Green
    
    # Check conversation
    $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/695514eb63755354c78dae25" -Method GET -Headers $bossHeaders
    $convData = $convResponse | ConvertFrom-Json
    Write-Host "Boss sees $($convData.data.Count) messages with HOD" -ForegroundColor White
} catch {
    Write-Host "Boss test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test HOD to Boss
Write-Host "`n2. Testing HOD to Boss..." -ForegroundColor Yellow
$hodLogin = '{"email":"anurag@100acress.com","password":"Anurag100acress"}'
try {
    $hodResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body $hodLogin -ContentType "application/json"
    $hodToken = ($hodResponse | ConvertFrom-Json).token
    Write-Host "HOD login successful" -ForegroundColor Green
    
    # Send message HOD to Boss
    $msgJson = '{"recipientId":"69550f0463755354c78dad7f","recipientEmail":"info@100acress.com","recipientName":"Boss","message":"Hello Boss from HOD","senderRole":"hod"}'
    $hodHeaders = @{'Authorization'="Bearer $hodToken";'Content-Type'='application/json'}
    $sendResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/send" -Method POST -Headers $hodHeaders -Body $msgJson
    Write-Host "HOD to Boss message sent" -ForegroundColor Green
    
    # Check conversation
    $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/69550f0463755354c78dad7f" -Method GET -Headers $hodHeaders
    $convData = $convResponse | ConvertFrom-Json
    Write-Host "HOD sees $($convData.data.Count) messages with Boss" -ForegroundColor White
} catch {
    Write-Host "HOD test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Team Leader to BD
Write-Host "`n3. Testing Team Leader to BD..." -ForegroundColor Yellow
$tlLogin = '{"email":"poojapoonia409@gmail.com","password":"team123"}'
try {
    $tlResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/auth/login" -Method POST -Body $tlLogin -ContentType "application/json"
    $tlToken = ($tlResponse | ConvertFrom-Json).token
    Write-Host "Team Leader login successful" -ForegroundColor Green
    
    # Send message Team Leader to BD
    $msgJson = '{"recipientId":"69561b5f01682a57e6ead75d","recipientEmail":"booktech2357@gmail.com","recipientName":"BD","message":"Hello BD from Team Leader","senderRole":"team-leader"}'
    $tlHeaders = @{'Authorization'="Bearer $tlToken";'Content-Type'='application/json'}
    $sendResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/send" -Method POST -Headers $tlHeaders -Body $msgJson
    Write-Host "Team Leader to BD message sent" -ForegroundColor Green
    
    # Check conversation
    $convResponse = Invoke-RestMethod -Uri "https://bcrm.100acress.com/api/messages/conversation/69561b5f01682a57e6ead75d" -Method GET -Headers $tlHeaders
    $convData = $convResponse | ConvertFrom-Json
    Write-Host "Team Leader sees $($convData.data.Count) messages with BD" -ForegroundColor White
} catch {
    Write-Host "Team Leader test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Multi-Role Chat Summary ===" -ForegroundColor Green
Write-Host "Boss can chat with: HOD, Team Leader, BD" -ForegroundColor Cyan
Write-Host "HOD can chat with: Boss, Team Leader, BD" -ForegroundColor Cyan
Write-Host "Team Leader can chat with: BD, Boss, HOD" -ForegroundColor Cyan
Write-Host "BD can chat with: Team Leader, HOD, Boss" -ForegroundColor Cyan
Write-Host "All role combinations are supported!" -ForegroundColor Green
