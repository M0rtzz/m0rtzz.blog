#!/bin/zsh

function onCtrlC() {
    exit 1
}

trap 'onCtrlC' INT

echo $'\e[1;32m开始构建静态资源...\e[0m'

rm -rf out/ .next/
source /home/m0rtzz/.nvm/nvm.sh
nvm use v18.20.3
pnpm build || {
    echo $'\e[1;31m静态资源构建失败\e[0m'
    exit 1
}

echo $'\e[1;32m静态资源构建完成\e[0m'

remote_user="root"
remote_host="117.72.76.61"

remote_folder_1="/root/Web/m0rtzz.blog/out/"
remote_folder_2="/root/Web/m0rtzz.blog/.next/"

ssh "${remote_user}"@"${remote_host}" "nginx -s stop && echo $'\e[1;32mnginx -s stop success\e[0m' || echo $'\e[1;31mnginx -s stop fail\e[0m'"

ssh "${remote_user}"@"${remote_host}" "cd /root/Web/m0rtzz.blog/ && git pull --rebase"

echo $'\e[1;32m代码拉取完成\e[0m'

ssh "${remote_user}"@"${remote_host}" "rm -rf ${remote_folder_1} ${remote_folder_2}"

local_folder="/home/m0rtzz/Workspaces/m0rtzz.blog/out/"

echo $'\e[1;32m开始传输静态资源...\e[0m'

scp -r "${local_folder}" "${remote_user}"@"${remote_host}":"${remote_folder_1}"

ssh "${remote_user}"@"${remote_host}" "nginx && nginx -s reload && echo $'\e[1;32mnginx -s reload success\e[0m' || echo $'\e[1;31mnginx -s reload fail\e[0m'"

echo $'\e[1;32m部署完成\e[0m'
