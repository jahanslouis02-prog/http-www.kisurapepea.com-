<#
Simple helper script to create a GitHub repo and push this folder.
Usage:
  - With GitHub CLI (recommended): .\publish-to-github.ps1 -RepoName "youruser/yourrepo"
  - Without GH: run script and provide remote URL when prompted.
#>
param(
  [string]$RepoName = ""
)

$cwd = Get-Location

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "git is not installed or not in PATH. Install Git before running this script."
  exit 1
}

$gh = $false
if (Get-Command gh -ErrorAction SilentlyContinue) { $gh = $true }

if ($gh) {
  if (-not $RepoName) {
    Write-Host "No repo name provided. Please enter the repository name in the form 'owner/repo' (e.g. youruser/climate-gbv-ngo-site)."
    $RepoName = Read-Host "Repo"
  }
  Write-Host "Attempting to create repository via GitHub CLI: $RepoName"
  gh repo create $RepoName --public --source="$cwd" --remote=origin --push
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Repository created and pushed successfully."
    exit 0
  } else {
    Write-Warning "GitHub CLI operation failed or was cancelled. Falling back to manual git push flow."
  }
}

# Manual fallback
if (-not (Test-Path ".git")) {
  git init
  git checkout -b main
} else {
  Write-Host "Repository already initialized locally. Using existing .git"
}

git add --all
if (-not (git rev-parse --verify HEAD 2>$null)) {
  git commit -m "Initial site"
} else {
  Write-Host "HEAD exists; creating a new commit."
  git commit -m "Update site" -a
}

if (-not $RepoName) {
  $remoteUrl = Read-Host "Enter remote URL (https://github.com/youruser/yourrepo.git)"
} else {
  $remoteUrl = "https://github.com/$RepoName.git"
}

git remote remove origin 2>$null | Out-Null
git remote add origin $remoteUrl

git push -u origin main

if ($LASTEXITCODE -eq 0) {
  Write-Host "Pushed to $remoteUrl."
} else {
  Write-Error "Push failed. Check your remote URL and credentials (use 'gh auth login' or set up SSH keys)."
}
