# HUSTNLP NAS 使用说明

实验室 NAS 已挂载至各服务器的：

```plaintext
/nas
```

目前主要目录结构如下：

```plaintext
/nas/
├── Models/
├── Datasets/
├── Users/
└── DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/
    └── HuggingFace/
        ├── assets/
        ├── datasets/
        ├── hub/
        ├── modules/
        └── xet/
```

> [!IMPORTANT]
> 除 Conda 环境外，请尽量将个人代码仓库、实验数据、日志、输出结果以及自行训练或微调产生的模型权重和 Checkpoint 全部放在 `/nas/Users/${USER}` 中。 
>
> 通过 Hugging Face、ModelScope 等平台获取的官方开放模型和公开数据集，如果使用命令行工具显式指定 `local_dir` 下载，则应分别保存到 `/nas/Models` 和 `/nas/Datasets`。代码中按默认方式加载的资源通常会自动进入共享缓存。

## 目录说明

### `/nas/Models`

用于存放实验室成员共享且需要长期使用的模型文件。

通过 Hugging Face CLI、ModelScope 等工具下载官方开放模型，并显式指定 `local_dir` 时，***应将目标位置统一设在该目录下，***例如：

```plaintext
/nas/Models/
├── Qwen/
├── Llama/
├── Mistral/
└── ...
```

如果模型已经存在于 `/nas/Models`，请优先直接使用，***避免重复下载。***

例如，可以按模型组织和名称建立目录：

```shell
huggingface-cli download <组织名>/<模型名> \
  --local-dir /nas/Models/<组织名>/<模型名>

modelscope download --model <组织名>/<模型名> \
  --local_dir /nas/Models/<组织名>/<模型名>
```

这里存放的是官方发布或实验室成员共同使用的开放权重。自行训练、微调或蒸馏产生的权重和 Checkpoint 应存放在 `/nas/Users/${USER}`，不要放入 `/nas/Models`。

> [!TIP]
> 下载大模型前，可以先运行以下命令查看已有模型：
>
> ```shell
> ls /nas/Models
> ```

---

### `/nas/Datasets`

用于存放实验室共享的数据集。

通过 Hugging Face CLI、ModelScope 等工具下载公开数据集，并显式指定 `local_dir` 时，***应将目标位置统一设在：***

```plaintext
/nas/Datasets
```

例如：

```plaintext
/nas/Datasets/
├── HarmBench/
├── AdvBench/
└── ...
```

下载数据集前，请先检查该目录中是否已经存在对应数据：

```shell
ls /nas/Datasets
```

例如：

```shell
huggingface-cli download <组织名>/<数据集名> \
  --repo-type dataset \
  --local-dir /nas/Datasets/<组织名>/<数据集名>

modelscope download --dataset <组织名>/<数据集名> \
  --local_dir /nas/Datasets/<组织名>/<数据集名>
```

个人实验自行生成、清洗或加工的数据仍应放在 `/nas/Users/${USER}` 中。

---

### `/nas/Users/${USER}`

用于存放个人文件、项目代码、实验数据、运行结果以及其他不适合放入公共目录的内容。

`${USER}` 会自动对应当前 Linux 用户名，可以通过以下命令查看：

```shell
echo "${USER}"
```

例如，当前用户名为：

```plaintext
ghost
```

则对应的个人 NAS 目录为：

```plaintext
/nas/Users/ghost
```

可以直接进入：

```shell
cd "/nas/Users/${USER}"
```

建议按照自己的需要建立目录，例如：

```plaintext
/nas/Users/${USER}/
├── Workspaces/
├── Programs/
├── Outputs/
├── Checkpoints/
├── Models/
├── Datasets/
├── Misc/
└── Temp/
```

可以使用以下命令快速创建：

```shell
mkdir -p "/nas/Users/${USER}"/{Workspaces,Programs,Outputs,Checkpoints,Models,Datasets,Misc,Temp}
```

***以下内容原则上都应存放在个人 NAS 目录中：***

- 代码仓库及项目文件
- 实验生成的数据
- 自行训练、微调或蒸馏产生的模型权重和 Checkpoint
- 日志文件
- 训练、评测和推理结果
- 临时处理文件
- 个人使用、不需要全实验室共享的模型或数据集
- 其他占用空间较大的个人文件

> [!NOTE]
> Conda 环境可以继续保存在服务器本地。除 Conda 环境外，建议将其他个人文件尽可能统一放入 `/nas/Users/${USER}`。

> [!WARNING]
> 自行训练的模型权重、Checkpoint、实验数据和输出通常占用大量空间。请将其存放在 `/nas/Users/${USER}`，不要长期保存在服务器本地的 `${HOME}`  中，以免占满本地磁盘并影响其他用户。

#### 在主目录中创建软连接

为了方便访问，可以在自己的主目录中创建指向个人 NAS 目录的软连接。

推荐将软连接命名为 `nas`：

```shell
ln -s "/nas/Users/${USER}" "${HOME}/nas"
```

之后可以直接使用：

```shell
cd "${HOME}/nas"
```

也可以先进入主目录，再执行简写命令：

```shell
cd ${HOME}
ln -s "/nas/Users/${USER}"
```

后一种写法会使用源目录的名称作为软连接名称。例如用户名为 `ghost` 时，将创建：

```plaintext
${HOME}/ghost -> /nas/Users/ghost
```

> [!TIP]
> 更推荐显式指定软连接名称：
>
> ```shell
> ln -s "/nas/Users/${USER}" "${HOME}/nas"
> ```
>
> 这样所有用户都可以通过统一的 `${HOME}/nas` 路径访问自己的 NAS 目录。

如果 `${HOME}/nas` 已经存在，请先检查它是什么：

```shell
ls -ld "${HOME}/nas"
```

不要在未确认内容的情况下直接覆盖或删除。

---

### `/nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace`

该目录是实验室统一使用的 Hugging Face 共享缓存：

```plaintext
/nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace
```

服务器已经配置了相关环境变量。因此，正常使用以下 Hugging Face 工具时，缓存会自动写入该目录：

```python
from transformers import AutoModel
from datasets import load_dataset
```

例如，在代码中使用仓库 ID 且不显式指定本地目录时，模型或数据集通常会下载到该共享缓存：

```python
from transformers import AutoModel
from datasets import load_dataset

model = AutoModel.from_pretrained("<组织名>/<模型名>")
dataset = load_dataset("<组织名>/<数据集名>")
```

这与使用 Hugging Face CLI、ModelScope 等工具显式指定 `local_dir` 的情形不同：后者下载的官方开放模型和公开数据集应分别放在 `/nas/Models` 和 `/nas/Datasets`。

#### Hugging Face Token

共享的只是 Hugging Face 缓存，Hugging Face Token 不共享。每位用户的 Token 都保存在各自的 `${HOME}` 中：

```plaintext
${HOME}/.cache/huggingface/token
```

服务器通过以下环境变量明确指定个人 Token 路径：

```shell
HF_TOKEN_PATH="${HOME}/.cache/huggingface/token"
```

系统只将模型、数据集、辅助资源和 Xet 缓存指向 NAS，不设置 `HF_HOME`，从而避免 Token 随缓存进入共享目录。整体关系如下：

```plaintext
模型与仓库缓存  → /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/hub
数据集处理缓存  → /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/datasets
辅助资源缓存    → /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/assets
Xet 缓存        → /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/xet
个人 Token      → ${HOME}/.cache/huggingface/token
```

用户应使用自己的 Linux 账号登录 Hugging Face：

```shell
hf auth login
```

不要使用 `sudo hf auth login`，否则 Token 可能被保存到 `root` 用户的主目录，而不是当前用户的 `${HOME}`。

可以检查 Token 路径是否配置正确，但不要输出 Token 文件内容：

```shell
echo "${HF_TOKEN_PATH}"
ls -l "${HF_TOKEN_PATH}"
hf auth whoami
```

期望 `HF_TOKEN_PATH` 指向：

```plaintext
${HOME}/.cache/huggingface/token
```

> [!WARNING]
> Token 属于个人敏感凭据。不要将 Token 写入代码仓库、实验配置、日志、共享 NAS 目录或聊天记录，也不要将 Token 文件复制到 `/nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace`。

> [!CAUTION]
> Hugging Face Token 只控制从远程仓库下载资源的权限，不控制已经下载到 NAS 后的本地文件读取权限。如有需要，可以不把敏感的 gated/private 模型下载到全员可读的共享缓存或公共模型目录；此类资源可使用权限隔离的个人或项目目录。

当前缓存目录包含：

```plaintext
/nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/
├── assets/
├── datasets/
├── hub/
├── modules/
└── xet/
```

各目录的主要用途如下：

| 目录 | 用途 |
| --- | --- |
| `assets/` | 存放 Hugging Face 相关库生成或下载的辅助资源 |
| `datasets/` | 存放 `datasets` 库处理后的数据集缓存、索引、锁文件及中间结果 |
| `hub/` | 存放从 Hugging Face Hub 下载的模型、数据集和其他仓库快照 |
| `modules/` | 存放动态加载的自定义 Python 模块或远程代码缓存 |
| `xet/` | 存放 Hugging Face Xet 下载机制使用的数据及传输缓存 |

其中常见内容包括：

```plaintext
hub/
├── models--组织名--模型名/
├── datasets--组织名--数据集名/
├── .locks/
└── ...

datasets/
├── 数据集处理缓存/
├── downloads/
├── *.lock
└── ...
```

> [!CAUTION]
> `/nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace` 下的所有文件和目录均由 Hugging Face 工具自动管理。请勿人工创建、复制、上传、修改、移动、重命名、整理或删除其中的任何文件或目录，包括 `.lock` 文件、快照、符号链接和看似重复的文件。***不得将个人文件、说明文档、手动下载的模型或数据集、实验输出以及临时文件放入该目录；***只有 Hugging Face 相关工具在正常运行过程中才能自动在其中创建缓存内容。

尤其不要执行：

```shell
rm -rf /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/*
```

也不要对其子目录执行类似操作，例如：

```shell
rm -rf /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/hub/*
rm -rf /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace/datasets/*
```

手动改动共享缓存可能导致：

- 其他用户正在运行的程序报错
- 模型或数据集缓存损坏
- 文件被重复下载
- 快照中的符号链接失效
- 数据集处理任务无法恢复
- 多进程任务发生锁冲突
- 占用更多 NAS 空间和网络带宽

> [!IMPORTANT]
> 可以通过 Hugging Face 库正常读取和使用共享缓存，但不要把 `hub/`、`datasets/` 等内部缓存路径当作稳定的模型或数据集路径写入项目配置。

请按资源来源和下载方式选择位置：

```plaintext
显式指定 local_dir 下载的官方开放模型 → /nas/Models
显式指定 local_dir 下载的公开数据集   → /nas/Datasets
自行训练的权重、Checkpoint 和实验数据 → /nas/Users/${USER}
代码默认调用产生的 Hugging Face 缓存   → 共享缓存（自动管理）
```

而不是直接依赖共享缓存中的内部目录结构。

---

## 推荐存储规则

| 内容 | 推荐路径 |
| --- | --- |
| 显式指定 `local_dir` 下载的官方开放模型 | `/nas/Models` |
| 显式指定 `local_dir` 下载的公开数据集 | `/nas/Datasets` |
| 个人代码仓库 | `/nas/Users/${USER}/Workspaces` |
| 个人安装的程序、工具及其运行文件 | `/nas/Users/${USER}/Programs` |
| 自行训练或微调完成后整理、导出的最终模型及个人模型权重 | `/nas/Users/${USER}/Models` |
| 自行生成、处理或仅供个人使用的数据集 | `/nas/Users/${USER}/Datasets` |
| 实验结果及日志 | `/nas/Users/${USER}/Outputs` |
| 训练过程中的模型 Checkpoint 及断点续训状态 | `/nas/Users/${USER}/Checkpoints` |
| 其他不便归类的个人文件 | `/nas/Users/${USER}/Misc` |
| 个人临时文件 | `/nas/Users/${USER}/Temp` |
| Conda 环境 | 可保存在服务器本地 |
| Hugging Face 自动缓存 | `/nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace` |
| Hugging Face 个人 Token | `${HOME}/.cache/huggingface/token` |

简单来说：

```plaintext
官方开放模型（显式 local_dir） → /nas/Models
公开数据集（显式 local_dir）   → /nas/Datasets
个人代码、实验数据、自训权重   → /nas/Users/${USER}
Conda 环境                      → 可以保留在服务器本地
代码默认调用产生的 Hugging Face 缓存      → /nas/DO_NOT_EDIT_OR_DELETE_SHARED_CACHE/HuggingFace
Hugging Face 个人 Token                   → ${HOME}/.cache/huggingface/token
```

## 使用建议

在下载较大的模型或数据集之前，请先检查：

```shell
ls /nas/Models
ls /nas/Datasets
```

模型和数据集应按以下规则存放：

- 使用 Hugging Face CLI、ModelScope 等工具显式指定 `local_dir` 下载的官方开放模型，保存至 `/nas/Models`
- 使用上述工具显式指定 `local_dir` 下载的公开数据集，保存至 `/nas/Datasets`
- 自行训练、微调或蒸馏完成后整理、导出的最终模型及个人模型权重，保存至 `/nas/Users/${USER}/Models`
- 训练过程中产生的模型 Checkpoint 及断点续训状态（如模型、优化器和学习率调度器状态），保存至 `/nas/Users/${USER}/Checkpoints`
- 自行生成、处理或仅供个人使用的数据集，保存至 `/nas/Users/${USER}/Datasets`
- 训练、评测和推理结果及日志，保存至 `/nas/Users/${USER}/Outputs`
- 在代码中通过 Hugging Face 仓库 ID 按默认方式加载的资源，通常会自动进入共享缓存，无需手动指定或整理缓存路径
- 不要将 Hugging Face 共享缓存当作个人文件存储目录
- 不要在服务器本地长期保存自行训练的模型权重、Checkpoint 等大文件

训练脚本中的输出路径也建议直接指定到个人 NAS 目录，例如：

```shell
OUTPUT_DIR="/nas/Users/${USER}/Outputs/my_experiment"
CHECKPOINT_DIR="/nas/Users/${USER}/Checkpoints/my_experiment"

mkdir -p "${OUTPUT_DIR}" "${CHECKPOINT_DIR}"
```

> [!TIP]
> 新建项目时，可以直接将代码仓库克隆到 NAS：
>
> ```shell
> cd "/nas/Users/${USER}/Workspaces"
> git clone <repository-url>
> ```

请大家尽量按照上述目录规范使用 NAS，以减少重复文件、方便资源共享，并降低各服务器本地磁盘的存储压力，谢谢大家 :)
