#!/usr/bin/env zsh

set -ex

export TZ='Asia/Shanghai' && date "+%Y-%m-%d %H:%M:%S"

function onCtrlC() {
    echo $'\e[1;31m部署中断\e[0m'
    exit 1
}

trap 'onCtrlC' INT

echo $'\e[1;32m开始构建静态资源...\e[0m'

repo_root_dir=$(git rev-parse --show-toplevel)

# inside the GFW
grep -rl --binary-files=without-match "fonts.googleapis.com" "${repo_root_dir}/node_modules" | xargs -r sed -i 's/fonts.googleapis.com/gfonts.aby.pub/g'
grep -rl --binary-files=without-match "fonts.gstatic.com" "${repo_root_dir}/node_modules" | xargs -r sed -i 's/fonts.gstatic.com/gfonts.aby.pub/g'

# outside the GFW
# grep -rl --binary-files=without-match "fonts.googleapis.com" "${repo_root_dir}/node_modules" | xargs -r sed -i 's/fonts.googleapis.com/gfonts.qaq.qa/g'
# grep -rl --binary-files=without-match "fonts.gstatic.com" "${repo_root_dir}/node_modules" | xargs -r sed -i 's/fonts.gstatic.com/gfonts.qaq.qa/g'

echo $'\e[1;32m镜像站URL替换完成\e[0m'

rm -rf out/ .next/

# GitHub Action 不执行
if echo "$(locale)" | grep -q "zh"; then
    source ~/.nvm/nvm.sh
    nvm use v18.20.3
fi
pnpm build || {
    echo $'\e[1;31m静态资源构建失败\e[0m'
    exit 1
}

# find out/ -type f -exec file {} \; | awk -F: '/text/ {print $1}' | while read -r file; do
# sed -i 's/fonts.googleapis.com/gfonts.aby.pub/g' "${file}"
# sed -i 's/fonts.googleapis.com/fonts.loli.net/g' "${file}"
# sed -i 's/fonts.googleapis.com/google-fonts.mirrors.sjtug.sjtu.edu.cn/g' "${file}"
# sed -i 's/fonts.gstatic.com/gfonts.aby.pub/g' "${file}"
# sed -i 's/fonts.gstatic.com/gstatic.loli.net/g' "${file}"
# done

echo $'\e[1;32m静态资源构建完成\e[0m'

zip -r -q out.zip out/

remote_user="root"
remote_host="${CLOUD}"
remote_folder="/root/Web/m0rtzz.blog/"

ssh "${remote_user}"@"${remote_host}" "cd ${remote_folder} && git pull --rebase"

echo $'\e[1;32m代码拉取完成\e[0m'

echo $'\e[1;32m开始传输静态资源...\e[0m'

scp out.zip "${remote_user}"@"${remote_host}":"${remote_folder}"

ssh "${remote_user}"@"${remote_host}" "lsof -i :80 -i :443 | awk 'NR!=1 {print \$2}' | xargs -r kill -9 && echo $'\e[1;32mkill process success\e[0m' || echo $'\e[1;31mkill process fail\e[0m'"

ssh "${remote_user}"@"${remote_host}" "
if pgrep -x nginx > /dev/null; then 
    if nginx -s stop; then 
        echo \$'\e[1;32mnginx -s stop success\e[0m'; 
    else 
        echo \$'\e[1;31mnginx -s stop fail\e[0m'; 
    fi
else 
    echo \$'\e[1;33mnginx is not running\e[0m';
fi
"

ssh "${remote_user}"@"${remote_host}" "rm -rf ${remote_folder}out/ ${remote_folder}.next/"

ssh "${remote_user}"@"${remote_host}" "unzip -o -q ${remote_folder}out.zip -d ${remote_folder} && rm -f ${remote_folder}out.zip && echo $'\e[1;32munzip success\e[0m' || echo $'\e[1;31munzip fail\e[0m'"

ssh "${remote_user}"@"${remote_host}" "gitlab-ctl stop && nginx && nginx -s reload && gitlab-ctl start && echo $'\e[1;32mnginx -s reload success\e[0m' || echo $'\e[1;31mnginx -s reload fail\e[0m'"

rm -f out.zip

echo $'\e[1;32m部署完成\e[0m'
