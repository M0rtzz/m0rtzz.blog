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
sudo npm install -g cnpm -registry=https://registry.npm.taobao.org
```

查看版本：

```shell
cnpm --version
```

![image-20240409105105463](https://static.m0rtzz.com/images/Year:2024/Month:04/Day:09/10:51:05_image-20240409105105463.png)

```shell
sudo cnpm install -g cz-customizable conventional-changelog-cli husky commit-and-tag-version
```

```shell
echo '{ "path": "cz-customizable" }' > ~/.czrc
```

## 3.本地创建git仓库

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
            value: '✨ feat',
            name: '✨ feat:\tA new feature | 新功能'
        },
        {
            value: '🚧 wip',
            name: '🚧 wip:\tWork in progress | 正在开发中'
        },
        {
            value: '🐛 fix',
            name: '🐛 fix:\tA bug fix | Bug 修复'
        },
        {
            value: '🔥 remove',
            name: '🔥 remove:\tRemove code or files | 移除'
        },
        {
            value: '💩 poop',
            name: '💩 poop:\tPoop | 写了一些屎一样待优化的代码'
        },
        {
            value: '🎨 style',
            name: '🎨 style:\tMarkup, white-space, formatting, missing semi-colons... | 风格'
        },
        {
            value: '🔀 merge',
            name: '🔀 merge:\tMerge branch | 合并'
        },
        {
            value: '🔖 release',
            name: '🔖 release:\tCreate a release commit | 发行版'
        },
        {
            value: '🚚 move',
            name: '🚚 move:\tMove or rename resources (e.g.: files, paths, routes) | 移动'
        },
        {
            value: '🔨 script',
            name: '🔨 script:\tAdd or update the build system | 脚本'
        },
        {
            value: '🤖 chore',
            name: '🤖 chore:\tBuild process or auxiliary tool changes | 构建/工程依赖/工具'
        },
        {
            value: '🔧 config',
            name: '🔧 config:\tAdd or update configuration files | 配置文件'
        },
        {
            value: '💄 ui',
            name: '💄 ui:\tUpdated UI and style files | 更新UI'
        },
        {
            value: '🍱 asset',
            name: '🍱 asset:\tAdd or update assets | 资源'
        },
        {
            value: '📸 image',
            name: '📸 image:\tAdd or update images | 图像'
        },
        {
            value: '⚡️ perf',
            name: '⚡️ perf:\tA code change that improves performance | 性能优化'
        },
        {
            value: '🧵 thread',
            name: '🧵 thread:\tAdd or update code related to multithreading or concurrency | 线程'
        },
        {
            value: '➕ add_dep',
            name: '➕ add_dep:\tAdd dep | 添加依赖'
        },
        {
            value: '➖ rm_dep',
            name: '➖ rm_dep:\tRemove dep | 移除依赖'
        },
        {
            value: '⬆️ up_dep',
            name: '⬆️  up_dep:\tUpgrade dep | 升级依赖'
        },
        {
            value: '⬇️ down_dep',
            name: '⬇️  down_dep:\tDowngrade dep | 降级依赖'
        },
        {
            value: '💡 comment',
            name: '💡 comment:\tComment | 注释'
        },
        {
            value: '🔐 secert',
            name: '🔐 secert:\tSecert | 秘钥'
        },
        {
            value: '✅ test',
            name: '✅ test:\tAdding missing tests | 测试'
        },
        {
            value: '🔊 add_log',
            name: '🔊 add_log:\tAdd or update logs | 添加日志'
        },
        {
            value: '🔇 rm_log',
            name: '🔇 rm_log:\tRemove logs | 移除日志'
        },
        {
            value: '♻️ refactor',
            name: '♻️  refactor:\tA code change that neither fixes a bug or adds a feature | 代码重构'
        },
        {
            value: '⏪ revert',
            name: '⏪ revert:\tRevert | 回退'
        },
        {
            value: '📦 build',
            name: '📦 build:\tBuild System | 打包构建'
        },
        {
            value: '👷 ci',
            name: '👷 ci:\tCI related changes | CI 配置'
        },
        {
            value: '🎉 init',
            name: '🎉 init:\tBegin a project | 初始化'
        },
        {
            value: '🙈 ignore',
            name: '🙈 ignore:\tAdd or update a .gitignore file | 忽略'
        },
        {
            value: '📄 license',
            name: '📄 license:\tAdd or update license | 证书'
        },
        {
            value: '📝 docs',
            name: '📝 docs:\tDocumentation only changes | 文档'
        },
    ],
    messages: {
        type: '请选择提交类型(必填):',
        customScope: '请输入文件修改范围(可选):',
        subject: '请简要描述提交(必填):',
        body: '请输入详细描述(可选):',
        breaking: '列出任何\x1b[1;31mBREAKING CHANGES\x1b[0m(可选):',
        footer: '请输入要关闭的issue(可选):',
        confirmCommit: '确定提交此说明吗？:'
    },
    allowCustomScopes: true,
    allowBreakingChanges: ['✨ feat', '🐛 fix', '🚧 wip', '🔥 remove', '🚚 move', '💩 poop', '⏪ revert', '➖ rm_dep', '➕ add_dep','⬆️ up_dep','⬇️ down_dep'],
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

修改`.husky/pre_push`：

原先：

```shell
#!/usr/bin/env sh
. "${0%/*}/h"
```

修改后：

```shell
#!/bin/sh

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
        echo ${new_tag}
        return
    fi

    # 更新版本号逻辑
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

    # 将新标签返回
    echo ${new_tag}
}

updateVersionInPackageJson() {
    new_version="$1"
    sed -i "s/\"version\": \".*\"/\"version\": \"${new_version}\"/" "${repo_root_dir}/package.json"
}

# 调用函数，并将结果赋给变量
new_tag=$(updateVersionTag)

updateVersionInPackageJson "${new_tag}"
git add "${repo_root_dir}/package.json"
git commit --amend -m "🔖 tag(package.json): ${new_tag}"

rm "${repo_root_dir}/CHANGELOG.md"
conventional-changelog -i "${repo_root_dir}/CHANGELOG.md" -s -r 0

# 获取当前本地仓库的远程URL
remote_url=$(git remote -v | grep origin | grep '(fetch)' | awk '{print $2}')

# 根据不同远程仓库处理
case "${remote_url}" in
*github.com*)
    echo "\e[1;32mRemote URL is from GitHub.\e[0m"
    ;;
*gitcode.com*)
    echo "\e[1;32mRemote URL is from GitCode.\e[0m"
    sed -i 's/commits\//commits\/detail\//g' "${repo_root_dir}/CHANGELOG.md"
    ;;
*gitee.com*)
    echo "\e[1;32mRemote URL is from Gitee.\e[0m"
    sed -i 's/commits\//commit\//g' "${repo_root_dir}/CHANGELOG.md"
    ;;
*)
    echo "\e[1;31mRemote URL is from an unknown source.\e[0m"
    ;;
esac

git add "${repo_root_dir}/CHANGELOG.md"
git commit -m "📝 docs(CHANGELOG.md): automatic update"

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
