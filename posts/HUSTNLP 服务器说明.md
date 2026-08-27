---
category: "Blog"
labels:
  - "Linux"
  - "Environment"
  - "Configuration"
title: "HUSTNLP 服务器说明"
summary: "A concise overview of the four HUSTNLP servers, ProxyJump access, and IPv4 forwarding through the A100 machine."
---

# HUSTNLP 服务器说明

> [!IMPORTANT]
>
> HUSTNLP 集群共有四台服务器，其中 ***A100 服务器具有固定 IPv4 地址***，另外三台服务器通过交换机与 A100 连接，***没有独立的公网入口。*** 文中的 A100 地址已进行脱敏处理，完整 IPv4 地址将在 QQ 群内说明。
>
> 因此，访问其他三台服务器时，***需要先经过 A100，***可以使用 SSH 的 `ProxyJump`，也可以先登录 A100，再从 A100 登录目标服务器。集群内部的 IPv4 流量统一通过 A100 转发。

服务器连接配置如下：

```sshconfig
Host A100
    HostName 222.XX.XX.XX
    User xzh

Host A6000
    HostName 192.168.10.13
    User xzh
    ProxyJump 100

Host 740
    HostName 192.168.10.12
    User xzh
    ProxyJump 100

Host 3090
    HostName 192.168.10.11
    User xzh
    ProxyJump 100
```

配置完成后，可以直接使用主机别名登录：

```shell
ssh A100    # A100 服务器
ssh A6000   # RTX 6000 服务器
ssh 740     # RTX 4070 服务器
ssh 3090    # RTX 3090 服务器
```

其中，`ProxyJump 100` 表示先通过 A100 建立跳转，再连接对应的内网服务器；`ForwardAgent yes` 用于允许 740 服务器使用本机转发的 SSH Agent。
