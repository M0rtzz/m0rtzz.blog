# git commit规范及自动生成CHANGELOG.md

本文以Ubuntu为例。

## 1.卸载旧版本Node.js并安装最新版本

```shell
sudo apt remove nodejs npm
```

```shell
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

检查版本：

```shell
node --version
```

![image-20240409105930459](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/10:59:30_image-20240409105930459.png)

```shell
npm --version
```

![image-20240409104733079](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/11:00:18_image-20240409104733079.png)

## 2.安装相关Package

首先安装淘宝的cnpm代替npm：

```shell
sudo npm install -g cnpm -registry=https://registry.npmmirror.com
```

查看版本：

```shell
cnpm --version
```

![image-20240409105105463](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/10:51:05_image-20240409105105463.png)

```shell
sudo cnpm install -g husky cz-customizable commit-and-tag-version conventional-changelog-cli 
```

```shell
echo '{ "path": "cz-customizable" }' > ~/.czrc
```

## 3.本地创建git仓库

解决Git显示中文文件名为乱码：

```shell
git config --global core.quotepath false
```

忽略文件权限变化：

```shell
git config --global core.filemode false
```

设置默认编辑器为`vim`：

```shell
git config --global core.editor vim
```

```shell
mkdir test-git-commit && cd test-git-commit
git init
```

![image-20240409105753718](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/10:57:53_image-20240409105753718.png)

## 4.远程创建git仓库

![image-20240409105727305](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/10:57:27_image-20240409105727305.png)

初始化仓库：

![image-20240409111419310](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/11:14:19_image-20240409111419310.png)

## 5.创建本地配置文件

```shell
code .
```

![image-20240409111651453](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/11:16:51_image-20240409111651453.png)

新建`.gitignore`、`.cz-config.js`、`test.txt`和`README.md`，内容如下：

---

`.gitignore`：

```ini
.cz-config.js
```

---

`.cz-config.js`：

```js
module.exports = {
    types: [
        {
            value: "✨ feat",
            name: "✨ feat:\tA new feature | 新功能"
        },
        {
            value: "🚧 wip",
            name: "🚧 wip:\tWork in progress | 正在开发中"
        },
        {
            value: "🐛 fix",
            name: "🐛 fix:\tA bug fix | Bug 修复"
        },
        {
            value: "🎨 style",
            name: "🎨 style:\tMarkup, whitespace, formatting, or missing semicolons | 风格"
        },
        {
            value: "💡 comment",
            name: "💡 comment: Comment changes | 注释"
        },
        {
            value: "🚚 path",
            name: "🚚 path:\tMove or rename resources, files, paths, or routes | 移动"
        },
        {
            value: "🔥 remove",
            name: "🔥 remove: Remove files | 移除代码文件"
        },
        {
            value: "⚰️ bury",
            name: "⚰️  bury:\tBury dead code | 埋葬无用代码"
        },
        {
            value: "🔧 config",
            name: "🔧 config: Add or update configuration files | 配置文件"
        },
        {
            value: "🍱 asset",
            name: "🍱 asset: Add or update assets | 资源"
        },
        {
            value: "📸 image",
            name: "📸 image: Add or update images | 图像"
        },
        {
            value: "🔨 script",
            name: "🔨 script: Add or update scripts or the build system | 脚本"
        },
        {
            value: "💩 poop",
            name: "💩 poop:\tLow-quality code that needs improvement | 写了一些屎一样待优化的代码"
        },
        {
            value: "💄 ui",
            name: "💄 ui:\tUpdate UI and style files | 更新 UI"
        },
        {
            value: "🧱 chore",
            name: "🧱 chore:\tBuild process, tooling, or auxiliary maintenance changes | 构建 / 工程依赖 / 工具"
        },
        {
            value: "🚨 lint",
            name: "🚨 lint:\tFix compiler or linter warnings | 编译 / 代码检查工具警告"
        },
        {
            value: "🚑️ hotfix",
            name: "🚑️ hotfix: Critical hotfix | 紧急修复"
        },
        {
            value: "✏️ typo",
            name: "✏️  typo:\tFix typos | 错别字"
        },
        {
            value: "🏷️ type",
            name: "🏷️  type:\tAdd or update types | 增加或更新类型"
        },
        {
            value: "🛂 passport",
            name: "🛂 passport: Authorization, roles, and permissions work | 授权、身份和权限相关"
        },
        {
            value: "🦺 val",
            name: "🦺 val:\tAdd or update validation logic | 验证相关"
        },
        {
            value: "⚓ hook",
            name: "⚓ hook:\tGit hook changes | 钩子"
        },
        {
            value: "🐳 docker",
            name: "🐳 docker: Docker-related changes | Docker 容器相关"
        },
        {
            value: "☸️ k8s",
            name: "☸️  k8s:\tKubernetes-related changes | Kubernetes 相关"
        },
        {
            value: "💫 anim",
            name: "💫 anim: Add or update animations and transitions | 动画和过渡"
        },
        {
            value: "👔 logic",
            name: "👔 logic: Add or update business logic | 业务逻辑"
        },
        {
            value: "💬 text",
            name: "💬 text:\tAdd or update copy, literals, or text content | 文本和文字"
        },
        {
            value: "⚡️ perf",
            name: "⚡️ perf:\tA change that improves performance | 性能优化"
        },
        {
            value: "🗃️ db",
            name: "🗃️  db:\tDatabase-related changes | 数据库相关"
        },
        {
            value: "🧵 thread",
            name: "🧵 thread: Multithreading or concurrency changes | 线程"
        },
        {
            value: "👽️ api",
            name: "👽️ api:\tChanges required by external API updates | API 相关"
        },
        {
            value: "🔐 secret",
            name: "🔐 secret: Secrets-related changes | 秘钥"
        },
        {
            value: "💸 fund",
            name: "💸 fund:\tSponsorship or money-related infrastructure | 资金相关"
        },
        {
            value: "🚀 deploy",
            name: "🚀 deploy: Deployment changes | 部署"
        },
        {
            value: "🚸 usability",
            name: "🚸 usability: Improve user experience or usability | 增强用户体验 / 可用性"
        },
        {
            value: "🌐 i18n",
            name: "🌐 i18n:\tInternationalization changes | 国际化"
        },
        {
            value: "🌐 l10n",
            name: "🌐 l10n:\tLocalization changes | 本地化"
        },
        {
            value: "🔀 merge",
            name: "🔀 merge: Merge branch changes | 合并"
        },
        {
            value: "⏪ revert",
            name: "⏪ revert: Revert changes | 回退"
        },
        {
            value: "🔖 release",
            name: "🔖 release: Create a release commit | 发行版"
        },
        {
            value: "📦 build",
            name: "📦 build:\tBuild system changes | 打包构建"
        },
        {
            value: "🥅 catch",
            name: "🥅 catch:\tAdd or improve error handling | 捕捉错误"
        },
        {
            value: "💚 fix_ci",
            name: "💚 fix_ci: Fix CI build issues | CI 修复"
        },
        {
            value: "👷 ci",
            name: "👷 ci:\tCI-related changes | CI 配置"
        },
        {
            value: "📈 monitor",
            name: "📈 monitor: Add or update analytics, metrics, or tracking | 分析或跟踪"
        },
        {
            value: "♻️ refactor",
            name: "♻️  refactor: Refactor code without adding a feature or fixing a bug | 代码重构"
        },
        {
            value: "🔊 add_log",
            name: "🔊 add_log: Add or update logs | 添加日志"
        },
        {
            value: "🔇 rm_log",
            name: "🔇 rm_log: Remove logs | 移除日志"
        },
        {
            value: "➕ add_dep",
            name: "➕ add_dep: Add a dependency | 添加依赖"
        },
        {
            value: "➖ rm_dep",
            name: "➖ rm_dep: Remove a dependency | 移除依赖"
        },
        {
            value: "⬆️ up_dep",
            name: "⬆️  up_dep: Upgrade a dependency | 升级依赖"
        },
        {
            value: "⬇️ down_dep",
            name: "⬇️  down_dep: Downgrade a dependency | 降级依赖"
        },
        {
            value: "📌 pin_dep",
            name: "📌 pin_dep: Pin dependencies to specific versions | 固定依赖版本"
        },
        {
            value: "✅ test",
            name: "✅ test:\tAdd or update tests | 测试"
        },
        {
            value: "⚗️ exp",
            name: "⚗️  exp:\tExperimental changes | 实验"
        },
        {
            value: "🎉 init",
            name: "🎉 init:\tBegin a project | 初始化"
        },
        {
            value: "🙈 ignore",
            name: "🙈 ignore: Add or update a .gitignore file | 忽略"
        },
        {
            value: "📄 license",
            name: "📄 license: Add or update a license | 证书"
        },
        {
            value: "📝 doc",
            name: "📝 doc:\tDocumentation-only changes | 文档"
        }
    ],
    messages: {
        type: "请选择提交类型 (必填):",
        customScope: "请输入文件修改范围 (可选):",
        subject: "请简要描述提交 (必填):",
        body: "请输入详细描述 (可选):",
        breaking: "列出任何 \x1b[1;31mBREAKING CHANGES\x1b[0m (可选):",
        footer: "请输入要关闭的 \x1b[1;38;5;129missue\x1b[0m (可选):",
        confirmCommit: "确定提交此说明吗？:"
    },
    allowCustomScopes: true,
    allowBreakingChanges: [
        "✨ feat",
        "🐛 fix",
        "🚧 wip",
        "🔥 remove",
        "🚚 path",
        "💩 poop",
        "⏪ revert",
        "➖ rm_dep",
        "➕ add_dep",
        "⬆️ up_dep",
        "⬇️ down_dep",
        "📌 pin_dep"
    ],
    subjectLimit: 100
};
```

---

`test.txt`：

```txt
1
```

---

`README.md`：

```markdown
# FIRST COMMIT
```

---

之后进行`npm init`：

```shell
npm init
```

依次填写即可（注意git远程仓库url不能填错）：

![image-20240409112455334](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/11:24:55_image-20240409112455334.png)

生成`.husky`文件夹：

```shell
husky
```

![image-20240409131309772](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/13:13:09_image-20240409131309772.png)

## 6.修改配置文件

修改`.husky/_/pre_push`：

原先：

```shell
#!/usr/bin/env sh
. "${0%/*}/h"
```

修改后：

```shell
#!/usr/bin/env sh

git pull --rebase || {
    echo "\e[1;31m代码拉取失败\e[0m"
    exit 1
}

echo "\e[1;32m\e[1m代码拉取成功\e[0m"

commit-and-tag-version

# 获取仓库根目录
repo_root_dir=$(git rev-parse --show-toplevel)

# 获取最新的标签
latest_tag_global=$(git describe --tags "$(git rev-list --tags --max-count=1)")

git tag -d "${latest_tag_global}"

updateVersionTag() {
    latest_tag=$(git describe --tags "$(git rev-list --tags --max-count=1)" 2>/dev/null)

    # 使用正则表达式从标签中提取主版本号、次版本号和修订号
    major_version=$(echo "${latest_tag}" | cut -d '.' -f 1 | sed 's/v//')
    minor_version=$(echo "${latest_tag}" | cut -d '.' -f 2)
    patch_version=$(echo "${latest_tag}" | cut -d '.' -f 3)

    # 如果是第一次提交，即没有标签
    if [ -z "${latest_tag}" ]; then
        new_tag="v1.0.0"
        echo "${new_tag}"
        return
    fi

    # 更新版本号
    if [ "${patch_version}" -eq 9 ]; then
        # 如果修订号为 9
        patch_version=0 # 将修订号重置为 0

        # 接下来检查次版本号
        if [ "${minor_version}" -eq 9 ]; then
            # 如果次版本号也为 9
            minor_version=0                      # 将次版本号重置为 0
            major_version=$((major_version + 1)) # 将主版本号加 1
        else
            # 如果次版本号不是 9
            minor_version=$((minor_version + 1)) # 将次版本号加 1
        fi
    else
        # 如果修订号不是 9
        patch_version=$((patch_version + 1)) # 将修订号加 1
    fi

    new_tag="v${major_version}.${minor_version}.${patch_version}"

    # 返回
    echo "${new_tag}"
}

updateVersionInPackageJson() {
    new_version="$1"
    sed -i "s/\"version\": \".*\"/\"version\": \"${new_version}\"/" "${repo_root_dir}/package.json"
}

new_tag=$(updateVersionTag)

updateVersionInPackageJson "${new_tag}"
git add "${repo_root_dir}/package.json"
git commit --amend -m "🔖 tag(package.json): ${new_tag}"

rm "${repo_root_dir}/CHANGELOG.md"
conventional-changelog -i "${repo_root_dir}/CHANGELOG.md" -s -r 0

# 获取当前仓库的远程URL
remote_url=$(git remote -v | grep origin | grep '(fetch)' | awk '{print $2}')

# 处理commit URL
case "${remote_url}" in
*github.com*)
    echo "\e[1;32mRemote URL is from GitHub.\e[0m"
    ;;
*gitee.com*)
    echo "\e[1;32mRemote URL is from Gitee.\e[0m"
    sed -i 's/commits\//commit\//g' "${repo_root_dir}/CHANGELOG.md"
    ;;
*gitcode.com*)
    echo "\e[1;32mRemote URL is from GitCode.\e[0m"
    sed -i 's/commits\//commits\/detail\//g' "${repo_root_dir}/CHANGELOG.md"
    ;;
*)
    echo "\e[1;31mRemote URL is from an unknown source.\e[0m"
    ;;
esac

git add "${repo_root_dir}/CHANGELOG.md"
git commit -m "📝 doc(CHANGELOG.md): automatic update"

git tag -a "${new_tag}" -m "🔖 tag: ${new_tag}"
echo "\e[1;32m更新后的标签为: ${new_tag}\e[0m"
```

## 7.测试

```shell
git add .
```

使用`cz-cust`代替`git commit -m`：

```shell
cz-cust
```

选择`init`：

![image-20240409130252142](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/13:02:52_image-20240409130252142.png)

![image-20240409130354052](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/13:03:54_image-20240409130354052.png)

或者起一个别名：

```shell
sudo vi /etc/profile # 为了使多用户和多Shell解释器同时生效
```

在最后加上：

```shell
alias cz='cz-cust'
```

保存退出：

```shell
source /etc/profile
```

```shell
git log
```

```shell
git push origin --set-upstream --follow-tags -u master
```

可以看到已经自动生成了`CHANGELOG.md`：

![image-20240409131748005](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/13:17:48_image-20240409131748005.png)

此时远程仓库已经更新：

![image-20240409161015571](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/16:10:20_image-20240409161015571.png)

## 8.Tips

之后推送代码可使用以下命令：

```shell
git push --follow-tags && sed -i 's/^/# /' $(git rev-parse --show-toplevel)/.husky/_/pre-push && git push --follow-tags && sed -i 's/^# //' $(git rev-parse --show-toplevel)/.husky/_/pre-push
```
