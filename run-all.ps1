# Check MongoDB Service
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if (-not $mongoService) {
    Write-Host "MongoDB service not found! Please install MongoDB first."
    Write-Host "Run setup.ps1 for installation instructions."
    exit 1
}

if ($mongoService.Status -ne "Running") {
    Write-Host "Starting MongoDB service..."
    Start-Service MongoDB
    Start-Sleep -Seconds 5
}

Write-Host "MongoDB is running..."

# Start Backend
Write-Host "`nStarting Backend server..."
Start-Process powershell -ArgumentList "-NoExit -Command cd ./Backend; npm start"

# Wait for Backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "`nStarting Frontend server..."
Start-Process powershell -ArgumentList "-NoExit -Command cd ./Frontend; npx http-server -p 8080 --cors"

Write-Host "`nAll servers are running!"
Write-Host "Access the application at: http://localhost:8080"
Write-Host "The MongoDB database is running as a Windows service"
Write-Host "Press Ctrl+C to stop the web servers (MongoDB service will keep running)"

try {
    Write-Host "`nPress Ctrl+C to stop servers..."
    while ($true) { Start-Sleep -Seconds 1 }
}
finally {
    # Cleanup (but don't stop MongoDB service)
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match 'npm start|http-server' } | Stop-Process
    Write-Host "Web servers stopped. MongoDB service is still running."
    Write-Host "To stop MongoDB service manually, run: Stop-Service MongoDB"
}
