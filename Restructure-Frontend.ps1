# save as: Restructure-Frontend.ps1
param(
  [switch]$DryRun = $true
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Err ($msg){ Write-Host "[ERR ] $msg" -ForegroundColor Red }

function Ensure-Dir([string]$Path){
  if(-not (Test-Path -LiteralPath $Path)){
    if($DryRun){ Info "Would create dir: $Path" }
    else{ New-Item -ItemType Directory -Path $Path -Force | Out-Null }
  }
}

function Write-Stub([string]$OldPath, [string]$NewPath){
  # tạo file stub re-export tại vị trí cũ, dùng relative path tới file mới (không đuôi .ts/.tsx)
  $oldDir = Split-Path -Parent $OldPath
  $rel = [System.IO.Path]::GetRelativePath($oldDir, $NewPath).Replace('\','/')
  $relNoExt = ($rel -replace '\.tsx?$','')
  $content = @"
export { default } from "./$relNoExt";
export * from "./$relNoExt";
"@
  if($DryRun){ Info "Would write STUB at $OldPath -> $relNoExt" }
  else{
    Ensure-Dir $oldDir
    Set-Content -LiteralPath $OldPath -Value $content -Encoding UTF8
  }
}

function Move-WithStub([hashtable]$Op){
  $Old = $Op.Old
  $New = $Op.New
  $AllowLegacy = $Op.ContainsKey('AllowLegacy') -and $Op.AllowLegacy
  $PreferExisting = $Op.ContainsKey('PreferExisting') -and $Op.PreferExisting

  if(-not (Test-Path -LiteralPath $Old)){
    Info "Skip (not found): $Old"
    return
  }

  $destDir = Split-Path -Parent $New
  Ensure-Dir $destDir

  $shouldMove = $true

  if(Test-Path -LiteralPath $New){
    if($PreferExisting){
      # đích đã tồn tại → dùng file đích, chỉ tạo stub ở vị trí cũ
      Info "Dest exists, prefer existing. Keep: $New ; Create stub at old: $Old"
      $shouldMove = $false
    } elseif ($AllowLegacy){
      # không overwrite → chuyển bản cũ sang _legacy
      $legacy = Join-Path 'src\_legacy' ($Old -replace '^src\\','')
      Info "Dest exists. Move OLD to legacy: $legacy ; Create stub at old."
      if(-not $DryRun){
        Ensure-Dir (Split-Path -Parent $legacy)
        Move-Item -LiteralPath $Old -Destination $legacy -Force
      }
      Write-Stub -OldPath $Old -NewPath $New
      return
    } else {
      Warn "Dest exists, will overwrite: $New"
    }
  }

  if($shouldMove){
    if($DryRun){ Info "Would MOVE: $Old  ->  $New" }
    else{
      Move-Item -LiteralPath $Old -Destination $New -Force
    }
  }

  # luôn tạo stub ở đường dẫn cũ
  Write-Stub -OldPath $Old -NewPath $New
}

function Preflight(){
  if(-not (Test-Path -LiteralPath 'package.json')){ throw "Run this script at project root (package.json not found)." }
  if(-not (Test-Path -LiteralPath 'src')){ throw "src/ not found." }

  # gợi ý git clean tree (không bắt buộc)
  if(Test-Path -LiteralPath '.git'){
    try{
      $status = (git status --porcelain)
      if($status){
        Warn "Git working tree is NOT clean. Consider: git add -A; git commit -m 'before restructure'"
      } else {
        Info "Git working tree is clean."
      }
    } catch { Warn "Git not available or error checking status (ignored)." }
  }

  # backup src
  $stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
  $backup = "__pre_restructure_backup_$stamp"
  if($DryRun){
    Info "Would backup 'src' -> '$backup\src'"
  } else {
    Info "Backing up 'src' to '$backup\src' ..."
    New-Item -ItemType Directory -Path $backup -Force | Out-Null
    robocopy src "$backup\src" /MIR /NFL /NDL /NJH /NJS | Out-Null
  }
}

# ========== MAIN ==========
Preflight

# Tạo các thư mục đích
$dirs = @(
  'src\app\config',
  'src\app\routes',
  'src\app\theme',
  'src\widgets\layout',
  'src\widgets\navbar',
  'src\widgets\menubar',
  'src\widgets\background-container',
  'src\widgets\hero-banner',
  'src\widgets\hero-section',
  'src\widgets\featured-books',
  'src\widgets\forum-section',
  'src\widgets\routing',
  'src\shared\api',
  'src\shared\hooks',
  'src\shared\lib',
  'src\shared\types',
  'src\shared\ui\icons',
  'src\_legacy'
)
$dirs | ForEach-Object { Ensure-Dir $_ }

# Danh sách thao tác di chuyển + stub
$operations = @(
  # widgets/layouts/routing
  @{Old='src\components\layout\Navbar.tsx';           New='src\widgets\navbar\Navbar.tsx'}
  @{Old='src\components\layout\MenuBar.tsx';          New='src\widgets\menubar\MenuBar.tsx'}
  @{Old='src\components\layout\BackgroundContainer.tsx'; New='src\widgets\background-container\BackgroundContainer.tsx'}
  @{Old='src\components\layout\MainLayout.tsx';       New='src\widgets\layout\MainLayout.tsx'}
  @{Old='src\components\ProtectedRoute.tsx';          New='src\widgets\routing\ProtectedRoute.tsx'}
  @{Old='src\components\PublicRoute.tsx';             New='src\widgets\routing\PublicRoute.tsx'}

  # sections/widgets
  @{Old='src\components\FeaturedBooks.tsx';           New='src\widgets\featured-books\FeaturedBooks.tsx'}
  @{Old='src\components\ForumSection.tsx';            New='src\widgets\forum-section\ForumSection.tsx'}
  @{Old='src\components\HeroBanner.tsx';              New='src\widgets\hero-banner\HeroBanner.tsx'}
  @{Old='src\components\HeroSection.tsx';             New='src\widgets\hero-section\HeroSection.tsx'}

  # commons → shared/ui
  @{Old='src\components\commons\DiscoverSection.tsx'; New='src\shared\ui\DiscoverSection.tsx'}
  @{Old='src\components\commons\NotFound.tsx';        New='src\shared\ui\NotFound.tsx'}
  @{Old='src\components\commons\Working.tsx';         New='src\shared\ui\Working.tsx'}
  @{Old='src\components\commons\DisintegrationTransition.tsx'; New='src\shared\ui\DisintegrationTransition.tsx'}

  # trùng bản ở components root → ưu tiên bản đã chuyển lên shared/ui, chỉ tạo stub nếu đích tồn tại
  @{Old='src\components\DisintegrationTransition.tsx'; New='src\shared\ui\DisintegrationTransition.tsx'; PreferExisting=$true}

  # icons
  @{Old='src\components\icons\Logo.tsx';             New='src\shared\ui\icons\Logo.tsx'}

  # routes/config/theme
  @{Old='src\routes\AppRoutes.tsx';                   New='src\app\routes\AppRoutes.tsx'}
  @{Old='src\config\bannerConfig.tsx';                New='src\app\config\bannerConfig.tsx'}
  @{Old='src\theme\palette.ts';                       New='src\app\theme\palette.ts'}

  # shared infra
  @{Old='src\api\axiosClient.ts';                     New='src\shared\api\axiosClient.ts'}
  @{Old='src\utils\constants.ts';                     New='src\shared\lib\constants.ts'}
  @{Old='src\utils\errorHandler.ts';                  New='src\shared\lib\errorHandler.ts'}
  @{Old='src\utils\format.ts';                        New='src\shared\lib\format.ts'}
  @{Old='src\types\assets.d.ts';                      New='src\shared\types\assets.d.ts'}
  @{Old='src\hooks\useThemeMode.tsx';                 New='src\shared\hooks\useThemeMode.tsx'}

  # features: api + hooks
  @{Old='src\hooks\useAuth.tsx';                      New='src\features\auth\hooks\useAuth.tsx'}
  @{Old='src\api\auth.api.ts';                        New='src\features\auth\api\auth.api.ts'}
  @{Old='src\api\books.api.ts';                       New='src\features\books\api\books.api.ts'}
  @{Old='src\api\borrow.api.ts';                      New='src\features\borrow\api\borrow.api.ts'}
  @{Old='src\api\favourites.api.ts';                  New='src\features\favourites\api\favourites.api.ts'}
  @{Old='src\api\users.api.ts';                       New='src\features\users\api\users.api.ts'}

  # forms: nếu đích đã có (features/auth/components/...), đẩy bản cũ vào _legacy + stub
  @{Old='src\components\forms\ForgotPasswordForm.tsx'; New='src\features\auth\components\ForgotPasswordForm.tsx'; AllowLegacy=$true}
  @{Old='src\components\forms\LoginForm.tsx';          New='src\features\auth\components\LoginForm.tsx'; AllowLegacy=$true}
  @{Old='src\components\forms\RegisterForm.tsx';       New='src\features\auth\components\RegisterForm.tsx'; AllowLegacy=$true}
  @{Old='src\components\forms\ResetPasswordForm.tsx';  New='src\features\auth\components\ResetPasswordForm.tsx'; AllowLegacy=$true}
)

foreach($op in $operations){ Move-WithStub $op }

Info "Done. Mode: " + ($(if($DryRun){"DRY-RUN (no changes)"} else {"APPLIED"}))
Info "Next steps:"
Info "  1) Run ESLint/TypeCheck:  npm run lint  &&  npm run build"
Info "  2) If any issue, restore from backup '__pre_restructure_backup_*' or 'git reset --hard'"
