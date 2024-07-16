# Linux版“IDM”—— XDM（Xtreme Download Manager，类Windows-IDM）安装并汉化

在Linux下使用XDM可以像在Winodows里使用IDM一样凭借动态文件分割技术进行文件分段下载。

## 1.下载8.0.18版本软件包

[GitHub_Releases页面](https://github.com/subhra74/xdm-experimental-binaries/releases/tag/8.0.18-beta)

![image-20240204115024426](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/11:51:00_image-20240204115024426.png)

这里以Ubuntu为例，我下载了xdman_gtk_8.0.18_amd64.deb，如是Red Hat及其衍生版本的Linux发行版，如Fedora、CentOS和RHEL等请选择rpm包。

可以使用curl获取：

```bash
sudo apt install curl && curl -L https://github.com/subhra74/xdm-experimental-binaries/releases/download/8.0.18-beta/xdman_gtk_8.0.18_amd64.deb -o xdman_gtk_8.0.18_amd64.deb
```

或使用公益加速源：

```bash
sudo apt install curl && curl -L https://ghproxy.net/https://github.com/subhra74/xdm-experimental-binaries/releases/download/8.0.18-beta/xdman_gtk_8.0.18_amd64.deb -o xdman_gtk_8.0.18_amd64.deb
```

![image-20240204122729232](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/12:27:29_image-20240204122729232.png)

## 2.安装XDM

在下载deb包的位置打开终端输入（别忘了./）：

```bash
sudo apt install ./xdman_gtk_8.0.18_amd64.deb
```

![image-20240204120845679](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/12:08:45_image-20240204120845679.png)

## 3.修改XDM语言为汉语

XDM自带的语言修改没有效果。

![image-20240204121058999](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/12:10:59_image-20240204121058999.png)

在终端输入：

```bash
sudo vi /opt/xdman/Lang/English.txt
```

修改其中内容为以下（官方提供的/opt/xdman/Lang/Chinese simplified.txt里面翻译不全，故使用以下内容）：

```txt
DESC_NEW=新建
DESC_DEL=删除
MENU_PAUSE=暂停
MENU_RESUME=恢复
CTX_OPEN_FILE=打开
CTX_OPEN_FOLDER=打开文件夹
LBL_SEARCH=搜索
TITLE_SETTINGS=设置
MENU_DELETE_COMPLETED=删除已完成的下载
MENU_IMPORT=导入
MENU_EXPORT=导出
MENU_EXIT=退出
MENU_UPDATE=检查更新
MENU_ABOUT=关于XDM
LBL_REPORT_PROBLEM=报告问题
LBL_SUPPORT_PAGE=帮助和支持
MENU_DELETE_DWN=删除下载
LBL_NEW_DOWNLOAD=新下载
LBL_MENU=菜单
SETTINGS_MONITORING=浏览器监控
ALL_UNFINISHED=未完成
ALL_FINISHED=完成
CAT_DOCUMENTS=文档
CAT_COMPRESSED=压缩
CAT_MUSIC=音乐
CAT_VIDEOS=视频
CAT_PROGRAMS=应用程序
LBL_VIDEO_DOWNLOAD=视频下载
MENU_BATCH_DOWNLOAD=批量下载
DESC_Q_TITLE=队列和调度程序
CTX_SAVE_AS=另存为
CTX_COPY_URL=复制URL
CTX_COPY_FILE=复制文件
MENU_REFRESH_LINK=刷新链接
LBL_SHOW_PROGRESS=显示进度
MENU_PROPERTIES=属性
MENU_RESTART=重新启动
Q_SCHEDULE_TXT=调度程序
Q_MOVE_TO=移至队列
SORT_NAME=名称
SORT_DATE=日期
SORT_SIZE=尺寸
SORT_STATUS=状态
MENU_LANG=语言
MSG_LANG1=选择语言
MSG_LANG2=请注意，更改将在下次启动XDM时生效
MSG_OK=确定
ND_CANCEL=取消
STAT_DOWNLOADING=下载
STAT_STOPPED=已停止
STAT_FINISHED=已完成
ND_ADDRESS=地址
ND_FILE=文件
LBL_SAVE_IN=保存在
ND_IGNORE_URL=不从此地址捕获下载
ND_MORE=更多。。。
ND_DOWNLOAD_LATER=稍后下载
ND_DOWNLOAD_NOW=立即下载
ND_AUTO_CAT=根据文件类型自动选择
BTN_BROWSE=浏览。。。
ND_TITLE=新下载
DESC_ADV_TITLE=高级设置
ND_AUTH=身份验证
DESC_NET4=代理设置
SPEED_LIMIT_TITLE=速度限制
DESC_USER=用户名
DESC_PASS=密码
ND_AUTH_REMEMBER=记住此网站的身份验证
LBL_NET_OPT_DEF=系统默认值
ND_NO_PROXY=无代理
ND_MANUAL_PROXY=手动代理
PROXY_HOST=代理主机
PROXY_PORT=代理端口
DESC_NET7=代理用户名
DESC_NET8=代理密码
ND_SYSTEM_PROXY=打开系统代理设置
MENU_SPEED_LIMITER=限速器
MSG_SPEED_LIMIT=下载速度限制[KB/秒]（0无限制）
MSG_INVALID_PORT=无效端口
MSG_INVALID_URL=下载地址无效或不受支持
MSG_NO_FILE=请输入文件名
LBL_NEW_QUEUE=名称
MSG_DOWNLOAD_FFMPEG=下载FFMPEG？
LBL_QUEUE_OPT3=不使用队列
VID_PASTE_URL=请将视频URL链接粘贴到此处
SETTINGS_ADV=高级设置
VID_CHK=全选
O_VID_FMT=格式
BAT_PATTERN=图案
BAT_LINKS=链接
BAT_SELECT_ITEMS=选择要下载的项目
BAT_PASTE_LINK=请在下面粘贴下载链接
LBL_BATCH_DESC=使用星号通配符下载一组顺序文件（示例http://xdman.sourceforge.net/images/edge*.png）
LBL_BATCH_ASTERISK=将星号替换为
LBL_BATCH_LETTER=字母
LBL_BATCH_NUM=数字
LBL_BATCH_FROM=来自
LBL_BATCH_TO=至
LBL_BATCH_WILDCARD_SIZE=通配符大小
LBL_BATCH_FILE1=第一个文件
LBL_BATCH_FILE2=第二个文件
LBL_BATCH_FILEN=最后一个文件
BAT_LEADING_ZERO=使用前导零
BAT_NO_LINK=无链接
MENU_START_Q=开始队列
DESC_SAVE_Q=保存
Q_ADD=添加
Q_REMOVE=删除
Q_MOVE_UP=上移
Q_MOVE_DN=向下移动
Q_MOVE_TO=移动到。。。
Q_LIST_FILES=队列中的文件
Q_SCHEDULE_TXT=调度程序
Q_ENABLE=启用调度程序
MSG_Q_START=开始队列
MSG_Q_STOP=停止队列
MSG_Q_DAILY=每日
MSG_Q_D1=周日
MSG_Q_D2=周一
MSG_Q_D3=周二
MSG_Q_D4=周三
MSG_Q_D5=周四
MSG_Q_D6=周五
MSG_Q_D7=周六
SETTINGS_GENERAL=常规设置
SETTINGS_NETWORK=网络设置
SETTINGS_CRED=密码管理器
SETTINGS_ADV=高级设置
DESC_MONITORING_1=请确保浏览器中安装了XDM扩展。要安装浏览器扩展，请单击下面的按钮或直接在浏览器中复制粘贴链接
DESC_OTHER_BROWSERS=XDM还可以通过以下链接集成到其他基于Chromium的浏览器（Vivaldi、Brave浏览器等）或基于Mozilla的浏览器（Icewasel、Waterbox等）中
DESC_CHROME=基于Chromium的浏览器
DESC_MOZ=基于Firefox的浏览器
DESC_FILETYPES=XDM将自动接管以下文件类型的浏览器下载
DESC_DEF=默认值
DESC_VIDEOTYPES=XDM将在浏览器中播放以下视频格式时显示下载选项
LBL_MIN_VIDEO_SIZE=下载大于
DESC_SITEEXCEPTIONS=不自动捕获以下网站的下载
MENU_CLIP_ADD=监控剪贴板
LBL_GET_TIMESTAMP=从服务器获取时间戳
SHOW_DWN_PRG=显示下载进度窗口
SHOW_DWN_COMPLETE=显示下载完成对话框
LBL_START_AUTO=自动开始下载
LBL_OVERWRITE_EXISTING=覆盖现有文件
LBL_TEMP_FOLDER=临时文件夹
MSG_MAX_DOWNLOAD=最大同时下载量
SETTINGS_CAT=下载类别
SETTINGS_CAT_NAME=类别名称
SETTINGS_CAT_TYPES=文件类型
SETTINGS_CAT_FOLDER=下载文件夹
SETTINGS_ATUO_CAT=根据文件类型自动选择下载文件夹
SETTINGS_FOLDER=默认下载文件夹
SETTINGS_DARK_THEME=如果可能，使用深色主题（需要重新启动应用程序）
SETTINGS_CAT_ADD=添加
SETTINGS_CAT_EDIT=编辑
DESC_NET1=连接超时（秒）
DESC_NET2=每次下载的段数
NET_MAX_RETRY=最大重试限制
NET_SYSTEM_PROXY=使用系统代理设置
DESC_HOST=主机/服务器
MSG_HALT=所有下载完成后关闭计算机
MSG_AWAKE=下载期间防止休眠或休眠
EXEC_CMD=在所有下载完成后运行程序
EXE_ANTI_VIR=下载后使用防病毒软件扫描文件
ANTIVIR_CMD=防病毒可执行文件
ANTIVIR_ARGS=命令行参数
AUTO_START=系统启动时启动XDM
LBL_DELETE_FILE=从磁盘删除文件
DEL_SEL_TEXT=是否确实要删除所选下载？
ERR_MSG_FILE_NOT_FOUND_MSG=文件已被移动、重命名或删除
NO_ITEM_SELECTED=请选择要打开的项目
MSG_QUEUE_NAME_MISSING=请指定队列名称
LBL_QUEUE_OPT1=创建新队列
MSG_QUEUE_NAME=队列名称
MSG_QUEUE_SELECT_ITEMS=选择要添加到队列的下载
MSG_DWN_STOP=下载已停止
MSG_NO_SPEED_LIMIT=无速度限制
BTN_STOP_PROCESSING=停止
DWN_HIDE=隐藏
MSG_TIME_LEFT=剩余时间
CD_TITLE=下载完成
REF_WAITING_FOR_LINK=正在等待下载链接。。。
SORT_TYPE=类型
PROP_REFERER=参考
PROP_COOKIE=COOKIE
MSG_HEADERS=标题
OPT_UPDATE_FFMPEG=更新组件
MSG_FAILED=下载失败
MSG_NO_UPDATE=无可用更新/已更新
MSG_UPDATED=更新成功
MSG_ALREADY_RUNNING=旧版本的XDM已在运行
MSG_BROWSER_LAUNCH_FAILED=无法启动
MSG_NATIVE_HOST_FAILED=安装本机主机时出错
MSG_DONT_SHOW_AGAIN=不再显示
MSG_NO_USERNAME=需要用户名
MSG_REF_LINK_MSG=接受新的下载链接
MSG_CATEGORY=类别
MSG_CAT_NAME_MISSING=需要类别名称
MSG_CAT_FILE_TYPES_MISSING=需要文件类型
MSG_CAT_FOLDER_MISSING=需要下载文件夹
MSG_HOST_NAME_MISSING=需要主机名
MSG_QUALITY=质量
MSG_MP3=MP3音频
MSG_TIME=时间
STAT_ASSEMBLING=组装
STAT_WAITING=等待
MSG_UPDATE_AVAILABLE=可用更新
MSG_RESTORE=还原窗口
MSG_DOUBLE_CLICK_ACTION=双击下载项目
MSG_OPEN_FILE=打开文件
MSG_FALLBACK_UA=如果手动添加下载，则使用用户代理
MSG_SAVE_AS_MP3=另存为MP3
MSG_VID_WIKI_TEXT=如果您有兴趣使用XDM从浏览器下载流视频
MSG_VID_WIKI_LINK=请单击此处
NO_REFRESH_LINK=链接刷新不可用于此下载
MSG_NO_VIDEO=未找到视频。然而，可能有其他方式下载视频。有关详细信息，请单击“了解更多”按钮。
MSG_VIDEO_DOWNLOAD_HELP=了解更多信息
MSG_READ_BROWSER_COOKIE=从浏览器读取COOKIE
MSG_SELECT_FOLDER=选择
MSG_IMPORT_DONE=导入完成
MSG_HELPER_TOOLS_MISSING=XDM依赖于名为YT-DLP的开源应用程序（如果YT-DLP不可用，则使用Youtube DL）实现此功能，但XDM找不到其中任何一个。您想了解如何安装它吗？
MSG_FFMPEG_MISSING=XDM依赖于名为FFMPEG的开源多媒体框架，但XDM找不到它。您想了解如何安装它吗？
MSG_YTDLP_DOWNLOAD=XDM依赖名为yt-dlp的开源应用程序实现此功能，请从GitHub存储库下载(https://github.com/yt-dlp/yt-dlp)?
MSG_MEDIA_CAPTURE=媒体抓取器
MSG_DOWNLOAD=下载
MSG_CLEAR=清除
MSG_CLOSE=关闭
MSG_ALWAYS_ON_TOP=始终在顶部
MSG_HOW_TO_USE_MG=如何从浏览器下载流视频
MSG_CHROME_INT=浏览器集成
MSG_PAGE1_TITLE=步骤1/3-浏览器扩展页
MSG_PAGE1_TEXT1=请在浏览器扩展页中启用开发人员模式
MSG_PAGE1_TEXT2=或者转到浏览器菜单->更多工具->扩展以打开扩展页。单击帮助以获取更多信息
MSG_HELP=帮助
MSG_NEXT=下一步
MSG_BACK=返回
MSG_PAGE2_TITLE=步骤2/3-启用开发人员模式
MSG_PAGE2_TEXT1=单击“浏览器扩展”页面中的“加载解压缩”按钮
MSG_PAGE3_TITLE=步骤3/3-安装扩展
MSG_PAGE3_TEXT1=在浏览器文件夹选择窗口中，请选择以下文件夹
MSG_PAGE3_TEXT5=或
MSG_PAGE3_TEXT2=单击浏览器扩展页中的“加载解压缩”按钮。
MSG_PAGE3_TEXT6=在文件选择窗口中，请选择以下文件夹：
MSG_PAGE3_TEXT3=已配置扩展，请重新启动浏览器。
MSG_PAGE3_TEXT4=重要！请关闭所有浏览器窗口。
MSG_SHOW_MEDIA_NOTIFICATION=显示下载视频通知。
MSG_REGISTER_EXT=注册浏览器扩展
MSG_REGISTER_EXT_TEXT=从浏览器扩展页复制粘贴扩展id
MSG_LINUX_EXT1=-请打开
MSG_LINUX_EXT2=-类型chrome://extensions/在地址栏中，按enter键，或者转到浏览器菜单->“更多工具”->“扩展”
MSG_LINUX_EXT3=-检查“开发人员模式”选项
MSG_LINUX_EXT4=-单击“加载解压缩”按钮
MSG_LINUX_EXT5=-将出现文件夹选择窗口，请选择以下文件夹
MSG_LINUX_EXT6=-XDM应用程序将显示一条消息，说明扩展已注册。如果由于某些原因无法正常工作，请从chrome扩展页面复制扩展id并将其粘贴到XDM菜单->“注册扩展”，手动注册扩展
MSG_LINUX_EXT7=-有关详细信息，请访问
MSG_FIELD_BLANK=字段为空
MSG_DOWNLOAD_VIDEO=下载视频
MSG_DWN_VID_DESC=请单击此处下载流视频
MSG_VID_CAP=检测到流视频，请打开媒体抓取器
MSG_KILL_BROWSER=浏览器将被终止
MSG_COPY_PASTE_EXT_URL=请复制粘贴｛0｝中的以下地址以打开扩展页
MSG_EXT_INSTALL_SUCCESS=扩展已成功安装。
MSG_EXT_PIN=请在浏览器工具栏中固定扩展以获得更好的用户体验
MSG_EXT_INSTALL_FAIL=扩展未成功安装，请单击“帮助”按钮了解如何修复它
MSG_COPY=复制
```

可以看到此时已完成汉化（如果无效可`reboot`重启）

![image-20240204121743360](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/12:17:43_image-20240204121743360.png)

## 4.安装对应浏览器扩展

点击设置里面的浏览器监控选择对应浏览器，就会进行插件安装指导。

![image-20240204121923476](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:04/12:19:23_image-20240204121923476.png)
