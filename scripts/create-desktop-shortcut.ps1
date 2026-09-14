[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
$targetScript = Join-Path $repoRoot 'scripts\start-typefirst.cmd'

if (-not (Test-Path -LiteralPath $targetScript)) {
    Write-Error "Launcher script not found at expected path: $targetScript"
    exit 1
}

$desktopPath = [Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)
if (-not (Test-Path -LiteralPath $desktopPath)) {
    Write-Error "User Desktop directory not found at path: $desktopPath"
    exit 1
}

$shortcutPath = Join-Path $desktopPath 'TypeFirst.lnk'

$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetScript
$shortcut.WorkingDirectory = $repoRoot
$shortcut.Description = 'Launch TypeFirst local development server'
$shortcut.Save()

Write-Host "Desktop shortcut created successfully:"
Write-Host "  Path:             $shortcutPath"
Write-Host "  Target:           $targetScript"
Write-Host "  WorkingDirectory: $repoRoot"
