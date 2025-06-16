# 自搭Overleaf

## 克隆仓库

```shell
git clone git@github.com:M0rtzz/overleaf.git

git clone git@github.com:overleaf/toolkit.git overleaf-toolkit
```

## 配置Toolkit

```shell
cd overleaf-toolkit/

# 生成`config/`下的配置文件
bin/init
```

`config/overleaf.rc`

```ini
OVERLEAF_LISTEN_IP=0.0.0.0
OVERLEAF_PORT=8383
```

`config/variables.env`

```ini
OVERLEAF_APP_NAME=M0rtzz Online LaTeX Editor

ENABLE_CONVERSIONS=true

OVERLEAF_TEMPLATE_GALLERY=true
OVERLEAF_NON_ADMIN_CAN_PUBLISH_TEMPLATES=true
OVERLEAF_TEMPLATE_CATEGORIES="academic-journal bibliography book calendar cv formal-letter homework newsletter poster presentation report thesis"

COMPILE_TIMEOUT=1800
COMPILE_BODY_SIZE_LIMIT_MB=250

OVERLEAF_SITE_URL=https://latex.m0rtzz.com
OVERLEAF_NAV_TITLE=M0rtzz Online LaTeX Editor
OVERLEAF_ADMIN_EMAIL=support@example.com
OVERLEAF_EMAIL_FROM_ADDRESS=noreply@example.com
OVERLEAF_EMAIL_SMTP_HOST=smtp.example.com
OVERLEAF_EMAIL_SMTP_PORT=587
OVERLEAF_EMAIL_SMTP_SECURE=false
OVERLEAF_EMAIL_SMTP_IGNORE_TLS=false
OVERLEAF_EMAIL_SMTP_USER=noreply@example.com
OVERLEAF_EMAIL_SMTP_PASS=your_passwd
OVERLEAF_EMAIL_SMTP_TLS_REJECT_UNAUTH=false
```

```shell
tee config/docker-compose.override.yml > /dev/null << EOF
---
services:
    sharelatex:
        image: sharelatex/sharelatex:ext-ce
        volumes:
          - ../config/certs:/overleaf/certs
EOF
```

## 编译镜像

```shell
cd overleaf/
```

`services/web/app/src/Features/User/UserController.js`

```javascript
  if (invitationCode !== "your_invitation_code") {
```

```shell
cd $(git rev-parse --show-toplevel)/service-ce/

make
```

## 创建容器

```shell
cd overleaf-toolkit/

bin/up -d
```

## 配置Nginx

`/etc/nginx/conf.d/overleaf.conf`

```nginx
upstream overleaf {
    server 127.0.0.1:8383;
}

server {
    listen 0.0.0.0:80;
    server_name latex.m0rtzz.com;

    # 将所有 http 请求重定向到 https
    return 301 https://$host$request_uri;
}

server {
    listen 0.0.0.0:443 ssl;
    server_name latex.m0rtzz.com;
    ssl_certificate_key /etc/nginx/ssl/m0rtzz.com/cert.key;
    ssl_certificate /etc/nginx/ssl/m0rtzz.com/fullchain.cer;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;

    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains;";
    server_tokens off;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    client_max_body_size 50M;

    location / {
        proxy_pass http://overleaf;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 3m;
        proxy_send_timeout 3m;
    }
}
```

```shell
nginx -t
```

## 安装完整版TexLive及相关包

```shell
docker exec -it sharelatex bash
```

```shell
sed -i '$a shell_escape = t' /usr/local/texlive/2025/texmf.cnf
```

```shell
cd ~

wget https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet/update-tlmgr-latest.sh

chmod +x update-tlmgr-latest.sh && bash update-tlmgr-latest.sh -- --upgrade

tlmgr option repository https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet

tlmgr update --self --all

tlmgr install scheme-full

apt update -y && apt upgrade -y && apt install -y python3-pygments fonts-noto-color-emoji ttf-mscorefonts-installer && fc-cache
```

## 重启容器

```shell
cd overleaf-toolkit/

bin/stop && bin/start
```

## 删除用户

```shell
docker exec -it mongo bash

mongosh

use sharelatex

db.users.find().pretty()

db.users.remove({ email: "email@example.edu.cn" })
```

