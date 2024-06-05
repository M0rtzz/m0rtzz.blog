#!/bin/zsh

rm -rf out/ .next/
source /home/m0rtzz/.nvm/nvm.sh
nvm use v18.20.3
pnpm build

remote_user="root"
remote_host="117.72.76.61"

remote_folder_1="/root/Web/m0rtzz.blog/out/"
remote_folder_2="/root/Web/m0rtzz.blog/.next/"

ssh "${remote_user}"@"${remote_host}" "nginx -s stop && echo -e \"\\033[1;32mnginx -s stop success\\033[0m\" || echo -e \"\\033[1;31mnginx -s stop fail\\033[0m\""

ssh "${remote_user}"@"${remote_host}" "cd /root/Web/m0rtzz.blog/ && git pull --rebase"

ssh "${remote_user}"@"${remote_host}" "rm -rf ${remote_folder_1} ${remote_folder_2}"

local_folder="/home/m0rtzz/Workspaces/m0rtzz.blog/out/"

scp -r "${local_folder}" "${remote_user}"@"${remote_host}":"${remote_folder_1}"

ssh "${remote_user}"@"${remote_host}" "nginx && nginx -s reload && echo -e \"\\033[1;32mnginx -s reload success\\033[0m\" || echo -e \"\\033[1;31mnginx -s reload fail\\033[0m\""
