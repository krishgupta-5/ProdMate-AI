# Usage: pwsh scripts/shoot.ps1 [url] [height]
# Full-page desktop and mobile screenshots into .shots/, desktop sliced into 1700px parts.
# Mobile is 500px wide: headless Chrome clamps narrower windows to 500px and crops the capture.
param([string]$Url = "http://localhost:3002", [int]$Height = 10500)

$dir = Join-Path $PSScriptRoot "..\.shots"
New-Item -ItemType Directory -Force $dir | Out-Null
$dir = (Resolve-Path $dir).Path
Remove-Item "$dir\*" -ErrorAction SilentlyContinue
$chrome = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 "--window-size=1440,$Height" --virtual-time-budget=9000 "--screenshot=$dir\desktop.png" $Url 2>$null | Out-Null
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 "--window-size=500,1800" --virtual-time-budget=9000 "--screenshot=$dir\mobile.png" $Url 2>$null | Out-Null
$n = 0
while (-not ((Test-Path "$dir\desktop.png") -and (Test-Path "$dir\mobile.png")) -and $n -lt 60) { Start-Sleep 1; $n++ }
Start-Sleep 2
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("$dir\desktop.png")
$h = 1700
for ($i = 0; $i -lt [math]::Ceiling($img.Height / $h); $i++) {
  $hh = [math]::Min($h, $img.Height - $i * $h)
  $bmp = New-Object System.Drawing.Bitmap 1440, $hh
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 1440, $hh), (New-Object System.Drawing.Rectangle 0, ($i * $h), 1440, $hh), [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save("$dir\d$i.png"); $g.Dispose(); $bmp.Dispose()
}
$img.Dispose()
Get-ChildItem $dir -Name
