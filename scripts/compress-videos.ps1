# ==================================================================
# SCRIPT DE COMPRESIÓN DE VIDEOS - ESBELTA (PowerShell)
# ==================================================================
# Comprime videos usando FFmpeg con codec H.264 y CRF 28
# Reducción esperada: 75-80% del tamaño original
# ==================================================================

Write-Host "🎬 Iniciando compresión de videos...`n" -ForegroundColor Green

# Ruta a FFmpeg (ajustar según tu instalación)
$ffmpegPath = "c:\Users\PepitoBillo\Downloads\ffmpeg-8.0-essentials_build\ffmpeg-8.0-essentials_build\bin\ffmpeg.exe"

# Verificar si FFmpeg existe
if (-not (Test-Path $ffmpegPath)) {
    Write-Host "❌ ERROR: FFmpeg no encontrado en: $ffmpegPath" -ForegroundColor Red
    Write-Host "Descarga FFmpeg desde: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

# Directorios
$videoDir = "public\landing-short-invisible\videos"
$outputDir = "$videoDir\compressed"

# Crear directorio de salida
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Write-Host "📂 Directorio: $videoDir" -ForegroundColor Yellow
Write-Host "📁 Salida: $outputDir`n" -ForegroundColor Yellow

# Contadores
$total = 0
$success = 0
$failed = 0

# Obtener todos los videos MP4
$videos = Get-ChildItem -Path $videoDir -Filter "*.mp4" -File

if ($videos.Count -eq 0) {
    Write-Host "⚠️ No se encontraron videos en $videoDir" -ForegroundColor Yellow
    exit 0
}

foreach ($video in $videos) {
    $inputFile = $video.FullName
    $outputFile = Join-Path $outputDir ($video.BaseName + "-compressed.mp4")

    # Tamaño original
    $originalSizeMB = [math]::Round($video.Length / 1MB, 2)

    Write-Host "🔄 Procesando: $($video.Name)" -ForegroundColor Yellow
    Write-Host "   Tamaño original: $originalSizeMB MB" -ForegroundColor Gray

    # Comando FFmpeg
    $arguments = @(
        "-i", $inputFile,
        "-c:v", "libx264",
        "-crf", "28",
        "-preset", "slow",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-pix_fmt", "yuv420p",
        $outputFile,
        "-y",
        "-hide_banner",
        "-loglevel", "error"
    )

    # Ejecutar FFmpeg
    $process = Start-Process -FilePath $ffmpegPath -ArgumentList $arguments -Wait -NoNewWindow -PassThru

    if ($process.ExitCode -eq 0) {
        $compressedSize = (Get-Item $outputFile).Length
        $compressedSizeMB = [math]::Round($compressedSize / 1MB, 2)
        $reduction = [math]::Round((1 - ($compressedSize / $video.Length)) * 100, 1)

        $reductionPercent = "$reduction" + "%"
        Write-Host "   ✅ Comprimido: $compressedSizeMB MB (-$reductionPercent)`n" -ForegroundColor Green
        $success++
    } else {
        Write-Host "   ❌ Error al comprimir`n" -ForegroundColor Red
        $failed++
    }

    $total++
}

# Resumen
Write-Host "`n================================================" -ForegroundColor Green
Write-Host "📊 RESUMEN DE COMPRESIÓN" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Total procesados: $total"
Write-Host "Exitosos: $success" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Fallidos: $failed" -ForegroundColor Red
}

# Calcular ahorro total
$originalTotal = (Get-ChildItem -Path "$videoDir\*.mp4" -File | Measure-Object -Property Length -Sum).Sum
$compressedTotal = (Get-ChildItem -Path "$outputDir\*.mp4" -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum

if ($originalTotal -and $compressedTotal) {
    $originalMB = [math]::Round($originalTotal / 1MB, 1)
    $compressedMB = [math]::Round($compressedTotal / 1MB, 1)
    $savedMB = [math]::Round(($originalTotal - $compressedTotal) / 1MB, 1)
    $reductionTotal = [math]::Round((1 - ($compressedTotal / $originalTotal)) * 100, 1)

    Write-Host "`n💾 Ahorro de espacio:" -ForegroundColor Yellow
    Write-Host "   Original: $originalMB MB"
    Write-Host "   Comprimido: $compressedMB MB"
    $reductionTotalPercent = "$reductionTotal" + "%"
    Write-Host "   Ahorro: $savedMB MB (-$reductionTotalPercent)" -ForegroundColor Green
}

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "📝 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Green
Write-Host "1. Revisar los videos comprimidos en: $outputDir"
Write-Host "2. Verificar la calidad de los videos"
Write-Host "3. Si están bien, reemplazar los originales:" -ForegroundColor Yellow
Write-Host "   Move-Item $outputDir\*-compressed.mp4 $videoDir\" -ForegroundColor Cyan
Write-Host "4. Renombrar para eliminar '-compressed' del nombre"
Write-Host "`nCompresion completada!`n" -ForegroundColor Green
