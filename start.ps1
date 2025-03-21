# Start MongoDB (use mongod from PATH)
Start-Process mongod -ArgumentList "--dbpath C:\data\db"

Write-Host "Started MongoDB server..."

# Start Backend server
Start-Process powershell -ArgumentList "cd ./Backend; npm start"
Write-Host "Started Backend server at http://localhost:3000"

# Start Frontend server
Start-Process powershell -ArgumentList "cd ./Frontend; http-server -p 8080 --cors"
Write-Host "Started Frontend server at http://localhost:8080"

Write-Host "All servers are running!"
Write-Host "Access the application at: http://localhost:8080"
Write-Host "Press Ctrl+C to stop all servers"

# Keep the script running and handle cleanup on exit
try {
    Write-Host "Press Ctrl+C to stop all servers..."
    while ($true) { Start-Sleep -Seconds 1 }
}
finally {
    # Cleanup on script exit
    Get-Process mongod -ErrorAction SilentlyContinue | Stop-Process
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match 'npm start|http-server' } | Stop-Process
    Write-Host "Servers stopped."
}
