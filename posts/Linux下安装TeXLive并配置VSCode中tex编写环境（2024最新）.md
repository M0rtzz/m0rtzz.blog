# Linux下安装TeXLive并配置VSCode中tex编写环境（2024最新）

这里我们以Ubuntu为例。

## 1.下载.iso镜像文件

[下载页](https://mirrors.hust.edu.cn/CTAN/systems/texlive/Images/)

![image-20240819171528777](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:19/17:15:28_image-20240819171528777.png)

终端使用curl获取.iso镜像文件：

```bash
sudo apt install curl && curl -L https://mirrors.hust.edu.cn/CTAN/systems/texlive/Images/texlive.iso -o texlive.iso
```

![image-20240819170549234](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:19/17:05:49_image-20240819170549234.png)

**或者使用XDM获取：**

![image-20240819170818452](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:19/17:08:18_image-20240819170818452.png)

*XDM安装教程：*

[https://blog.csdn.net/M0rtzz/article/details/136023863](https://blog.csdn.net/M0rtzz/article/details/136023863)

或：

[https://www.m0rtzz.com/posts/6](https://www.m0rtzz.com/posts/6)

## 2.安装TeXLive

首先安装一个GUI工具包：

```bash
sudo apt install libdigest-perl-md5-perl perl-tk
```

![image-20240329232608535](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:29/23:26:08_image-20240329232608535.png)

在下载iso的目录打开终端：

```bash
sudo chmod 777 texlive.iso
sudo mount -o loop texlive.iso /mnt
cd /mnt
ls
sudo ./install-tl -gui
```

![image-20240204145113354](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:51:13_image-20240204145113354.png)

![image-20240329232410555](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:29/23:24:15_image-20240329232410555.png)

单击`Install`开始安装，显示`Installed`才可点击`Close`。

![image-20240329234051336](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:29/23:40:51_image-20240329234051336.png)

卸载挂载到`/mnt`的镜像：

```bash
cd ~
sudo umount /mnt
```

配置环境变量：

```bash
vi ~/.bashrc
```

在末尾添加以下内容（年份填你的，本文是2024）：

```bash
# LaTeX
export MANPATH=${MANPATH}:/usr/local/texlive/2024/texmf-dist/doc/man
export INFOPATH=${INFOPATH}:/usr/local/texlive/2024/texmf-dist/doc/info
export PATH=${PATH}:/usr/local/texlive/2024/bin/x86_64-linux
```

保存退出

```bash
source ~/.bashrc
```

输入`tex -version`显示版本号即配置成功

![image-20240329234435790](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:29/23:44:35_image-20240329234435790.png)

## 3.配置VSCode

首先安装Perl模块（后边如果使用`latexindent`格式化代码时需要用到，我这里已经提前安装过了）：

```bash
sudo apt update -y && sudo apt install -y cpanminus
```

```bash
sudo cpanm YAML::Tiny
sudo cpanm File::HomeDir
sudo cpanm Unicode::GCString
sudo cpanm Log::Log4perl
sudo cpanm Log::Dispatch
```

![image-20240204134747369](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/13:47:47_image-20240204134747369.png)

安装`tex-fmt`：

```bash
sudo apt install -y cargo && \
mkdir -p ${HOME}/.cargo && \
sudo tee ${HOME}/.cargo/config.toml > /dev/null << EOF
[source.crates-io]
replace-with = 'hustmirror'

[source.hustmirror]
registry = "sparse+https://mirrors.hust.edu.cn/crates.io-index/"
EOF
sudo cargo install tex-fmt && \
echo 'export PATH=${PATH}:${HOME}/.cargo/bin' >> ~/.bashrc
```

打开VSCode，点击侧边栏插件按钮，搜索`LaTeX`，安装下图两个插件：

![image-20240204135028322](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/13:50:28_image-20240204135028322.png)

然后键入`Ctrl+逗号`进入设置页面，单击右上角次按钮进入Json配置文件：

![image-20240204135608750](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/13:56:08_image-20240204135608750.png)

在末尾加入以下内容：

```json
"files.autoSave": "afterDelay", // 自动保存
"editor.formatOnPaste": true, // 粘贴后自动格式化
"editor.formatOnType": true, // 键入后自动格式化
"editor.formatOnSave": true, // 保存时自动格式化
// LaTeX
"latex-workshop.latex.recipes": [
  {
    "name": "xelatex",
    "tools": [
      "xelatex"
    ]
  },
  {
    "name": "pdflatex",
    "tools": [
      "pdflatex"
    ]
  },
  {
    "name": "latexmk",
    "tools": [
      "latexmk"
    ]
  },
  {
    "name": "xelatex -> bibtex -> xelatex*2",
    "tools": [
      "xelatex",
      "bibtex",
      "xelatex",
      "xelatex"
    ]
  }
],
"latex-workshop.latex.tools": [
  {
    "name": "latexmk",
    "command": "latexmk",
    "args": [
      "--shell-escape",
      "-synctex=1",
      "-interaction=nonstopmode",
      "-file-line-error",
      "-pdf",
      "%DOC%"
    ]
  },
  {
    "name": "xelatex",
    "command": "xelatex",
    "args": [
      "--shell-escape",
      "-synctex=1",
      "-interaction=nonstopmode",
      "-file-line-error",
      "%DOC%"
    ]
  },
  {
    "name": "pdflatex",
    "command": "pdflatex",
    "args": [
      "--shell-escape",
      "-synctex=1",
      "-interaction=nonstopmode",
      "-file-line-error",
      "%DOC%"
    ]
  },
  {
    "name": "bibtex",
    "command": "bibtex",
    "args": [
      "%DOCFILE%"
    ]
  }
],
"latex-workshop.latex.clean.fileTypes": [
  "*.acn",
  "*.acr",
  "*.alg",
  "*.aux",
  "*.bbl",
  "*.blg",
  "*.fdb_latexmk",
  "*.fls",
  "*.glg",
  "*.glo",
  "*.gls",
  "*.idx",
  "*.ind",
  "*.ist",
  "*.lof",
  "*.log",
  "*.lot",
  "*.nav",
  "*.out",
  "*.pdfsync",
  "*.pre",
  "*.rubbercache",
  "*.snm",
  "*.synctex",
  "*.synctex(busy)",
  "*.synctex.gz",
  "*.synctex.gz(busy)",
  "*.toc",
  "*.vrb"
],
// 使用"glob"方法清理上述后缀名的文件
"latex-workshop.latex.clean.method": "glob",
// 语法检查
"latex.linter.enabled": false,
// tex文件浏览器，可选项为"none" "browser" "tab" "external"
"latex-workshop.view.pdf.viewer": "tab",
// 自动编译tex文件
"latex-workshop.latex.autoBuild.run": "onSave",
// 显示内容菜单：（1）编译文件；（2）定位游标
"latex-workshop.showContextMenu": true,
// 显示错误
"latex-workshop.message.error.show": true,
// 显示警告
"latex-workshop.message.warning.show": true,
// 从使用的包中自动补全命令和环境
"latex-workshop.intellisense.package.enabled": true,
// 清除辅助文件
"latex-workshop.latex.autoClean.run": "never",
// 设置vscode编译tex文档时的默认编译链
"latex-workshop.latex.recipe.default": "lastUsed",
// 用于反向同步的内部查看器的键绑定。ctrl/cmd + 点击（默认）或双击
"latex-workshop.view.pdf.internal.synctex.keybinding": "double-click",
// "latexindent" "tex-fmt"
"latex-workshop.formatting.latex": "tex-fmt",
// "tex-fmt"参数
"latex-workshop.formatting.tex-fmt.args": [
  "--keep",
  "--tab=4"
]
```

配置完之后侧边栏会出现`TEX`按钮，里面的内容对应了我们刚才的配置：

![image-20240204144520352](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:45:20_image-20240204144520352.png)

新建`.tex`文件，输入：

```tex
\documentclass{article}
\begin{document}

 {\Huge Hello, \LaTeX!}

\end{document}
```

之后点击：

![image-20240204143115049](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:31:15_image-20240204143115049.png)

再点击：

![image-20240204143158321](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:31:58_image-20240204143158321.png)

若正常显示`.pdf`文件，则配置成功

![image-20240204144037612](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:40:37_image-20240204144037612.png)

右键空白处选择`使用...格式化文档`

![image-20240204143432155](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:34:32_image-20240204143432155.png)

选择`LaTeX Workshop`为默认格式化程序：

![image-20240204143534684](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:35:34_image-20240204143534684.png)

这时键入`Ctrl+S`手动保存时，因刚才`.json`文件中设置了`"editor.formatOnSave": true, // 保存时自动格式化`，也安装了Perl模块，这时代码应该会自动格式化。

原先：

![image-20240204144131168](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:41:31_image-20240204144131168.png)

格式化后：

![image-20240204144344447](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/14:43:44_image-20240204144344447.png)
