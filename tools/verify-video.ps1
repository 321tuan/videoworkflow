# Kiem tra TOAN DIEN file video cuoi (dung ngay sau khi render):
#   1. Thong so file (dung luong, kich thuoc, codec, fps)
#   2. Am thanh: tach ra roi do RMS tung canh + khe im lang + dinh (tools/mix-check.mjs)
#   3. Hinh anh: cat 1 frame giua moi canh tu CHINH file mp4 roi do bo cuc (tools/frame-check.mjs)
#   4. Phong tan so: phat hien am thanh bi het/khong (tools/band-rms.mjs)
#
# Cach dung:
#   .\verify-video.ps1 -Mp4 "D:\test AI\videos\ten-video.mp4" -Project "D:\test AI\neo-tin-hoc-1"
param(
  [Parameter(Mandatory = $true)][string]$Mp4,
  [Parameter(Mandatory = $true)][string]$Project,
  [string]$Tmp = "D:\cache\tmp\verify",
  [string]$Ffmpeg = "",
  [string]$Ffprobe = ""
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ff = Join-Path $Project "node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
$fp = Join-Path $Project "node_modules\@remotion\compositor-win32-x64-msvc\ffprobe.exe"
# Project HyperFrames khong co ffmpeg cua Remotion -> dung ban trong PATH.
# Co the truyen -Ffmpeg / -Ffprobe neu may khong co sanh sanh.
if($Ffmpeg){ $ff = $Ffmpeg }
if($Ffprobe){ $fp = $Ffprobe }
if(-not (Test-Path $ff)){ $c = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if($c){ $ff = $c.Source } else { throw "khong tim thay ffmpeg (truyen -Ffmpeg <duong dan>)" } }
if(-not (Test-Path $fp)){ $c = Get-Command ffprobe -ErrorAction SilentlyContinue
  if($c){ $fp = $c.Source } else { throw "khong tim thay ffprobe (truyen -Ffprobe <duong dan>)" } }
Write-Host "  ffmpeg : $ff" -ForegroundColor DarkGray
Write-Host "  ffprobe: $fp" -ForegroundColor DarkGray
$tools = "D:\test AI\tools"
New-Item -ItemType Directory -Force -Path $Tmp, "$Tmp\frames" | Out-Null
Remove-Item "$Tmp\*.wav" -ErrorAction SilentlyContinue
Remove-Item "$Tmp\frames\*.png" -ErrorAction SilentlyContinue

Write-Host "`n=== 1. THONG SO FILE ===" -ForegroundColor Cyan
& $fp -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels -of default=noprint_wrappers=1 $Mp4 |
  ForEach-Object { "  $_" }

Write-Host "`n=== 2. AM THANH (tach tu chinh file mp4) ===" -ForegroundColor Cyan
& $ff -v error -y -i $Mp4 -ac 2 -ar 48000 -f wav "$Tmp\mix-stereo.wav"
& $ff -v error -y -i $Mp4 -ac 1 -f wav "$Tmp\mix-mono.wav"
# Project HyperFrames khong co src/vo-durations.json (do Remotion). Moc canh
# nam o storyboard.json o thu muc CHA cua project/hf -> tim o ca 2 noi.
$Par = Split-Path $Project -Parent
$DurFile = ""
foreach($c in @((Join-Path $Project "src\vo-durations.json"), (Join-Path $Project "storyboard.json"), (Join-Path $Par "storyboard.json"))){
  if(Test-Path $c){ $DurFile = $c; break }
}
if($DurFile){
  Write-Host "  moc canh: $DurFile" -ForegroundColor DarkGray
  $dur = Get-Content $DurFile -Raw -Encoding UTF8 | ConvertFrom-Json
} else { $dur = $null }
$SceneKeys = @()
if($dur){
  if($dur.frames){ $SceneKeys = @($dur.frames | ForEach-Object { $_.id }) }
  else { $SceneKeys = @($dur.PSObject.Properties.Name) }
}
if($SceneKeys.Count -eq 0){
  Write-Host "  (khong doc duoc moc canh - bo qua phan RMS tung canh)" -ForegroundColor Yellow
  & node "$tools\band-rms.mjs" "$Tmp\mix-mono.wav"
  & node "$tools\voice-fingerprint.mjs" "$Tmp\mix-mono.wav"
} else {
  & node "$tools\mix-check.mjs" "$Tmp\mix-stereo.wav" --storyboard $DurFile
  & node "$tools\band-rms.mjs" "$Tmp\mix-mono.wav"
  & node "$tools\voice-fingerprint.mjs" "$Tmp\mix-mono.wav"
}

Write-Host "`n=== 3. HINH ANH (cat frame tu chinh file mp4) ===" -ForegroundColor Cyan
if($SceneKeys.Count -eq 0){
  Write-Host "  (khong co moc canh - cat 6 frame deu)"
  foreach($i in @(5,45,85,125,165,205)){ & $ff -v error -y -ss $i -i $Mp4 -frames:v 1 "$Tmp\frames\t$i.png" }
} else {
  # Cat frame o giua moi canh theo moc thoi gian that cua storyboard
  foreach($k in $SceneKeys){
    $start = 0.0
    if($dur.frames){ $fr = $dur.frames | Where-Object { $_.id -eq $k } | Select-Object -First 1; $start = [double]$fr.start_s; $ln = [double]$fr.duration_s }
    else { $start = 0.0; $ln = 0.0 }
    $sec = [math]::Round($start + ($ln * 0.5), 2)
    & $ff -v error -y -ss $sec -i $Mp4 -frames:v 1 "$Tmp\frames\$k.png"
  }
}
Get-ChildItem "$Tmp\frames\*.png" | Sort-Object Name | ForEach-Object {
  Write-Host "--- $($_.BaseName)" -ForegroundColor DarkGray
  & node "$tools\frame-check.mjs" $_.FullName
}

Write-Host "`nXong kiem tra. Anh cat: $Tmp\frames   Am thanh: $Tmp\mix-mono.wav" -ForegroundColor Green
