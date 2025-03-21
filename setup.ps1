# Function to check if MongoDB is installed
function Test-MongoDBInstalled {
    try {
        $mongod = Get-Command mongod -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Function to install MongoDB
function Install-MongoDB {
    Write-Host "Installing MongoDB..."
    
    # Download MongoDB installer
    $downloadDir = "$env:TEMP\mongodb_install"
    New-Item -ItemType Directory -Force -Path $downloadDir | Out-Null
    
    $url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.5-signed.msi"
    $installerPath = "$downloadDir\mongodb_installer.msi"
    
    Write-Host "Downloading MongoDB installer..."
    Invoke-WebRequest -Uri $url -OutFile $installerPath
    
    # Install MongoDB
    Write-Host "Running MongoDB installer..."
    $arguments = "/i `"$installerPath`" ADDLOCAL=ALL INSTALLLOCATION=`"C:\Program Files\MongoDB\Server\6.0`" /quiet"
    Start-Process msiexec.exe -Wait -ArgumentList $arguments
    
    # Create data directory
    $dataDir = "C:\data\db"
    New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
    
    Write-Host "MongoDB installation complete!"
}

# Function to install http-server globally
function Install-HttpServer {
    Write-Host "Installing http-server..."
    npm install -g http-server
}

# Main setup script
Write-Host "Setting up Quiz App..."

# Check MongoDB installation
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if (-not $mongoService) {
    Write-Host "`n[WARNING] MongoDB service not found!"
    Write-Host "Please install MongoDB Community Server from: https://www.mongodb.com/try/download/community"
    Write-Host "During installation:"
    Write-Host "1. Choose 'Complete' installation"
    Write-Host "2. Make sure 'Install MongoDB as a Service' is checked"
    Write-Host "3. Complete the installation"
    Write-Host "`nPress Enter once MongoDB is installed to continue setup..."
    Read-Host
}

# Create MongoDB data directory if it doesn't exist
$dataDir = "C:\data\db"
if (-not (Test-Path $dataDir)) {
    Write-Host "Creating MongoDB data directory..."
    New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..."
Set-Location ./Backend
npm install

# Install http-server if not already installed
if (-not (Get-Command http-server -ErrorAction SilentlyContinue)) {
    Write-Host "`nInstalling http-server..."
    npm install -g http-server
}

Write-Host "`nSetup complete! Use 'run-all.ps1' to run the application."
