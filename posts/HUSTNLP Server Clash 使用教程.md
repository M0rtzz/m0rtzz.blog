# HUSTNLP Server Clash 使用教程

本文面向 HUSTNLP 的所有同学。每个人使用自己的订阅、节点、端口和 `mihomo` 进程；不需要 `sudo`，也不会影响其他用户。

> 不要把订阅链接、Web 控制台 secret 或自己的配置目录分享给其他人。订阅链接通常包含可直接使用的 token。

快速配置可直接跳转至[简易图文教程](https://www.m0rtzz.com/posts/19#9-简易图文教程)。

## 1. 首次初始化

登录服务器后执行：

```shell
clashctl init # 首次必须使用；加载 hook 后可用 clashinit
```

`init` 会创建当前用户的私有配置目录，并为当前 shell 注册兼容命令。根据 shell 类型加载一次：

```shell
# Bash
source "${HOME}/.bashrc"

# Z-shell
source "${HOME}/.zshrc"
```

之后可检查命令是否已加载：

```shell
type clashctl
type clashui
clashctl doctor # 或：clashdoctor
```

新开的 Bash/Z-shell 终端会自动加载。`clashctl` 是系统可执行命令，即使尚未加载 shell hook 也可以使用；`clashui`、`clashsub`、`clashnode` 等是兼容函数，必须先加载 shell hook。

兼容别名与主命令的对应关系如下：

| 主命令 | 别名 |
| --- | --- |
| `clashctl on` | `clashon` |
| `clashctl off` | `clashoff` |
| `clashctl status` | `clashstatus` |
| `clashctl ui` | `clashui` |
| `clashctl sub ...` | `clashsub ...` |
| `clashctl node ...` | `clashnode ...` |
| `clashctl tun ...` | `clashtun ...` |
| `clashctl mixin ...` | `clashmixin ...` |
| `clashctl secret` | `clashsecret` |
| `clashctl log` | `clashlog` |
| `clashctl upgrade` | `clashupgrade` |
| `clashctl init` | `clashinit` |
| `clashctl env` | `clashenv` |
| `clashctl doctor` | `clashdoctor` |
| `clashctl migrate` | `clashmigrate` |
| `clashctl uninit` | `clashuninit` |
| `clashctl -h` | `clashhelp` |

下文每个业务命令都同时给出两种写法。别名只在加载 shell hook 后可用。

## 2. 添加和管理订阅

建议为订阅显式指定一个好记且唯一的名称：

```shell
clashctl sub add -n "${USER}" -u 'https://example.com/subscription-token' # 或：clashsub add -n "${USER}" -u 'https://example.com/subscription-token'
```

- `-n` 指定订阅名称。
- `-u` 表示添加后立刻切换到该订阅。
- 如果不指定 `-n`，程序会根据订阅文件名或链接域名生成名称。

查看当前订阅列表：

```shell
clashctl sub ls # 或：clashsub ls
```

列表中的 `*` 表示正在使用的订阅。当前订阅管理以“名称”为唯一标识，不使用数字 ID。

```shell
# 切换订阅
clashctl sub use "${USER}" # 或：clashsub use "${USER}"

# 不带参数时，交互选择并切换订阅
clashctl sub # 或：clashsub

# 更新当前使用的订阅
clashctl sub update # 或：clashsub update

# 更新指定订阅或全部订阅
clashctl sub update "${USER}" # 或：clashsub update "${USER}"
clashctl sub update --all # 或：clashsub update --all

# 重命名或删除订阅
clashctl sub rename "${USER}" 'My Airport Backup' # 或：clashsub rename "${USER}" 'My Airport Backup'
clashctl sub del 'My Airport Backup' # 或：clashsub del 'My Airport Backup'
```

名称中有空格、中文或特殊字符时，始终用单引号包住名称。

## 3. 开启终端代理

加载 shell hook 后，使用：

```shell
clashctl on # 或：clashon
```

它会启动当前用户自己的 `mihomo`，并为**当前终端**设置 `http_proxy`、`https_proxy`、`all_proxy` 等环境变量。验证：

```shell
clashctl status # 或：clashstatus
curl -s http://ip-api.com
```

关闭当前用户的服务并清除当前终端代理变量：

```shell
clashctl off # 或：clashoff
```

代理环境变量只对执行 `clashctl on` 的那个终端生效。新开的终端需要再次执行 `clashctl on`。

### 没有加载 shell hook 时

先启动自己的服务，再由当前 shell 执行导出的环境变量：

```shell
clashctl on # 或：clashon
eval "$(clashctl env)" # 或：eval "$(clashenv)"
```

更推荐执行一次 `source "${HOME}/.bashrc"` 或 `source "${HOME}/.zshrc"`，之后直接使用 `clashctl on/off`。

## 4. 选择节点

先确保服务已经运行：

```shell
clashctl on # 或：clashon
```

交互选择策略组和节点：

```shell
clashctl node # 或：clashnode
```

查看策略组、节点或帮助：

```shell
clashctl node ls # 或：clashnode ls
clashctl node -h # 或：clashnode -h
```

节点选择只会修改当前用户自己的 `mihomo` 实例，不会影响其他同学。

## 5. Web 控制台

执行：

```shell
clashctl ui # 或：clashui
```

命令会显示当前用户控制台的内网地址和公网地址，并自动启动自己的服务。控制台端口按用户独立分配，因此不要把别人的端口当作自己的端口使用。

查看当前控制台 secret：

```shell
clashctl secret # 或：clashsecret
```

首次打开面板时，如页面要求认证，请填入该命令输出的 secret。不要将控制台地址和 secret 一起公开；如果公网地址无法访问，请联系服务器管理员检查防火墙，不要自行修改 `allow-lan`、`bind-address` 或共享安装目录。

## 6. 常用排查命令

```shell
# 当前用户的目录、PID、端口、controller、活动订阅
clashctl doctor # 或：clashdoctor

# 服务状态
clashctl status # 或：clashstatus

# mihomo 日志
clashctl log # 或：clashlog

# 订阅更新日志
clashctl sub log # 或：clashsub log

# 查看所有命令
clashctl -h # 或：clashhelp
clashctl sub -h # 或：clashsub -h
clashctl node -h # 或：clashnode -h
```

提交日志或截图求助时，请先删除订阅 URL、token 和 Web secret。

## 7. 多用户服务器的限制

- system 多用户模式不支持 TUN。请使用 HTTP/SOCKS 环境变量代理，即 `clashctl on`。
- 普通用户不能升级共享 `mihomo` 内核；需要升级时联系管理员。
- 不要执行 `sudo pkill mihomo`、`pkill mihomo` 或系统级 `systemctl stop mihomo`。请使用 `clashctl off`，它只停止你自己的实例。
- 不要修改 `/usr/local/lib/clashctl`、`/usr/local/bin/clashctl` 或其他用户的 `${HOME}` 目录。

## 8. 常见问题

### `clashui: command not found`

当前 shell 尚未加载 hook。Bash 执行：

```shell
source "${HOME}/.bashrc"
```

Z-shell 执行：

```shell
source "${HOME}/.zshrc"
```

也可先继续使用完整命令 `clashctl ui`。

### `clashctl on` 提示未加载 shell hook

服务已经可以启动，但子进程无法直接修改你的终端环境变量。执行：

```shell
source "${HOME}/.bashrc"
clashctl on # 或：clashon
```

或者执行：

```shell
eval "$(clashctl env)" # 或：eval "$(clashenv)"
```

### 订阅更新失败

先查看订阅日志：

```shell
clashctl sub log # 或：clashsub log
```

确认订阅链接仍然有效，再重试：

```shell
clashctl sub update # 或：clashsub update
```

### 要清理自己的所有数据

以下命令会停止并删除**当前用户**的配置、订阅和日志，不会删除共享程序，也不会影响其他用户：

```shell
clashctl uninit # 或：clashuninit
```

非交互脚本中才使用：

```shell
clashctl uninit --yes # 或：clashuninit --yes
```

## 9. 简易图文教程

### A100 教程

首先连接服务器后执行初始化：

```shell
clashctl init

# Bash
source ~/.bashrc

# Z-shell
source ~/.zshrc
```

添加和应用订阅：

```shell
clashsub add -n "${USER}" -u 'https://example.com/subscription-token'
clashsub ls
clashsub use "${USER}"
```

查看自己的端口和密码：

![image-20260819165618508](https://static.m0rtzz.com/images/Year:2026/Month:08/Day:19/16:56:18_image-20260819165618508.png)

然后输入主机、端口、密码并登录：

![image-20260819165637079](https://static.m0rtzz.com/images/Year:2026/Month:08/Day:19/16:56:37_image-20260819165637079.png)

测速并切换节点：

![image-20260819165744659](https://static.m0rtzz.com/images/Year:2026/Month:08/Day:19/16:57:44_image-20260819165744659.png)

### A6000、3090 教程

> [!NOTE]
>
> 因 A6000、3090 通过交换机连接到 A100，二者均无固定 ip，所以需要特殊的 ssh 连接方式转发端口。

#### 这里以 A6000 为例

首先连接服务器后执行初始化：

```shell
clashctl init

# Bash
source ~/.bashrc

# Z-shell
source ~/.zshrc
```

添加和应用订阅：

```shell
clashsub add -n "${USER}" -u 'https://example.com/subscription-token'
clashsub ls
clashsub use "${USER}"
```

查看自己的端口和密码：

![image-20260819171531285](https://static.m0rtzz.com/images/Year:2026/Month:08/Day:19/17:15:31_image-20260819171531285.png)

然后再次使用 ssh 连接服务器并转发端口：

```shell
ssh -N -T \
    -o ExitOnForwardFailure=yes \
    -o ServerAliveInterval=5 \
    -L 9090:127.0.0.1:9090 \
    -J username@222.20.99.38 \
    username@192.168.10.13

# 或者（前提是配置过 ProxyJump）
ssh -N -T \
    -o ExitOnForwardFailure=yes \
    -o ServerAliveInterval=5 \
    -L 9090:127.0.0.1:9090 \
    A6000 # 别名
```

![image-20260819173508387](https://static.m0rtzz.com/images/Year:2026/Month:08/Day:19/17:35:08_image-20260819173508387.png)

输入主机、端口、密码并登录：

![image-20260819171754478](https://static.m0rtzz.com/images/Year:2026/Month:08/Day:19/17:17:54_image-20260819171754478.png)

同理，测速并切换节点：

![image-20260819172658239](https://static.m0rtzz.com/images/Year:2026/Month:08/Day:19/17:26:58_image-20260819172658239.png)

> [!TIP]
>
> 3090 使用同样方法，此处不再进行赘述。
