#!/bin/bash

# ==================================================================
# SCRIPT DE COMPRESIÓN DE VIDEOS - ESBELTA
# ==================================================================
# Comprime videos usando FFmpeg con codec H.264 y CRF 28
# Reducción esperada: 75-80% del tamaño original
# ==================================================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎬 Iniciando compresión de videos...${NC}\n"

# Verificar si FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ ERROR: FFmpeg no está instalado${NC}"
    echo "Instala FFmpeg desde: https://ffmpeg.org/download.html"
    echo "O usa el binario en: c:\\Users\\PepitoBillo\\Downloads\\ffmpeg-8.0-essentials_build\\ffmpeg-8.0-essentials_build\\bin\\ffmpeg.exe"
    exit 1
fi

# Directorio de videos
VIDEO_DIR="public/landing-short-invisible/videos"
OUTPUT_DIR="$VIDEO_DIR/compressed"

# Crear directorio de salida si no existe
mkdir -p "$OUTPUT_DIR"

echo -e "${YELLOW}📂 Directorio: $VIDEO_DIR${NC}"
echo -e "${YELLOW}📁 Salida: $OUTPUT_DIR${NC}\n"

# Contador
total=0
success=0
failed=0

# Función para comprimir un video
compress_video() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local output_file="$OUTPUT_DIR/${filename%.mp4}-compressed.mp4"

    # Obtener tamaño original
    local original_size=$(du -h "$input_file" | cut -f1)

    echo -e "${YELLOW}🔄 Procesando: $filename${NC}"
    echo "   Tamaño original: $original_size"

    # Comprimir con FFmpeg
    # -c:v libx264: Codec de video H.264
    # -crf 28: Constant Rate Factor (18=máxima calidad, 28=buena calidad/tamaño)
    # -preset slow: Mejor compresión (más lento pero mejor calidad)
    # -c:a aac: Codec de audio AAC
    # -b:a 128k: Bitrate de audio 128 kbps
    # -movflags +faststart: Optimizar para streaming web

    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -crf 28 \
        -preset slow \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -pix_fmt yuv420p \
        "$output_file" \
        -y \
        -hide_banner \
        -loglevel error

    if [ $? -eq 0 ]; then
        # Obtener tamaño comprimido
        local compressed_size=$(du -h "$output_file" | cut -f1)
        local original_bytes=$(stat -c%s "$input_file" 2>/dev/null || stat -f%z "$input_file")
        local compressed_bytes=$(stat -c%s "$output_file" 2>/dev/null || stat -f%z "$output_file")
        local reduction=$(awk "BEGIN {printf \"%.1f\", (1 - $compressed_bytes / $original_bytes) * 100}")

        echo -e "   ${GREEN}✅ Comprimido: $compressed_size (-$reduction%)${NC}\n"
        ((success++))
    else
        echo -e "   ${RED}❌ Error al comprimir${NC}\n"
        ((failed++))
    fi

    ((total++))
}

# Comprimir todos los videos .mp4 en el directorio
for video in "$VIDEO_DIR"/*.mp4; do
    if [ -f "$video" ]; then
        compress_video "$video"
    fi
done

# Resumen
echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}📊 RESUMEN DE COMPRESIÓN${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "Total procesados: $total"
echo -e "${GREEN}Exitosos: $success${NC}"
if [ $failed -gt 0 ]; then
    echo -e "${RED}Fallidos: $failed${NC}"
fi

# Calcular ahorro total
original_total=$(du -sb "$VIDEO_DIR"/*.mp4 2>/dev/null | awk '{sum+=$1} END {print sum}')
compressed_total=$(du -sb "$OUTPUT_DIR"/*.mp4 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ ! -z "$original_total" ] && [ ! -z "$compressed_total" ]; then
    original_mb=$(awk "BEGIN {printf \"%.1f\", $original_total / 1024 / 1024}")
    compressed_mb=$(awk "BEGIN {printf \"%.1f\", $compressed_total / 1024 / 1024}")
    saved_mb=$(awk "BEGIN {printf \"%.1f\", ($original_total - $compressed_total) / 1024 / 1024}")
    reduction_total=$(awk "BEGIN {printf \"%.1f\", (1 - $compressed_total / $original_total) * 100}")

    echo -e "\n${YELLOW}💾 Ahorro de espacio:${NC}"
    echo -e "   Original: ${original_mb} MB"
    echo -e "   Comprimido: ${compressed_mb} MB"
    echo -e "   ${GREEN}Ahorro: ${saved_mb} MB (-${reduction_total}%)${NC}"
fi

echo -e "\n${GREEN}================================================${NC}"
echo -e "${YELLOW}📝 PRÓXIMOS PASOS:${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "1. Revisar los videos comprimidos en: $OUTPUT_DIR"
echo -e "2. Verificar la calidad de los videos"
echo -e "3. Si están bien, reemplazar los originales:"
echo -e "   ${YELLOW}mv $OUTPUT_DIR/*-compressed.mp4 $VIDEO_DIR/${NC}"
echo -e "4. Renombrar para eliminar '-compressed' del nombre"
echo -e "\n${GREEN}✨ ¡Compresión completada!${NC}\n"
