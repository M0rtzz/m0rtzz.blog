# 关于Ubuntu18.04/20.04安装后的一系列环境配置过程的总结

**Updating（最速更新链接：[博客](https://www.m0rtzz.com/posts/3)）...**

ZZU-SR的童鞋配置环境前可以给我发邮件：[E-mail](mailto:m0rtzz@stu.zzu.edu.cn)

---

本文用到的部分文件打包供无法访问部分网站的童鞋下载【**Updating**】：

链接:

[https://pan.baidu.com/s/1PgmWHKl8oyX_cWYx_uZJrg?pwd=zwz4](https://pan.baidu.com/s/1PgmWHKl8oyX_cWYx_uZJrg?pwd=zwz4)

提取码:

zwz4

--来自百度网盘超级会员v4的分享

## 1.注意

刚进入系统一段时间，系统会通知更新到新版本系统（Ubuntu18.04），选择否，之后会询问是否更新系统组件（大概400mb），选择是。

阻止软件更新弹窗：

打开终端输入：

```bash
sudo chmod a-x /usr/bin/update-notifier
```

将关机时间从90秒换为5秒：

打开终端输入：

```bash
sudo gedit /etc/systemd/system.conf
```

将：

```ini
#DefaultTimeoutStopSec=90s
```

改为：

```ini
DefaultTimeoutStopSec=5s
```

保存退出，打开终端输入：

```bash
sudo systemctl daemon-reload
```

打开终端输入：

```bash
gedit ~/.bashrc
```

```bash
# 在最后（WARNING：如果安装了Anaconda3，需要加在__conda_setup之前）加入如下代码段：
# 显示git分支
function customizePrompt()
{
    local none='\[\033[00m\]'  # 重置所有属性到默认状态
    local green='\[\033[0;32m\]'   # 绿色，用于用户名和主机名
    local user_at_host="${green}\[\033[1m\]\u@\h${none}"  # 用户名和主机名显示为绿色并加粗
    local blue='\[\033[0;34m\]'   # 蓝色，用于当前工作目录
    local git_branch_color='\[\033[1;43;37m\]' # 黄色背景，白色字体，用于git分支
    local command_prompt='$' # 命令提示符

    if [ $UID -eq 0 ]; then
        command_prompt='#'
    fi
    local working_directory="${blue}\[\033[1m\]\w${none}"  # 当前工作目录显示为蓝色并加粗
    # 使用__git_ps1函数来显示当前git分支，使用自定义的颜色
    echo "${user_at_host}:${working_directory}\$(__git_ps1 \" ${git_branch_color}[%s]${none} \")${command_prompt} "
}

export PS1="$(customizePrompt)"


# 复制上一个命令到系统剪切板，sudo apt install xsel
function copyLastCommand()
{
    # fc获取最后执行的命令，echo发送给xsel复制到剪切板
    # -nl以列表形式显示命令历史，但不包括命令编号，-1只获取最近一条命令
    echo -n $(fc -nl -1) | xsel --clipboard --input
}

# 创建一个别名，若与你的其他软件包内置命令冲突，请自行更换别名
alias clc="copyLastCommand"

# 计划关机
function powerOff() {
    sudo shutdown -c # 取消之前的计划关机

    echo "已取消之前的计划关机，下面进行新的计划~"

    echo "请输入关机的年份（YYYY）："
    read shutdown_year

    echo "请输入关机的月份（MM）："
    read shutdown_month

    echo "请输入关机的日期（DD）："
    read shutdown_day

    echo "请输入关机的小时（24小时制，HH）："
    read shutdown_hour

    echo "请输入关机的分钟（MM）："
    read shutdown_minute

    shutdown_datetime="${shutdown_year}-${shutdown_month}-${shutdown_day} ${shutdown_hour}:${shutdown_minute}"

    # 检查日期时间是否合法
    date -d "${shutdown_datetime}" &>/dev/null
    if [ $? -ne 0 ]; then
        echo "Error：请输入合法的日期和时间格式（YYYY-MM-DD HH:MM）"
        return 1
    fi

    # 计算等待时间（秒数）
    current_timestamp=$(date +%s)
    shutdown_timestamp=$(date -d "${shutdown_datetime}" +%s)
    wait_time=$(echo "(${shutdown_timestamp} - ${current_timestamp}) / 60" | bc)

    # 检查是否为未来时间
    if [ ${wait_time} -le 0 ]; then
        echo "Error：请输入未来的日期和时间"
        return 1
    fi

    echo "计划在 ${shutdown_datetime} 关机"
    sudo shutdown -h +${wait_time}
}

alias po="powerOff"

alias pip3='python3 -m pip'
alias pip='python3 -m pip'
```

之后保存退出

```bash
source ~/.bashrc
```

这样就可以更清晰的显示git分支~

## 2.更换国内源

```bash
sudo gedit /etc/apt/sources.list
```

将原本的注释掉，在最下方加入:

```bash
# 华科源（Ubuntu 18.04）【默认注释了源码仓库，如有需要可自行取消注释】
deb https://mirrors.hust.edu.cn/ubuntu/ bionic main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ bionic main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu bionic-security main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu bionic-security main restricted universe multiverse

## 预发布软件源，不建议启用
# deb https://mirrors.hust.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
```

```bash
# 华科源（Ubuntu 20.04）【默认注释了源码仓库，如有需要可自行取消注释】
deb https://mirrors.hust.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ focal main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ focal-updates main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ focal-backports main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu focal-security main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu focal-security main restricted universe multiverse

## 预发布软件源，不建议启用
# deb https://mirrors.hust.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```

```bash
sudo apt update
```

anaconda镜像源（~/.condarc）【**注意替换**`envs_dirs`**中的绝对路径**】:

```yaml
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/pro
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  deepmodeling: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  nvidia: https://mirrors.sustech.edu.cn/anaconda-extra/cloud

envs_dirs:
  - /home/m0rtzz/Programs/anaconda3/envs
```

pip设置镜像源：

```bash
cd ${HOME}/.config/pip/ || (mkdir -p ${HOME}/.config/pip/ && gedit ${HOME}/.config/pip/pip.conf)
```

```ini
[global]
index-url = https://mirrors.hust.edu.cn/pypi/web/simple

extra-index-url =
    https://pypi.tuna.tsinghua.edu.cn/simple
    https://mirrors.bfsu.edu.cn/pypi/web/simple
    https://pypi.nvidia.com
    https://pypi.ngc.nvidia.com

trusted-host =
    mirrors.hust.edu.cn
    pypi.tuna.tsinghua.edu.cn
    mirrors.bfsu.edu.cn
    pypi.nvidia.com
    pypi.ngc.nvidia.com

no-cache-dir = true
```

## 3.设置$HOME下的文件夹为英文

```bash
export LANG=en_US
```

```bash
xdg-user-dirs-gtk-update
```

编辑选择右边的Update Names

![11860bd995624609b10076f25fc108fb.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:25:55_11860bd995624609b10076f25fc108fb.png)

之后执行以下语句：

```bash
export LANG=zh_CN
```

```bash
reboot
```

勾选不要在次询问我，并选择保留旧的名称

![560bffa1f8fd4255a9bec1f2be43efcd.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:58:57_560bffa1f8fd4255a9bec1f2be43efcd.png)

## 4.禁用Nouveau驱动

```bash
sudo gedit /etc/modprobe.d/blacklist.conf
```

在最后输入：

```ini
blacklist nouveau
options nouveau modeset=0
```

保存后关闭，打开终端，输入：

```bash
sudo update-initramfs -u
```

```bash
reboot
```

## 5.安装Nvidia驱动

> [!CAUTION]
>
> 有可能会损坏系统，如果损坏可以重装并看看网上的其他教程，除了这种安装方法还有其他安装方法，但是曾经试过很多种方法，鄙人认为这种方法最快捷且最不容易损坏系统。

打开终端，输入：

```bash
sudo apt install gcc g++ make zlib1g
```

```bash
sudo ubuntu-drivers devices
```

![image-20240219202632909](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:19/20:26:33_image-20240219202632909.png)

寻找带有recommended的版本，输入

```bash
sudo apt install nvidia-driver-your_version nvidia-settings nvidia-prime
```

（your_version是你的版本号）

```bash
sudo apt update
```

```bash
sudo apt upgrade
```

```bash
reboot
```

验证版本

```bash
nvidia-smi
```

![image-20240720105532528](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:55:32_image-20240720105532528.png)

## 6.CUDA安装

[https://developer.nvidia.com/cuda-toolkit-archive](https://developer.nvidia.com/cuda-toolkit-archive)

选择≤上一步nvidia-smi显示的CUDA版本进行安装，官方有教程。

安装好之后打开终端输入

```bash
gedit ~/.bashrc
```

在最后输入

```bash
# cuda
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/local/cuda/lib64
export PATH=${PATH}:/usr/local/cuda/bin
export CUDA_HOME=/usr/local/cuda  #cuda的软连接库,可以设置多版本共存指向
```

保存后关闭，打开终端，输入：

```bash
source ~/.bashrc
```

接下来验证cuda版本：

```bash
nvcc --version
```

![image-20240720105543634](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:55:43_image-20240720105543634.png)

安装成功！

## 7.CUDNN安装

[https://developer.nvidia.com/rdp/cudnn-archive](https://developer.nvidia.com/rdp/cudnn-archive)

官方安装教程（选择合适版本的**NVIDIA cuDNN Installation Guide**，鄙人一般来说会安装和已安装CUDA的发布时间相近的版本进行安装，之前安装PaddlePaddle的时候发现GPU版PaddlePaddle依赖库要求的CUDA工具包版本和CUDNN版本貌似也是这样对应的）：

[https://docs.nvidia.com/deeplearning/cudnn/archives/index.html](https://docs.nvidia.com/deeplearning/cudnn/archives/index.html)

```bash
tar -xvf cudnn-linux-x86_64-8.x.x.x_cudaX.Y-archive.tar.xz
sudo cp cudnn-*-archive/include/cudnn*.h /usr/local/cuda/include
sudo cp -P cudnn-*-archive/lib/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*
```

验证是否安装成功

```bash
cat /usr/local/cuda/include/cudnn_version.h | grep CUDNN_MAJOR -A 2
```

![image-20240720105555452](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:55:55_image-20240720105555452.png)

## 8.安装ROS（有些图忘记截了）

### ①ROS-melodic

**导入Key**

```bash
sudo gpg --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```bash
sudo gpg --export C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654 | sudo tee /usr/share/keyrings/ros.gpg > /dev/null
```

**设置中科大源**

```bash
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/ros.gpg] https://mirrors.ustc.edu.cn/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

```bash
sudo apt update
```

```bash
sudo apt install ros-melodic-desktop-full
```

```bash
echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

```bash
sudo apt install python-rosdep python-rosinstall python-rosinstall-generator python-wstool build-essential
```

```bash
sudo apt install python3-pip
```

使用阿里镜像源加速pip下载：

```bash
sudo pip3 install rosdepc -i https://mirrors.aliyun.com/pypi/simple/
```

```bash
sudo rosdepc init
rosdepc update
```

```bash
sudo chmod 777 -R ~/.ros/
```

```bash
roscore
```

![52b0561164a34d3ea62b74322abe50bc.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:26:21_52b0561164a34d3ea62b74322abe50bc.png)

---

### ②ROS-noetic

**导入Key**

```bash
sudo gpg --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```bash
sudo gpg --export C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654 | sudo tee /usr/share/keyrings/ros.gpg > /dev/null
```

**设置中科大源**

```bash
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/ros.gpg] https://mirrors.ustc.edu.cn/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

```bash
sudo apt update && sudo apt install ros-noetic-desktop-full
```

```bash
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

```bash
sudo apt install python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential
```

```bash
sudo apt install python3-pip
```

使用阿里镜像源加速pip下载：

```bash
sudo pip3 install rosdepc -i https://mirrors.aliyun.com/pypi/simple/
```

```bash
sudo rosdepc init
rosdepc update
```

```bash
sudo chmod 777 -R ~/.ros/
```

```bash
roscore
```

![image-20240219203852347](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:19/20:38:52_image-20240219203852347.png)

---

再新建两个终端，分别输入

```bash
rosrun turtlesim turtlesim_node
```

```bash
rosrun turtlesim turtle_teleop_key
```

在 `rosrun turtlesim turtle_teleop_key`所在终端点击一下任意位置，然后使用↕↔小键盘控制，看小海龟会不会动，如果会动则安装成功

![c40128bd8c5245a48d386c21ba465449.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:26:29_c40128bd8c5245a48d386c21ba465449.png)

## 9.安装opencv-3.4.16和opencv_contrib-3.4.16（Ubuntu18.04），Ubuntu20.04请装opencv-4.2.0及其扩展模块

~~虽然使用cv_bridge时某些shared object有可能和ROS自带的opencv-3.2.0版本冲突，但实测安装3.2.0对cuda的兼容性太差导致无法使用深度相机，所以安装官网最近更新过的OpenCV3.4.16~~

**_经尝试多版本Ubuntu和OpenCV，装Ubuntu20.04，ROS noetic和OpenCV4.2.0及其扩展模块才能解决将彩色图像转换为网络所需的输入Blob后前馈时抛出的（raised OpenCV exception，error: (-215:Assertion failed)等等）。下方OpenCV3的安装步骤仅供参考，OpenCV4.2.0的cmake命令及注意事项在本小节最后！_**

### ①OpenCV3的安装步骤

```bash
git clone -b 3.4.16 https://github.com/opencv/opencv.git opencv-3.4.16
```

或公益加速源：

```bash
git clone -b 3.4.16 https://mirror.ghproxy.com/https://github.com/opencv/opencv.git opencv-3.4.16
```

```bash
cd opencv-3.4.16
```

```bash
git clone -b 3.4.16 https://github.com/opencv/opencv_contrib.git opencv-3.4.16
```

或公益加速源：

```bash
git clone -b 3.4.16 https://mirror.ghproxy.com/https://github.com/opencv/opencv_contrib.git opencv_contrib-3.4.16
```

安装所需依赖库，打开终端，输入：

```bash
sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main"
sudo apt update
sudo apt install libjasper1 libjasper-dev
```

```bash
sudo apt install build-essential cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libdc1394-22-dev liblapacke-dev checkinstall
```

```bash
sudo apt install liblapacke-dev checkinstall
```

进入opencv-3.4.16文件夹，打开终端，输入：

```bash
mkdir build
```

```bash
cd build
```

**接下来编译安装，注意此命令的OPENCV_EXTRA_MODULES_PATH=后边的路径是你电脑下的绝对路径，请自行修改**

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK_2_X=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=YES \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-3.4.16/opencv_contrib-3.4.16/modules \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_FFMPEG=ON \
-D WITH_OPENGL=ON \
-D WITH_NVCUVID=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D CMAKE_EXE_LINKER_FLAGS=-lcblas \
-D WITH_LAPACK=OFF \
-j$(nproc) ..
```

过程中会出现IPPICV: Download: ippicv_2020_lnx_intel64_20191018_general.tgz

解决方法：

```bash
cd ../ && mkdir downloads
```

```bash
cd downloads && pwd
```

![34afaa6be110406889d65e506c8e2a2b](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:58:58_34afaa6be110406889d65e506c8e2a2b.png)

复制绝对路径后：

打开这个ippicv.cmake

![6e9cc239b5a048ef932999f88634f470](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:26:38_6e9cc239b5a048ef932999f88634f470.png)

把绝对路径复制进去：

![e3d64802ff8748d7b5921fdbed6093a3](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:58:59_e3d64802ff8748d7b5921fdbed6093a3.png)

然后把下面网址下载的文件cp进去就行了（或者开头百度云分享链接中自取~）

[https://github.com/opencv/opencv_3rdparty](https://github.com/opencv/opencv_3rdparty)

然后重新打开终端，输入：（**别忘了改路径**）：

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK_2_X=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=YES \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-3.4.16/opencv_contrib-3.4.16/modules \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_FFMPEG=ON \
-D WITH_OPENGL=ON \
-D WITH_NVCUVID=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D CMAKE_EXE_LINKER_FLAGS=-lcblas \
-D WITH_LAPACK=OFF \
-j$(nproc) ..
```

![875eccbb886649e9af1df6fa04c0a168](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:26:49_875eccbb886649e9af1df6fa04c0a168.png)

这些.i文件需要在国外下载，网上说下载好文件直接把他们放进相对应的目录下就行，实测不行（建议科学的上网，想试试网上说法的：

[https://blog.csdn.net/curious_undergather/article/details/111639199](https://blog.csdn.net/curious_undergather/article/details/111639199)

文件的话，开头百度云分享链接里都有)

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK_2_X=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=YES \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-3.4.16/opencv_contrib-3.4.16/modules \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_FFMPEG=ON \
-D WITH_OPENGL=ON \
-D WITH_NVCUVID=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D CMAKE_EXE_LINKER_FLAGS=-lcblas \
-D WITH_LAPACK=OFF \
-j$(nproc) ..
```

![52f9d072a94643efb55ffa119bf1db67](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:58:59_52f9d072a94643efb55ffa119bf1db67.png)

```bash
sudo make -j$(nproc)
```

![image-20240206162428124](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:10/17:34:12_16_24_28_image-20240206162428124.png)

打开那个头文件，把报错所在行改为：

```cpp
#include "lapacke.h"
```

```bash
sudo make -j$(nproc)
```

![e8807dc847184bdd9935739a3a623c75](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:00_e8807dc847184bdd9935739a3a623c75.png)

```bash
sudo make install
```

![325ba9f219904c1abf99cc8924c2374e](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:27:04_325ba9f219904c1abf99cc8924c2374e.png)

```bash
sudo gedit /etc/ld.so.conf.d/opencv.conf
```

加入

```ini
/usr/local/lib
```

保存后关闭，打开终端，输入：

```bash
sudo ldconfig
```

```bash
sudo gedit /etc/bash.bashrc
```

加入

```bash
export PKG_CONFIG_PATH=${PKG_CONFIG_PATH}:/usr/local/lib/pkgconfig
```

保存后关闭，打开终端，输入：

```bash
source /etc/bash.bashrc
```

测试

```bash
cd ../samples/cpp/example_cmake
cmake -j$(nproc) .
sudo make -j$(nproc)
./opencv_example
```

![1cb714361c874eacb01f3bce3f37e1fb.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:00_1cb714361c874eacb01f3bce3f37e1fb.png)

安装成功！

**_设置cv_bridge的版本（ROS-melodic，经实践发现毫无效果）：_**

```bash
sudo gedit /opt/ros/melodic/share/cv_bridge/cmake/cv_bridgeConfig.cmake
```

修改其中的以下内容：

```cmake
# 94行左右
if(NOT "include;/usr/include;/usr/include/opencv " STREQUAL " ") // [!code --]
  set(cv_bridge_INCLUDE_DIRS "") // [!code --]
  set(_include_dirs "include;/usr/include;/usr/include/opencv") // [!code --]
if(NOT "include;/usr/local/include/opencv;/usr/local/include/opencv2 " STREQUAL " ") // [!code ++]
  set(cv_bridge_INCLUDE_DIRS "") // [!code ++]
  set(_include_dirs "include;/usr/local/include/opencv;/usr/local/include/opencv;/usr/local/include/;/usr/include") // [!code ++]

# 119行左右
set(libraries "cv_bridge;/usr/lib/x86_64-linux-gnu/libopencv_core.so.3.2.0;/usr/lib/x86_64-linux-gnu/libopencv_imgproc.so.3.2.0;/usr/lib/x86_64-linux-gnu/libopencv_imgcodecs.so.3.2.0") // [!code --]
set(libraries "cv_bridge;/usr/local/lib/libopencv_core.so.3.4.16;/usr/local/lib/libopencv_imgproc.so.3.4.16;/usr/local/lib/libopencv_imgcodecs.so.3.4.16") // [!code ++]
```

opencv-3.4.4cmake命令：

```bash
cmake -D CMAKE_BUILD_TYPE=BUILD \
-D CMAKE_INSTALL_PREFIX=/usr/local \
-D WITH_GTK_2_X=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=YES \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-3.4.4/opencv_contrib-3.4.4/modules \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D OPENCV_DNN_CUDA=ON \
-D WITH_FFMPEG=ON \
-D WITH_OPENGL=ON \
-D WITH_NVCUVID=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D CMAKE_EXE_LINKER_FLAGS=-lcblas \
-D WITH_LAPACK=OFF \
-D WITH_OPENMP=ON \
-D BUILD_TESTS=OFF \
-D BUILD_opencv_xfeatures2d=ON \
-D CUDA_ARCH_BIN=8.6 \
-D CUDA_GENERATION=Auto \
-D CUDA_HOST_COMPILER:FILEPATH=/usr/bin/gcc-7 \
-j$(nproc) ..
```

### ②OpenCV4.2.0的cmake命令及注意事项（Ubuntu20.04装这个）

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D INSTALL_PYTHON_EXAMPLES=ON \
-D INSTALL_C_EXAMPLES=ON \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-4.2.0/opencv_contrib-4.2.0/modules \
-D WITH_V4L=ON \
-D WITH_QT=ON \
-D WITH_GTK=ON \
-D WITH_VTK=ON \
-D WITH_OPENGL=ON \
-D WITH_OPENMP=ON \
-D BUILD_EXAMPLES=ON \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D OPENCV_DNN_CUDA=ON \
-D BUILD_TIFF=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D OPENCV_ENABLE_NONFREE=ON \
-D CUDA_GENERATION=Auto \
-D CUDA_CUDA_LIBRARY=/usr/local/cuda/lib64/stubs/libcuda.so \
-D CUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda \
-D CUDNN_LIBRARY=/usr/local/cuda/lib64/libcudnn.so \
-D WITH_ADE=OFF ..
```

或：

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D INSTALL_PYTHON_EXAMPLES=ON \
-D INSTALL_C_EXAMPLES=ON \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-4.2.0/opencv_contrib-4.2.0/modules \
-D WITH_V4L=ON \
-D WITH_QT=ON \
-D WITH_GTK=ON \
-D WITH_VTK=ON \
-D WITH_OPENGL=ON \
-D WITH_OPENMP=ON \
-D BUILD_EXAMPLES=ON \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D OPENCV_DNN_CUDA=ON \
-D BUILD_TIFF=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D OPENCV_ENABLE_NONFREE=ON \
-D CUDA_GENERATION=Auto \
-D WITH_ADE=OFF \
-D CUDA_CUDA_LIBRARY=true \
-D CUDA_nppicom_LIBRARY=true \
-j$(nproc) ..
```

或：

```bash
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D INSTALL_PYTHON_EXAMPLES=ON \
-D INSTALL_C_EXAMPLES=ON \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-4.2.0/opencv_contrib-4.2.0/modules \
-D WITH_V4L=ON \
-D WITH_QT=ON \
-D WITH_GTK=ON \
-D WITH_VTK=OFF \
-D WITH_OPENGL=ON \
-D WITH_OPENMP=ON \
-D BUILD_EXAMPLES=ON \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D OPENCV_DNN_CUDA=ON \
-D BUILD_TIFF=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D OPENCV_ENABLE_NONFREE=ON \
-D CUDA_GENERATION=Auto \
-D WITH_ADE=OFF \
-D CUDA_CUDA_LIBRARY=true \
-D CUDNN_LIBRARY=/usr/local/cuda/lib64/libcudnn.so \
-D CUDA_ARCH_BIN= 8.6\
-D CUDA_nppicom_LIBRARY=stdc++ \
-D CUDA_HOST_COMPILER:FILEPATH=/usr/bin/gcc \
-j$(nproc) ..
```

CUDA_ARCH_BIN查看命令：

```bash
sudo apt install mlocate
sudo updatedb.mlocate
$(mlocate deviceQuery | grep cuda | head -n 1)
```

![image-20240206162114753](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/16:21:14_image-20240206162114753.png)

**_（解决CUDNN8编译报错，需手动加入PR代码）_**

[https://github.com/opencv/opencv/pull/17685/files](https://github.com/opencv/opencv/pull/17685/files)

.patch文件可用以下命令下载：

```bash
wget -q --show-progress https://raw.gitcode.com/M0rtzz/opencv4-cudnn8-support-patch/assets/149 -O opencv_PR_17685.patch
```

**_（如果不执行以下几步，编译darknet_ros会报错:error:‘IplImage’之类的）_**

```bash
sudo cp /usr/local/lib/pkgconfig/opencv4.pc /usr/lib/pkgconfig/opencv4.pc
sudo cp /usr/lib/pkgconfig/opencv4.pc /usr/lib/pkgconfig/opencv.pc
```

## 10.安装protobuf2.6.1

```bash
sudo apt install libtool
```

[https://github.com/google/protobuf/releases/download/v2.6.1/protobuf-2.6.1.tar.gz](https://github.com/google/protobuf/releases/download/v2.6.1/protobuf-2.6.1.tar.gz)

或镜像：

```bash
wget -q --show-progress https://raw.gitcode.com/M0rtzz/protobuf-2.6.1/assets/199 -O protobuf-2.6.1.tar.gz
```

解压压缩包后进入文件夹，打开终端，输入：

```bash
./autogen.sh
```

![da01acbb001f42cea9ca08ddad814655.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:01_da01acbb001f42cea9ca08ddad814655.png)

```bash
./configure --prefix=/usr/local/protobuf
```

![1c6a5408dece4f7aa5fb4e78680eb913.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:27:11_1c6a5408dece4f7aa5fb4e78680eb913.png)

```bash
sudo make -j$(nproc)
```

![140562b609004503a731358eea387731.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:27:28_140562b609004503a731358eea387731.png)

养成 `make check`的好习惯

```bash
sudo make check -j$(nproc)
```

![f9827d81f7f946d8ba91d26494c7251d.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:01_f9827d81f7f946d8ba91d26494c7251d.png)

```bash
sudo make install
```

![bf530b0ab13e4939bd810d4731e2764d.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:01_bf530b0ab13e4939bd810d4731e2764d.png)

```bash
sudo gedit /etc/profile
```

在最后加入：

```bash
#protobuf
export PATH=${PATH}:/usr/local/protobuf/bin/export PKG_CONFIG_PATH=${PKG_CONFIG_PATH}:/usr/local/protobuf/lib/pkgconfig/
```

保存后关闭，打开终端，输入：

```bash
source /etc/profile
```

```bash
sudo gedit /etc/ld.so.conf
```

在最后一行输入：

```ini
/usr/local/protobuf/lib
```

保存后关闭，打开终端，输入：

```bash
sudo ldconfig
```

![d80cbadb617b4986a99827d13170e9eb.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:02_d80cbadb617b4986a99827d13170e9eb.png)

最后验证版本：

```bash
protoc --version
```

## 11.配置OpenBLAS

```bash
sudo apt install gcc-arm-linux-gnueabihf libnewlib-arm-none-eabi libc6-dev-i386
```

OpenBLAS源码（非最新）最上方百度网盘里有，或者使用公益加速源：

```bash
git clone https://gitclone.com/github.com/OpenMathLib/OpenBLAS.git OpenBLAS
```

```bash
cd OpenBLAS
```

```bash
sudo apt install gfortran
```

```bash
sudo make FC=gfortran TARGET=ARMV8 -j$(nproc)
```

```bash
sudo make PREFIX=/usr/local install
```

![af045e49e18643d8a1c0c12deb166d44.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:27:35_af045e49e18643d8a1c0c12deb166d44.png)

查看版本

```bash
grep OPENBLAS_VERSION /usr/local/include/openblas_config.h
```

![e76d37851f2e4d08b08c4ac035423cbc.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:02_e76d37851f2e4d08b08c4ac035423cbc.png)

## 12.配置seetaface2工作空间

```bash
gedit ~/.bashrc
```

在最后加入

```bash
source /home/m0rtzz/Workspaces/catkin_ws/devel/setup.bash
```

保存后关闭，打开终端，输入：

```bash
source ~/.bashrc
```

![597806c7f0834400b846b99cae4c9d63.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:02_597806c7f0834400b846b99cae4c9d63.png)

![0bccdd5c978048189fcd47437ad89dfc.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:03_0bccdd5c978048189fcd47437ad89dfc.png)

解决办法：

终端输入：

```bash
gedit ~/.bashrc
```

加入工作空间下lib文件夹的路径

```bash
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/home/m0rtzz/Workspaces/catkin_ws/lib
```

保存后关闭，打开终端，输入：

```bash
source ~/.bashrc
```

![4000fa5374ee48dfbc2fdee5c5ddf2d0.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:27:47_4000fa5374ee48dfbc2fdee5c5ddf2d0.png)

解决！

报错：

```bash
Gtk-Message: 15:22:30.610: Failed to load module "canberra-gtk-module"
```

解决方法：

```bash
sudo apt install libcanberra-gtk*
```

## 13.百度智能云

```bash
sudo apt install curl
```

include jsoncpp库的头文件改为

```cpp
#include "jsoncpp/json/json.h"
```

g++编译

```bash
g++ *.cpp -o * -lcurl -ljsoncpp
```

运行

```bash
./*
```

## 14.使在桌面上右键打开终端时进入Desktop目录（Ubuntu18.04）

[https://packages.ubuntu.com/source/bionic/gnome-terminal](https://packages.ubuntu.com/source/bionic/gnome-terminal)

下载下图表格中的下边两个文件

![ae94b3493cf44d08a7a962e070256653.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:03_ae94b3493cf44d08a7a962e070256653.png)

下载好gnome-terminal_3.28.1.orig.tar.xz文件之后解压出一个文件夹gnome-terminal-3.28.1，将gnome-terminal_3.28.1-1ubuntu1.debian.tar.xz 里面debian目录下的文件解压到之前解压出的gnome-terminal-3.28.1目录下

![5097eb7f2b8b474a8411cf11a3694b55.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:27:55_5097eb7f2b8b474a8411cf11a3694b55.png)

在此目录下打开终端

```bash
git apply patches/*.patch
```

安装依赖

```bash
sudo apt install  intltool  libvte-2.91-dev gsettings-desktop-schemas-dev uuid-dev libdconf-dev libpcre2-dev libgconf2-dev libxml2-utils  gnome-shell libnautilus-extension-dev itstool  yelp-tools pcre2-utils
```

打开src/下的terminal-nautilus.c

找到

```c
static inline gboolean
desktop_opens_home_dir (TerminalNautilus *nautilus)
{
#if 0
  return  _client_get_bool (gconf_client,
                                "/apps/nautilus-open-terminal/desktop_opens_home_dir",
                                NULL);
#endif
  return TRUE;
}
```

改为

```c
static inline gboolean
desktop_opens_home_dir (TerminalNautilus *nautilus)
{
#if 0
  return  _client_get_bool (gconf_client,
                                "/apps/nautilus-open-terminal/desktop_opens_home_dir",
                                NULL);
#endif
  return FALSE;
}
```

src下打开终端

```bash
cd ..
```

```bash
autoreconf --install
```

```bash
autoconf
```

```bash
./configure --prefix='/usr'
```

```bash
sudo make -j$(nproc)
```

```bash
sudo make check -j$(nproc)
```

```bash
sudo make install
```

![83ef9eec20fe4b5991ce5e0d3107d68d.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:03_83ef9eec20fe4b5991ce5e0d3107d68d.png)

```bash
sudo cp /usr/lib/nautilus/extensions-3.0/libterminal-nautilus.so /usr/lib/x86_64-linux-gnu/nautilus/extensions-3.0/
```

```bash
reboot
```

问题解决！

## 15.同步双系统时间

```bash
sudo apt install ntpdate
```

```bash
sudo ntpdate time.windows.com
```

```bash
timedatectl set-local-rtc 1 --adjust-system-clock
```

![c17b8bd812df4e5f86bfba16f5948a9d.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:04_c17b8bd812df4e5f86bfba16f5948a9d.png)

## 16.启动菜单的默认项

```bash
sudo gedit /etc/default/grub
```

改一下GRUB_DEFAULT=后边的数字，默认是0，windows是第n个就设置为 n-1

![2a4260711db540b6af9fd30682dc9257.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:04_2a4260711db540b6af9fd30682dc9257.png)

保存后关闭，打开终端，输入：

```bash
sudo update-grub
```

![cb668a5bf2a84177956f1c6417f5310a.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:05_cb668a5bf2a84177956f1c6417f5310a.png)

```bash
reboot
```

重启后问题解决~

## 17.安装darknet版yolov3及darknet-ros工作空间

```bash
git clone https://github.com/AlexeyAB/darknet.git darknet
```

或公益加速源：

```bash
git clone https://mirror.ghproxy.com/https://github.com/AlexeyAB/darknet.git darknet
```

```bash
cd darknet
```

```bash
sudo gedit Makefile
```

修改以下前几行为：

```makefile
GPU=1
CUDNN=1
CUDNN_HALF=1
OPENCV=1
AVX=0
OPENMP=1
LIBSO=1
ZED_CAMERA=0
ZED_CAMERA_v2_8=0
```

然后修改NVCC=后边为nvcc路径：

```makefile
NVCC=/usr/local/cuda/bin/nvcc
```

![image-20240206170152890](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:01:53_image-20240206170152890.png)

之后保存退出后，打开终端，输入：

```bash
sudo gedit /etc/ld.so.conf.d/cuda.conf
```

加入以下内容后保存退出：

```ini
/usr/local/cuda/lib64
```

打开终端输入：

```bash
sudo ldconfig
```

```bash
sudo make -j$(nproc)
```

```bash
./darknet
```

输出为：

```bash
usage: ./darknet <function>
```

![9e10fa48060244c9972d9db1be8178cb.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:05_9e10fa48060244c9972d9db1be8178cb.png)

之后我们下载yolov3权重文件：

```bash
mkdir weights && cd ./weights && wget -q --show-progress https://pjreddie.com/media/files/yolov3.weights
```

正常wget太慢，我们使用mwget进行安装：

找一个你想安装mwget的地方打开终端，输入：

```bash
sudo apt install build-essential intltool
```

```bash
sudo apt upgrade intltool
```

```bash
sudo apt install libssl-dev
```

之后：

```bash
git clone https://github.com/rayylee/mwget.git mwget
```

或公益加速源：

```bash
git clone https://mirror.ghproxy.com/https://github.com/rayylee/mwget.git mwget
```

```bash
cd mwget
```

```bash
./configure
```

```bash
sudo make -j$(nproc)
```

```bash
sudo make install
```

之后mwget就安装成功了

我们用mwget多线程获取权重文件：

```bash
cd darknet/ && mkdir weights && cd weights/
```

```bash
mwget https://pjreddie.com/media/files/yolov3.weights -n16
```

上方命令是16线程获取 ，速度会快很多

![05ea3530787d45c1b9672559eb8df952.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:05_05ea3530787d45c1b9672559eb8df952.png)

到此为止darknet版yolov3就配置好了

下面我们测试一下：

```bash
./darknet detect cfg/yolov3.cfg weights/yolov3.weights data/dog.jpg
```

输出以下就证明配置没有问题：

![9967309fc02949e98046bf0b4566371b.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:00_9967309fc02949e98046bf0b4566371b.png)

输出的最后一行报错：

```bash
Gtk-Message: 15:22:30.610: Failed to load module "canberra-gtk-module"
```

解决方法：

```bash
sudo apt install libcanberra-gtk*
```

安装之后重新运行就不会报错了。

配置 darknet-ros工作空间：

```bash
mkdir darknet-ros_test_ws && cd darknet-ros_test_ws/ && mkdir src
```

```bash
cd src/ && catkin_init_workspace
```

```bash
cd .. && catkin_make -j$(nproc)
```

```bash
cd src/
```

### ①如果是OpenCV3

```bash
git clone --recursive https://github.com/leggedrobotics/darknet_ros.git darknet_ros
```

或公益加速源：

```bash
git clone --recursive https://mirror.ghproxy.com/https://github.com/leggedrobotics/darknet_ros.git darknet_ros
```

### ①如果是OpenCV4

```bash
git clone -b opencv4 --recursive https://github.com/kunaltyagi/darknet_ros.git darknet_ros
cd darknet_ros
git branch -a
git checkout remotes/origin/opencv4
git submodule update --recursive
```

如果是OpenCV4，视频流只有第一帧是RGB8编码格式，阅读源码后发现在show_image之前调用image.cpp中的rgbgr_image函数循环转换图像编码格式即可解决此问题：

```cpp
// @file : image.cpp
void rgbgr_image(image im)
{
    int i;
    for(i = 0; i < im.w*im.h; ++i){
        float swap = im.data[i];
        im.data[i] = im.data[i+im.w*im.h*2];
        im.data[i+im.w*im.h*2] = swap;
    }
}
```

```cpp
// @file : YoloObjectDetector.cpp
  void *YoloObjectDetector::displayInThread(void *ptr)
  {
    // NOTE: Modified by M0rtzz，Solved the problem of displaying video streams as bgr8
    rgbgr_image(buff_[(buffIndex_ + 1) % 3]);
    int c = show_image(buff_[(buffIndex_ + 1) % 3], "YOLO V3", waitKeyDelay_);
    if (c != -1)
      c = c % 256;
    if (c == 27)
    {
      demoDone_ = 1;
      return 0;
    }
    else if (c == 82)
    {
      demoThresh_ += .02;
    }
    else if (c == 84)
    {
      demoThresh_ -= .02;
      if (demoThresh_ <= .02)
        demoThresh_ = .02;
    }
    else if (c == 83)
    {
      demoHier_ += .02;
    }
    else if (c == 81)
    {
      demoHier_ -= .02;
      if (demoHier_ <= .0)
        demoHier_ = .0;
    }
    return 0;
  }
```

之后：

```bash
cd darknet_ros && sudo rm -rf darknet
```

```bash
git clone https://github.com/AlexeyAB/darknet.git darknet
```

或公益加速源：

```bash
git clone https://mirror.ghproxy.com/https://github.com/AlexeyAB/darknet.git darknet
```

catkin_make如果编译不过的话（error: ‘IplImage’之类的，之前装OpenCV提到过避免报错的方法），注意以下命令是只编译darknet-ros一个包，若工作空间下有多个包需要一起编译那么把命令中的darknet-ros删除重新执行即可：

```bash
catkin_make -j$(nproc) darknet_ros --cmake-args -DCMAKE_CXX_FLAGS=-DCV__ENABLE_C_API_CTORS
```

如果报错nvcc fatal : Unsupported gpu architecture 'compute_30'之类的，是因为CUDA11已经不支持compute_30了，我们将darknet_ros/darknet/Makefile和darknet_ros/darknet_ros/CMakeLists.txt中含有 'compute_30'的行进行注释后重新catkin_make：

![b2175aecc6ec4d489d3b0703e4f9d00d](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:06_b2175aecc6ec4d489d3b0703e4f9d00d.png)

![da1d083fd06f4aed9dd17b0e1446223f](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:06_da1d083fd06f4aed9dd17b0e1446223f.png)

## 18.Azure Kinect SDK-v1.4.0的安装

> [!NOTE]
>
> 鄙人在Ubuntu18.04下是通过源码编译安装的，在Ubuntu20.04下是通过deb包直接安装的。

### ①Ubuntu18.04源码编译安装

**Reference：**

[https://blog.csdn.net/BlacKingZ/article/details/119115883](https://blog.csdn.net/BlacKingZ/article/details/119115883)

```bash
git clone -b v1.4.0 https://github.com/microsoft/Azure-Kinect-Sensor-SDK.git Azure-Kinect-Sensor-SDK-v1.4.0
```

或公益加速源：

```bash
git clone -b v1.4.0 https://mirror.ghproxy.com/https://github.com/microsoft/Azure-Kinect-Sensor-SDK.git Azure-Kinect-Sensor-SDK-v1.4.0
```

```bash
sudo dpkg --add-architecture amd64
```

```bash
sudo apt update
```

```bash
sudo apt install -y  pkg-config  ninja-build doxygen clang  gcc-multilib  g++-multilib python3 nasm cmake libgl1-mesa-dev libsoundio-dev libvulkan-dev libx11-dev libxcursor-dev libxinerama-dev libxrandr-dev libusb-1.0-0-dev libssl-dev libudev-dev mesa-common-dev uuid-dev
```

[https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/libk/](https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/libk/)

从上面的网站下载 `libk4a1.2` 中 `libk4a1.2_1.2.0_amd64.deb`文件

![f806a0d411ac415497e78b45bf3c20ac.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:06_f806a0d411ac415497e78b45bf3c20ac.png)

解压 .deb 文件，再解压内部的 `data.tar.gz`和 `control.tar.gz`文件,并进入data文件夹，打开终端输入：

```bash
cd usr/lib/x86_64-linux-gnu
sudo cp libdepthengine.so.2.0 /usr/lib/x86_64-linux-gnu
```

随后进入下载好的 Azure-Kinect-Sensor-SDK-v1.4.0文件夹下打开终端输入

```bash
mkdir build && cd build
cmake -j$(nproc) .. -GNinja
```

注意此步过程中extern/libyuv/src克隆较慢原因是使用了google的网站，我们把对应文件的克隆url改为github的就能正常克隆了，在Azure-Kinect-Sensor-SDK-v1.4.0文件夹下键盘Ctrl+H显示隐藏文件，打开.gitmodules文件，修改libyuv的部分为：

```ini
[submodule "extern/libyuv/src"]
	path = extern/libyuv/src
	url = https://github.com/lemenkov/libyuv.git
```

保存后关闭

之后打开.git文件夹下的config文件，修改libyuv的部分为：

```ini
[submodule "extern/libyuv/src"]
	active = true
	url = https://github.com/lemenkov/libyuv.git
```

接下来就能正常克隆了，但是速度还是很慢，请耐心等待~

保存后关闭，打开终端，输入：

```bash
cmake -j$(nproc) .. -GNinja
```

克隆完成后为如图所示：

![b07fac22ae4b45ebb3e5a061739a4d87.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:06_b07fac22ae4b45ebb3e5a061739a4d87.png)

之后输入：

```bash
sudo ninja -j$(nproc)
```

完成后如下：

![c625650ae9744c02aea905984da47566.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:07_c625650ae9744c02aea905984da47566.png)

最后输入：

```bash
sudo ninja install
```

完成后如下：

![b71183010a584c469b0a6cbfc72b3e39.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:09_b71183010a584c469b0a6cbfc72b3e39.png)

之后安装依赖：

```bash
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
```

```bash
sudo apt update
```

```bash
sudo gedit /etc/apt/sources.list
```

在最后一行加入：

```bash
## gcc-4.9
deb http://dk.archive.ubuntu.com/ubuntu/ xenial main
deb http://dk.archive.ubuntu.com/ubuntu/ xenial universe
##
```

保存后关闭，打开终端，输入：

```bash
sudo apt update
```

```bash
sudo apt install gcc-4.9
```

```bash
sudo apt upgrade libstdc++6
```

```bash
sudo cp /usr/lib/x86_64-linux-gnu/libk4a1.4/libdepthengine.so.2.0 /usr/lib
```

之后测试一下：

```bash
sudo ./bin/k4aviewer
```

![cd9e9d8ea9884b6eb7c73e864efb7912](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:14_cd9e9d8ea9884b6eb7c73e864efb7912.png)

授予权限：

```bash
cd .. && sudo cp scripts/99-k4a.rules /etc/udev/rules.d
```

如果是.deb包安装，该udev规则文件（99-k4a.rules，将其保存在/etc/udev/rules.d下）内容如下：

```bash
# Bus 002 Device 116: ID 045e:097a Microsoft Corp.  - Generic Superspeed USB Hub
# Bus 001 Device 015: ID 045e:097b Microsoft Corp.  - Generic USB Hub
# Bus 002 Device 118: ID 045e:097c Microsoft Corp.  - Azure Kinect Depth Camera
# Bus 002 Device 117: ID 045e:097d Microsoft Corp.  - Azure Kinect 4K Camera
# Bus 001 Device 016: ID 045e:097e Microsoft Corp.  - Azure Kinect Microphone Array

BUS!="usb", ACTION!="add", SUBSYSTEM!=="usb_device", GOTO="k4a_logic_rules_end"

ATTRS{idVendor}=="045e", ATTRS{idProduct}=="097a", MODE="0666", GROUP="plugdev"
ATTRS{idVendor}=="045e", ATTRS{idProduct}=="097b", MODE="0666", GROUP="plugdev"
ATTRS{idVendor}=="045e", ATTRS{idProduct}=="097c", MODE="0666", GROUP="plugdev"
ATTRS{idVendor}=="045e", ATTRS{idProduct}=="097d", MODE="0666", GROUP="plugdev"
ATTRS{idVendor}=="045e", ATTRS{idProduct}=="097e", MODE="0666", GROUP="plugdev"

LABEL="k4a_logic_rules_end"
```

### ②Ubuntu20.04

> Reference：
>
> [https://blog.csdn.net/qq_42108414/article/details/129015474](https://blog.csdn.net/qq_42108414/article/details/129015474)

## 19.配置科大讯飞

[https://www.xfyun.cn/sdk/dispatcher](https://www.xfyun.cn/sdk/dispatcher)

```bash
sudo apt install sox libsox-fmt-all pavucontrol
```

```bash
sudo gedit /usr/include/pcl-1.8/pcl/visualization/cloud_viewer.h
```

修改一下：

```cpp
//line 199左右
private:
        /** \brief Private implementation. */
        struct CloudViewer_impl;
        //std::auto_ptr<CloudViewer_impl> impl_;
        std::shared_ptr<CloudViewer_impl> impl_;

        boost::signals2::connection
        registerMouseCallback (boost::function<void (const pcl::visualization::MouseEvent&)>);
```

下载所需SDK,将libs/x64/libmsc.so文件拷贝至工作空间的某个位置。

```cmake
cmake_minimum_required(VERSION 3.0.2)
project(tts_voice_test)
SET(CMAKE_CXX_FLAGS "-std=c++0x")
find_package(k4a REQUIRED)
find_package(OpenCV REQUIRED)
find_package(catkin REQUIRED COMPONENTS
roscpp
rospy
std_msgs
cv_bridge
message_generation
)

generate_messages(
  DEPENDENCIES
  std_msgs
)

include_directories(
  ~/Workspaces/tts_test_ws/include
  ${catkin_INCLUDE_DIRS}
)

add_executable(tts_voice_test src/tts_voice_test.cpp)

target_link_libraries(tts_voice_test
  PRIVATE k4a::k4a
  ${catkin_LIBRARIES}
  ${OpenCV_LIBRARIES}
  ${PCL_LIBRARIES}
  -lcurl -ljsoncpp -lmsc -lrt -ldl -pthread  -lasound
  /home/m0rtzz/Workspaces/tts_voice_test_ws/libs/x64/libmsc.so
```

打开终端：

```bash
catkin_make
```

若找不到asoundlib.h文件打开终端输入：

```bash
sudo apt install libasound2-dev
```

编译通过~

## 20.配置realsense及realsense工作空间

```bash
sudo apt install ros-${ROS_DISTRO}-realsense2-camera ros-${ROS_DISTRO}-rgbd-launch
```

![808f1ad01090402eafa94dd83545aed3.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:08_808f1ad01090402eafa94dd83545aed3.png)

安装realsense sdk:

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key F6E65AC044F831AC80A06380C8B3A55A6F3EFCDE || sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-key F6E65AC044F831AC80A06380C8B3A55A6F3EFCDE
```

![8fbc31d16a394fdc91f04302aa04b1d4.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:21_8fbc31d16a394fdc91f04302aa04b1d4.png)

```bash
sudo add-apt-repository "deb https://librealsense.intel.com/Debian/apt-repo $(lsb_release -cs) main" -u
```

![344007bb790841da91383d12d7eaa42b.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:08_344007bb790841da91383d12d7eaa42b.png)

```bash
sudo apt update
```

安装realsense lib

```bash
sudo apt install librealsense2-dkms librealsense2-utils
```

![eaed28f89f1d421ca57b099a6266168a.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:08_eaed28f89f1d421ca57b099a6266168a.png)

测试：

```bash
realsense-viewer
```

![66d6e2234539406982aa1aaad9e82698.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:09_66d6e2234539406982aa1aaad9e82698.png)

下载lib并指定版本为v2.50.0，否则接下来会与realsense-ros版本冲突导致无法打开摄像头:

```bash
git clone -b v2.50.0 https://github.com/IntelRealSense/librealsense.git librealsense-2.50.0
```

或公益加速源：

```bash
git clone -b v2.50.0 https://mirror.ghproxy.com/https://github.com/IntelRealSense/librealsense.git librealsense-2.50.0
```

![image-20240206162428124](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:10/17:35:25_16_24_28_image-20240206162428124.png)

安装依赖：

```bash
sudo apt install libudev-dev pkg-config libgtk-3-dev libusb-1.0-0-dev pkg-config libglfw3-dev
```

进入刚才克隆的librealsense文件夹内：

```bash
cd librealsense-2.50.0/
```

```bash
./scripts/setup_udev_rules.sh
```

```bash
# 应该是只能在Ubuntu18.04下执行
./scripts/patch-realsense-ubuntu-lts.sh
```

注意：上面的命令可能执行过慢，请耐心等待，或者科学的上网~

完成结果如下：

![389a2809970d49d8a24d299ece865576.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:31_389a2809970d49d8a24d299ece865576.png)

之后输入：

```bash
mkdir build && cd build
```

```bash
# @file : CMakeLists.txt
# NOTE: Modified by M0rtzz
LINK_LIBRARIES(-lcurl -lcrypto)
```

```bash
cmake -j$(nproc) ../ -DCMAKE_BUILD_TYPE=Release -DBUILD_EXAMPLES=true
```

以下编译过慢，使用CPU最大线程进行make，速度会快很多：

```bash
sudo make -j$(nproc)
```

```bash
sudo make install
```

测试：

```bash
cd examples/capture
```

```bash
./rs-capture
```

![32507b26116048919945b01bb173b72c](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:40_32507b26116048919945b01bb173b72c.png)

接下来我们配置realsense工作空间：

创建一个realsense_test_ws文件夹，进入文件夹下，打开终端：

```bash
mkdir src && cd src/
```

下载功能包:

```bash
git clone -b ros1-legacy https://github.com/IntelRealSense/realsense-ros.git realsense-ros
```

或公益加速源：

```bash
git clone -b ros1-legacy https://mirror.ghproxy.com/https://github.com/IntelRealSense/realsense-ros.git realsense-ros
```

![2c9b3f3767d845dcb4e2ace8830f6d7b.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:10_2c9b3f3767d845dcb4e2ace8830f6d7b.png)

```bash
cd ..
```

```bash
catkin_make -j$(nproc) -DCATKIN_ENABLE_TESTING=False -DCMAKE_BUILD_TYPE=Release
```

```bash
catkin_make install
```

![d66e547ed18645e380ba7beb0fd3c999.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:10_d66e547ed18645e380ba7beb0fd3c999.png)

测试：

```bash
roslaunch realsense2_camera rs_camera.launch
```

![d6c0eef6da874de9aff7596e3cc16a86.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:45_d6c0eef6da874de9aff7596e3cc16a86.png)

还没安摄像头~

## 21.配置Kinova机械臂工作空间

```bash
mkdir -p kinova_test_ws/src
```

```bash
cd kinova_test_ws/src
```

```bash
catkin_init_workspace
```

![645ec87a65914495adcd474cda614d5f.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:10_645ec87a65914495adcd474cda614d5f.png)

```bash
cd ..
```

```bash
catkin_make
```

```bash
echo 'source /home/m0rtzz/Workspaces/kinova_test_ws/devel/setup.bash' >> ~/.bashrc
```

```bash
cd src/
```

```bash
git clone https://github.com/Kinovarobotics/kinova-ros.git kinova-ros
```

或公益加速源：

```bash
git clone https://mirror.ghproxy.com/https://github.com/Kinovarobotics/kinova-ros.git kinova-ros
```

```bash
cd ..
```

安装缺少的moveit中相应的功能包 ：

```bash
sudo apt install ros-${ROS_DISTRO}-moveit-visual-tools ros-${ROS_DISTRO}-moveit-ros-planning-interface
```

```bash
catkin_make -j$(nproc)
```

![0808ea44aa244c66b30562c0307c9594.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:11_0808ea44aa244c66b30562c0307c9594.png)

```bash
sudo cp src/kinova-ros/kinova_driver/udev/10-kinova-arm.rules /etc/udev/rules.d/
```

安装Moveit和pr2：

```bash
sudo apt install $(apt-cache search ros-${ROS_DISTRO}-pr2- | grep -v "ros-${ROS_DISTRO}-pr2-apps" | cut -d' ' -f1)
```

![image-20240206162428124](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:10/17:36:15_16_24_28_image-20240206162428124.png)

完成~

## 22.配置机器人导航（实体）

安装 Arduino IDE:

[https://www.arduino.cc/en/software](https://www.arduino.cc/en/software)

![a5bb61f57e684a538b737a22d537a3c7](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:11_a5bb61f57e684a538b737a22d537a3c7.png)

下载Linux 64bit安装包

```bash
tar -xvf arduino-1.8.19-linux64.tar.xz
```

```bash
sudo mv arduino-1.8.19 /opt
```

```bash
cd /opt/arduino-1.8.19
```

```bash
sudo chmod +x install.sh
```

```bash
sudo ./install.sh
```

```bash
sudo apt install ros-${ROS_DISTRO}-move-base* ros-${ROS_DISTRO}-turtlebot3-* ros-${ROS_DISTRO}-dwa-local-planner
```

```bash
sudo apt install ros-${ROS_DISTRO}-joy ros-${ROS_DISTRO}-teleop-twist-joy ros-${ROS_DISTRO}-teleop-twist-keyboard ros-${ROS_DISTRO}-laser-proc ros-${ROS_DISTRO}-rgbd-launch ros-${ROS_DISTRO}-depthimage-to-laserscan ros-${ROS_DISTRO}-rosserial-arduino ros-${ROS_DISTRO}-rosserial-python ros-${ROS_DISTRO}-rosserial-server ros-${ROS_DISTRO}-rosserial-client ros-${ROS_DISTRO}-rosserial-msgs ros-${ROS_DISTRO}-amcl ros-${ROS_DISTRO}-map-server ros-${ROS_DISTRO}-move-base ros-${ROS_DISTRO}-urdf ros-${ROS_DISTRO}-xacro ros-${ROS_DISTRO}-compressed-image-transport ros-${ROS_DISTRO}-rqt-image-view ros-${ROS_DISTRO}-gmapping ros-${ROS_DISTRO}-navigation ros-${ROS_DISTRO}-interactive-markers
```

安装 gmapping 包（用于构建地图）：

```bash
sudo apt install ros-${ROS_DISTRO}-gmapping
```

安装地图服务包（用于保存与读取地图）:

```bash
sudo apt install ros-${ROS_DISTRO}-map-server
```

安装 navigation 包（用于定位以及路径规划）:

```bash
sudo apt install ros-${ROS_DISTRO}-navigation
```

因tf和tf2迁移问题，需将工作空间内的所有global_costmap_params.yaml和local_costmap_params.yaml文件里的头几行去掉“/”,返回工作空间根目录下重新编译。

**Reference：**

[http://wiki.ros.org/tf2/Migration](http://wiki.ros.org/tf2/Migration)

![1](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:01/17:29:21_1.png)

![2](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:10/17:29:09_2.png)

首先创建实体导航工作空间：

```bash
mkdir -p navigation_entity_test_ws/src
```

![e6316e2fe5e941369669b43ab767ea9d.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:12_e6316e2fe5e941369669b43ab767ea9d.png)

```bash
cd navigation_entity_test_ws/src
```

```bash
catkin_create_pkg entity_test roscpp rospy std_msgs  gmapping map_server amcl move_base
```

![12f06d657996445fa8d8cac418d21147.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:28:55_12f06d657996445fa8d8cac418d21147.png)

```bash
cd .. && catkin_make
```

![c5a44dee31014fcd9b8f97237e3f58e4.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:30:23_c5a44dee31014fcd9b8f97237e3f58e4.png)

查看一下文件目录，tree命令在下边的PS小节有讲怎么安装

```bash
tree .
```

![f5242b23d16a43e88ce2626341f3ed33.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:13_f5242b23d16a43e88ce2626341f3ed33.png)

```bash
cd src/ && catkin_create_pkg robot_start_test roscpp rospy std_msgs ros_arduino_python usb_cam rplidar_ros
```

```bash
cd robot_start_test/ && mkdir launch && cd launch && touch start_test.launch
```

```xml
<!--@File Name : start_test.launch
    @Brief : 机器人启动文件：
        1.启动底盘
        2.启动激光雷达
        3.启动摄像头
 -->

<launch>
        <include file="$(find ros_arduino_python)/launch/arduino.launch" />
        <include file="$(find usb_cam)/launch/usb_cam-test.launch" />
        <include file="$(find rplidar_ros)/launch/rplidar.launch" />
</launch>
```

接下来创建机器人模型相关的功能包：

```bash
cd src/
```

```bash
catkin_create_pkg robot_description_test urdf xacro
```

![0af4f65dceea471f94be94ef66fadbe2.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:02_0af4f65dceea471f94be94ef66fadbe2.png)

在功能包下新建 urdf 目录，编写具体的 urdf 文件（code命令是VSCode，没安装的小伙伴下边PS小节有下载网址~）:

```bash
cd robot_description_test/ && mkdir urdf
```

```bash
cd urdf/ && touch {robot.urdf.xacro,robot_base.urdf.xacro,robot_camera.urdf.xacro,robot_laser.urdf.xacro} && code robot.urdf.xacro
```

将下列代码粘贴进去：

```xml
<!-- File Name : robot.urdf.xacro -->

<robot name="robot_test" xmlns:xacro="http://wiki.ros.org/xacro">

    <xacro:include filename="robot_base.urdf.xacro" />
    <xacro:include filename="robot_camera.urdf.xacro" />
    <xacro:include filename="robot_laser.urdf.xacro" />

</robot>
```

保存退出，打开终端输入：

```bash
code robot_base.urdf.xacro
```

将下列代码粘贴进去：

<Details summary="robot_base.urdf.xacro（点击展开）">

`robot_base.urdf.xacro`

```xml
<!-- File Name : robot_base.urdf.xacro -->

<robot name="robot_test" xmlns:xacro="http://wiki.ros.org/xacro">

    <xacro:property name="footprint_radius" value="0.001" />
    <link name="base_footprint">
        <visual>
            <geometry>
                <sphere radius="${footprint_radius}" />
            </geometry>
        </visual>
    </link>

    <xacro:property name="base_radius" value="0.1" />
    <xacro:property name="base_length" value="0.08" />
    <xacro:property name="lidi" value="0.015" />
    <xacro:property name="base_joint_z" value="${base_length / 2 + lidi}" />
    <link name="base_link">
        <visual>
            <geometry>
                <cylinder radius="0.1" length="0.08" />
            </geometry>

            <origin xyz="0 0 0" rpy="0 0 0" />

            <material name="baselink_color">
                <color rgba="1.0 0.5 0.2 0.5" />
            </material>
        </visual>

    </link>

    <joint name="link2footprint" type="fixed">
        <parent link="base_footprint"  />
        <child link="base_link" />
        <origin xyz="0 0 0.055" rpy="0 0 0" />
    </joint>

    <xacro:property name="wheel_radius" value="0.0325" />
    <xacro:property name="wheel_length" value="0.015" />
    <xacro:property name="PI" value="3.1415927" />
    <xacro:property name="wheel_joint_z" value="${(base_length / 2 + lidi - wheel_radius) * -1}" />

    <xacro:macro name="wheel_func" params="wheel_name flag">

        <link name="${wheel_name}_wheel">
            <visual>
                <geometry>
                    <cylinder radius="${wheel_radius}" length="${wheel_length}" />
                </geometry>

                <origin xyz="0 0 0" rpy="${PI / 2} 0 0" />

                <material name="wheel_color">
                    <color rgba="0 0 0 0.3" />
                </material>
            </visual>

        </link>

        <joint name="${wheel_name}2link" type="continuous">
            <parent link="base_link"  />
            <child link="${wheel_name}_wheel" />

            <origin xyz="0 ${0.1 * flag} ${wheel_joint_z}" rpy="0 0 0" />
            <axis xyz="0 1 0" />
        </joint>

    </xacro:macro>

    <xacro:wheel_func wheel_name="left" flag="1" />
    <xacro:wheel_func wheel_name="right" flag="-1" />

    <xacro:property name="small_wheel_radius" value="0.0075" />
    <xacro:property name="small_joint_z" value="${(base_length / 2 + lidi - small_wheel_radius) * -1}" />

    <xacro:macro name="small_wheel_func" params="small_wheel_name flag">
        <link name="${small_wheel_name}_wheel">
            <visual>
                <geometry>
                    <sphere radius="${small_wheel_radius}" />
                </geometry>

                <origin xyz="0 0 0" rpy="0 0 0" />

                <material name="wheel_color">
                    <color rgba="0 0 0 0.3" />
                </material>
            </visual>

        </link>

        <joint name="${small_wheel_name}2link" type="continuous">
            <parent link="base_link"  />
            <child link="${small_wheel_name}_wheel" />

            <origin xyz="${0.08 * flag} 0 ${small_joint_z}" rpy="0 0 0" />
            <axis xyz="0 1 0" />
        </joint>

    </xacro:macro >
    <xacro:small_wheel_func small_wheel_name="front" flag="1"/>
    <xacro:small_wheel_func small_wheel_name="back" flag="-1"/>

</robot>
```

</Details>

保存退出，打开终端输入：

```bash
code robot_camera.urdf.xacro
```

将下列代码粘贴进去：

```xml
<!-- File Name : robot_camera.urdf.xacro -->

<robot name="robot_test" xmlns:xacro="http://wiki.ros.org/xacro">

    <xacro:property name="camera_length" value="0.02" />
    <xacro:property name="camera_width" value="0.05" />
    <xacro:property name="camera_height" value="0.05" />
    <xacro:property name="joint_camera_x" value="0.08" />
    <xacro:property name="joint_camera_y" value="0" />
    <xacro:property name="joint_camera_z" value="${base_length / 2 + camera_height / 2}" />

    <link name="camera">
        <visual>
            <geometry>
                <box size="${camera_length} ${camera_width} ${camera_height}" />
            </geometry>
            <origin xyz="0 0 0" rpy="0 0 0" />
            <material name="black">
                <color rgba="0 0 0 0.8" />
            </material>
        </visual>
    </link>

    <joint name="camera2base" type="fixed">
        <parent link="base_link" />
        <child link="camera" />
        <origin xyz="${joint_camera_x} ${joint_camera_y} ${joint_camera_z}" rpy="0 0 0" />
    </joint>

</robot>
```

保存退出，打开终端输入：

```bash
code robot_laser.urdf.xacro
```

将下列代码粘贴进去：

```xml
<!-- File Name : robot_laser.urdf.xacro -->

<robot name="robot_test" xmlns:xacro="http://wiki.ros.org/xacro">

    <xacro:property name="support_radius" value="0.01" />
    <xacro:property name="support_length" value="0.15" />

    <xacro:property name="laser_radius" value="0.03" />
    <xacro:property name="laser_length" value="0.05" />

    <xacro:property name="joint_support_x" value="0" />
    <xacro:property name="joint_support_y" value="0" />
    <xacro:property name="joint_support_z" value="${base_length / 2 + support_length / 2}" />

    <xacro:property name="joint_laser_x" value="0" />
    <xacro:property name="joint_laser_y" value="0" />
    <xacro:property name="joint_laser_z" value="${support_length / 2 + laser_length / 2}" />

    <link name="support">
        <visual>
            <geometry>
                <cylinder radius="${support_radius}" length="${support_length}" />
            </geometry>
            <material name="yellow">
                <color rgba="0.8 0.5 0.0 0.5" />
            </material>
        </visual>

    </link>

    <joint name="support2base" type="fixed">
        <parent link="base_link" />
        <child link="support"/>
        <origin xyz="${joint_support_x} ${joint_support_y} ${joint_support_z}" rpy="0 0 0" />
    </joint>
    <link name="laser">
        <visual>
            <geometry>
                <cylinder radius="${laser_radius}" length="${laser_length}" />
            </geometry>
            <material name="black">
                <color rgba="0 0 0 0.5" />
            </material>
        </visual>

    </link>

    <joint name="laser2support" type="fixed">
        <parent link="support" />
        <child link="laser"/>
        <origin xyz="${joint_laser_x} ${joint_laser_y} ${joint_laser_z}" rpy="0 0 0" />
    </joint>
</robot>
```

保存退出，打开终端：

```bash
cd .. && mkdir launch
```

```bash
touch robot_test.launch && code robot_test.launch
```

将下列代码粘贴进去：

```xml
<!-- File Name : robot_test.launch -->

<launch>
    <param name="robot_description" command="$(find xacro)/xacro $(find robot_description_test)/urdf/robot.urdf.xacro" />
    <node pkg="joint_state_publisher" name="joint_state_publisher" type="joint_state_publisher" />
    <node pkg="robot_state_publisher" name="robot_state_publisher" type="robot_state_publisher" />
</launch>
```

保存退出，打开终端：

```bash
cd ../../../ && echo 'source /home/m0rtzz/Workspaces/navigation_entity_test_ws/devel/setup.bash' >> ~/.bashrc && source ~/.bashrc
```

测试一下：

```bash
roslaunch robot_description_test robot_test.launch
```

![756d60eb62c14cfe82eafa7e3bdf4862.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:13_756d60eb62c14cfe82eafa7e3bdf4862.png)

之后Ctrl+Alt+T打开一个新的终端，输入：

```bash
rviz
```

![4dc525d781d94b19bfe14f73cd68738f.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:14_4dc525d781d94b19bfe14f73cd68738f.png)

将 Fixed Frame设置为base_footprint：

![c37069f5d4ba47cf94e637d64a15f416.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:14_c37069f5d4ba47cf94e637d64a15f416.png)

Add一个RobotModel：

![4111cf3ff31e4bda9b90de04c5d76e8a.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:14_4111cf3ff31e4bda9b90de04c5d76e8a.png)

Add一个TF：

![9b1fddd56a704702b30240024f4e7b65.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:14_9b1fddd56a704702b30240024f4e7b65.png)

```bash
cd src/entity_test/ && mkdir launch && cd launch/
```

```bash
touch gmapping.launch && code gmapping.launch
```

将下列代码粘贴进去：

```xml
<!-- File Name : gmapping.launch -->

<launch>
    <node pkg="gmapping" type="slam_gmapping" name="slam_gmapping" output="screen">
      <remap from="scan" to="scan"/>
      <param name="base_frame" value="base_footprint"/><!--底盘坐标系-->
      <param name="odom_frame" value="odom"/> <!--里程计坐标系-->
      <param name="map_update_interval" value="5.0"/>
      <param name="maxUrange" value="16.0"/>
      <param name="sigma" value="0.05"/>
      <param name="kernelSize" value="1"/>
      <param name="lstep" value="0.05"/>
      <param name="astep" value="0.05"/>
      <param name="iterations" value="5"/>
      <param name="lsigma" value="0.075"/>
      <param name="ogain" value="3.0"/>
      <param name="lskip" value="0"/>
      <param name="srr" value="0.1"/>
      <param name="srt" value="0.2"/>
      <param name="str" value="0.1"/>
      <param name="stt" value="0.2"/>
      <param name="linearUpdate" value="1.0"/>
      <param name="angularUpdate" value="0.5"/>
      <param name="temporalUpdate" value="3.0"/>
      <param name="resampleThreshold" value="0.5"/>
      <param name="particles" value="30"/>
      <param name="xmin" value="-50.0"/>
      <param name="ymin" value="-50.0"/>
      <param name="xmax" value="50.0"/>
      <param name="ymax" value="50.0"/>
      <param name="delta" value="0.05"/>
      <param name="llsamplerange" value="0.01"/>
      <param name="llsamplestep" value="0.01"/>
      <param name="lasamplerange" value="0.005"/>
      <param name="lasamplestep" value="0.005"/>
    </node>
</launch>
```

```bash
cd .. && mkdir map
```

```bash
cd launch && touch map_save.launch && code map_save.launch
```

将下列代码粘贴进去：

```xml
<!-- File Name : map_save.launch -->

<launch>
    <arg name="filename" value="$(find entity_test)/map/nav" />
    <node name="map_save" pkg="map_server" type="map_saver" args="-f $(arg filename)" />
</launch>
```

```bash
touch map_server.launch && code map_server.launch
```

将下列代码粘贴进去：

```xml
<!-- File Name : map_server.launch -->

<launch>
    <!-- 设置地图的配置文件 -->
    <arg name="map" default="nav.yaml" />
    <!-- 运行地图服务器，并且加载设置的地图-->
    <node name="map_server" pkg="map_server" type="map_server" args="$(find entity_test)/map/$(arg map)"/>
</launch>
```

```bash
touch amcl.launch && code amcl.launch
```

将下列代码粘贴进去：

```xml
<!-- File Name : amcl.launch -->

<launch>
  <node pkg="amcl" type="amcl" name="amcl" output="screen">
    <!-- Publish scans from best pose at a max of 10 Hz -->
    <param name="odom_model_type" value="diff"/><!-- 里程计模式为差分 -->
    <param name="odom_alpha5" value="0.1"/>
    <param name="transform_tolerance" value="0.2" />
    <param name="gui_publish_rate" value="10.0"/>
    <param name="laser_max_beams" value="30"/>
    <param name="min_particles" value="500"/>
    <param name="max_particles" value="5000"/>
    <param name="kld_err" value="0.05"/>
    <param name="kld_z" value="0.99"/>
    <param name="odom_alpha1" value="0.2"/>
    <param name="odom_alpha2" value="0.2"/>
    <!-- translation std dev, m -->
    <param name="odom_alpha3" value="0.8"/>
    <param name="odom_alpha4" value="0.2"/>
    <param name="laser_z_hit" value="0.5"/>
    <param name="laser_z_short" value="0.05"/>
    <param name="laser_z_max" value="0.05"/>
    <param name="laser_z_rand" value="0.5"/>
    <param name="laser_sigma_hit" value="0.2"/>
    <param name="laser_lambda_short" value="0.1"/>
    <param name="laser_lambda_short" value="0.1"/>
    <param name="laser_model_type" value="likelihood_field"/>
    <!-- <param name="laser_model_type" value="beam"/> -->
    <param name="laser_likelihood_max_dist" value="2.0"/>
    <param name="update_min_d" value="0.2"/>
    <param name="update_min_a" value="0.5"/>

    <param name="odom_frame_id" value="odom"/><!-- 里程计坐标系 -->
    <param name="base_frame_id" value="base_footprint"/><!-- 添加机器人基坐标系 -->
    <param name="global_frame_id" value="map"/><!-- 添加地图坐标系 -->

  </node>
</launch>
```

```bash
cd .. && mkdir param && cd param/ && touch {costmap_common_params.yaml,local_costmap_params.yaml,global_costmap_params.yaml,base_local_planner_params.yaml} && code .
```

将下列几个代码分别粘贴进去：

```yaml
# File Name : base_local_planner_params.yaml

TrajectoryPlannerROS:
  # Robot Configuration Parameters
  max_vel_x: 0.5 # X 方向最大速度
  min_vel_x: 0.1 # X 方向最小速速

  max_vel_theta: 1.0 #
  min_vel_theta: -1.0
  min_in_place_vel_theta: 1.0

  acc_lim_x: 1.0 # X 加速限制
  acc_lim_y: 0.0 # Y 加速限制
  acc_lim_theta: 0.6 # 角速度加速限制

  # Goal Tolerance Parameters，目标公差
  xy_goal_tolerance: 0.10
  yaw_goal_tolerance: 0.05

  # Differential-drive robot configuration
  # 是否是全向移动机器人
  holonomic_robot: false

  # Forward Simulation Parameters，前进模拟参数
  sim_time: 0.8
  vx_samples: 18
  vtheta_samples: 20
  sim_granularity: 0.05
```

```yaml
# File Name : cost_common_params.yaml

#机器人几何参，如果机器人是圆形，设置 robot_radius,如果是其他形状设置 footprint
robot_radius: 0.12 #圆形
# footprint: [[-0.12, -0.12], [-0.12, 0.12], [0.12, 0.12], [0.12, -0.12]] #其他形状

obstacle_range: 3.0 # 用于障碍物探测，比如: 值为 3.0，意味着检测到距离小于 3 米的障碍物时，就会引入代价地图
raytrace_range: 3.5 # 用于清除障碍物，比如：值为 3.5，意味着清除代价地图中 3.5 米以外的障碍物

#膨胀半径，扩展在碰撞区域以外的代价区域，使得机器人规划路径避开障碍物
inflation_radius: 0.2
#代价比例系数，越大则代价值越小
cost_scaling_factor: 3.0

#地图类型
map_type: costmap
#导航包所需要的传感器
observation_sources: scan
#对传感器的坐标系和数据进行配置。这个也会用于代价地图添加和清除障碍物。例如，你可以用激光雷达传感器用于在代价地图添加障碍物，再添加kinect用于导航和清除障碍物。
scan:
  {
    sensor_frame: laser,
    data_type: LaserScan,
    topic: scan,
    marking: true,
    clearing: true,
  }
```

```yaml
# File Name : global_costmap_params.yaml

global_costmap:
  global_frame: map #地图坐标系
  robot_base_frame: base_footprint #机器人坐标系
  # 以此实现坐标变换

  update_frequency: 1.0 #代价地图更新频率
  publish_frequency: 1.0 #代价地图的发布频率
  transform_tolerance: 0.5 #等待坐标变换发布信息的超时时间

  static_map: true # 是否使用一个地图或者地图服务器来初始化全局代价地图，如果不使用静态地图，这个参数为false.
```

```yaml
# File Name : local_costmap_params.yaml

local_costmap:
  global_frame: odom #里程计坐标系
  robot_base_frame: base_footprint #机器人坐标系

  update_frequency: 10.0 #代价地图更新频率
  publish_frequency: 10.0 #代价地图的发布频率
  transform_tolerance: 0.5 #等待坐标变换发布信息的超时时间

  static_map: false #不需要静态地图，可以提升导航效果
  rolling_window: true #是否使用动态窗口，默认为false，在静态的全局地图中，地图不会变化
  width: 3 # 局部地图宽度 单位是 m
  height: 3 # 局部地图高度 单位是 m
  resolution: 0.05 # 局部地图分辨率 单位是 m，一般与静态地图分辨率保持一致
```

```bash
cd ../launch && touch move_base.launch && code move_base.launch
```

将下列代码粘贴进去：

```xml
<!-- File Name : move_base.launch -->

<launch>

    <node pkg="move_base" type="move_base" respawn="false" name="move_base" output="screen" clear_params="true">
        <rosparam file="$(find nav)/param/costmap_common_params.yaml" command="load" ns="global_costmap" />
        <rosparam file="$(find nav)/param/costmap_common_params.yaml" command="load" ns="local_costmap" />
        <rosparam file="$(find nav)/param/local_costmap_params.yaml" command="load" />
        <rosparam file="$(find nav)/param/global_costmap_params.yaml" command="load" />
        <rosparam file="$(find nav)/param/base_local_planner_params.yaml" command="load" />
    </node>

</launch>
```

```bash
touch auto_slam.launch && code auto_slam.launch
```

将下列代码粘贴进去：

```xml
<!-- File Name : auto_slam.launch -->

<launch>
    <!-- 启动SLAM节点 -->
    <include file="$(find entity_test)/launch/gmapping.launch" />
    <!-- 运行move_base节点 -->
    <include file="$(find entity_test)/launch/move_base.launch" />
</launch>
```

## 23.安装配置caffe

**Reference：**

[https://blog.csdn.net/weixin_39161727/article/details/120136500](https://blog.csdn.net/weixin_39161727/article/details/120136500)

首先安装依赖：

```bash
sudo apt install libprotobuf-dev libleveldb-dev libsnappy-dev libopencv-dev libhdf5-serial-dev protobuf-compiler libatlas-base-dev libgflags-dev libgoogle-glog-dev liblmdb-dev && sudo apt install --no-install-recommends libboost-all-dev
```

```bash
git clone https://github.com/BVLC/caffe.git caffe
```

或公益加速源：

```bash
git clone https://mirror.ghproxy.com/https://github.com/BVLC/caffe.git caffe
```

```bash
cd caffe/ && sudo cp Makefile.config.example Makefile.config
```

```bash
gedit Makefile.config
```

<Details summary="Makefile.config（点击展开）">

`Makefile.config`

```makefile
## Refer to http://caffe.berkeleyvision.org/installation.html
# Contributions simplifying and improving our build system are welcome!

# cuDNN acceleration switch (uncomment to build with cuDNN).
USE_CUDNN := 1

# CPU-only switch (uncomment to build without GPU support).
# CPU_ONLY := 1

# uncomment to disable IO dependencies and corresponding data layers
# USE_OPENCV := 0
# USE_LEVELDB := 0
# USE_LMDB := 0
# This code is taken from https://github.com/sh1r0/caffe-android-lib
# USE_HDF5 := 0

# uncomment to allow MDB_NOLOCK when reading LMDB files (only if necessary)
#	You should not set this flag if you will be reading LMDBs with any
#	possibility of simultaneous read and write
# ALLOW_LMDB_NOLOCK := 1

# Uncomment if you're using OpenCV 3
OPENCV_VERSION := 3

# To customize your choice of compiler, uncomment and set the following.
# N.B. the default for Linux is g++ and the default for OSX is clang++
CUSTOM_CXX := g++

# CUDA directory contains bin/ and lib/ directories that we need.
CUDA_DIR := /usr/local/cuda
# On Ubuntu 14.04, if cuda tools are installed via
# "sudo apt-get install nvidia-cuda-toolkit" then use this instead:
# CUDA_DIR := /usr

# CUDA architecture setting: going with all of them.
# For CUDA < 6.0, comment the *_50 through *_61 lines for compatibility.
# For CUDA < 8.0, comment the *_60 and *_61 lines for compatibility.
# For CUDA >= 9.0, comment the *_20 and *_21 lines for compatibility.
CUDA_ARCH := #-gencode arch=compute_20,code=sm_20 \
		#-gencode arch=compute_20,code=sm_21 \
		#-gencode arch=compute_30,code=sm_30 \
		-gencode arch=compute_35,code=sm_35 \
		-gencode arch=compute_50,code=sm_50 \
		-gencode arch=compute_52,code=sm_52 \
		-gencode arch=compute_60,code=sm_60 \
		-gencode arch=compute_61,code=sm_61 \
		-gencode arch=compute_61,code=compute_61

# BLAS choice:
# atlas for ATLAS (default)
# mkl for MKL
# open for OpenBlas
BLAS := open
# Custom (MKL/ATLAS/OpenBLAS) include and lib directories.
# Leave commented to accept the defaults for your choice of BLAS
# (which should work)!
# BLAS_INCLUDE := /path/to/your/blas
# BLAS_LIB := /path/to/your/blas

# Homebrew puts openblas in a directory that is not on the standard search path
# BLAS_INCLUDE := $(shell brew --prefix openblas)/include
# BLAS_LIB := $(shell brew --prefix openblas)/lib

# This is required only if you will compile the matlab interface.
# MATLAB directory should contain the mex binary in /bin.
# MATLAB_DIR := /usr/local
# MATLAB_DIR := /Applications/MATLAB_R2012b.app

# NOTE: this is required only if you will compile the python interface.
# We need to be able to find Python.h and numpy/arrayobject.h.
PYTHON_INCLUDE := /usr/include/python2.7 \
		/usr/lib/python2.7/dist-packages/numpy/core/include
# Anaconda Python distribution is quite popular. Include path:
# Verify anaconda location, sometimes it's in root.
# ANACONDA_HOME := $(HOME)/anaconda
# PYTHON_INCLUDE := $(ANACONDA_HOME)/include \
		# $(ANACONDA_HOME)/include/python2.7 \
		# $(ANACONDA_HOME)/lib/python2.7/site-packages/numpy/core/include

# Uncomment to use Python 3 (default is Python 2)
 PYTHON_LIBRARIES := boost_python3 python3.6m
 PYTHON_INCLUDE := /usr/include/python3.6m \
                 /usr/lib/python3.6/dist-packages/numpy/core/include

# We need to be able to find libpythonX.X.so or .dylib.
PYTHON_LIB := /usr/lib
# PYTHON_LIB := $(ANACONDA_HOME)/lib

# Homebrew installs numpy in a non standard path (keg only)
# PYTHON_INCLUDE += $(dir $(shell python -c 'import numpy.core; print(numpy.core.__file__)'))/include
# PYTHON_LIB += $(shell brew --prefix numpy)/lib

# Uncomment to support layers written in Python (will link against Python libs)
WITH_PYTHON_LAYER := 1

# Whatever else you find you need goes here.
INCLUDE_DIRS := $(PYTHON_INCLUDE) /usr/local/include /usr/include/hdf5/serial/
LIBRARY_DIRS := $(PYTHON_LIB) /usr/local/lib /usr/lib /usr/lib/x86_64-linux-gnu/hdf5/serial/

# If Homebrew is installed at a non standard location (for example your home directory) and you use it for general dependencies
# INCLUDE_DIRS += $(shell brew --prefix)/include
# LIBRARY_DIRS += $(shell brew --prefix)/lib

# NCCL acceleration switch (uncomment to build with NCCL)
# https://github.com/NVIDIA/nccl (last tested version: v1.2.3-1+cuda8.0)
# USE_NCCL := 1

# Uncomment to use `pkg-config` to specify OpenCV library paths.
# (Usually not necessary -- OpenCV libraries are normally installed in one of the above $LIBRARY_DIRS.)
# USE_PKG_CONFIG := 1

# N.B. both build and distribute dirs are cleared on `make clean`
BUILD_DIR := build
DISTRIBUTE_DIR := distribute

# Uncomment for debugging. Does not work on OSX due to https://github.com/BVLC/caffe/issues/171
# DEBUG := 1

# The ID of the GPU that 'make runtest' will use to run unit tests.
TEST_GPUID := 0

# enable pretty build (comment to see full commands)
Q ?= @
```

</Details>

```bash
gedit Makefile
```

<Details summary="Makefile（点击展开）">

`Makefile`

```makefile
PROJECT := caffe

CONFIG_FILE := Makefile.config
# Explicitly check for the config file, otherwise make -k will proceed anyway.
ifeq ($(wildcard $(CONFIG_FILE)),)
$(error $(CONFIG_FILE) not found. See $(CONFIG_FILE).example.)
endif
include $(CONFIG_FILE)

BUILD_DIR_LINK := $(BUILD_DIR)
ifeq ($(RELEASE_BUILD_DIR),)
	RELEASE_BUILD_DIR := .$(BUILD_DIR)_release
endif
ifeq ($(DEBUG_BUILD_DIR),)
	DEBUG_BUILD_DIR := .$(BUILD_DIR)_debug
endif

DEBUG ?= 0
ifeq ($(DEBUG), 1)
	BUILD_DIR := $(DEBUG_BUILD_DIR)
	OTHER_BUILD_DIR := $(RELEASE_BUILD_DIR)
else
	BUILD_DIR := $(RELEASE_BUILD_DIR)
	OTHER_BUILD_DIR := $(DEBUG_BUILD_DIR)
endif

# All of the directories containing code.
SRC_DIRS := $(shell find * -type d -exec bash -c "find {} -maxdepth 1 \
	\( -name '*.cpp' -o -name '*.proto' \) | grep -q ." \; -print)

# The target shared library name
LIBRARY_NAME := $(PROJECT)
LIB_BUILD_DIR := $(BUILD_DIR)/lib
STATIC_NAME := $(LIB_BUILD_DIR)/lib$(LIBRARY_NAME).a
DYNAMIC_VERSION_MAJOR 		:= 1
DYNAMIC_VERSION_MINOR 		:= 0
DYNAMIC_VERSION_REVISION 	:= 0
DYNAMIC_NAME_SHORT := lib$(LIBRARY_NAME).so
#DYNAMIC_SONAME_SHORT := $(DYNAMIC_NAME_SHORT).$(DYNAMIC_VERSION_MAJOR)
DYNAMIC_VERSIONED_NAME_SHORT := $(DYNAMIC_NAME_SHORT).$(DYNAMIC_VERSION_MAJOR).$(DYNAMIC_VERSION_MINOR).$(DYNAMIC_VERSION_REVISION)
DYNAMIC_NAME := $(LIB_BUILD_DIR)/$(DYNAMIC_VERSIONED_NAME_SHORT)
COMMON_FLAGS += -DCAFFE_VERSION=$(DYNAMIC_VERSION_MAJOR).$(DYNAMIC_VERSION_MINOR).$(DYNAMIC_VERSION_REVISION)

##############################
# Get all source files
##############################
# CXX_SRCS are the source files excluding the test ones.
CXX_SRCS := $(shell find src/$(PROJECT) ! -name "test_*.cpp" -name "*.cpp")
# CU_SRCS are the cuda source files
CU_SRCS := $(shell find src/$(PROJECT) ! -name "test_*.cu" -name "*.cu")
# TEST_SRCS are the test source files
TEST_MAIN_SRC := src/$(PROJECT)/test/test_caffe_main.cpp
TEST_SRCS := $(shell find src/$(PROJECT) -name "test_*.cpp")
TEST_SRCS := $(filter-out $(TEST_MAIN_SRC), $(TEST_SRCS))
TEST_CU_SRCS := $(shell find src/$(PROJECT) -name "test_*.cu")
GTEST_SRC := src/gtest/gtest-all.cpp
# TOOL_SRCS are the source files for the tool binaries
TOOL_SRCS := $(shell find tools -name "*.cpp")
# EXAMPLE_SRCS are the source files for the example binaries
EXAMPLE_SRCS := $(shell find examples -name "*.cpp")
# BUILD_INCLUDE_DIR contains any generated header files we want to include.
BUILD_INCLUDE_DIR := $(BUILD_DIR)/src
# PROTO_SRCS are the protocol buffer definitions
PROTO_SRC_DIR := src/$(PROJECT)/proto
PROTO_SRCS := $(wildcard $(PROTO_SRC_DIR)/*.proto)
# PROTO_BUILD_DIR will contain the .cc and obj files generated from
# PROTO_SRCS; PROTO_BUILD_INCLUDE_DIR will contain the .h header files
PROTO_BUILD_DIR := $(BUILD_DIR)/$(PROTO_SRC_DIR)
PROTO_BUILD_INCLUDE_DIR := $(BUILD_INCLUDE_DIR)/$(PROJECT)/proto
# NONGEN_CXX_SRCS includes all source/header files except those generated
# automatically (e.g., by proto).
NONGEN_CXX_SRCS := $(shell find \
	src/$(PROJECT) \
	include/$(PROJECT) \
	python/$(PROJECT) \
	matlab/+$(PROJECT)/private \
	examples \
	tools \
	-name "*.cpp" -or -name "*.hpp" -or -name "*.cu" -or -name "*.cuh")
LINT_SCRIPT := scripts/cpp_lint.py
LINT_OUTPUT_DIR := $(BUILD_DIR)/.lint
LINT_EXT := lint.txt
LINT_OUTPUTS := $(addsuffix .$(LINT_EXT), $(addprefix $(LINT_OUTPUT_DIR)/, $(NONGEN_CXX_SRCS)))
EMPTY_LINT_REPORT := $(BUILD_DIR)/.$(LINT_EXT)
NONEMPTY_LINT_REPORT := $(BUILD_DIR)/$(LINT_EXT)
# PY$(PROJECT)_SRC is the python wrapper for $(PROJECT)
PY$(PROJECT)_SRC := python/$(PROJECT)/_$(PROJECT).cpp
PY$(PROJECT)_SO := python/$(PROJECT)/_$(PROJECT).so
PY$(PROJECT)_HXX := include/$(PROJECT)/layers/python_layer.hpp
# MAT$(PROJECT)_SRC is the mex entrance point of matlab package for $(PROJECT)
MAT$(PROJECT)_SRC := matlab/+$(PROJECT)/private/$(PROJECT)_.cpp
ifneq ($(MATLAB_DIR),)
	MAT_SO_EXT := $(shell $(MATLAB_DIR)/bin/mexext)
endif
MAT$(PROJECT)_SO := matlab/+$(PROJECT)/private/$(PROJECT)_.$(MAT_SO_EXT)

##############################
# Derive generated files
##############################
# The generated files for protocol buffers
PROTO_GEN_HEADER_SRCS := $(addprefix $(PROTO_BUILD_DIR)/, \
		$(notdir ${PROTO_SRCS:.proto=.pb.h}))
PROTO_GEN_HEADER := $(addprefix $(PROTO_BUILD_INCLUDE_DIR)/, \
		$(notdir ${PROTO_SRCS:.proto=.pb.h}))
PROTO_GEN_CC := $(addprefix $(BUILD_DIR)/, ${PROTO_SRCS:.proto=.pb.cc})
PY_PROTO_BUILD_DIR := python/$(PROJECT)/proto
PY_PROTO_INIT := python/$(PROJECT)/proto/__init__.py
PROTO_GEN_PY := $(foreach file,${PROTO_SRCS:.proto=_pb2.py}, \
		$(PY_PROTO_BUILD_DIR)/$(notdir $(file)))
# The objects corresponding to the source files
# These objects will be linked into the final shared library, so we
# exclude the tool, example, and test objects.
CXX_OBJS := $(addprefix $(BUILD_DIR)/, ${CXX_SRCS:.cpp=.o})
CU_OBJS := $(addprefix $(BUILD_DIR)/cuda/, ${CU_SRCS:.cu=.o})
PROTO_OBJS := ${PROTO_GEN_CC:.cc=.o}
OBJS := $(PROTO_OBJS) $(CXX_OBJS) $(CU_OBJS)
# tool, example, and test objects
TOOL_OBJS := $(addprefix $(BUILD_DIR)/, ${TOOL_SRCS:.cpp=.o})
TOOL_BUILD_DIR := $(BUILD_DIR)/tools
TEST_CXX_BUILD_DIR := $(BUILD_DIR)/src/$(PROJECT)/test
TEST_CU_BUILD_DIR := $(BUILD_DIR)/cuda/src/$(PROJECT)/test
TEST_CXX_OBJS := $(addprefix $(BUILD_DIR)/, ${TEST_SRCS:.cpp=.o})
TEST_CU_OBJS := $(addprefix $(BUILD_DIR)/cuda/, ${TEST_CU_SRCS:.cu=.o})
TEST_OBJS := $(TEST_CXX_OBJS) $(TEST_CU_OBJS)
GTEST_OBJ := $(addprefix $(BUILD_DIR)/, ${GTEST_SRC:.cpp=.o})
EXAMPLE_OBJS := $(addprefix $(BUILD_DIR)/, ${EXAMPLE_SRCS:.cpp=.o})
# Output files for automatic dependency generation
DEPS := ${CXX_OBJS:.o=.d} ${CU_OBJS:.o=.d} ${TEST_CXX_OBJS:.o=.d} \
	${TEST_CU_OBJS:.o=.d} $(BUILD_DIR)/${MAT$(PROJECT)_SO:.$(MAT_SO_EXT)=.d}
# tool, example, and test bins
TOOL_BINS := ${TOOL_OBJS:.o=.bin}
EXAMPLE_BINS := ${EXAMPLE_OBJS:.o=.bin}
# symlinks to tool bins without the ".bin" extension
TOOL_BIN_LINKS := ${TOOL_BINS:.bin=}
# Put the test binaries in build/test for convenience.
TEST_BIN_DIR := $(BUILD_DIR)/test
TEST_CU_BINS := $(addsuffix .testbin,$(addprefix $(TEST_BIN_DIR)/, \
		$(foreach obj,$(TEST_CU_OBJS),$(basename $(notdir $(obj))))))
TEST_CXX_BINS := $(addsuffix .testbin,$(addprefix $(TEST_BIN_DIR)/, \
		$(foreach obj,$(TEST_CXX_OBJS),$(basename $(notdir $(obj))))))
TEST_BINS := $(TEST_CXX_BINS) $(TEST_CU_BINS)
# TEST_ALL_BIN is the test binary that links caffe dynamically.
TEST_ALL_BIN := $(TEST_BIN_DIR)/test_all.testbin

##############################
# Derive compiler warning dump locations
##############################
WARNS_EXT := warnings.txt
CXX_WARNS := $(addprefix $(BUILD_DIR)/, ${CXX_SRCS:.cpp=.o.$(WARNS_EXT)})
CU_WARNS := $(addprefix $(BUILD_DIR)/cuda/, ${CU_SRCS:.cu=.o.$(WARNS_EXT)})
TOOL_WARNS := $(addprefix $(BUILD_DIR)/, ${TOOL_SRCS:.cpp=.o.$(WARNS_EXT)})
EXAMPLE_WARNS := $(addprefix $(BUILD_DIR)/, ${EXAMPLE_SRCS:.cpp=.o.$(WARNS_EXT)})
TEST_WARNS := $(addprefix $(BUILD_DIR)/, ${TEST_SRCS:.cpp=.o.$(WARNS_EXT)})
TEST_CU_WARNS := $(addprefix $(BUILD_DIR)/cuda/, ${TEST_CU_SRCS:.cu=.o.$(WARNS_EXT)})
ALL_CXX_WARNS := $(CXX_WARNS) $(TOOL_WARNS) $(EXAMPLE_WARNS) $(TEST_WARNS)
ALL_CU_WARNS := $(CU_WARNS) $(TEST_CU_WARNS)
ALL_WARNS := $(ALL_CXX_WARNS) $(ALL_CU_WARNS)

EMPTY_WARN_REPORT := $(BUILD_DIR)/.$(WARNS_EXT)
NONEMPTY_WARN_REPORT := $(BUILD_DIR)/$(WARNS_EXT)

##############################
# Derive include and lib directories
##############################
CUDA_INCLUDE_DIR := $(CUDA_DIR)/include

CUDA_LIB_DIR :=
# add <cuda>/lib64 only if it exists
ifneq ("$(wildcard $(CUDA_DIR)/lib64)","")
	CUDA_LIB_DIR += $(CUDA_DIR)/lib64
endif
CUDA_LIB_DIR += $(CUDA_DIR)/lib

INCLUDE_DIRS += $(BUILD_INCLUDE_DIR) ./src ./include
ifneq ($(CPU_ONLY), 1)
	INCLUDE_DIRS += $(CUDA_INCLUDE_DIR)
	LIBRARY_DIRS += $(CUDA_LIB_DIR)
	LIBRARIES := cudart cublas curand
endif

LIBRARIES += glog gflags protobuf boost_system boost_filesystem m hdf5_serial_hl hdf5_serial

# handle IO dependencies
USE_LEVELDB ?= 1
USE_LMDB ?= 1
# This code is taken from https://github.com/sh1r0/caffe-android-lib
USE_HDF5 ?= 1
USE_OPENCV ?= 1

ifeq ($(USE_LEVELDB), 1)
	LIBRARIES += leveldb snappy
endif
ifeq ($(USE_LMDB), 1)
	LIBRARIES += lmdb
endif
# This code is taken from https://github.com/sh1r0/caffe-android-lib
ifeq ($(USE_HDF5), 1)
	LIBRARIES += hdf5_hl hdf5
endif
ifeq ($(USE_OPENCV), 1)
	LIBRARIES += opencv_core opencv_highgui opencv_imgproc

	ifeq ($(OPENCV_VERSION), 3)
		LIBRARIES += opencv_imgcodecs
	endif

endif
PYTHON_LIBRARIES ?= boost_python python2.7
WARNINGS := -Wall -Wno-sign-compare

##############################
# Set build directories
##############################

DISTRIBUTE_DIR ?= distribute
DISTRIBUTE_SUBDIRS := $(DISTRIBUTE_DIR)/bin $(DISTRIBUTE_DIR)/lib
DIST_ALIASES := dist
ifneq ($(strip $(DISTRIBUTE_DIR)),distribute)
		DIST_ALIASES += distribute
endif

ALL_BUILD_DIRS := $(sort $(BUILD_DIR) $(addprefix $(BUILD_DIR)/, $(SRC_DIRS)) \
	$(addprefix $(BUILD_DIR)/cuda/, $(SRC_DIRS)) \
	$(LIB_BUILD_DIR) $(TEST_BIN_DIR) $(PY_PROTO_BUILD_DIR) $(LINT_OUTPUT_DIR) \
	$(DISTRIBUTE_SUBDIRS) $(PROTO_BUILD_INCLUDE_DIR))

##############################
# Set directory for Doxygen-generated documentation
##############################
DOXYGEN_CONFIG_FILE ?= ./.Doxyfile
# should be the same as OUTPUT_DIRECTORY in the .Doxyfile
DOXYGEN_OUTPUT_DIR ?= ./doxygen
DOXYGEN_COMMAND ?= doxygen
# All the files that might have Doxygen documentation.
DOXYGEN_SOURCES := $(shell find \
	src/$(PROJECT) \
	include/$(PROJECT) \
	python/ \
	matlab/ \
	examples \
	tools \
	-name "*.cpp" -or -name "*.hpp" -or -name "*.cu" -or -name "*.cuh" -or \
        -name "*.py" -or -name "*.m")
DOXYGEN_SOURCES += $(DOXYGEN_CONFIG_FILE)


##############################
# Configure build
##############################

# Determine platform
UNAME := $(shell uname -s)
ifeq ($(UNAME), Linux)
	LINUX := 1
else ifeq ($(UNAME), Darwin)
	OSX := 1
	OSX_MAJOR_VERSION := $(shell sw_vers -productVersion | cut -f 1 -d .)
	OSX_MINOR_VERSION := $(shell sw_vers -productVersion | cut -f 2 -d .)
endif

# Linux
ifeq ($(LINUX), 1)
	CXX ?= /usr/bin/g++
	GCCVERSION := $(shell $(CXX) -dumpversion | cut -f1,2 -d.)
	# older versions of gcc are too dumb to build boost with -Wuninitalized
	ifeq ($(shell echo | awk '{exit $(GCCVERSION) < 4.6;}'), 1)
		WARNINGS += -Wno-uninitialized
	endif
	# boost::thread is reasonably called boost_thread (compare OS X)
	# We will also explicitly add stdc++ to the link target.
	LIBRARIES += boost_thread stdc++
	VERSIONFLAGS += -Wl,-soname,$(DYNAMIC_VERSIONED_NAME_SHORT) -Wl,-rpath,$(ORIGIN)/../lib
endif

# OS X:
# clang++ instead of g++
# libstdc++ for NVCC compatibility on OS X >= 10.9 with CUDA < 7.0
ifeq ($(OSX), 1)
	CXX := /usr/bin/clang++
	ifneq ($(CPU_ONLY), 1)
		CUDA_VERSION := $(shell $(CUDA_DIR)/bin/nvcc -V | grep -o 'release [0-9.]*' | tr -d '[a-z ]')
		ifeq ($(shell echo | awk '{exit $(CUDA_VERSION) < 7.0;}'), 1)
			CXXFLAGS += -stdlib=libstdc++
			LINKFLAGS += -stdlib=libstdc++
		endif
		# clang throws this warning for cuda headers
		WARNINGS += -Wno-unneeded-internal-declaration
		# 10.11 strips DYLD_* env vars so link CUDA (rpath is available on 10.5+)
		OSX_10_OR_LATER   := $(shell [ $(OSX_MAJOR_VERSION) -ge 10 ] && echo true)
		OSX_10_5_OR_LATER := $(shell [ $(OSX_MINOR_VERSION) -ge 5 ] && echo true)
		ifeq ($(OSX_10_OR_LATER),true)
			ifeq ($(OSX_10_5_OR_LATER),true)
				LDFLAGS += -Wl,-rpath,$(CUDA_LIB_DIR)
			endif
		endif
	endif
	# gtest needs to use its own tuple to not conflict with clang
	COMMON_FLAGS += -DGTEST_USE_OWN_TR1_TUPLE=1
	# boost::thread is called boost_thread-mt to mark multithreading on OS X
	LIBRARIES += boost_thread-mt
	# we need to explicitly ask for the rpath to be obeyed
	ORIGIN := @loader_path
	VERSIONFLAGS += -Wl,-install_name,@rpath/$(DYNAMIC_VERSIONED_NAME_SHORT) -Wl,-rpath,$(ORIGIN)/../../build/lib
else
	ORIGIN := \$$ORIGIN
endif

# Custom compiler
ifdef CUSTOM_CXX
	CXX := $(CUSTOM_CXX)
endif

# Static linking
ifneq (,$(findstring clang++,$(CXX)))
	STATIC_LINK_COMMAND := -Wl,-force_load $(STATIC_NAME)
else ifneq (,$(findstring g++,$(CXX)))
	STATIC_LINK_COMMAND := -Wl,--whole-archive $(STATIC_NAME) -Wl,--no-whole-archive
else
  # The following line must not be indented with a tab, since we are not inside a target
  $(error Cannot static link with the $(CXX) compiler)
endif

# Debugging
ifeq ($(DEBUG), 1)
	COMMON_FLAGS += -DDEBUG -g -O0
	NVCCFLAGS += -G
else
	COMMON_FLAGS += -DNDEBUG -O2
endif

# cuDNN acceleration configuration.
ifeq ($(USE_CUDNN), 1)
	LIBRARIES += cudnn
	COMMON_FLAGS += -DUSE_CUDNN
endif

# NCCL acceleration configuration
ifeq ($(USE_NCCL), 1)
	LIBRARIES += nccl
	COMMON_FLAGS += -DUSE_NCCL
endif

# configure IO libraries
ifeq ($(USE_OPENCV), 1)
	COMMON_FLAGS += -DUSE_OPENCV
endif
ifeq ($(USE_LEVELDB), 1)
	COMMON_FLAGS += -DUSE_LEVELDB
endif
ifeq ($(USE_LMDB), 1)
	COMMON_FLAGS += -DUSE_LMDB
ifeq ($(ALLOW_LMDB_NOLOCK), 1)
	COMMON_FLAGS += -DALLOW_LMDB_NOLOCK
endif
endif
# This code is taken from https://github.com/sh1r0/caffe-android-lib
ifeq ($(USE_HDF5), 1)
	COMMON_FLAGS += -DUSE_HDF5
endif

# CPU-only configuration
ifeq ($(CPU_ONLY), 1)
	OBJS := $(PROTO_OBJS) $(CXX_OBJS)
	TEST_OBJS := $(TEST_CXX_OBJS)
	TEST_BINS := $(TEST_CXX_BINS)
	ALL_WARNS := $(ALL_CXX_WARNS)
	TEST_FILTER := --gtest_filter="-*GPU*"
	COMMON_FLAGS += -DCPU_ONLY
endif

# Python layer support
ifeq ($(WITH_PYTHON_LAYER), 1)
	COMMON_FLAGS += -DWITH_PYTHON_LAYER
	LIBRARIES += $(PYTHON_LIBRARIES)
endif

# BLAS configuration (default = ATLAS)
BLAS ?= atlas
ifeq ($(BLAS), mkl)
	# MKL
	LIBRARIES += mkl_rt
	COMMON_FLAGS += -DUSE_MKL
	MKLROOT ?= /opt/intel/mkl
	BLAS_INCLUDE ?= $(MKLROOT)/include
	BLAS_LIB ?= $(MKLROOT)/lib $(MKLROOT)/lib/intel64
else ifeq ($(BLAS), open)
	# OpenBLAS
	LIBRARIES += openblas
else
	# ATLAS
	ifeq ($(LINUX), 1)
		ifeq ($(BLAS), atlas)
			# Linux simply has cblas and atlas
			LIBRARIES += cblas atlas
		endif
	else ifeq ($(OSX), 1)
		# OS X packages atlas as the vecLib framework
		LIBRARIES += cblas
		# 10.10 has accelerate while 10.9 has veclib
		XCODE_CLT_VER := $(shell pkgutil --pkg-info=com.apple.pkg.CLTools_Executables | grep 'version' | sed 's/[^0-9]*\([0-9]\).*/\1/')
		XCODE_CLT_GEQ_7 := $(shell [ $(XCODE_CLT_VER) -gt 6 ] && echo 1)
		XCODE_CLT_GEQ_6 := $(shell [ $(XCODE_CLT_VER) -gt 5 ] && echo 1)
		ifeq ($(XCODE_CLT_GEQ_7), 1)
			BLAS_INCLUDE ?= /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/$(shell ls /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/ | sort | tail -1)/System/Library/Frameworks/Accelerate.framework/Versions/A/Frameworks/vecLib.framework/Versions/A/Headers
		else ifeq ($(XCODE_CLT_GEQ_6), 1)
			BLAS_INCLUDE ?= /System/Library/Frameworks/Accelerate.framework/Versions/Current/Frameworks/vecLib.framework/Headers/
			LDFLAGS += -framework Accelerate
		else
			BLAS_INCLUDE ?= /System/Library/Frameworks/vecLib.framework/Versions/Current/Headers/
			LDFLAGS += -framework vecLib
		endif
	endif
endif
INCLUDE_DIRS += $(BLAS_INCLUDE)
LIBRARY_DIRS += $(BLAS_LIB)

LIBRARY_DIRS += $(LIB_BUILD_DIR)

# Automatic dependency generation (nvcc is handled separately)
CXXFLAGS += -MMD -MP

# Complete build flags.
COMMON_FLAGS += $(foreach includedir,$(INCLUDE_DIRS),-I$(includedir))
CXXFLAGS += -pthread -fPIC $(COMMON_FLAGS) $(WARNINGS)
NVCCFLAGS += -ccbin=$(CXX) -Xcompiler -fPIC $(COMMON_FLAGS)
NVCCFLAGS += -D_FORCE_INLINES -ccbin=$(CXX) -Xcompiler -fPIC $(COMMON_FLAGS)
# mex may invoke an older gcc that is too liberal with -Wuninitalized
MATLAB_CXXFLAGS := $(CXXFLAGS) -Wno-uninitialized
LINKFLAGS += -pthread -fPIC $(COMMON_FLAGS) $(WARNINGS)

USE_PKG_CONFIG ?= 0
ifeq ($(USE_PKG_CONFIG), 1)
	PKG_CONFIG := $(shell pkg-config opencv --libs)
else
	PKG_CONFIG :=
endif
LDFLAGS += $(foreach librarydir,$(LIBRARY_DIRS),-L$(librarydir)) $(PKG_CONFIG) \
		$(foreach library,$(LIBRARIES),-l$(library))
PYTHON_LDFLAGS := $(LDFLAGS) $(foreach library,$(PYTHON_LIBRARIES),-l$(library))

# 'superclean' target recursively* deletes all files ending with an extension
# in $(SUPERCLEAN_EXTS) below.  This may be useful if you've built older
# versions of Caffe that do not place all generated files in a location known
# to the 'clean' target.
#
# 'supercleanlist' will list the files to be deleted by make superclean.
#
# * Recursive with the exception that symbolic links are never followed, per the
# default behavior of 'find'.
SUPERCLEAN_EXTS := .so .a .o .bin .testbin .pb.cc .pb.h _pb2.py .cuo

# Set the sub-targets of the 'everything' target.
EVERYTHING_TARGETS := all py$(PROJECT) test warn lint
# Only build matcaffe as part of "everything" if MATLAB_DIR is specified.
ifneq ($(MATLAB_DIR),)
	EVERYTHING_TARGETS += mat$(PROJECT)
endif

##############################
# Define build targets
##############################
.PHONY: all lib test clean docs linecount lint lintclean tools examples $(DIST_ALIASES) \
	py mat py$(PROJECT) mat$(PROJECT) proto runtest \
	superclean supercleanlist supercleanfiles warn everything

all: lib tools examples

lib: $(STATIC_NAME) $(DYNAMIC_NAME)

everything: $(EVERYTHING_TARGETS)

linecount:
	cloc --read-lang-def=$(PROJECT).cloc \
		src/$(PROJECT) include/$(PROJECT) tools examples \
		python matlab

lint: $(EMPTY_LINT_REPORT)

lintclean:
	@ $(RM) -r $(LINT_OUTPUT_DIR) $(EMPTY_LINT_REPORT) $(NONEMPTY_LINT_REPORT)

docs: $(DOXYGEN_OUTPUT_DIR)
	@ cd ./docs ; ln -sfn ../$(DOXYGEN_OUTPUT_DIR)/html doxygen

$(DOXYGEN_OUTPUT_DIR): $(DOXYGEN_CONFIG_FILE) $(DOXYGEN_SOURCES)
	$(DOXYGEN_COMMAND) $(DOXYGEN_CONFIG_FILE)

$(EMPTY_LINT_REPORT): $(LINT_OUTPUTS) | $(BUILD_DIR)
	@ cat $(LINT_OUTPUTS) > $@
	@ if [ -s "$@" ]; then \
		cat $@; \
		mv $@ $(NONEMPTY_LINT_REPORT); \
		echo "Found one or more lint errors."; \
		exit 1; \
	  fi; \
	  $(RM) $(NONEMPTY_LINT_REPORT); \
	  echo "No lint errors!";

$(LINT_OUTPUTS): $(LINT_OUTPUT_DIR)/%.lint.txt : % $(LINT_SCRIPT) | $(LINT_OUTPUT_DIR)
	@ mkdir -p $(dir $@)
	@ python $(LINT_SCRIPT) $< 2>&1 \
		| grep -v "^Done processing " \
		| grep -v "^Total errors found: 0" \
		> $@ \
		|| true

test: $(TEST_ALL_BIN) $(TEST_ALL_DYNLINK_BIN) $(TEST_BINS)

tools: $(TOOL_BINS) $(TOOL_BIN_LINKS)

examples: $(EXAMPLE_BINS)

py$(PROJECT): py

py: $(PY$(PROJECT)_SO) $(PROTO_GEN_PY)

$(PY$(PROJECT)_SO): $(PY$(PROJECT)_SRC) $(PY$(PROJECT)_HXX) | $(DYNAMIC_NAME)
	@ echo CXX/LD -o $@ $<
	$(Q)$(CXX) -shared -o $@ $(PY$(PROJECT)_SRC) \
		-o $@ $(LINKFLAGS) -l$(LIBRARY_NAME) $(PYTHON_LDFLAGS) \
		-Wl,-rpath,$(ORIGIN)/../../build/lib

mat$(PROJECT): mat

mat: $(MAT$(PROJECT)_SO)

$(MAT$(PROJECT)_SO): $(MAT$(PROJECT)_SRC) $(STATIC_NAME)
	@ if [ -z "$(MATLAB_DIR)" ]; then \
		echo "MATLAB_DIR must be specified in $(CONFIG_FILE)" \
			"to build mat$(PROJECT)."; \
		exit 1; \
	fi
	@ echo MEX $<
	$(Q)$(MATLAB_DIR)/bin/mex $(MAT$(PROJECT)_SRC) \
			CXX="$(CXX)" \
			CXXFLAGS="\$$CXXFLAGS $(MATLAB_CXXFLAGS)" \
			CXXLIBS="\$$CXXLIBS $(STATIC_LINK_COMMAND) $(LDFLAGS)" -output $@
	@ if [ -f "$(PROJECT)_.d" ]; then \
		mv -f $(PROJECT)_.d $(BUILD_DIR)/${MAT$(PROJECT)_SO:.$(MAT_SO_EXT)=.d}; \
	fi

runtest: $(TEST_ALL_BIN)
	$(TOOL_BUILD_DIR)/caffe
	$(TEST_ALL_BIN) $(TEST_GPUID) --gtest_shuffle $(TEST_FILTER)

pytest: py
	cd python; python -m unittest discover -s caffe/test

mattest: mat
	cd matlab; $(MATLAB_DIR)/bin/matlab -nodisplay -r 'caffe.run_tests(), exit()'

warn: $(EMPTY_WARN_REPORT)

$(EMPTY_WARN_REPORT): $(ALL_WARNS) | $(BUILD_DIR)
	@ cat $(ALL_WARNS) > $@
	@ if [ -s "$@" ]; then \
		cat $@; \
		mv $@ $(NONEMPTY_WARN_REPORT); \
		echo "Compiler produced one or more warnings."; \
		exit 1; \
	  fi; \
	  $(RM) $(NONEMPTY_WARN_REPORT); \
	  echo "No compiler warnings!";

$(ALL_WARNS): %.o.$(WARNS_EXT) : %.o

$(BUILD_DIR_LINK): $(BUILD_DIR)/.linked

# Create a target ".linked" in this BUILD_DIR to tell Make that the "build" link
# is currently correct, then delete the one in the OTHER_BUILD_DIR in case it
# exists and $(DEBUG) is toggled later.
$(BUILD_DIR)/.linked:
	@ mkdir -p $(BUILD_DIR)
	@ $(RM) $(OTHER_BUILD_DIR)/.linked
	@ $(RM) -r $(BUILD_DIR_LINK)
	@ ln -s $(BUILD_DIR) $(BUILD_DIR_LINK)
	@ touch $@

$(ALL_BUILD_DIRS): | $(BUILD_DIR_LINK)
	@ mkdir -p $@

$(DYNAMIC_NAME): $(OBJS) | $(LIB_BUILD_DIR)
	@ echo LD -o $@
	$(Q)$(CXX) -shared -o $@ $(OBJS) $(VERSIONFLAGS) $(LINKFLAGS) $(LDFLAGS)
	@ cd $(BUILD_DIR)/lib; rm -f $(DYNAMIC_NAME_SHORT);   ln -s $(DYNAMIC_VERSIONED_NAME_SHORT) $(DYNAMIC_NAME_SHORT)

$(STATIC_NAME): $(OBJS) | $(LIB_BUILD_DIR)
	@ echo AR -o $@
	$(Q)ar rcs $@ $(OBJS)

$(BUILD_DIR)/%.o: %.cpp $(PROTO_GEN_HEADER) | $(ALL_BUILD_DIRS)
	@ echo CXX $<
	$(Q)$(CXX) $< $(CXXFLAGS) -c -o $@ 2> $@.$(WARNS_EXT) \
		|| (cat $@.$(WARNS_EXT); exit 1)
	@ cat $@.$(WARNS_EXT)

$(PROTO_BUILD_DIR)/%.pb.o: $(PROTO_BUILD_DIR)/%.pb.cc $(PROTO_GEN_HEADER) \
		| $(PROTO_BUILD_DIR)
	@ echo CXX $<
	$(Q)$(CXX) $< $(CXXFLAGS) -c -o $@ 2> $@.$(WARNS_EXT) \
		|| (cat $@.$(WARNS_EXT); exit 1)
	@ cat $@.$(WARNS_EXT)

$(BUILD_DIR)/cuda/%.o: %.cu | $(ALL_BUILD_DIRS)
	@ echo NVCC $<
	$(Q)$(CUDA_DIR)/bin/nvcc $(NVCCFLAGS) $(CUDA_ARCH) -M $< -o ${@:.o=.d} \
		-odir $(@D)
	$(Q)$(CUDA_DIR)/bin/nvcc $(NVCCFLAGS) $(CUDA_ARCH) -c $< -o $@ 2> $@.$(WARNS_EXT) \
		|| (cat $@.$(WARNS_EXT); exit 1)
	@ cat $@.$(WARNS_EXT)

$(TEST_ALL_BIN): $(TEST_MAIN_SRC) $(TEST_OBJS) $(GTEST_OBJ) \
		| $(DYNAMIC_NAME) $(TEST_BIN_DIR)
	@ echo CXX/LD -o $@ $<
	$(Q)$(CXX) $(TEST_MAIN_SRC) $(TEST_OBJS) $(GTEST_OBJ) \
		-o $@ $(LINKFLAGS) $(LDFLAGS) -l$(LIBRARY_NAME) -Wl,-rpath,$(ORIGIN)/../lib

$(TEST_CU_BINS): $(TEST_BIN_DIR)/%.testbin: $(TEST_CU_BUILD_DIR)/%.o \
	$(GTEST_OBJ) | $(DYNAMIC_NAME) $(TEST_BIN_DIR)
	@ echo LD $<
	$(Q)$(CXX) $(TEST_MAIN_SRC) $< $(GTEST_OBJ) \
		-o $@ $(LINKFLAGS) $(LDFLAGS) -l$(LIBRARY_NAME) -Wl,-rpath,$(ORIGIN)/../lib

$(TEST_CXX_BINS): $(TEST_BIN_DIR)/%.testbin: $(TEST_CXX_BUILD_DIR)/%.o \
	$(GTEST_OBJ) | $(DYNAMIC_NAME) $(TEST_BIN_DIR)
	@ echo LD $<
	$(Q)$(CXX) $(TEST_MAIN_SRC) $< $(GTEST_OBJ) \
		-o $@ $(LINKFLAGS) $(LDFLAGS) -l$(LIBRARY_NAME) -Wl,-rpath,$(ORIGIN)/../lib

# Target for extension-less symlinks to tool binaries with extension '*.bin'.
$(TOOL_BUILD_DIR)/%: $(TOOL_BUILD_DIR)/%.bin | $(TOOL_BUILD_DIR)
	@ $(RM) $@
	@ ln -s $(notdir $<) $@

$(TOOL_BINS): %.bin : %.o | $(DYNAMIC_NAME)
	@ echo CXX/LD -o $@
	$(Q)$(CXX) $< -o $@ $(LINKFLAGS) -l$(LIBRARY_NAME) $(LDFLAGS) \
		-Wl,-rpath,$(ORIGIN)/../lib

$(EXAMPLE_BINS): %.bin : %.o | $(DYNAMIC_NAME)
	@ echo CXX/LD -o $@
	$(Q)$(CXX) $< -o $@ $(LINKFLAGS) -l$(LIBRARY_NAME) $(LDFLAGS) \
		-Wl,-rpath,$(ORIGIN)/../../lib

proto: $(PROTO_GEN_CC) $(PROTO_GEN_HEADER)

$(PROTO_BUILD_DIR)/%.pb.cc $(PROTO_BUILD_DIR)/%.pb.h : \
		$(PROTO_SRC_DIR)/%.proto | $(PROTO_BUILD_DIR)
	@ echo PROTOC $<
	$(Q)protoc --proto_path=$(PROTO_SRC_DIR) --cpp_out=$(PROTO_BUILD_DIR) $<

$(PY_PROTO_BUILD_DIR)/%_pb2.py : $(PROTO_SRC_DIR)/%.proto \
		$(PY_PROTO_INIT) | $(PY_PROTO_BUILD_DIR)
	@ echo PROTOC \(python\) $<
	$(Q)protoc --proto_path=src --python_out=python $<

$(PY_PROTO_INIT): | $(PY_PROTO_BUILD_DIR)
	touch $(PY_PROTO_INIT)

clean:
	@- $(RM) -rf $(ALL_BUILD_DIRS)
	@- $(RM) -rf $(OTHER_BUILD_DIR)
	@- $(RM) -rf $(BUILD_DIR_LINK)
	@- $(RM) -rf $(DISTRIBUTE_DIR)
	@- $(RM) $(PY$(PROJECT)_SO)
	@- $(RM) $(MAT$(PROJECT)_SO)

supercleanfiles:
	$(eval SUPERCLEAN_FILES := $(strip \
			$(foreach ext,$(SUPERCLEAN_EXTS), $(shell find . -name '*$(ext)' \
			-not -path './data/*'))))

supercleanlist: supercleanfiles
	@ \
	if [ -z "$(SUPERCLEAN_FILES)" ]; then \
		echo "No generated files found."; \
	else \
		echo $(SUPERCLEAN_FILES) | tr ' ' '\n'; \
	fi

superclean: clean supercleanfiles
	@ \
	if [ -z "$(SUPERCLEAN_FILES)" ]; then \
		echo "No generated files found."; \
	else \
		echo "Deleting the following generated files:"; \
		echo $(SUPERCLEAN_FILES) | tr ' ' '\n'; \
		$(RM) $(SUPERCLEAN_FILES); \
	fi

$(DIST_ALIASES): $(DISTRIBUTE_DIR)

$(DISTRIBUTE_DIR): all py | $(DISTRIBUTE_SUBDIRS)
	# add proto
	cp -r src/caffe/proto $(DISTRIBUTE_DIR)/
	# add include
	cp -r include $(DISTRIBUTE_DIR)/
	mkdir -p $(DISTRIBUTE_DIR)/include/caffe/proto
	cp $(PROTO_GEN_HEADER_SRCS) $(DISTRIBUTE_DIR)/include/caffe/proto
	# add tool and example binaries
	cp $(TOOL_BINS) $(DISTRIBUTE_DIR)/bin
	cp $(EXAMPLE_BINS) $(DISTRIBUTE_DIR)/bin
	# add libraries
	cp $(STATIC_NAME) $(DISTRIBUTE_DIR)/lib
	install -m 644 $(DYNAMIC_NAME) $(DISTRIBUTE_DIR)/lib
	cd $(DISTRIBUTE_DIR)/lib; rm -f $(DYNAMIC_NAME_SHORT);   ln -s $(DYNAMIC_VERSIONED_NAME_SHORT) $(DYNAMIC_NAME_SHORT)
	# add python - it's not the standard way, indeed...
	cp -r python $(DISTRIBUTE_DIR)/

-include $(DEPS)
```

</Details>

```bash
cd python/
```

使用阿里云镜像安装依赖库：

```bash
for req in $(cat requirements.txt); do pip3 install $req -i https://mirrors.aliyun.com/pypi/simple/; done
```

```bash
cd .. && sudo make clean
```

```bash
sudo make all -j$(nproc)
```

由于caffe最后支持的版本是cuDNN7.6.5，为了能在cuDNN8的环境下编译通过，需要修改两个cpp文件，路径为/caffe/src/caffe/layers下的cudnn_conv_layer.cpp和cudnn_deconv_layer.cpp两个文件，分别将他们内容替换为：

<Details summary="cudnn_conv_layer.cpp（点击展开）">

`cudnn_conv_layer.cpp`

```cpp
/**
 * @File Name : cudnn_conv_layer.cpp
 */

#ifdef USE_CUDNN
#include <algorithm>
#include <vector>

#include "caffe/layers/cudnn_conv_layer.hpp"

namespace caffe
{

// Set to three for the benefit of the backward pass, which
// can use separate streams for calculating the gradient w.r.t.
// bias, filter weights, and bottom data for each group independently
#define CUDNN_STREAMS_PER_GROUP 3

  /**
   * TODO(dox) explain cuDNN interface
   */
  template <typename Dtype>
  void CuDNNConvolutionLayer<Dtype>::LayerSetUp(
      const vector<Blob<Dtype> *> &bottom, const vector<Blob<Dtype> *> &top)
  {
    ConvolutionLayer<Dtype>::LayerSetUp(bottom, top);
    // Initialize CUDA streams and cuDNN.
    stream_ = new cudaStream_t[this->group_ * CUDNN_STREAMS_PER_GROUP];
    handle_ = new cudnnHandle_t[this->group_ * CUDNN_STREAMS_PER_GROUP];

    // Initialize algorithm arrays
    fwd_algo_ = new cudnnConvolutionFwdAlgo_t[bottom.size()];
    bwd_filter_algo_ = new cudnnConvolutionBwdFilterAlgo_t[bottom.size()];
    bwd_data_algo_ = new cudnnConvolutionBwdDataAlgo_t[bottom.size()];

    // initialize size arrays
    workspace_fwd_sizes_ = new size_t[bottom.size()];
    workspace_bwd_filter_sizes_ = new size_t[bottom.size()];
    workspace_bwd_data_sizes_ = new size_t[bottom.size()];

    // workspace data
    workspaceSizeInBytes = 0;
    workspaceData = NULL;
    workspace = new void *[this->group_ * CUDNN_STREAMS_PER_GROUP];

    for (size_t i = 0; i < bottom.size(); ++i)
    {
      // initialize all to default algorithms
      fwd_algo_[i] = (cudnnConvolutionFwdAlgo_t)0;
      bwd_filter_algo_[i] = (cudnnConvolutionBwdFilterAlgo_t)0;
      bwd_data_algo_[i] = (cudnnConvolutionBwdDataAlgo_t)0;
      // default algorithms don't require workspace
      workspace_fwd_sizes_[i] = 0;
      workspace_bwd_data_sizes_[i] = 0;
      workspace_bwd_filter_sizes_[i] = 0;
    }

    for (int g = 0; g < this->group_ * CUDNN_STREAMS_PER_GROUP; g++)
    {
      CUDA_CHECK(cudaStreamCreate(&stream_[g]));
      CUDNN_CHECK(cudnnCreate(&handle_[g]));
      CUDNN_CHECK(cudnnSetStream(handle_[g], stream_[g]));
      workspace[g] = NULL;
    }

    // Set the indexing parameters.
    bias_offset_ = (this->num_output_ / this->group_);

    // Create filter descriptor.
    const int *kernel_shape_data = this->kernel_shape_.cpu_data();
    const int kernel_h = kernel_shape_data[0];
    const int kernel_w = kernel_shape_data[1];
    cudnn::createFilterDesc<Dtype>(&filter_desc_,
                                   this->num_output_ / this->group_, this->channels_ / this->group_,
                                   kernel_h, kernel_w);

    // Create tensor descriptor(s) for data and corresponding convolution(s).
    for (int i = 0; i < bottom.size(); i++)
    {
      cudnnTensorDescriptor_t bottom_desc;
      cudnn::createTensor4dDesc<Dtype>(&bottom_desc);
      bottom_descs_.push_back(bottom_desc);
      cudnnTensorDescriptor_t top_desc;
      cudnn::createTensor4dDesc<Dtype>(&top_desc);
      top_descs_.push_back(top_desc);
      cudnnConvolutionDescriptor_t conv_desc;
      cudnn::createConvolutionDesc<Dtype>(&conv_desc);
      conv_descs_.push_back(conv_desc);
    }

    // Tensor descriptor for bias.
    if (this->bias_term_)
    {
      cudnn::createTensor4dDesc<Dtype>(&bias_desc_);
    }

    handles_setup_ = true;
  }

  template <typename Dtype>
  void CuDNNConvolutionLayer<Dtype>::Reshape(
      const vector<Blob<Dtype> *> &bottom, const vector<Blob<Dtype> *> &top)
  {
    ConvolutionLayer<Dtype>::Reshape(bottom, top);
    CHECK_EQ(2, this->num_spatial_axes_)
        << "CuDNNConvolution input must have 2 spatial axes "
        << "(e.g., height and width). "
        << "Use 'engine: CAFFE' for general ND convolution.";
    bottom_offset_ = this->bottom_dim_ / this->group_;
    top_offset_ = this->top_dim_ / this->group_;
    const int height = bottom[0]->shape(this->channel_axis_ + 1);
    const int width = bottom[0]->shape(this->channel_axis_ + 2);
    const int height_out = top[0]->shape(this->channel_axis_ + 1);
    const int width_out = top[0]->shape(this->channel_axis_ + 2);
    const int *pad_data = this->pad_.cpu_data();
    const int pad_h = pad_data[0];
    const int pad_w = pad_data[1];
    const int *stride_data = this->stride_.cpu_data();
    const int stride_h = stride_data[0];
    const int stride_w = stride_data[1];
#if CUDNN_VERSION_MIN(8, 0, 0)
    int RetCnt;
    bool found_conv_algorithm;
    size_t free_memory, total_memory;
    cudnnConvolutionFwdAlgoPerf_t fwd_algo_pref_[4];
    cudnnConvolutionBwdDataAlgoPerf_t bwd_data_algo_pref_[4];

    // get memory sizes
    cudaMemGetInfo(&free_memory, &total_memory);
#else
    // Specify workspace limit for kernels directly until we have a
    // planning strategy and a rewrite of Caffe's GPU memory mangagement
    size_t workspace_limit_bytes = 8 * 1024 * 1024;
#endif
    for (int i = 0; i < bottom.size(); i++)
    {
      cudnn::setTensor4dDesc<Dtype>(&bottom_descs_[i],
                                    this->num_,
                                    this->channels_ / this->group_, height, width,
                                    this->channels_ * height * width,
                                    height * width, width, 1);
      cudnn::setTensor4dDesc<Dtype>(&top_descs_[i],
                                    this->num_,
                                    this->num_output_ / this->group_, height_out, width_out,
                                    this->num_output_ * this->out_spatial_dim_,
                                    this->out_spatial_dim_, width_out, 1);
      cudnn::setConvolutionDesc<Dtype>(&conv_descs_[i], bottom_descs_[i],
                                       filter_desc_, pad_h, pad_w,
                                       stride_h, stride_w);

#if CUDNN_VERSION_MIN(8, 0, 0)
      // choose forward algorithm for filter
      // in forward filter the CUDNN_CONVOLUTION_FWD_ALGO_WINOGRAD_NONFUSED is not implemented in cuDNN 8
      CUDNN_CHECK(cudnnGetConvolutionForwardAlgorithm_v7(handle_[0],
                                                         bottom_descs_[i],
                                                         filter_desc_,
                                                         conv_descs_[i],
                                                         top_descs_[i],
                                                         4,
                                                         &RetCnt,
                                                         fwd_algo_pref_));

      found_conv_algorithm = false;
      for (int n = 0; n < RetCnt; n++)
      {
        if (fwd_algo_pref_[n].status == CUDNN_STATUS_SUCCESS &&
            fwd_algo_pref_[n].algo != CUDNN_CONVOLUTION_FWD_ALGO_WINOGRAD_NONFUSED &&
            fwd_algo_pref_[n].memory < free_memory)
        {
          found_conv_algorithm = true;
          fwd_algo_[i] = fwd_algo_pref_[n].algo;
          workspace_fwd_sizes_[i] = fwd_algo_pref_[n].memory;
          break;
        }
      }
      if (!found_conv_algorithm)
        LOG(ERROR) << "cuDNN did not return a suitable algorithm for convolution.";
      else
      {
        // choose backward algorithm for filter
        // for better or worse, just a fixed constant due to the missing
        // cudnnGetConvolutionBackwardFilterAlgorithm in cuDNN version 8.0
        bwd_filter_algo_[i] = CUDNN_CONVOLUTION_BWD_FILTER_ALGO_0;
        // twice the amount of the forward search to be save
        workspace_bwd_filter_sizes_[i] = 2 * workspace_fwd_sizes_[i];
      }

      // choose backward algo for data
      CUDNN_CHECK(cudnnGetConvolutionBackwardDataAlgorithm_v7(handle_[0],
                                                              filter_desc_,
                                                              top_descs_[i],
                                                              conv_descs_[i],
                                                              bottom_descs_[i],
                                                              4,
                                                              &RetCnt,
                                                              bwd_data_algo_pref_));

      found_conv_algorithm = false;
      for (int n = 0; n < RetCnt; n++)
      {
        if (bwd_data_algo_pref_[n].status == CUDNN_STATUS_SUCCESS &&
            bwd_data_algo_pref_[n].algo != CUDNN_CONVOLUTION_BWD_DATA_ALGO_WINOGRAD &&
            bwd_data_algo_pref_[n].algo != CUDNN_CONVOLUTION_BWD_DATA_ALGO_WINOGRAD_NONFUSED &&
            bwd_data_algo_pref_[n].memory < free_memory)
        {
          found_conv_algorithm = true;
          bwd_data_algo_[i] = bwd_data_algo_pref_[n].algo;
          workspace_bwd_data_sizes_[i] = bwd_data_algo_pref_[n].memory;
          break;
        }
      }
      if (!found_conv_algorithm)
        LOG(ERROR) << "cuDNN did not return a suitable algorithm for convolution.";
#else
      // choose forward and backward algorithms + workspace(s)
      CUDNN_CHECK(cudnnGetConvolutionForwardAlgorithm(handle_[0],
                                                      bottom_descs_[i],
                                                      filter_desc_,
                                                      conv_descs_[i],
                                                      top_descs_[i],
                                                      CUDNN_CONVOLUTION_FWD_SPECIFY_WORKSPACE_LIMIT,
                                                      workspace_limit_bytes,
                                                      &fwd_algo_[i]));

      CUDNN_CHECK(cudnnGetConvolutionForwardWorkspaceSize(handle_[0],
                                                          bottom_descs_[i],
                                                          filter_desc_,
                                                          conv_descs_[i],
                                                          top_descs_[i],
                                                          fwd_algo_[i],
                                                          &(workspace_fwd_sizes_[i])));

      // choose backward algorithm for filter
      CUDNN_CHECK(cudnnGetConvolutionBackwardFilterAlgorithm(handle_[0],
                                                             bottom_descs_[i], top_descs_[i], conv_descs_[i], filter_desc_,
                                                             CUDNN_CONVOLUTION_BWD_FILTER_SPECIFY_WORKSPACE_LIMIT,
                                                             workspace_limit_bytes, &bwd_filter_algo_[i]));

      // get workspace for backwards filter algorithm
      CUDNN_CHECK(cudnnGetConvolutionBackwardFilterWorkspaceSize(handle_[0],
                                                                 bottom_descs_[i], top_descs_[i], conv_descs_[i], filter_desc_,
                                                                 bwd_filter_algo_[i], &workspace_bwd_filter_sizes_[i]));

      // choose backward algo for data
      CUDNN_CHECK(cudnnGetConvolutionBackwardDataAlgorithm(handle_[0],
                                                           filter_desc_, top_descs_[i], conv_descs_[i], bottom_descs_[i],
                                                           CUDNN_CONVOLUTION_BWD_DATA_SPECIFY_WORKSPACE_LIMIT,
                                                           workspace_limit_bytes, &bwd_data_algo_[i]));

      // get workspace size
      CUDNN_CHECK(cudnnGetConvolutionBackwardDataWorkspaceSize(handle_[0],
                                                               filter_desc_, top_descs_[i], conv_descs_[i], bottom_descs_[i],
                                                               bwd_data_algo_[i], &workspace_bwd_data_sizes_[i]));
#endif
    }
    // reduce over all workspace sizes to get a maximum to allocate / reallocate
    size_t total_workspace_fwd = 0;
    size_t total_workspace_bwd_data = 0;
    size_t total_workspace_bwd_filter = 0;

    for (size_t i = 0; i < bottom.size(); i++)
    {
      total_workspace_fwd = std::max(total_workspace_fwd,
                                     workspace_fwd_sizes_[i]);
      total_workspace_bwd_data = std::max(total_workspace_bwd_data,
                                          workspace_bwd_data_sizes_[i]);
      total_workspace_bwd_filter = std::max(total_workspace_bwd_filter,
                                            workspace_bwd_filter_sizes_[i]);
    }
    // get max over all operations
    size_t max_workspace = std::max(total_workspace_fwd,
                                    total_workspace_bwd_data);
    max_workspace = std::max(max_workspace, total_workspace_bwd_filter);
    // ensure all groups have enough workspace
    size_t total_max_workspace = max_workspace *
                                 (this->group_ * CUDNN_STREAMS_PER_GROUP);

    // this is the total amount of storage needed over all groups + streams
    if (total_max_workspace > workspaceSizeInBytes)
    {
      DLOG(INFO) << "Reallocating workspace storage: " << total_max_workspace;
      workspaceSizeInBytes = total_max_workspace;

      // free the existing workspace and allocate a new (larger) one
      cudaFree(this->workspaceData);

      cudaError_t err = cudaMalloc(&(this->workspaceData), workspaceSizeInBytes);
      if (err != cudaSuccess)
      {
        // force zero memory path
        for (int i = 0; i < bottom.size(); i++)
        {
          workspace_fwd_sizes_[i] = 0;
          workspace_bwd_filter_sizes_[i] = 0;
          workspace_bwd_data_sizes_[i] = 0;
          fwd_algo_[i] = CUDNN_CONVOLUTION_FWD_ALGO_IMPLICIT_GEMM;
          bwd_filter_algo_[i] = CUDNN_CONVOLUTION_BWD_FILTER_ALGO_0;
          bwd_data_algo_[i] = CUDNN_CONVOLUTION_BWD_DATA_ALGO_0;
        }

        // NULL out all workspace pointers
        for (int g = 0; g < (this->group_ * CUDNN_STREAMS_PER_GROUP); g++)
        {
          workspace[g] = NULL;
        }
        // NULL out underlying data
        workspaceData = NULL;
        workspaceSizeInBytes = 0;
      }

      // if we succeed in the allocation, set pointer aliases for workspaces
      for (int g = 0; g < (this->group_ * CUDNN_STREAMS_PER_GROUP); g++)
      {
        workspace[g] = reinterpret_cast<char *>(workspaceData) + g * max_workspace;
      }
    }

    // Tensor descriptor for bias.
    if (this->bias_term_)
    {
      cudnn::setTensor4dDesc<Dtype>(&bias_desc_,
                                    1, this->num_output_ / this->group_, 1, 1);
    }
  }

  template <typename Dtype>
  CuDNNConvolutionLayer<Dtype>::~CuDNNConvolutionLayer()
  {
    // Check that handles have been setup before destroying.
    if (!handles_setup_)
    {
      return;
    }

    for (int i = 0; i < bottom_descs_.size(); i++)
    {
      cudnnDestroyTensorDescriptor(bottom_descs_[i]);
      cudnnDestroyTensorDescriptor(top_descs_[i]);
      cudnnDestroyConvolutionDescriptor(conv_descs_[i]);
    }
    if (this->bias_term_)
    {
      cudnnDestroyTensorDescriptor(bias_desc_);
    }
    cudnnDestroyFilterDescriptor(filter_desc_);

    for (int g = 0; g < this->group_ * CUDNN_STREAMS_PER_GROUP; g++)
    {
      cudaStreamDestroy(stream_[g]);
      cudnnDestroy(handle_[g]);
    }

    cudaFree(workspaceData);
    delete[] stream_;
    delete[] handle_;
    delete[] fwd_algo_;
    delete[] bwd_filter_algo_;
    delete[] bwd_data_algo_;
    delete[] workspace_fwd_sizes_;
    delete[] workspace_bwd_data_sizes_;
    delete[] workspace_bwd_filter_sizes_;
  }

  INSTANTIATE_CLASS(CuDNNConvolutionLayer);

} // namespace caffe
#endif
```

</Details>

<Details summary="cudnn_deconv_layer.cpp（点击展开）">

`cudnn_deconv_layer.cpp`

```cpp
/**
 * @File Name : cudnn_deconv_layer.cpp
 */

#ifdef USE_CUDNN
#include <algorithm>
#include <vector>

#include "caffe/layers/cudnn_deconv_layer.hpp"

namespace caffe
{

// Set to three for the benefit of the backward pass, which
// can use separate streams for calculating the gradient w.r.t.
// bias, filter weights, and bottom data for each group independently
#define CUDNN_STREAMS_PER_GROUP 3

  /**
   * TODO(dox) explain cuDNN interface
   */
  template <typename Dtype>
  void CuDNNDeconvolutionLayer<Dtype>::LayerSetUp(
      const vector<Blob<Dtype> *> &bottom, const vector<Blob<Dtype> *> &top)
  {
    DeconvolutionLayer<Dtype>::LayerSetUp(bottom, top);
    // Initialize CUDA streams and cuDNN.
    stream_ = new cudaStream_t[this->group_ * CUDNN_STREAMS_PER_GROUP];
    handle_ = new cudnnHandle_t[this->group_ * CUDNN_STREAMS_PER_GROUP];

    // Initialize algorithm arrays
    fwd_algo_ = new cudnnConvolutionFwdAlgo_t[bottom.size()];
    bwd_filter_algo_ = new cudnnConvolutionBwdFilterAlgo_t[bottom.size()];
    bwd_data_algo_ = new cudnnConvolutionBwdDataAlgo_t[bottom.size()];

    // initialize size arrays
    workspace_fwd_sizes_ = new size_t[bottom.size()];
    workspace_bwd_filter_sizes_ = new size_t[bottom.size()];
    workspace_bwd_data_sizes_ = new size_t[bottom.size()];

    // workspace data
    workspaceSizeInBytes = 0;
    workspaceData = NULL;
    workspace = new void *[this->group_ * CUDNN_STREAMS_PER_GROUP];

    for (size_t i = 0; i < bottom.size(); ++i)
    {
      // initialize all to default algorithms
      fwd_algo_[i] = (cudnnConvolutionFwdAlgo_t)0;
      bwd_filter_algo_[i] = (cudnnConvolutionBwdFilterAlgo_t)0;
      bwd_data_algo_[i] = (cudnnConvolutionBwdDataAlgo_t)0;
      // default algorithms don't require workspace
      workspace_fwd_sizes_[i] = 0;
      workspace_bwd_data_sizes_[i] = 0;
      workspace_bwd_filter_sizes_[i] = 0;
    }

    for (int g = 0; g < this->group_ * CUDNN_STREAMS_PER_GROUP; g++)
    {
      CUDA_CHECK(cudaStreamCreate(&stream_[g]));
      CUDNN_CHECK(cudnnCreate(&handle_[g]));
      CUDNN_CHECK(cudnnSetStream(handle_[g], stream_[g]));
      workspace[g] = NULL;
    }

    // Set the indexing parameters.
    bias_offset_ = (this->num_output_ / this->group_);

    // Create filter descriptor.
    const int *kernel_shape_data = this->kernel_shape_.cpu_data();
    const int kernel_h = kernel_shape_data[0];
    const int kernel_w = kernel_shape_data[1];
    cudnn::createFilterDesc<Dtype>(&filter_desc_,
                                   this->channels_ / this->group_,
                                   this->num_output_ / this->group_,
                                   kernel_h,
                                   kernel_w);

    // Create tensor descriptor(s) for data and corresponding convolution(s).
    for (int i = 0; i < bottom.size(); i++)
    {
      cudnnTensorDescriptor_t bottom_desc;
      cudnn::createTensor4dDesc<Dtype>(&bottom_desc);
      bottom_descs_.push_back(bottom_desc);
      cudnnTensorDescriptor_t top_desc;
      cudnn::createTensor4dDesc<Dtype>(&top_desc);
      top_descs_.push_back(top_desc);
      cudnnConvolutionDescriptor_t conv_desc;
      cudnn::createConvolutionDesc<Dtype>(&conv_desc);
      conv_descs_.push_back(conv_desc);
    }

    // Tensor descriptor for bias.
    if (this->bias_term_)
    {
      cudnn::createTensor4dDesc<Dtype>(&bias_desc_);
    }

    handles_setup_ = true;
  }

  template <typename Dtype>
  void CuDNNDeconvolutionLayer<Dtype>::Reshape(
      const vector<Blob<Dtype> *> &bottom, const vector<Blob<Dtype> *> &top)
  {
    DeconvolutionLayer<Dtype>::Reshape(bottom, top);
    CHECK_EQ(2, this->num_spatial_axes_)
        << "CuDNNDeconvolutionLayer input must have 2 spatial axes "
        << "(e.g., height and width). "
        << "Use 'engine: CAFFE' for general ND convolution.";
    bottom_offset_ = this->bottom_dim_ / this->group_;
    top_offset_ = this->top_dim_ / this->group_;
    const int height = bottom[0]->shape(this->channel_axis_ + 1);
    const int width = bottom[0]->shape(this->channel_axis_ + 2);
    const int height_out = top[0]->shape(this->channel_axis_ + 1);
    const int width_out = top[0]->shape(this->channel_axis_ + 2);
    const int *pad_data = this->pad_.cpu_data();
    const int pad_h = pad_data[0];
    const int pad_w = pad_data[1];
    const int *stride_data = this->stride_.cpu_data();
    const int stride_h = stride_data[0];
    const int stride_w = stride_data[1];
#if CUDNN_VERSION_MIN(8, 0, 0)
    int RetCnt;
    bool found_conv_algorithm;
    size_t free_memory, total_memory;
    cudnnConvolutionFwdAlgoPerf_t fwd_algo_pref_[4];
    cudnnConvolutionBwdDataAlgoPerf_t bwd_data_algo_pref_[4];

    // get memory sizes
    cudaMemGetInfo(&free_memory, &total_memory);
#else
    // Specify workspace limit for kernels directly until we have a
    // planning strategy and a rewrite of Caffe's GPU memory mangagement
    size_t workspace_limit_bytes = 8 * 1024 * 1024;
#endif
    for (int i = 0; i < bottom.size(); i++)
    {
      cudnn::setTensor4dDesc<Dtype>(&bottom_descs_[i],
                                    this->num_,
                                    this->channels_ / this->group_,
                                    height,
                                    width,
                                    this->channels_ * height * width,
                                    height * width,
                                    width,
                                    1);
      cudnn::setTensor4dDesc<Dtype>(&top_descs_[i],
                                    this->num_,
                                    this->num_output_ / this->group_,
                                    height_out,
                                    width_out,
                                    this->num_output_ * height_out * width_out,
                                    height_out * width_out,
                                    width_out,
                                    1);
      cudnn::setConvolutionDesc<Dtype>(&conv_descs_[i],
                                       top_descs_[i],
                                       filter_desc_,
                                       pad_h,
                                       pad_w,
                                       stride_h,
                                       stride_w);

#if CUDNN_VERSION_MIN(8, 0, 0)
      // choose forward algorithm for filter
      // in forward filter the CUDNN_CONVOLUTION_FWD_ALGO_WINOGRAD_NONFUSED is not implemented in cuDNN 8
      CUDNN_CHECK(cudnnGetConvolutionForwardAlgorithm_v7(handle_[0],
                                                         top_descs_[i],
                                                         filter_desc_,
                                                         conv_descs_[i],
                                                         bottom_descs_[i],
                                                         4,
                                                         &RetCnt,
                                                         fwd_algo_pref_));

      found_conv_algorithm = false;
      for (int n = 0; n < RetCnt; n++)
      {
        if (fwd_algo_pref_[n].status == CUDNN_STATUS_SUCCESS &&
            fwd_algo_pref_[n].algo != CUDNN_CONVOLUTION_FWD_ALGO_WINOGRAD_NONFUSED &&
            fwd_algo_pref_[n].memory < free_memory)
        {
          found_conv_algorithm = true;
          fwd_algo_[i] = fwd_algo_pref_[n].algo;
          workspace_fwd_sizes_[i] = fwd_algo_pref_[n].memory;
          break;
        }
      }
      if (!found_conv_algorithm)
        LOG(ERROR) << "cuDNN did not return a suitable algorithm for convolution.";
      else
      {
        // choose backward algorithm for filter
        // for better or worse, just a fixed constant due to the missing
        // cudnnGetConvolutionBackwardFilterAlgorithm in cuDNN version 8.0
        bwd_filter_algo_[i] = CUDNN_CONVOLUTION_BWD_FILTER_ALGO_0;
        // twice the amount of the forward search to be save
        workspace_bwd_filter_sizes_[i] = 2 * workspace_fwd_sizes_[i];
      }

      // choose backward algo for data
      CUDNN_CHECK(cudnnGetConvolutionBackwardDataAlgorithm_v7(handle_[0],
                                                              filter_desc_,
                                                              bottom_descs_[i],
                                                              conv_descs_[i],
                                                              top_descs_[i],
                                                              4,
                                                              &RetCnt,
                                                              bwd_data_algo_pref_));

      found_conv_algorithm = false;
      for (int n = 0; n < RetCnt; n++)
      {
        if (bwd_data_algo_pref_[n].status == CUDNN_STATUS_SUCCESS &&
            bwd_data_algo_pref_[n].algo != CUDNN_CONVOLUTION_BWD_DATA_ALGO_WINOGRAD &&
            bwd_data_algo_pref_[n].algo != CUDNN_CONVOLUTION_BWD_DATA_ALGO_WINOGRAD_NONFUSED &&
            bwd_data_algo_pref_[n].memory < free_memory)
        {
          found_conv_algorithm = true;
          bwd_data_algo_[i] = bwd_data_algo_pref_[n].algo;
          workspace_bwd_data_sizes_[i] = bwd_data_algo_pref_[n].memory;
          break;
        }
      }
      if (!found_conv_algorithm)
        LOG(ERROR) << "cuDNN did not return a suitable algorithm for convolution.";
#else
      // choose forward and backward algorithms + workspace(s)
      CUDNN_CHECK(cudnnGetConvolutionForwardAlgorithm(
          handle_[0],
          top_descs_[i],
          filter_desc_,
          conv_descs_[i],
          bottom_descs_[i],
          CUDNN_CONVOLUTION_FWD_SPECIFY_WORKSPACE_LIMIT,
          workspace_limit_bytes,
          &fwd_algo_[i]));

      // We have found that CUDNN_CONVOLUTION_FWD_ALGO_IMPLICIT_PRECOMP_GEMM is
      // buggy. Thus, if this algo was chosen, choose winograd instead. If
      // winograd is not supported or workspace is larger than threshold, choose
      // implicit_gemm instead.
      if (fwd_algo_[i] == CUDNN_CONVOLUTION_FWD_ALGO_IMPLICIT_PRECOMP_GEMM)
      {
        size_t winograd_workspace_size;
        cudnnStatus_t status = cudnnGetConvolutionForwardWorkspaceSize(
            handle_[0],
            top_descs_[i],
            filter_desc_,
            conv_descs_[i],
            bottom_descs_[i],
            CUDNN_CONVOLUTION_FWD_ALGO_WINOGRAD,
            &winograd_workspace_size);
        if (status != CUDNN_STATUS_SUCCESS ||
            winograd_workspace_size >= workspace_limit_bytes)
        {
          fwd_algo_[i] = CUDNN_CONVOLUTION_FWD_ALGO_IMPLICIT_GEMM;
        }
        else
        {
          fwd_algo_[i] = CUDNN_CONVOLUTION_FWD_ALGO_WINOGRAD;
        }
      }

      CUDNN_CHECK(cudnnGetConvolutionForwardWorkspaceSize(
          handle_[0],
          top_descs_[i],
          filter_desc_,
          conv_descs_[i],
          bottom_descs_[i],
          fwd_algo_[i],
          &(workspace_fwd_sizes_[i])));

      // choose backward algorithm for filter
      CUDNN_CHECK(cudnnGetConvolutionBackwardFilterAlgorithm(
          handle_[0],
          top_descs_[i],
          bottom_descs_[i],
          conv_descs_[i],
          filter_desc_,
          CUDNN_CONVOLUTION_BWD_FILTER_SPECIFY_WORKSPACE_LIMIT,
          workspace_limit_bytes,
          &bwd_filter_algo_[i]));

      // get workspace for backwards filter algorithm
      CUDNN_CHECK(cudnnGetConvolutionBackwardFilterWorkspaceSize(
          handle_[0],
          top_descs_[i],
          bottom_descs_[i],
          conv_descs_[i],
          filter_desc_,
          bwd_filter_algo_[i],
          &workspace_bwd_filter_sizes_[i]));

      // choose backward algo for data
      CUDNN_CHECK(cudnnGetConvolutionBackwardDataAlgorithm(
          handle_[0],
          filter_desc_,
          bottom_descs_[i],
          conv_descs_[i],
          top_descs_[i],
          CUDNN_CONVOLUTION_BWD_DATA_SPECIFY_WORKSPACE_LIMIT,
          workspace_limit_bytes,
          &bwd_data_algo_[i]));

      // get workspace size
      CUDNN_CHECK(cudnnGetConvolutionBackwardDataWorkspaceSize(
          handle_[0],
          filter_desc_,
          bottom_descs_[i],
          conv_descs_[i],
          top_descs_[i],
          bwd_data_algo_[i],
          &workspace_bwd_data_sizes_[i]));
#endif
    }

    // reduce over all workspace sizes to get a maximum to allocate / reallocate
    size_t total_workspace_fwd = 0;
    size_t total_workspace_bwd_data = 0;
    size_t total_workspace_bwd_filter = 0;

    for (size_t i = 0; i < bottom.size(); i++)
    {
      total_workspace_fwd = std::max(total_workspace_fwd,
                                     workspace_fwd_sizes_[i]);
      total_workspace_bwd_data = std::max(total_workspace_bwd_data,
                                          workspace_bwd_data_sizes_[i]);
      total_workspace_bwd_filter = std::max(total_workspace_bwd_filter,
                                            workspace_bwd_filter_sizes_[i]);
    }
    // get max over all operations
    size_t max_workspace = std::max(total_workspace_fwd,
                                    total_workspace_bwd_data);
    max_workspace = std::max(max_workspace, total_workspace_bwd_filter);
    // ensure all groups have enough workspace
    size_t total_max_workspace = max_workspace *
                                 (this->group_ * CUDNN_STREAMS_PER_GROUP);

    // this is the total amount of storage needed over all groups + streams
    if (total_max_workspace > workspaceSizeInBytes)
    {
      DLOG(INFO) << "Reallocating workspace storage: " << total_max_workspace;
      workspaceSizeInBytes = total_max_workspace;

      // free the existing workspace and allocate a new (larger) one
      cudaFree(this->workspaceData);

      cudaError_t err = cudaMalloc(&(this->workspaceData), workspaceSizeInBytes);
      if (err != cudaSuccess)
      {
        // force zero memory path
        for (int i = 0; i < bottom.size(); i++)
        {
          workspace_fwd_sizes_[i] = 0;
          workspace_bwd_filter_sizes_[i] = 0;
          workspace_bwd_data_sizes_[i] = 0;
          fwd_algo_[i] = CUDNN_CONVOLUTION_FWD_ALGO_FFT_TILING;
          bwd_filter_algo_[i] = CUDNN_CONVOLUTION_BWD_FILTER_ALGO_0;
          bwd_data_algo_[i] = CUDNN_CONVOLUTION_BWD_DATA_ALGO_0;
        }

        // NULL out all workspace pointers
        for (int g = 0; g < (this->group_ * CUDNN_STREAMS_PER_GROUP); g++)
        {
          workspace[g] = NULL;
        }
        // NULL out underlying data
        workspaceData = NULL;
        workspaceSizeInBytes = 0;
      }

      // if we succeed in the allocation, set pointer aliases for workspaces
      for (int g = 0; g < (this->group_ * CUDNN_STREAMS_PER_GROUP); g++)
      {
        workspace[g] = reinterpret_cast<char *>(workspaceData) + g * max_workspace;
      }
    }

    // Tensor descriptor for bias.
    if (this->bias_term_)
    {
      cudnn::setTensor4dDesc<Dtype>(
          &bias_desc_, 1, this->num_output_ / this->group_, 1, 1);
    }
  }

  template <typename Dtype>
  CuDNNDeconvolutionLayer<Dtype>::~CuDNNDeconvolutionLayer()
  {
    // Check that handles have been setup before destroying.
    if (!handles_setup_)
    {
      return;
    }

    for (int i = 0; i < bottom_descs_.size(); i++)
    {
      cudnnDestroyTensorDescriptor(bottom_descs_[i]);
      cudnnDestroyTensorDescriptor(top_descs_[i]);
      cudnnDestroyConvolutionDescriptor(conv_descs_[i]);
    }
    if (this->bias_term_)
    {
      cudnnDestroyTensorDescriptor(bias_desc_);
    }
    cudnnDestroyFilterDescriptor(filter_desc_);

    for (int g = 0; g < this->group_ * CUDNN_STREAMS_PER_GROUP; g++)
    {
      cudaStreamDestroy(stream_[g]);
      cudnnDestroy(handle_[g]);
    }

    cudaFree(workspaceData);
    delete[] workspace;
    delete[] stream_;
    delete[] handle_;
    delete[] fwd_algo_;
    delete[] bwd_filter_algo_;
    delete[] bwd_data_algo_;
    delete[] workspace_fwd_sizes_;
    delete[] workspace_bwd_data_sizes_;
    delete[] workspace_bwd_filter_sizes_;
  }

  INSTANTIATE_CLASS(CuDNNDeconvolutionLayer);

} // namespace caffe
#endif
```

</Details>

由于cuDNN对代码进行了改版，在cudnn.h文件中不再指出cudnn的版本号，而是放在了cudnn_version.h文件中，所以，将cudnn_version.h中对于版本段的代码复制到cudnn.h文件中，代码如下：

```bash
locate cudnn_version.h
```

```bash
sudo gedit /usr/local/cuda/targets/x86_64-linux/include/cudnn_version.h
```

![d02f7f01b16e41a1a5528d664a6623f2](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:08_d02f7f01b16e41a1a5528d664a6623f2.png)

复制其中的非注释部分：

![841eda431c924b86bd9b14cc93472420](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:14_841eda431c924b86bd9b14cc93472420.png)

```bash
sudo gedit /usr/local/cuda/targets/x86_64-linux/include/cudnn.h
```

粘贴到最开头：

![828bd6d08d3c4c8990d2227e667cfc98](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:15_828bd6d08d3c4c8990d2227e667cfc98.png)

然后打开caffe包下的cudnn.hpp文件并指定cudnn.h路径：

![8a8df47d267a4f35a0e641ea1e4057c4](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:15_8a8df47d267a4f35a0e641ea1e4057c4.png)

之后重新执行编译：

```bash
sudo make clean && make all -j$(nproc)
```

生成以下静态库和共享库文件：

![a97e353858cb415487b0c511e20a3d8e](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:12_a97e353858cb415487b0c511e20a3d8e.png)

测试，时间较慢，耐心等待~

```bash
sudo make test -j$(nproc)
```

```bash
sudo make runtest -j$(nproc)
```

```bash
sudo make pycaffe -j$(nproc)
```

可能会有报错，但问题不大，我们只是需要那些库文件~

## 24.安装libfreenect2

```bash
git clone https://github.com/OpenKinect/libfreenect2.git libfreenect2
```

或公益加速源：

```bash
git clone https://mirror.ghproxy.com/https://github.com/OpenKinect/libfreenect2.git libfreenect2
```

```bash
cd libfreenect2 && mkdir build && cd build/
```

```bash
cmake -j$(nproc) .. -DENABLE_CXX11=ON
```

```bash
sudo make -j$(nproc)
```

![6cadc0a213e2406ba85889e9723ad7c6](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:18_6cadc0a213e2406ba85889e9723ad7c6.png)

```bash
sudo make install
```

![472362d895074bb6bfe40f6ca40a91f8](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:28_472362d895074bb6bfe40f6ca40a91f8.png)

```bash
sudo cp ../platform/linux/udev/90-kinect2.rules /etc/udev/rules.d/
```

## 25.安装vtk8.2.0及PCL1.9.1

[https://vtk.org/download/](https://vtk.org/download/)

下载VTK-8.2.0.zip

![6895bcbb15424c2db7b82265cd3873d5](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:16_6895bcbb15424c2db7b82265cd3873d5.png)

解压之后，进入文件夹打开终端：

```bash
sudo apt install cmake-gui && mkdir build && cd  build && cmake-gui
```

![19c7fca7f8e745cd8f97283961027dbb](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:16_19c7fca7f8e745cd8f97283961027dbb.png)

单击Configure后勾选以下两项后单击Configure和Generate

![5889f9e275ba4d33a6506a89ee9e00e9](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:16_5889f9e275ba4d33a6506a89ee9e00e9.png)

![20fd96ee42a5447f9715388b48670d2b](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:17_20fd96ee42a5447f9715388b48670d2b.png)

```bash
sudo make -j$(nproc)
```

![fd63a2d3317447d5b982c5a1c6defc59](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:34_fd63a2d3317447d5b982c5a1c6defc59.png)

```bash
sudo make install
```

![image-20240206162428124](https://static.m0rtzz.com/images/Year:2024/Month:03/Day:10/17:39:26_16_24_28_image-20240206162428124.png)

接下来安装pcl：

```bash
git clone -b pcl-1.9.1 https://github.com/PointCloudLibrary/pcl.git pcl-1.9.1
```

或公益加速源：

```bash
git clone -b pcl-1.9.1 https://mirror.ghproxy.com/https://github.com/PointCloudLibrary/pcl.git pcl-1.9.1
```

之后进入文件夹打开终端输入：

```bash
mkdir release && cd release
```

```bash
cmake -D CMAKE_BUILD_TYPE=None \
-D CMAKE_INSTALL_PREFIX=/usr \
-D BUILD_GPU=ON-DBUILD_apps=ON \
-D BUILD_examples=ON \
-D CMAKE_INSTALL_PREFIX=/usr \
-j$(nproc) ..
```

![d8596882117248859b7c3cb104b19d13](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:17_d8596882117248859b7c3cb104b19d13.png)

```bash
sudo make -j$(nproc)
```

![8d1ac3a5ef5f417aa47abf5f5172ff1e](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:18_8d1ac3a5ef5f417aa47abf5f5172ff1e.png)

```bash
sudo make install
```

![69d7d955c7f24ab4926dadd31dddfb04](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:18_69d7d955c7f24ab4926dadd31dddfb04.png)

## 26.安装CarlaUE4

> [!IMPORTANT]
>
> 必须是[CarlaUnreal的UE仓库中的carla分支](https://github.com/CarlaUnreal/UnrealEngine/tree/carla)才可以通过安装Carla时的编译。

```bash
find . -name "*.sh" -exec dos2unix {} +
```

```bash
find . -name "*.sh" -exec chmod +x {} +
```

```bash
sudo chown -R m0rtzz: *
```

若报错：

![2ea1050777ac49fbb8a0986e34d3140e](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:30:50_2ea1050777ac49fbb8a0986e34d3140e.png)

因Epic更新了gitdeps，但Github上却没有更新，所以需要进入Github官方仓库release界面寻找对应版本的Commit.gitdeps.xml替换原来的文件即可：

[https://github.com/EpicGames/UnrealEngine/releases/tag](https://github.com/EpicGames/UnrealEngine/releases/tag)

若报错：

![a430a7833c97404cae877a549b6b2322](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:18_a430a7833c97404cae877a549b6b2322.png)

鄙人认为是因执行Setup.sh脚本未赋予root权限导致依赖未安装完整，所以再次执行：

```bash
sudo ./Setup.sh
```

```cpp
// @file : CubemapUnwrapUtils.cpp

// Use
RHICmdList.GetBoundVertexShader() instead of GetVertexShader()
RHICmdList.GetBoundPixelShader() instead of GetPixelShader()

// Instead of the given macros, use code as below.
GraphicsPSOInit.BoundShaderState.VertexShaderRHI = VertexShader.GetVertexShader();
GraphicsPSOInit.BoundShaderState.PixelShaderRHI = PixelShader.GetPixelShader();
```

[http://cdn.unrealengine.com/Toolchain_Linux/native-linux-v17_clang-10.0.10centos.tar.gz](http://cdn.unrealengine.com/Toolchain_Linux/native-linux-v17_clang-10.0.10centos.tar.gz)

```bash
cd your-path/UnrealEngine_4.26/Engine/Extras/ThirdPartyNotUE/SDKs/HostLinux/Linux_x64/
```

```bash
tar -zxvf native-linux-v17_clang-10.0.1-centos7.tar.gz
```

## 27.安装CARLA0.9.14（添加fisheye sensor模块）

修改Update.sh下载网址为南方科技大学镜像站的网址：

```bash
#CONTENT_LINK=http://carla-assets.s3.amazonaws.com/${CONTENT_ID}.tar.gz
CONTENT_LINK=https://mirrors.sustech.edu.cn/carla/carla_content/${CONTENT_ID}.tar.gz
```

```cpp
// @file : test_streaming.cpp

// Line 58
carla::streaming::low_level::Server<tcp::Server> srv(io.service, TESTING_PORT);

// Line 63
carla::streaming::low_level::Client<tcp::Client> c;

// Line 93
carla::streaming::low_level::Server<tcp::Server> srv(io.service, TESTING_PORT);

// Line 96
carla::streaming::low_level::Client<tcp::Client> c;
```

```bash
# @file : Package.sh(https://github.com/annaornatskaya/carla/tree/fisheye-sensor)

  # copy_if_changed "./Plugins/" "${DESTINATION}/Plugins/"

  copy_if_changed "./Unreal/CarlaUE4/Content/Carla/HDMaps/*.pcd" "${DESTINATION}/HDMaps/"
  copy_if_changed "./Unreal/CarlaUE4/Content/Carla/HDMaps/Readme.md" "${DESTINATION}/HDMaps/README"

  # NOTE: Modified by M0rtzz
  if [ -d "./Plugins/" ] ; then
    copy_if_changed "./Plugins/" "${DESTINATION}/Plugins/"
  fi
```

## 28.P.S

推荐一些linux办公常用的软件（linux版，不包括wine环境下，全部下载deb格式的安装包，系统架构可通过命令uname -a查看）：

[百度网盘](https://pan.baidu.com/download#linux)

[向日葵](https://sunlogin.oray.com/download/linux?type=personal)

[ToDesk](https://www.todesk.com/linux.html)

[QQ](https://im.qq.com/linuxqq/index.shtml)

[腾讯会议](https://meeting.tencent.com/download?mfrom=OfficialIndex_TopBanner1_Download)

[WPS Office](https://linux.wps.cn/)

[搜狗输入法](https://shurufa.sogou.com/)（下载安装包后，官方会跳转至安装教程，严格按照步骤执行）

[Visual Studio Code](https://code.visualstudio.com/docs/?dv=linux64_deb)（推荐打开Settings Sync，换电脑时设置可以同步）

![195197efec704c98ba8f61ecc4c8370a.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:43_195197efec704c98ba8f61ecc4c8370a.png)

![bd3b7b33a2744c5cb67011223648eabf.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:29:50_bd3b7b33a2744c5cb67011223648eabf.png)

[星火应用商店](https://www.spark-app.store/download)

仅支持Ubuntu20.04，需安装依赖包：

![image-20240718162329579](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/16:23:29_image-20240718162329579.png)

[Linux原生微信\_需要安装星火应用商店（最近的版本好像使用Fcitx输入法时中文输入有问题）](spk://store/chat/store.spark-app.wechat-linux-spark)

![image-20240718202231084](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/20:22:31_image-20240718202231084.png)

Ubuntu20.04以下版本或者不想安装星火应用商店的用户可安装Flatpak打包的微信（需安装Flatpak，下文有Flatpak安装教程）：

解决基于Fcitx5的搜狗输入法无法在Flatpak版微信中进行中文输入的问题：[https://github.com/web1n/wechat-universal-flatpak/issues/33#issuecomment-2222259823](https://github.com/web1n/wechat-universal-flatpak/issues/33#issuecomment-2222259823)

```bash
wget -q --show-progress https://github.com/web1n/wechat-universal-flatpak/releases/latest/download/com.tencent.WeChat-x86_64.flatpak -O com.tencent.WeChat-x86_64.flatpak && sudo flatpak install ./com.tencent.WeChat-x86_64.flatpak
```

可以水平和垂直分割的终端：

```bash
sudo apt install terminator
```

![74c734b7ca9e4cc5a68246b4f8a73ee3.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:19_74c734b7ca9e4cc5a68246b4f8a73ee3.png)

trash命令：

```bash
sudo apt install trash-cli
```

tree命令：

```bash
sudo apt install tree
```

![5434b41e73244f8f941b795586faaea2.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:19_5434b41e73244f8f941b795586faaea2.png)

![c344c03378a74cdca9e9585f3c3c14d8.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/17:30:05_c344c03378a74cdca9e9585f3c3c14d8.png)

查看系统信息：

```bash
sudo apt install neofetch
```

![image-20240720105620903](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:56:21_image-20240720105620903.png)

或安装用C语言写的更快的`fastfetch`：

```bash
wget -q --show-progress https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb -O fastfetch-linux-amd64.deb && sudo apt install -y ./fastfetch-linux-amd64.deb
```

![image-20240720105657155](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:56:57_image-20240720105657155.png)

rar文件解压工具：

```bash
sudo apt install unrar
```

解决不能观看MP4文件：

```bash
sudo apt update
```

```bash
sudo apt install libdvdnav-dev libdvdread-dev gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly libdvd-pkg
```

```bash
sudo apt install ubuntu-restricted-extras
```

```bash
sudo dpkg-reconfigure libdvd-pkg
```

系统优化：

```bash
sudo apt update
```

```bash
sudo apt install gnome-tweak-tool
```

命令启动：

```bash
gnome-tweaks
```

或：

![image-20240718201417588](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/20:14:18_image-20240718201417588.png)

![image-20240718155818281](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/15:58:18_image-20240718155818281.png)

剪贴板管理工具：

```bash
sudo add-apt-repository ppa:diodon-team/stable
sudo apt update && sudo apt install diodon
```

然后使用刚才安装的优化工具将`diodon`设置为开机自启动：

![2024-07-18](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/16:02:27_2024-07-18.png)

这样就实现了类似于`Windows`下`Win + V`的剪贴板功能：

![image-20240718160648762](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/16:06:48_image-20240718160648762.png)

另外可使用中科大反向代理`Canonical`的`ppa仓库`：

> [!TIP]
>
> 将`/etc/apt/sources.list.d`下`.list`文件中的`http://ppa.launchpad.net`替换为`https://launchpad.proxy.ustclug.org`即可，建议替换前先`sudo cp /etc/apt/sources.list.d/your-file.list /etc/apt/sources.list.d/your-file.list.save`备份一下（请自行替换文件名）

![image-20240720105759025](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:57:59_image-20240720105759025.png)

Flatpak：

Ubuntu 18.10 (Cosmic Cuttlefish) or later：

```bash
sudo apt install flatpak
```

Older Ubuntu versions：

```bash
sudo add-apt-repository ppa:flatpak/stable
sudo apt update
sudo apt install flatpak
```

FlatHub上交镜像源：

[https://mirrors.sjtug.sjtu.edu.cn/docs/flathub](https://mirrors.sjtug.sjtu.edu.cn/docs/flathub)

切换之后更新Flatpak应用将加速：

```bash
sudo flatpak update
```

火狐浏览器优化：

地址栏输入：

```ini
about:config
```

![4700bc61b15141609ce55f97e9334034](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:20_4700bc61b15141609ce55f97e9334034.png)

```ini
full-screen-api.warning.timeout
```

设置为0~

```ini
full-screen-api.transition-duration.enter
```

和

```ini
full-screen-api.transition-duration.leave
```

都设置为0 0~

```ini
browser.search.openintab
```

```ini
browser.urlbar.openintab
```

```ini
browser.tabs.loadBookmarksInTabs
```

都设置为true~
