---
discussionNumber: 22
category: "Blog"
labels:
  - "Linux"
  - "Environment"
  - "Configuration"
title: "Sub2API 管理员操作手册"
summary: "A practical Sub2API administration guide covering service recovery, container updates, proxy configuration, troubleshooting, and account setup."
---

# Sub2API 管理员操作手册

本文只记录管理员日常需要执行的操作。

> [!IMPORTANT]
>
> 文中的 ***A100 服务器公网 IPv4 地址已进行脱敏处理，***统一以 `222.XX.XX.XX` 表示，完整 IPv4 地址将在 QQ 群内说明。访问服务或执行命令前，请将脱敏占位符替换为实际地址。

## 快速入口

| 要做的事情 | 查看章节 |
| --- | --- |
| 服务器重启后恢复服务 | [1. 启动与恢复](https://www.m0rtzz.com/posts/22#1-启动与恢复) |
| 更新 Sub2API 版本 | [1.5 更新 Sub2API 版本](https://www.m0rtzz.com/posts/22#15-更新-sub2api-版本) |
| 首次部署或修改代理端口 | [2. 配置项目网络](https://www.m0rtzz.com/posts/22#2-配置项目网络) |
| 排查代理探测失败 | [2.5 排查代理探测失败](https://www.m0rtzz.com/posts/22#25-排查代理探测失败) |
| 在 Sub2API 后台添加代理 | [3. 后台配置代理](https://www.m0rtzz.com/posts/22#3-后台配置代理) |
| 更多 | [4. 更多](https://www.m0rtzz.com/posts/22#4-更多) |

## 当前配置

```text
系统账号：collab
项目目录：/data/collab/Projects/sub2api
Compose 文件：deploy/docker-compose.local.yml
平台端口：23434
Clash 端口：127.0.0.1:49872
socat 监听：172.17.0.1:49872
容器代理：http://host.docker.internal:49872
screen 会话：clash
```

注意：

- `collab` 密码、Clash 订阅地址和项目密钥从负责人处获取，不要写入本文或 Git。
- 当前使用 screen 保持 socat 运行。SSH 断开不影响，但服务器重启后需要重新执行第 1 节。
- Clash 保持 `allow-lan: false`，不要把 socat 绑定到 `0.0.0.0`。

## 1. 启动与恢复

### 1.1 登录 collab

```bash
su - collab
```

### 1.2 在 screen 中启动 Clash

```bash
clashoff
clashon
```

测试 Clash：

```bash
curl -sS \
  --proxy http://127.0.0.1:49872 \
  -o /dev/null \
  -w 'HTTP %{http_code}\n' \
  https://github.com/
```

预期输出：

```text
HTTP 200
```

如果是第一次使用 Clash，请参考文档：[HUSTNLP Server Clash 使用教程](https://www.m0rtzz.com/posts/19)。

### 1.3 启动 socat relay

先检查 relay 是否已经运行：

```bash
screen -ls
pgrep -af socat
ss -ltnp | grep 49872
```

如果已经看到下面两个监听，不要重复启动：

```text
127.0.0.1:49872  mihomo
172.17.0.1:49872 socat
```

如果 socat 没有运行，重新进入上一步骤的 screen（开启了 clash 的）：

```bash
screen -r clash
```

在 screen 中执行：

```bash
socat -d -d \
  TCP-LISTEN:49872,bind=172.17.0.1,reuseaddr,fork \
  TCP:127.0.0.1:49872
```

保持 socat 运行，按下面的组合键退出 screen：

```text
先按 Ctrl+a，松开，再按 d
```

以后需要回到该窗口时执行：

```bash
screen -r clash
```

测试 relay：

```bash
curl -sS \
  --proxy http://172.17.0.1:49872 \
  -o /dev/null \
  -w 'HTTP %{http_code}\n' \
  https://github.com/
```

预期输出 `HTTP 200`。

### 1.4 启动 Sub2API

```bash
cd /data/collab/Projects/sub2api/deploy
docker compose -f docker-compose.local.yml up -d --force-recreate
```

检查服务（前端地址格式为 `http://222.XX.XX.XX:23434`，即服务器 IP + 设置的服务端口；请先将脱敏占位符替换为 QQ 群内提供的实际地址）：

```bash
docker compose -f docker-compose.local.yml ps
curl -fsS http://127.0.0.1:23434/health
```

健康接口应输出：

```json
{"status":"ok"}
```

最后从容器测试代理：

```bash
docker exec sub2api sh -lc '
curl -sS \
  --proxy http://host.docker.internal:49872 \
  -o /dev/null \
  -w "HTTP %{http_code}\n" \
  https://github.com/
'
```

预期输出 `HTTP 200`。测试时优先使用 `curl`，不要用 `wget` 判断代理是否正常。

### 1.5 更新 Sub2API 版本

进入部署目录并拉取最新的 Sub2API 镜像，然后仅重新创建 `sub2api` 服务：

```bash
cd /data/collab/Projects/sub2api/deploy

docker compose -f docker-compose.local.yml pull sub2api
docker compose -f docker-compose.local.yml up -d --force-recreate --no-deps sub2api
```

## 2. 配置项目网络

只有首次部署、Clash 端口变化或 relay 地址变化时，才需要执行本节。

### 2.1 确认 host.docker.internal 地址

当前地址是 `172.17.0.1`。运行中的容器可以这样确认：

```bash
docker exec sub2api sh -lc \
  "grep '[[:space:]]host.docker.internal' /etc/hosts"
```

当前预期输出：

```text
172.17.0.1 host.docker.internal
```

如果输出了其他地址，socat 命令中的 `bind=172.17.0.1` 也要改成该地址。

### 2.2 修改 Compose

打开配置文件：

```bash
cd /data/collab/Projects/sub2api
vim deploy/docker-compose.local.yml
```

确认 `sub2api` 服务包含：

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

确认下面三项端口一致：

```yaml
- HTTP_PROXY=${SUB2API_HTTP_PROXY:-http://host.docker.internal:49872}
- HTTPS_PROXY=${SUB2API_HTTPS_PROXY:-http://host.docker.internal:49872}
- UPDATE_PROXY_URL=${UPDATE_PROXY_URL:-http://host.docker.internal:49872}
```

保存后检查 Compose 语法：

```bash
cd /data/collab/Projects/sub2api/deploy
docker compose -f docker-compose.local.yml config --quiet
```

命令没有输出表示语法正常。

### 2.3 应用配置

首次部署，启动全部服务：

```bash
cd /data/collab/Projects/sub2api/deploy
docker compose -f docker-compose.local.yml up -d --force-recreate
```

如果只修改了代理配置，只重新创建 Sub2API 容器：

```bash
docker compose -f docker-compose.local.yml up -d --force-recreate sub2api
```

不需要执行 `docker build`。只执行 `docker restart sub2api` 不能应用新的 Compose 环境变量。

### 2.4 修改端口时需要同步的地方

如果以后将 `49872` 改为其他端口，必须同时修改：

1. Clash mixed 端口。
2. socat 的 `TCP-LISTEN` 和 `TCP:127.0.0.1` 端口。
3. Compose 的 `HTTP_PROXY`、`HTTPS_PROXY`、`UPDATE_PROXY_URL`。
4. Sub2API 管理员控制台“IP 管理”中“VPN”的“端口”。

改完后重新执行第 1.3、1.4 节的测试。

### 2.5 排查代理探测失败

如果出现下面的错误：

```text
all probe URLs failed, last error: proxy connection failed: Get "http://api64.ipify.org?format=json": proxyconnect tcp: dial tcp: lookup host.docker.internal on 127.0.0.11:53: no such host
```

通常是 Clash 端口配置不一致导致的。修改端口时，必须同时修改以下三处：

1. Clash 的 mixed 端口。
2. socat 命令中 `TCP-LISTEN` 和 `TCP:127.0.0.1` 的端口。
3. `docker-compose.local.yml` 中 `HTTP_PROXY`、`HTTPS_PROXY` 和 `UPDATE_PROXY_URL` 的端口。

还需要进入 Sub2API 管理员控制台，在“IP 管理”中编辑“VPN”，将“端口”同步修改为 Clash 使用的端口。修改 Compose 配置后，按照第 2.3 节重新创建 `sub2api` 容器。

如果端口已经一致，但错误中仍然出现 `lookup host.docker.internal`，请按照第 2.1、2.2 节检查 `host.docker.internal` 地址以及 Compose 中的 `extra_hosts` 配置。

## 3. 后台配置代理

Compose 中的全局代理不一定覆盖 AI 网关请求，因此需要在 Sub2API 中给账号绑定代理。

### 3.1 在 IP 管理中添加代理

> [!IMPORTANT]
>
> 修改 Clash 端口后，还必须进入管理员控制台的“IP 管理”，编辑“VPN”，并将“端口”同步修改为 `49872`。

1. 使用管理员账号登录 Sub2API。
2. 进入“IP 管理”。
3. 点击“添加代理”。
4. 名称填写 `host-clash-relay`。
5. 协议选择 `HTTP`。
6. 主机填写 `host.docker.internal`。
7. 端口填写 `49872`。
8. 用户名、密码留空。
9. 保存。
10. 点击“测试连接”或“测试代理”。

测试应显示代理连接正常。不要填写 `127.0.0.1`，因为请求是从 Docker 容器中发出的。

### 3.2 给 AI 账号绑定代理

1. 进入“账号管理”。
2. 添加账号，或编辑已有账号。
3. 在“代理”字段选择 `host-clash-relay`。
4. 保存账号。
5. 如果是 OAuth 账号，在选好代理后完成授权或重新授权。
6. 发起一次真实 AI 请求，确认账号状态和请求日志正常。

OpenAI、Claude、Gemini、Grok 等需要境外访问的账号都应检查代理绑定。

## 4. 更多

更多操作可以参考以下项目文档：

- [Sub2API](https://github.com/Wei-Shaw/sub2api/tree/main)
- [HUSTNLP Server Clash 使用教程](https://www.m0rtzz.com/posts/19)
