#!/bin/bash

# 本地GIF转CSS动画光标脚本
# 使用：./gif-to-cursor.sh /path/to/your/animation.gif

if [ $# -eq 0 ]; then
    echo "错误：未提供GIF文件路径"
    echo "用法：$0 /path/to/your/animation.gif"
    exit 1
fi

GIFPATH="$1"
GIFNAME=$(basename "$GIFPATH")
BASENAME="${GIFNAME%.*}" # 获取不带扩展名的文件名

# 清理文件名：只保留字母、数字和下划线
CLEAN_BASENAME=$(echo "$BASENAME" | tr -cd '[:alnum:]_')
if [ -z "$CLEAN_BASENAME" ]; then
    CLEAN_BASENAME="cursor"
fi

FMT="${CLEAN_BASENAME}_%03d.png"

if [ ! -f "$GIFPATH" ]; then
    echo "错误：文件 $GIFPATH 不存在"
    exit 1
fi

# 验证ImageMagick
if ! command -v convert &> /dev/null; then
    echo "错误：ImageMagick未安装！"
    echo "请先安装："
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    exit 1
fi

# 验证dc计算器
if ! command -v dc &> /dev/null; then
    echo "错误：dc计算器未安装！"
    echo "请先安装："
    echo "  Ubuntu/Debian: sudo apt-get install dc"
    exit 1
fi

echo "正在处理 GIF: $GIFPATH"
echo "生成文件名格式: $FMT"
convert -coalesce "$GIFPATH" $FMT

FRAMES=$(ls ${CLEAN_BASENAME}_*.png 2> /dev/null | wc -l)
if [ "$FRAMES" -eq 0 ]; then
    echo "错误：未能分解GIF帧！可能原因："
    echo "  1. GIF文件格式损坏"
    echo "  2. 生成的文件名格式不正确"
    exit 1
fi

echo "成功分解GIF为 $FRAMES 帧"
INCR=$(echo "4k 100 $FRAMES / p" | dc)

cat <<EOF
/* 
 * 动画光标生成工具
 * 来源: $GIFNAME
 * 生成时间: $(date)
 * 提示: 需要将生成的PNG文件与CSS放置在同一目录
 */
* { 
  animation: cursor 1s infinite; 
  cursor: url(${CLEAN_BASENAME}_000.png), auto; /* 默认帧 */
}
@keyframes cursor {
EOF

for P in $(seq 0 $((FRAMES - 1))); do
    PERCENT=$(echo "15k 100 $FRAMES 1- / $P * 0k 1/ p" | dc)
    printf "  %.2f%% { cursor: url(%s), auto; }\n" "$PERCENT" "$(printf $FMT $P)"
done
echo '}'

echo "生成完成！请将CSS和PNG文件一同使用"