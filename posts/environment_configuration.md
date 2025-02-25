# ZZU-RoboCup环境配置

**Updating（最速更新链接【支持一些扩展语法，观感良好】）：[博客](https://www.m0rtzz.com/posts/3)）...**

> [!IMPORTANT]
>
> **ZZU-SR**的童鞋配置环境前可以给鄙人发邮件：[E-mail](mailto:m0rtzz@stu.zzu.edu.cn)，另外：
>
> ***如果装了***`Anaconda3/Miniconda3`***，最好设置***`auto_activate_base: false`***，或者需要编译时***`conda deactivate`***，否则会影响编译。***
>
> 本文根据重要程度对各个步骤进行分类：
>
> - ESSENTIAL (必需)
> - RECOMMENDED (推荐)
> - OPTIONAL (可选)
> - NOT RECOMMENDED (不宜)
> - NOT REQUIRED (无需)
> - EOL (停更)

---

本文用到的部分文件打包供无法访问部分网站的童鞋下载 (**EOL**)：

链接:

[https://pan.baidu.com/s/1PgmWHKl8oyX_cWYx_uZJrg?pwd=zwz4](https://pan.baidu.com/s/1PgmWHKl8oyX_cWYx_uZJrg?pwd=zwz4)

提取码:

zwz4

---

## ESSENTIAL

刚进入系统一段时间，系统会通知是否更新到新版本的系统（比如Ubuntu20.04 → Ubuntu22.04 or Later），选择否，之后会询问是否更新系统组件，选择否。

阻止软件更新弹窗：

打开终端输入：

```bash
sudo chmod a-x /usr/bin/update-notifier
```

将关机时间从90秒换为5秒：

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

### 更换国内源（可替换为自己中意的镜像源）

```bash
sudo gedit /etc/apt/sources.list
```

将原本的注释掉，在最下方加入:

```bash
# 华科源（Ubuntu 18.04）【默认注释了源码仓库，如有需要可自行取消注释】
deb https://mirrors.hust.edu.cn/ubuntu bionic main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu bionic main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu bionic-updates main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu bionic-updates main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu bionic-backports main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu bionic-backports main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu bionic-security main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu bionic-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.hust.edu.cn/ubuntu bionic-proposed main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu bionic-proposed main restricted universe multiverse
```

```bash
# 华科源（Ubuntu 20.04）【默认注释了源码仓库，如有需要可自行取消注释】
deb https://mirrors.hust.edu.cn/ubuntu focal main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu focal main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu focal-updates main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu focal-updates main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu focal-backports main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu focal-backports main restricted universe multiverse

deb https://mirrors.hust.edu.cn/ubuntu focal-security main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu focal-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.hust.edu.cn/ubuntu focal-proposed main restricted universe multiverse
# deb-src https://mirrors.hust.edu.cn/ubuntu focal-proposed main restricted universe multiverse
```

```bash
sudo apt update -y && sudo apt upgrade -y
```

`anaconda`镜像源（`~/.condarc`）:

> [!TIP]
>
> **注意替换**`envs_dirs`**中的绝对路径！**
>
> `custom_channels`中鄙人只填了自己可能用到的，其它第三方源列表可参考[清华源的文档](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda)自行添加。

```yaml
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/pro
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  numba: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pyviz: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  omnia: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  ohmeta: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  plotly: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  fastai: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  caffe2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  Paddle: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  dglteam: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  rapidsai: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  MindSpore: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch3d: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-test: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  nvidia: https://mirrors.sustech.edu.cn/anaconda-extra/cloud

envs_dirs:
  - /home/m0rtzz/Programs/anaconda3/envs
  
auto_activate_base: false
```

`pip`设置镜像源：

```bash
mkdir -p ${HOME}/.config/pip/ && cd ${HOME}/.config/pip/ && \
tee ${HOME}/.config/pip/pip.conf > /dev/null << EOF
[global]
index-url = https://mirrors.hust.edu.cn/pypi/web/simple

extra-index-url =
    https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
    https://mirrors.bfsu.edu.cn/pypi/web/simple
    # https://pypi.nvidia.com
    # https://pypi.ngc.nvidia.com

trusted-host =
    mirrors.hust.edu.cn
    mirrors.tuna.tsinghua.edu.cn
    mirrors.bfsu.edu.cn
    pypi.nvidia.com
    pypi.ngc.nvidia.com

no-cache-dir = true
EOF
```

### 禁用Nouveau驱动

```bash
sudo tee -a /etc/modprobe.d/blacklist.conf > /dev/null << EOF
# 禁用Nouveau驱动
blacklist nouveau
options nouveau modeset=0
EOF
```

```bash
sudo update-initramfs -u
```

```bash
reboot
```

### NVIDIA驱动

> [!CAUTION]
>
> 由于众所周知的原因，安装`NVIDIA`显卡驱动有可能会损坏系统，如果损坏可以重装并看看网上的其他教程，鄙人曾经尝试过多种方法，认定这种方法最快捷且最不容易损坏系统。

打开终端，输入：

```bash
sudo apt install -y gcc g++ make zlib1g
```

```bash
sudo ubuntu-drivers devices
```

![image-20240827102555812](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:27/10:25:56_image-20240827102555812.png)

寻找带有`recommended`的版本，输入：

```bash
# `your_version`是你的版本号
sudo apt install -y nvidia-driver-your_version nvidia-settings nvidia-prime
```

```bash
sudo apt update -y
```

```bash
sudo apt upgrade -y
```

```bash
reboot
```

验证版本：

```bash
nvidia-smi
```

![image-20240720105532528](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:55:32_image-20240720105532528.png)

### CUDA

[https://developer.nvidia.com/cuda-toolkit-archive](https://developer.nvidia.com/cuda-toolkit-archive)

选择≤上一步`nvidia-smi`显示的`CUDA Version`进行安装，官方有教程。

安装好之后打开终端输入：

```bash
sudo tee -a /etc/profile > /dev/null << 'EOF'
# CUDA
export PATH=${PATH}:/usr/local/cuda/bin
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/local/cuda/lib64
export CUDA_HOME=/usr/local/cuda # 通过设置软链接`/usr/local/cuda`，可以做到多版本CUDA共存
EOF
```

```bash
source /etc/profile
```

接下来验证`CUDA`版本：

```bash
nvcc --version
```

![image-20240720105543634](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:55:43_image-20240720105543634.png)

安装成功！

### cuDNN

[https://developer.nvidia.com/rdp/cudnn-archive](https://developer.nvidia.com/rdp/cudnn-archive)

> [!TIP]
>
> 官方安装教程（选择合适版本的**NVIDIA cuDNN Installation Guide**，鄙人一般来说会安装和已安装`CUDA`的发布时间相近的版本，之前安装`PaddlePaddle`的时候发现`GPU`版`PaddlePaddle`依赖库要求的`CUDA`工具包版本和`cuDNN`版本貌似也是这样对应的）：
>
> [https://docs.nvidia.com/deeplearning/cudnn/archives/index.html](https://docs.nvidia.com/deeplearning/cudnn/archives/index.html)

```bash
tar -xvf cudnn-linux-x86_64-8.x.x.x_cudaX.Y-archive.tar.xz
sudo cp cudnn-*-archive/include/cudnn*.h /usr/local/cuda/include
sudo cp -P cudnn-*-archive/lib/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*
```

验证是否安装成功：

```bash
cat /usr/local/cuda/include/cudnn_version.h | grep CUDNN_MAJOR -A 2
```

![image-20240720105555452](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:55:55_image-20240720105555452.png)

### ROS-noetic（有些图忘记截了）

```bash
sudo gpg --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```bash
sudo gpg --export C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654 | sudo tee /usr/share/keyrings/ros.gpg > /dev/null
```

```bash
sudo tee /etc/apt/sources.list.d/ros-latest.list > /dev/null << EOF
deb [signed-by=/usr/share/keyrings/ros.gpg] https://mirrors.hust.edu.cn/ros/ubuntu/ $(lsb_release -sc) main
EOF
```

```bash
sudo apt update -y && sudo apt install -y ros-noetic-desktop-full
```

```bash
echo 'source /opt/ros/noetic/setup.bash' >> ~/.bashrc
source ~/.bashrc
```

```bash
sudo apt install -y python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential
```

```bash
sudo apt install -y python3-pip
```

使用镜像源加速`pip`下载：

```bash
sudo pip3 install rosdepc -i https://mirrors.hust.edu.cn/pypi/web/simple
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

![image-20240827102731991](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:27/10:27:32_image-20240827102731991.png)

再新建两个终端，分别输入：

```bash
rosrun turtlesim turtlesim_node
```

```bash
rosrun turtlesim turtle_teleop_key
```

在 `rosrun turtlesim turtle_teleop_key`所在终端点击一下任意位置，然后使用`←↕→`小键盘控制，看小海龟会不会动，如果会动则安装成功。

![image-20240827102929723](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:27/10:29:30_image-20240827102929723.png)

### OpenCV-4.2.0及其扩展模块

***经尝试多版本Ubuntu和OpenCV，装Ubuntu20.04，ROS noetic和OpenCV4.2.0及其扩展模块才能解决将彩色图像转换为网络所需的输入Blob后前馈时抛出的***`raised OpenCV exception`和`error: (-215:Assertion failed)`***等错误。***

#### cmake命令

以下为几次成功安装的命令（**注意替换命令中的绝对路径**），安装过程可以参考**NOT RECOMMENDED**中的`OpenCV3`安装步骤：

```bash
cmake \
-D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK=ON \
-D WITH_VTK=ON \
-D WITH_ADE=OFF \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_OPENMP=ON \
-D WITH_LAPACK=OFF \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_GENERATION=Auto \
-D CUDA_CUDA_LIBRARY=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-4.2.0/opencv_contrib-4.2.0/modules \
..
```

或：

```bash
cmake \
-D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK=ON \
-D WITH_VTK=ON \
-D WITH_ADE=OFF \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_OPENMP=ON \
-D WITH_LAPACK=OFF \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_GENERATION=Auto \
-D CUDA_CUDA_LIBRARY=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D CUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda \
-D CUDNN_LIBRARY=/usr/local/cuda/lib64/libcudnn.so \
-D CUDA_CUDA_LIBRARY=/usr/local/cuda/lib64/stubs/libcuda.so \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-4.2.0/opencv_contrib-4.2.0/modules \
..
```

或：

```bash
cmake \
-D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK=ON \
-D WITH_VTK=ON \
-D WITH_ADE=OFF \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_OPENMP=ON \
-D WITH_LAPACK=OFF \
-D CUDA_ARCH_BIN=8.6 \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_GENERATION=Auto \
-D CUDA_CUDA_LIBRARY=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D CUDA_HOST_COMPILER:FILEPATH=/usr/bin/gcc \
-D CUDNN_LIBRARY=/usr/local/cuda/lib64/libcudnn.so \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-4.2.0/opencv_contrib-4.2.0/modules \
..
```

`CUDA_ARCH_BIN`查看命令：

```bash
sudo apt install -y mlocate
sudo updatedb.mlocate
mlocate deviceQuery | grep cuda | head -n 1 | xargs -r bash -c | grep 'CUDA Capability Major/Minor version number:'
```

![image-20240824153854954](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:24/15:38:55_image-20240824153854954.png)

#### 部分报错解决办法

##### cuDNN8.X相关

###### 无法识别cuDNN版本

![image-20240826153451298](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/15:34:51_image-20240826153451298.png)

解决办法：

```cmake
# @file: $(git rev-parse --show-toplevel)/cmake/FindCUDNN.cmake

# @line: 66左右
# extract version from the include
if(CUDNN_INCLUDE_DIR)
  file(READ "${CUDNN_INCLUDE_DIR}/cudnn.h" CUDNN_H_CONTENTS) # [!code --]
  if(EXISTS "${CUDNN_INCLUDE_DIR}/cudnn_version.h") # [!code ++]
    file(READ "${CUDNN_INCLUDE_DIR}/cudnn_version.h" CUDNN_H_CONTENTS) # [!code ++]
  else() # [!code ++]
    file(READ "${CUDNN_INCLUDE_DIR}/cudnn.h" CUDNN_H_CONTENTS) # [!code ++]
  endif() # [!code ++]

  string(REGEX MATCH "define CUDNN_MAJOR ([0-9]+)" _ "${CUDNN_H_CONTENTS}")
  set(CUDNN_MAJOR_VERSION ${CMAKE_MATCH_1} CACHE INTERNAL "")
  message("CUDNN_MAJOR_VERSION:" ${CUDNN_MAJOR_VERSION}) # [!code ++]
  string(REGEX MATCH "define CUDNN_MINOR ([0-9]+)" _ "${CUDNN_H_CONTENTS}")
  set(CUDNN_MINOR_VERSION ${CMAKE_MATCH_1} CACHE INTERNAL "")
  message("CUDNN_MINOR_VERSION:" ${CUDNN_MINOR_VERSION}) # [!code ++]
  string(REGEX MATCH "define CUDNN_PATCHLEVEL ([0-9]+)" _ "${CUDNN_H_CONTENTS}")
  set(CUDNN_PATCH_VERSION ${CMAKE_MATCH_1} CACHE INTERNAL "")
  message("CUDNN_PATCH_VERSION:" ${CUDNN_PATCH_VERSION}) # [!code ++]

  set(CUDNN_VERSION
    "${CUDNN_MAJOR_VERSION}.${CUDNN_MINOR_VERSION}.${CUDNN_PATCH_VERSION}"
    CACHE
    STRING # [!code --]
    INTERNAL # [!code ++]
    "cuDNN version"
  )

  unset(CUDNN_H_CONTENTS)
endif()
```

> ***Reference:***
>
> [https://github.com/opencv/opencv/issues/18697](https://github.com/opencv/opencv/issues/18697)

###### 添加cuDNN8.X支持

![image-20240826155810307](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/15:58:10_image-20240826155810307.png)

打补丁：

`.patch`文件：

```bash
cd $(git rev-parse --show-toplevel)/ && \
wget -q --show-progress https://raw.gitcode.com/M0rtzz/opencv4-cudnn8-support/raw/master/opencv_pr_17685.patch -O opencv_pr_17685.patch && \
git apply opencv_pr_17685.patch
```

或者手动加入PR代码：

`.diff`文件：

```bash
cd $(git rev-parse --show-toplevel)/ && \
wget -q --show-progress https://raw.gitcode.com/M0rtzz/opencv4-cudnn8-support/raw/master/opencv_pr_17685.diff -O opencv_pr_17685.diff
```

```cpp
// @brief: 行号是按照从上到下添加的顺序依次排列的
// @file: $(git rev-parse --show-toplevel)/modules/dnn/src/cuda4dnn/csl/cudnn/convolution.hpp

// @line: 226左右
                CUDA4DNN_CHECK_CUDNN(cudnnSetConvolutionGroupCount(descriptor, group_count));
/**/// [!code ++]
#if CUDNN_MAJOR >= 8 // [!code ++]
                /* cuDNN 7 and below use FMA math by default. cuDNN 8 includes TF32 Tensor Ops // [!code ++]
                 * in the default setting. TF32 convolutions have lower precision than FP32. // [!code ++]
                 * Hence, we set the math type to CUDNN_FMA_MATH to reproduce old behavior. // [!code ++]
                 */ // [!code ++]
                CUDA4DNN_CHECK_CUDNN(cudnnSetConvolutionMathType(descriptor, CUDNN_FMA_MATH)); // [!code ++]
#endif // [!code ++]
/**/// [!code ++]
                if (std::is_same<T, half>::value)

/********************************分割线********************************/               

// @line: 263左右
        ConvolutionAlgorithm(
            const Handle& handle, // [!code --]
            const ConvolutionDescriptor<T>& conv, // [!code --]
            const FilterDescriptor<T>& filter, // [!code --]
            const TensorDescriptor<T>& input, // [!code --]
            const TensorDescriptor<T>& output) // [!code --]
            const ConvolutionDescriptor<T>& convDesc, // [!code ++]
            const FilterDescriptor<T>& filterDesc, // [!code ++]
            const TensorDescriptor<T>& inputDesc, // [!code ++]
            const TensorDescriptor<T>& outputDesc) // [!code ++]

/********************************分割线********************************/               

// @line: 269左右
        {
#if CUDNN_MAJOR >= 8 // [!code ++]
            int requestedAlgoCount = 0, returnedAlgoCount = 0; // [!code ++]
            CUDA4DNN_CHECK_CUDNN(cudnnGetConvolutionForwardAlgorithmMaxCount(handle.get(), &requestedAlgoCount)); // [!code ++]
            std::vector<cudnnConvolutionFwdAlgoPerf_t> results(requestedAlgoCount); // [!code ++]
            CUDA4DNN_CHECK_CUDNN( // [!code ++]
                cudnnGetConvolutionForwardAlgorithm_v7( // [!code ++]
                    handle.get(), // [!code ++]
                    inputDesc.get(), filterDesc.get(), convDesc.get(), outputDesc.get(), // [!code ++]
                    requestedAlgoCount, // [!code ++]
                    &returnedAlgoCount, // [!code ++]
                    &results[0] // [!code ++]
                ) // [!code ++]
            ); // [!code ++]
/**/// [!code ++]
            size_t free_memory, total_memory; // [!code ++]
            CUDA4DNN_CHECK_CUDA(cudaMemGetInfo(&free_memory, &total_memory)); // [!code ++]
/**/// [!code ++]
            bool found_conv_algorithm = false; // [!code ++]
            for (int i = 0; i < returnedAlgoCount; i++) // [!code ++]
            { // [!code ++]
                if (results[i].status == CUDNN_STATUS_SUCCESS && // [!code ++]
                    results[i].algo != CUDNN_CONVOLUTION_FWD_ALGO_WINOGRAD_NONFUSED && // [!code ++]
                    results[i].memory < free_memory) // [!code ++]
                { // [!code ++]
                    found_conv_algorithm = true; // [!code ++]
                    algo = results[i].algo; // [!code ++]
                    workspace_size = results[i].memory; // [!code ++]
                    break; // [!code ++]
                } // [!code ++]
            } // [!code ++]
/**/// [!code ++]
            if (!found_conv_algorithm) // [!code ++]
                CV_Error (cv::Error::GpuApiCallError, "cuDNN did not return a suitable algorithm for convolution."); // [!code ++]
#else // [!code ++]
            CUDA4DNN_CHECK_CUDNN(

/********************************分割线********************************/               

// @line: 304左右
                cudnnGetConvolutionForwardAlgorithm(
                    handle.get(),
                    input.get(), filter.get(), conv.get(), output.get(), // [!code --]
                    inputDesc.get(), filterDesc.get(), convDesc.get(), outputDesc.get(), // [!code ++]
                    CUDNN_CONVOLUTION_FWD_PREFER_FASTEST,
    
/********************************分割线********************************/               

// @line: 314左右
                cudnnGetConvolutionForwardWorkspaceSize(
                    handle.get(),
                    input.get(), filter.get(), conv.get(), output.get(), // [!code --]
                    inputDesc.get(), filterDesc.get(), convDesc.get(), outputDesc.get(), // [!code ++]
                    algo, &workspace_size
       
/********************************分割线********************************/               

// @line: 320左右
            );
#endif // [!code ++]
        }

        ConvolutionAlgorithm& operator=(const ConvolutionAlgorithm&) = default;
```

```cpp
// @brief: 行号是按照从上到下添加的顺序依次排列的
// @file: $(git rev-parse --show-toplevel)/modules/dnn/src/cuda4dnn/csl/cudnn/transpose_convolution.hpp

// @line: 31左右
        TransposeConvolutionAlgorithm(
            const Handle& handle, // [!code --]
            const ConvolutionDescriptor<T>& conv, // [!code --]
            const FilterDescriptor<T>& filter, // [!code --]
            const TensorDescriptor<T>& input, // [!code --]
            const TensorDescriptor<T>& output) // [!code --]
            const ConvolutionDescriptor<T>& convDesc, // [!code ++]
            const FilterDescriptor<T>& filterDesc, // [!code ++]
            const TensorDescriptor<T>& inputDesc, // [!code ++]
            const TensorDescriptor<T>& outputDesc) // [!code ++]

/********************************分割线********************************/               

// @line: 31左右
        {
#if CUDNN_MAJOR >= 8 // [!code ++]
            int requestedAlgoCount = 0, returnedAlgoCount = 0; // [!code ++]
            CUDA4DNN_CHECK_CUDNN(cudnnGetConvolutionBackwardDataAlgorithmMaxCount(handle.get(), &requestedAlgoCount)); // [!code ++]
            std::vector<cudnnConvolutionBwdDataAlgoPerf_t> results(requestedAlgoCount); // [!code ++]
            CUDA4DNN_CHECK_CUDNN( // [!code ++]
                cudnnGetConvolutionBackwardDataAlgorithm_v7( // [!code ++]
                    handle.get(), // [!code ++]
                    filterDesc.get(), inputDesc.get(), convDesc.get(), outputDesc.get(), // [!code ++]
                    requestedAlgoCount, // [!code ++]
                    &returnedAlgoCount, // [!code ++]
                    &results[0] // [!code ++]
                ) // [!code ++]
            ); // [!code ++]
/**/// [!code ++]
            size_t free_memory, total_memory; // [!code ++]
            CUDA4DNN_CHECK_CUDA(cudaMemGetInfo(&free_memory, &total_memory)); // [!code ++]
/**/// [!code ++]
            bool found_conv_algorithm = false; // [!code ++]
            for (int i = 0; i < returnedAlgoCount; i++) // [!code ++]
            { // [!code ++]
                if (results[i].status == CUDNN_STATUS_SUCCESS && // [!code ++]
                    results[i].algo != CUDNN_CONVOLUTION_BWD_DATA_ALGO_WINOGRAD_NONFUSED && // [!code ++]
                    results[i].memory < free_memory) // [!code ++]
                { // [!code ++]
                    found_conv_algorithm = true; // [!code ++]
                    dalgo = results[i].algo; // [!code ++]
                    workspace_size = results[i].memory; // [!code ++]
                    break; // [!code ++]
                } // [!code ++]
            } // [!code ++]
/**/// [!code ++]
            if (!found_conv_algorithm) // [!code ++]
                CV_Error (cv::Error::GpuApiCallError, "cuDNN did not return a suitable algorithm for transpose convolution."); // [!code ++]
#else // [!code ++]
            CUDA4DNN_CHECK_CUDNN(

/********************************分割线********************************/               

// @line: 73左右
                cudnnGetConvolutionBackwardDataAlgorithm(
                    handle.get(),
                    filter.get(), input.get(), conv.get(), output.get(), // [!code --]
                    filterDesc.get(), inputDesc.get(), convDesc.get(), outputDesc.get(), // [!code ++]
                    CUDNN_CONVOLUTION_BWD_DATA_PREFER_FASTEST,
         
/********************************分割线********************************/               

// @line: 83左右
                cudnnGetConvolutionBackwardDataWorkspaceSize(
                    handle.get(),
                    filter.get(), input.get(), conv.get(), output.get(), // [!code --]
                    filterDesc.get(), inputDesc.get(), convDesc.get(), outputDesc.get(), // [!code ++]
                    dalgo, &workspace_size

/********************************分割线********************************/               

// @line: 88左右
            );
#endif // [!code ++]
        }

        TransposeConvolutionAlgorithm& operator=(const TransposeConvolutionAlgorithm&) = default;
```

> ***Reference:***
>
> [https://github.com/opencv/opencv/pull/17685/files](https://github.com/opencv/opencv/pull/17685/files)

---

##### CUDA11.X相关

因为`CUDA11.X`不再支持`CUDA_nppicom_LIBRARY`而报错：

![image-20240826130754825](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/13:07:55_image-20240826130754825.png)

解决办法：

```cmake
# @file: $(git rev-parse --show-toplevel)/cmake/OpenCVDetectCUDA.cmake

# @line: 29左右
if(CUDA_FOUND)
  set(HAVE_CUDA 1)
  if(CUDA_VERSION VERSION_GREATER_EQUAL "11.0") # [!code ++]
    # CUDA 11.X removes nppicom # [!code ++]
    ocv_list_filterout(CUDA_npp_LIBRARY "nppicom") # [!code ++]
    ocv_list_filterout(CUDA_nppi_LIBRARY "nppicom") # [!code ++]
  endif() # [!code ++]
  if(WITH_CUFFT)
```

![image-20240826153656145](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/15:36:56_image-20240826153656145.png)

> ***Reference:***
>
> [https://github.com/opencv/opencv/pull/17499/files](https://github.com/opencv/opencv/pull/17499/files)

---

##### Python相关

可能是`cmake`找不到合适的`Python`解释器来执行脚本：

![image-20240826133725674](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/13:37:26_image-20240826133725674.png)

解决办法：

```bash
# 手动执行脚本
cd $(git rev-parse --show-toplevel)/ && \
python3 ./modules/python/src2/gen2.py \
./build/modules/python_bindings_generator \
./build/modules/python_bindings_generator/headers.txt
```

![image-20240828155616856](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:28/15:56:22_image-20240828155616856.png)

> ***Reference:***
>
> [https://github.com/opencv/opencv/issues/10771#issuecomment-376861139](https://github.com/opencv/opencv/issues/10771#issuecomment-376861139)

#### 处理配置文件

如果不执行以下几步，编译`darknet_ros`会报错: `error: 'IplImage'`之类的：

```bash
sudo cp /usr/local/lib/pkgconfig/opencv4.pc /usr/lib/pkgconfig/opencv4.pc
sudo cp /usr/lib/pkgconfig/opencv4.pc /usr/lib/pkgconfig/opencv.pc
```

### 百度智能云

```bash
sudo apt install -y curl libjsoncpp-dev
```

`jsoncpp`库的头文件改为：

```cpp
#include <jsoncpp/json/json.h>
```

`g++`编译：

```bash
g++ test.cpp -o test.out -lcurl -ljsoncpp
```

运行：

```bash
./test.out
```

### darknet、yolov3及darknet_ros工作空间

```bash
git clone https://github.com/AlexeyAB/darknet.git darknet
```

或公益加速源：

```bash
git clone https://ghp.ci/https://github.com/AlexeyAB/darknet.git darknet
```

```bash
cd darknet/
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

然后修改`NVCC=`后边为`nvcc`路径：

```makefile
NVCC=/usr/local/cuda/bin/nvcc
```

打开终端，输入：

```bash
sudo tee /etc/ld.so.conf.d/cuda.conf > /dev/null << EOF
/usr/local/cuda/lib64
EOF
```

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

```txt
usage: ./darknet <function>
```

之后我们下载`yolov3`权重文件：

```bash
cd $(git rev-parse --show-toplevel)/ && \
mkdir weights && cd weights/ && \
wget -q --show-progress https://pjreddie.com/media/files/yolov3.weight
```

到此为止`darknet`就配置好了。

下面我们测试一下：

```bash
cd $(git rev-parse --show-toplevel)/ && \
./darknet detect cfg/yolov3.cfg weights/yolov3.weights data/dog.jpg
```

输出以下就证明配置没有问题：

![f0b4566371b](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/17:19:26_f0b4566371b.png)

输出的最后一行报错：

```txt
Gtk-Message: 15:22:30.610: Failed to load module "canberra-gtk-module"
```

解决方法：

```bash
sudo apt install -y 'libcanberra-gtk*'
```

安装之后重新运行就不会报错了。

`darknet_ros`工作空间（`OpenCV-4.2.0`）：

```bash
mkdir -p catkin_ws/src && cd catkin_ws/src/ && catkin_init_workspace
```

```bash
cd .. && catkin_make
```

```bash
cd src/
```

```bash
git clone -b opencv4 --recursive https://github.com/M0rtzz/darknet_ros.git darknet_ros
cd darknet_ros/
git submodule update --init --recursive
```

如果视频流只有第一帧是`RGB8`编码格式，阅读源码后发现在`show_image`之前调用`image.cpp`中的`rgbgr_image`函数循环转换图像编码格式即可解决此问题：

```cpp
// @file: image.cpp
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
// @file: YoloObjectDetector.cpp
  void *YoloObjectDetector::displayInThread(void *ptr)
  {
    // NOTE: Modified by M0rtzz, solved the problem of displaying video stream as bgr8
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
catkin_make
```

`catkin_make`如果编译不过的话（`error: 'IplImage' `之类的，之前装`OpenCV`提到过避免报错的方法），注意以下命令是只编译`darknet_ros`一个包，若工作空间下有多个包需要一起编译那么把命令中的`darknet_ros`删除重新执行即可：

```bash
catkin_make darknet_ros \
--cmake-args \
-D CMAKE_CXX_FLAGS='-D CV__ENABLE_C_API_CTORS'
```

如果报错`nvcc fatal : Unsupported gpu architecture 'compute_30'`之类的，是因为`CUDA11.X`已经不支持`compute_30`了，我们将`darknet_ros/darknet_ros/CMakeLists.txt`中含有 `compute_30`的行进行注释后重新`catkin_make`：

![image-20240825123152168](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:25/12:32:01_image-20240825123152168.png)

### Azure Kinect SDK-v1.4.2（软件包）

> [!NOTE]
>
> 鄙人在`Ubuntu18.04`下是通过源码编译安装的，在`Ubuntu20.04`下是通过`deb`包直接安装的。

下载软件包：

```bash
wget -q --show-progress https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/libk/libk4a1.4/libk4a1.4_1.4.2_amd64.deb -O ./libk4a1.4_1.4.2_amd64.deb && \
wget -q --show-progress https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/libk/libk4a1.4-dev/libk4a1.4-dev_1.4.2_amd64.deb -O ./libk4a1.4-dev_1.4.2_amd64.deb && \
wget -q --show-progress https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/k/k4a-tools/k4a-tools_1.4.2_amd64.deb -O ./k4a-tools_1.4.2_amd64.deb
```

安装：

```bash
sudo apt install -y ./libk4a1.4_1.4.2_amd64.deb && \
sudo cp /usr/lib/x86_64-linux-gnu/libk4a1.4/libdepthengine.so.2.0 /usr/lib/ && \
sudo cp /usr/lib/libdepthengine.so.2.0 /usr/lib/x86_64-linux-gnu/
```

![image-20240819154538551](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:19/15:45:38_image-20240819154538551.png)

```bash
sudo apt install -y ./libk4a1.4-dev_1.4.2_amd64.deb ./k4a-tools_1.4.2_amd64.deb
```

配置`udev`规则：

```bash
sudo tee /etc/udev/rules.d/99-k4a.rules > /dev/null << EOF
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
EOF
```

### 科大讯飞语音

[https://www.xfyun.cn/sdk/dispatcher](https://www.xfyun.cn/sdk/dispatcher)

```bash
sudo apt install -y sox libsox-fmt-all pavucontrol
```

```bash
# 如果编译时有相关warning再修改
sudo gedit /usr/include/pcl-1.8/pcl/visualization/cloud_viewer.h
```

修改一下：

```cpp
// @line: 199左右
private:
        /** \brief Private implementation. */
        struct CloudViewer_impl;
        // std::auto_ptr<CloudViewer_impl> impl_;
        std::shared_ptr<CloudViewer_impl> impl_;

        boost::signals2::connection
        registerMouseCallback (boost::function<void (const pcl::visualization::MouseEvent&)>);
```

下载所需`SDK`,将`libs/x64/libmsc.so`文件拷贝至`工作空间根目录/lib/your-appid/libmsc.so`。

```cmake
cmake_minimum_required(VERSION 3.0.2)
project(tts_voice_test)
set(CMAKE_CXX_FLAGS "-std=c++11")

find_package(
  catkin REQUIRED
  COMPONENTS roscpp
             rospy
             std_msgs
             genmsg
             actionlib_msgs
             actionlib
             rostime
             sensor_msgs
             message_filters
             cv_bridge
             image_transport
             compressed_image_transport
             compressed_depth_image_transport
             tf
             tf2
             tf2_ros
             tf2_geometry_msgs
             geometry_msgs
             message_generation
             nodelet
             kinova_msgs)

find_package(k4a REQUIRED)
find_package(realsense2 REQUIRED)

set(OpenCV_DIR "/usr/local/lib/cmake/opencv4")
find_package(OpenCV REQUIRED)

find_package(OpenMP)
find_package(PCL REQUIRED)

add_message_files(FILES person_msgs.msg BoundingBoxes.msg BoundingBox.msg)

generate_messages(DEPENDENCIES std_msgs)

catkin_package(
  INCLUDE_DIRS
  CATKIN_DEPENDS
  include
  roscpp
  rospy
  std_msgs
  message_runtime
  actionlib_msgs)

if(OPENMP_FOUND)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
endif()

include_directories(/home/m0rtzz/Workspaces/tts_test_ws/include ${catkin_INCLUDE_DIRS}
                    ${OpenCV_INCLUDE_DIRS} ${PCL_INCLUDE_DIRS})
link_directories(/home/m0rtzz/Workspaces/tts_test_ws/lib/)

add_executable(tts_voice_test src/tts_voice_test.cc)
add_dependencies(tts_voice_test ${${PROJECT_NAME}_EXPORTED_TARGETS}
                 ${catkin_EXPORTED_TARGETS})
target_link_libraries(
  tts_voice_test
  PRIVATE
    k4a::k4a
    ${PCL_LIBRARIES}
    ${catkin_LIBRARIES}
    ${OpenCV_LIBRARIES}
    ${realsense2_LIBRARY}
    -lrt
    -ldl
    -lhpdf
    -lcurl
    -pthread
    -lasound
    -ljsoncpp
    /home/m0rtzz/Workspaces/tts_voice_test_ws/lib/your-appid/libmsc.so # 替换为你的appid
)
```

打开终端：

```bash
catkin_make
```

若找不到`asoundlib.h`文件打开终端输入：

```bash
sudo apt install -y libasound2-dev
```

编译通过~

### librealsense及realsense-ros工作空间

```bash
sudo apt install -y ros-${ROS_DISTRO}-realsense2-camera ros-${ROS_DISTRO}-rgbd-launch
```

安装`realsense sdk`:

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key F6E65AC044F831AC80A06380C8B3A55A6F3EFCDE || sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-key F6E65AC044F831AC80A06380C8B3A55A6F3EFCDE
```

```bash
sudo add-apt-repository "deb https://librealsense.intel.com/Debian/apt-repo $(lsb_release -cs) main" -u
```

```bash
sudo apt update -y
```

安装`realsense lib`：

```bash
sudo apt install -y librealsense2-dkms librealsense2-utils
```

安装`gcc-4.9`和`g++-4.9`：

```bash
sudo tee -a /etc/apt/sources.list > /dev/null << EOF
# gcc-4.9, g++4.9
deb https://mirrors.hust.edu.cn/ubuntu/ xenial universe
EOF
```

```bash
sudo apt update -y
sudo apt install -y gcc-4.9 g++-4.9
```

```bash
# 注释掉xenial软件源
sudo sed -i '/^deb https:\/\/mirrors.hust.edu.cn\/ubuntu\/ xenial universe/s/^/# /' /etc/apt/sources.list && sudo apt update -y
```

测试：

```bash
realsense-viewer
```

![image-20240826102855968](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:29:01_image-20240826102855968.png)

克隆`librealsense`源码并指定版本为`v2.50.0`:

```bash
git clone -b v2.50.0 https://github.com/IntelRealSense/librealsense.git librealsense-2.50.0
```

或公益加速源：

```bash
git clone -b v2.50.0 https://ghp.ci/https://github.com/IntelRealSense/librealsense.git librealsense-2.50.0
```

安装依赖：

```bash
sudo apt install -y libssl-dev libgtk-3-dev libusb-1.0-0-dev libglfw3-dev libgl1-mesa-dev libglu1-mesa-dev 
```

进入刚才克隆的`librealsense`文件夹内：

```bash
cd librealsense-2.50.0/
```

```bash
./scripts/setup_udev_rules.sh
```

```bash
# The Bionic patches are maintained for Bionic Beaver LTS kernels 4.1[5/8], 5.[0/3/4] （Ubuntu18.04，`uname -r`查看自己的内核版本）
# The Focal patches are maintained for Ubuntu LTS with kernel 5.4, 5.8, 5.11 （Ubuntu20.04，`uname -r`查看自己的内核版本）
# 貌似不执行也不影响
./scripts/patch-realsense-ubuntu-lts.sh
```

注意：上面的命令可能执行过慢，请耐心等待，或者科学的上网~

完成结果如下：

![d299ece865576](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/09:46:14_d299ece865576.png)

之后输入：

```bash
mkdir build && cd build/
```

```bash
# @file: $(git rev-parse --show-toplevel)/CMakeLists.txt
# @line: 3左右
project(librealsense2 LANGUAGES CXX C)
# NOTE: Modified by M0rtzz # [!code ++]
LINK_LIBRARIES(-lcurl -lcrypto) # [!code ++]
include(CMake/lrs_options.cmake)
```

```bash
cmake \
-D CMAKE_BUILD_TYPE=Release \
-D BUILD_EXAMPLES=true \
..
```

以下编译过慢，使用`CPU`最大线程进行`make`，速度会快很多：

```bash
sudo make -j$(nproc)
```

```bash
sudo make -j$(nproc) install
```

测试：

```bash
cd examples/capture/
```

```bash
./rs-capture
```

![5b01bb173b72c](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/09:47:39_5b01bb173b72c.png)

接下来我们配置`realsense-ros`工作空间：

```bash
cd catkin_ws/src/
```

下载功能包:

```bash
git clone -b ros1-legacy https://github.com/IntelRealSense/realsense-ros.git realsense-ros
```

或公益加速源：

```bash
git clone -b ros1-legacy https://ghp.ci/https://github.com/IntelRealSense/realsense-ros.git realsense-ros
```

```bash
cd ..
```

```bash
catkin_make \
-D CMAKE_BUILD_TYPE=Release \
-D CATKIN_ENABLE_TESTING=False
```

```bash
catkin_make install
```

测试：

```bash
roslaunch realsense2_camera rs_camera.launch
```

![image-20240826103646388](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:36:46_image-20240826103646388.png)

还没安摄像头~

### kinova-ros机械臂工作空间

```bash
cd catkin_ws/src/
```

```bash
catkin_init_workspace
```

```bash
cd ..
```

```bash
catkin_make
```

```bash
cd src/
```

```bash
git clone https://github.com/Kinovarobotics/kinova-ros.git kinova-ros
```

或公益加速源：

```bash
git clone https://ghp.ci/https://github.com/Kinovarobotics/kinova-ros.git kinova-ros
```

```bash
cd ..
```

安装缺少的`moveit`中相应的功能包 ：

```bash
sudo apt install -y ros-${ROS_DISTRO}-moveit-visual-tools ros-${ROS_DISTRO}-moveit-ros-planning-interface
```

```bash
catkin_make
```

```bash
sudo cp src/kinova-ros/kinova_driver/udev/10-kinova-arm.rules /etc/udev/rules.d/
```

安装Moveit和pr2：

```bash
sudo apt install -y $(apt-cache search ros-${ROS_DISTRO}-pr2- | grep -v "ros-${ROS_DISTRO}-pr2-apps" | cut -d' ' -f1)
```

完成~

### 机器人导航

> [!CAUTION]
>
> **ZZU-SR**的童鞋请注意，此小节只需安装软件包，其他内容是之前[听课](https://www.bilibili.com/video/BV1Ub4y1a7PH?p=73)做的笔记，导航相关代码直接`Copy`比赛电脑的`catkin_ws`中的`mrobot`即可。

#### Dependency (ESSENTIAL)

```bash
sudo apt install -y "ros-${ROS_DISTRO}-move-base*" "ros-${ROS_DISTRO}-turtlebot3-*"
```

```bash
sudo apt install -y ros-${ROS_DISTRO}-dwa-local-planner ros-${ROS_DISTRO}-joy ros-${ROS_DISTRO}-teleop-twist-joy ros-${ROS_DISTRO}-teleop-twist-keyboard ros-${ROS_DISTRO}-laser-proc ros-${ROS_DISTRO}-rgbd-launch ros-${ROS_DISTRO}-depthimage-to-laserscan ros-${ROS_DISTRO}-rosserial-arduino ros-${ROS_DISTRO}-rosserial-python ros-${ROS_DISTRO}-rosserial-server ros-${ROS_DISTRO}-rosserial-client ros-${ROS_DISTRO}-rosserial-msgs ros-${ROS_DISTRO}-amcl ros-${ROS_DISTRO}-map-server ros-${ROS_DISTRO}-move-base ros-${ROS_DISTRO}-urdf ros-${ROS_DISTRO}-xacro ros-${ROS_DISTRO}-compressed-image-transport ros-${ROS_DISTRO}-rqt-image-view ros-${ROS_DISTRO}-gmapping ros-${ROS_DISTRO}-navigation ros-${ROS_DISTRO}-interactive-markers
```

安装`gmapping`包（用于构建地图）：

```bash
sudo apt install -y ros-${ROS_DISTRO}-gmapping
```

安装地图服务包（用于保存与读取地图）:

```bash
sudo apt install -y ros-${ROS_DISTRO}-map-server
```

安装`navigation`包（用于定位以及路径规划）:

```bash
sudo apt install -y ros-${ROS_DISTRO}-navigation
```

因`tf`和`tf2`迁移问题，需将工作空间内的所有`global_costmap_params.yaml`和`local_costmap_params.yaml`文件里的头几行去掉`/`,返回工作空间根目录下重新编译。

> ***Reference:***
>
> [http://wiki.ros.org/tf2/Migration#Removal_of_support_for_tf_prefix](http://wiki.ros.org/tf2/Migration#Removal_of_support_for_tf_prefix)

![image-20240825131636586](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:25/13:16:36_image-20240825131636586.png)

![image-20240825131656932](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:25/13:16:57_image-20240825131656932.png)

#### Arduino IDE (NOT REQUIRED) (EOL)

[https://www.arduino.cc/en/software](https://www.arduino.cc/en/software)

![image-20240826095129015](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/09:51:29_image-20240826095129015.png)

下载安装包：

```bash
tar -xvf arduino-1.8.19-linux64.tar.xz && cd arduino-1.8.19/
```

```bash
sudo chmod +x install.sh
```

```bash
sudo ./install.sh
```

#### 听课笔记 (NOT REQUIRED) (EOL)

首先创建实体导航工作空间：

```bash
mkdir -p navigation_entity_test_ws/src && cd navigation_entity_test_ws/src/
```

```bash
catkin_create_pkg entity_test roscpp rospy std_msgs gmapping map_server amcl move_base
```

```bash
cd .. && catkin_make
```

```bash
cd src/ && catkin_create_pkg robot_start_test roscpp rospy std_msgs ros_arduino_python usb_cam rplidar_ros
```

```bash
cd robot_start_test/ && mkdir launch && cd launch/ && touch start_test.launch
```

```xml
<!-- @file: start_test.launch
     @brief: 机器人启动文件：
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
cd ../../src/
```

```bash
catkin_create_pkg robot_description_test urdf xacro
```

在功能包下新建`urdf`目录，编写具体的`urdf`文件：

```bash
cd robot_description_test/ && mkdir urdf
```

```bash
cd urdf/ && touch {robot.urdf.xacro,robot_base.urdf.xacro,robot_camera.urdf.xacro,robot_laser.urdf.xacro} && code robot.urdf.xacro
```

将下列代码粘贴进去：

```xml
<!-- @file: robot.urdf.xacro -->

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
<!-- @file: robot_base.urdf.xacro -->

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
<!-- @file: robot_camera.urdf.xacro -->

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
<!-- @file: robot_laser.urdf.xacro -->

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
cd launch/ && touch robot_test.launch && code robot_test.launch
```

将下列代码粘贴进去：

```xml
<!-- @file: robot_test.launch -->

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

![image-20240826104130156](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:41:30_image-20240826104130156.png)

之后`Ctrl+Alt+T`打开一个新的终端，输入：

```bash
rviz
```

![image-20240826104244706](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:42:45_image-20240826104244706.png)

将`Fixed Frame`设置为`base_footprint`：

![c37069f5d4ba47cf94e637d64a15f416.png](https://static.m0rtzz.com/images/Year:2024/Month:02/Day:06/14:59:14_c37069f5d4ba47cf94e637d64a15f416.png)

`Add`一个`RobotModel`：

![image-20240826105755744](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:57:56_image-20240826105755744.png)

`Add`一个`TF`：

![image-20240826105819998](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:58:20_image-20240826105819998.png)

```bash
cd src/entity_test/ && mkdir launch && cd launch/
```

```bash
touch gmapping.launch && code gmapping.launch
```

将下列代码粘贴进去：

```xml
<!-- @file: gmapping.launch -->

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
cd launch/ && touch map_save.launch && code map_save.launch
```

将下列代码粘贴进去：

```xml
<!-- @file: map_save.launch -->

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
<!-- @file: map_server.launch -->

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
<!-- @file: amcl.launch -->

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
# @file: base_local_planner_params.yaml

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
# @file: cost_common_params.yaml

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
# @file: global_costmap_params.yaml

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
# @file: local_costmap_params.yaml

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
cd ../launch/ && touch move_base.launch && code move_base.launch
```

将下列代码粘贴进去：

```xml
<!-- @file: move_base.launch -->

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
<!-- @file: auto_slam.launch -->

<launch>
    <!-- 启动SLAM节点 -->
    <include file="$(find entity_test)/launch/gmapping.launch" />
    <!-- 运行move_base节点 -->
    <include file="$(find entity_test)/launch/move_base.launch" />
</launch>
```

## RECOMMENDED

### 自定义函数及别名

打开终端输入：

```bash
tee -a ~/.bashrc >> /dev/null << 'EOF'
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

# 复制上一个命令到系统剪切板，sudo apt install -y xsel
function copyLastCommand()
{
    # fc获取最后执行的命令，echo发送给xsel复制到剪切板
    # -nl以列表形式显示命令历史，但不包括命令编号，-1只获取最近一条命令
    echo -n $(fc -nl -1) | xsel --clipboard --input
}

# 创建一个别名，若与你的其他软件包内置命令冲突，请自行更换别名
alias clc='copyLastCommand'

# 计划关机（为了使得`.zshrc`也能用此函数，就没有使用`read -p`）
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

alias po='powerOff'

# 有效解决Anaconda3激活虚拟环境后使用`pip install`或`pip3 install`会安装到其他虚拟环境的问题
alias pip='python3 -m pip'
alias pip3='python3 -m pip'
EOF
```

```bash
source ~/.bashrc
```

这样就可以更清晰的显示`git`分支~

### 设置$\{HOME\}下的文件夹为英文

```bash
export LANG=en_US
```

```bash
xdg-user-dirs-gtk-update
```

编辑选择右边的`Update Names`：

![76f25fc108fb](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/09:54:32_76f25fc108fb.png)

之后执行以下语句：

```bash
export LANG=zh_CN
```

```bash
reboot
```

勾选不要再次询问我，并选择保留旧的名称：

![ec1f2be43efcd](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/09:55:37_ec1f2be43efcd.png)

### 同步双系统时间

```bash
sudo apt install -y ntpdate
```

```bash
sudo ntpdate time.windows.com
```

```bash
timedatectl set-local-rtc 1 --adjust-system-clock
```

### Software

推荐一些`Linux`办公常用的软件（包括`wine`环境下，全部下载`deb`格式的安装包，系统架构可通过命令`uname -a`查看）：

[百度网盘](https://pan.baidu.com/download#linux)

[向日葵](https://sunlogin.oray.com/download/linux?type=personal)

[ToDesk](https://www.todesk.com/linux.html)

[QQ](https://im.qq.com/linuxqq/index.shtml)

[腾讯会议](https://meeting.tencent.com/download?mfrom=OfficialIndex_TopBanner1_Download)

[WPS Office](https://linux.wps.cn/)

[搜狗输入法](https://shurufa.sogou.com/)（下载安装包后，官方会跳转至安装教程，严格按照步骤执行）

[Visual Studio Code](https://code.visualstudio.com/docs/?dv=linux64_deb)（推荐打开`Settings Sync`，换电脑时设置可以同步）

[星火应用商店](https://www.spark-app.store/download)

仅支持`Ubuntu20.04`，需安装依赖包：

![image-20240718162329579](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/16:23:29_image-20240718162329579.png)

[Linux原生微信\_需要安装星火应用商店（最近的版本好像使用Fcitx输入法时中文输入有问题）](spk://store/chat/store.spark-app.wechat-linux-spark)

![image-20240718202231084](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/20:22:31_image-20240718202231084.png)

`Ubuntu20.04`以下版本或者不想安装星火应用商店的用户可安装`Flatpak`打包的微信（需安装`Flatpak`，下文有`Flatpak`安装教程）：

解决基于`Fcitx5`的搜狗输入法无法在`Flatpak`版微信中进行中文输入的问题：[https://github.com/web1n/wechat-universal-flatpak/issues/33#issuecomment-2222259823](https://github.com/web1n/wechat-universal-flatpak/issues/33#issuecomment-2222259823)

```bash
wget -q --show-progress https://github.com/web1n/wechat-universal-flatpak/releases/latest/download/com.tencent.WeChat-x86_64.flatpak -O com.tencent.WeChat-x86_64.flatpak && sudo flatpak install ./com.tencent.WeChat-x86_64.flatpak
```

可以水平和垂直分割的终端：

```bash
sudo apt install -y terminator
```

![image-20240826105849251](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:58:49_image-20240826105849251.png)

`Neovim`：

```bash
sudo apt install -y neovim && \
echo '/usr/bin/nvim' | sudo update-alternatives --config editor
```

`trash`命令：

```bash
sudo apt install -y trash-cli
```

`tree`命令：

```bash
sudo apt install -y tree
```

查看系统信息：

```bash
sudo apt install -y neofetch
```

![image-20240720105620903](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:56:21_image-20240720105620903.png)

或安装用C语言写的更快的`fastfetch`：

```bash
wget -q --show-progress https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb -O fastfetch-linux-amd64.deb && sudo apt install -y ./fastfetch-linux-amd64.deb
```

![image-20240720105657155](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:56:57_image-20240720105657155.png)

`rar`文件解压工具：

```bash
sudo apt install -y unrar
```

解决不能观看`MP4`文件：

```bash
sudo apt update -y
```

```bash
sudo apt install -y libdvdnav-dev libdvdread-dev gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly libdvd-pkg
```

```bash
sudo apt install -y ubuntu-restricted-extras
```

```bash
sudo dpkg-reconfigure libdvd-pkg
```

系统优化：

```bash
sudo apt update -y
```

```bash
sudo apt install -y gnome-tweak-tool
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
sudo apt update -y && sudo apt install -y diodon
```

然后使用刚才安装的优化工具将`diodon`设置为开机自启动：

![2024-07-18](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/16:02:27_2024-07-18.png)

这样就实现了类似于`Windows`下`Win + V`的剪贴板功能：

![image-20240718160648762](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:18/16:06:48_image-20240718160648762.png)

另外可使用中科大源反向代理的`Canonical PPA仓库`：

> [!TIP]
>
> 将`/etc/apt/sources.list.d`下`.list`文件中的`http://ppa.launchpad.net`替换为`https://launchpad.proxy.ustclug.org`即可，建议替换前先`sudo cp /etc/apt/sources.list.d/your-file.list /etc/apt/sources.list.d/your-file.list.save`备份一下（请自行替换文件名）

![image-20240720105759025](https://static.m0rtzz.com/images/Year:2024/Month:07/Day:20/10:57:59_image-20240720105759025.png)

`Flatpak`：

Ubuntu 18.10 (Cosmic Cuttlefish) or later：

```bash
sudo apt install -y flatpak
```

Older Ubuntu versions：

```bash
sudo add-apt-repository ppa:flatpak/stable
sudo apt update -y
sudo apt install -y flatpak
```

`FlatHub`上交镜像源：

[https://mirror.sjtu.edu.cn/docs/flathub](https://mirror.sjtu.edu.cn/docs/flathub)

切换之后更新`Flatpak`应用将加速：

```bash
sudo flatpak update
```

火狐浏览器优化：

地址栏输入：

```txt
about:config
```

```txt
full-screen-api.warning.timeout
```

设置为`0`~

```txt
full-screen-api.transition-duration.enter
```

和

```txt
full-screen-api.transition-duration.leave
```

都设置为`0 0`~

```txt
browser.search.openintab
```

```txt
browser.urlbar.openintab
```

```txt
browser.tabs.loadBookmarksInTabs
```

都设置为`true`~

```txt
browser.urlbar.trimURLs
```

设置为`false`~

## OPTIONAL

### 启动菜单的默认项

```bash
sudo gedit /etc/default/grub
```

改一下`GRUB_DEFAULT=`后边的数字，默认是`0`，`Windows`是第`n`个就设置为`n-1`

保存后关闭，打开终端，输入：

```bash
sudo update-grub
```

```bash
reboot
```

重启后问题解决~

### 使在桌面上右键打开终端时进入Desktop目录（Ubuntu18.04）

[https://launchpad.net/ubuntu/+source/gnome-terminal/3.28.1-1ubuntu1](https://launchpad.net/ubuntu/+source/gnome-terminal/3.28.1-1ubuntu1)

下载源码包：

```bash
wget -q --show-progress https://launchpad.net/ubuntu/+archive/primary/+sourcefiles/gnome-terminal/3.28.1-1ubuntu1/gnome-terminal_3.28.1.orig.tar.xz -O gnome-terminal_3.28.1.orig.tar.xz && \
wget -q --show-progress https://launchpad.net/ubuntu/+archive/primary/+sourcefiles/gnome-terminal/3.28.1-1ubuntu1/gnome-terminal_3.28.1-1ubuntu1.debian.tar.xz -O gnome-terminal_3.28.1-1ubuntu1.debian.tar.xz
```

解压：

```bash
tar -xf gnome-terminal_3.28.1.orig.tar.xz && \
tar -xf gnome-terminal_3.28.1-1ubuntu1.debian.tar.xz
```

```bash
ls debian/ gnome-terminal-3.28.1/
cp -r debian/* gnome-terminal-3.28.1/
```

```bash
cd gnome-terminal-3.28.1/ && git apply patches/*.patch
```

安装依赖：

```bash
sudo apt install -y intltool libvte-2.91-dev gsettings-desktop-schemas-dev uuid-dev libdconf-dev libpcre2-dev libgconf2-dev libxml2-utils gnome-shell libnautilus-extension-dev itstool yelp-tools pcre2-utils
```

打开`src/`下的`terminal-nautilus.c`，找到：

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
  return FALSE; // here
}
```

`src/`下打开终端

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
sudo make -j$(nproc) install
```

```bash
sudo cp /usr/lib/nautilus/extensions-3.0/libterminal-nautilus.so /usr/lib/x86_64-linux-gnu/nautilus/extensions-3.0/
```

```bash
reboot
```

问题解决！

### protobuf-2.6.1

```bash
sudo apt install -y libtool
```

[https://github.com/protocolbuffers/protobuf/releases/download/v2.6.1/protobuf-2.6.1.tar.gz](https://github.com/protocolbuffers/protobuf/releases/download/v2.6.1/protobuf-2.6.1.tar.gz)

或镜像：

```bash
wget -q --show-progress https://raw.gitcode.com/M0rtzz/protobuf-2.6.1/assets/199 -O protobuf-2.6.1.tar.gz
```

```bash
tar -zxvf protobuf-2.6.1.tar.gz && cd protobuf-2.6.1
```

```bash
# 可有可无（Reference: https://github.com/protocolbuffers/protobuf/blob/v2.6.1/README.md?plain=1#L11-L21）
./autogen.sh
```

```bash
./configure --prefix=/usr/local/protobuf
```

```bash
sudo make -j$(nproc)
```

养成有`make check/test`就执行的好习惯：

```bash
sudo make check -j$(nproc)
```

![6494c7251d](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:07:27_6494c7251d.png)

```bash
sudo make -j$(nproc) install
```

```bash
sudo tee -a /etc/profile > /dev/null << 'EOF'
# protobuf
export PATH=${PATH}:/usr/local/protobuf/bin
export LIBRARY_PATH=${LIBRARY_PATH}:/usr/local/protobuf/lib
export PKG_CONFIG_PATH=${PKG_CONFIG_PATH}:/usr/local/protobuf/lib/pkgconfig
EOF
```

```bash
source /etc/profile
```

```bash
sudo tee /etc/ld.so.conf.d/protobuf.conf > /dev/null << EOF
/usr/local/protobuf/lib
EOF
```

```bash
sudo ldconfig
```

### OpenBLAS

#### 软件源安装 (RECOMMENDED)

```bash
sudo apt update -y && sudo apt install -y libopenblas-dev
```

#### 源码编译安装 (NOT RECOMMENDED)

```bash
sudo apt install -y gfortran gcc-arm-linux-gnueabihf libnewlib-arm-none-eabi libc6-dev-i386
```

```bash
git clone https://github.com/OpenMathLib/OpenBLAS.git OpenBLAS
```

或公益加速源：

```bash
git clone https://gitclone.com/github.com/OpenMathLib/OpenBLAS.git OpenBLAS
```

```bash
cd OpenBLAS/
```

```bash
sudo make -j$(nproc)
```

```bash
sudo make PREFIX=/usr/local install
```

查看版本：

```bash
grep OPENBLAS_VERSION /usr/local/include/openblas_config.h
```

### seetaface2工作空间

```bash
echo 'source /home/m0rtzz/Workspaces/catkin_ws/devel/setup.bash' >> ~/.bashrc
source ~/.bashrc
```

![47437ad89dfc](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:08:17_47437ad89dfc.png)

解决办法：

加入工作空间下lib文件夹的路径：

```bash
echo 'export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/home/m0rtzz/Workspaces/catkin_ws/lib' >> ~/.bashrc
source ~/.bashrc
```

![ee5c5ddf2d0](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:09:21_ee5c5ddf2d0.png)

解决！

报错：

```txt
Gtk-Message: 15:22:30.610: Failed to load module "canberra-gtk-module"
```

解决方法：

```bash
sudo apt install -y 'libcanberra-gtk*'
```

### caffe (EOL)

> ***Reference:***
>
> [https://blog.csdn.net/weixin_39161727/article/details/120136500](https://blog.csdn.net/weixin_39161727/article/details/120136500)

首先安装依赖：

```bash
sudo apt install -y libprotobuf-dev libleveldb-dev libsnappy-dev libopencv-dev libhdf5-serial-dev protobuf-compiler libatlas-base-dev libgflags-dev libgoogle-glog-dev liblmdb-dev libboost-all-dev
```

```bash
git clone https://github.com/BVLC/caffe.git caffe
```

或公益加速源：

```bash
git clone https://ghp.ci/https://github.com/BVLC/caffe.git caffe
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

使用镜像源安装依赖库：

```bash
python3 -m pip install -r requirements.txt -i https://mirrors.hust.edu.cn/pypi/web/simple
```

```bash
cd .. && sudo make clean
```

由于`caffe`不支持`cuDNN8.X`，为了能在`cuDNN8.X`的环境下编译通过，需要修改两个`cpp`文件，路径为`src/caffe/layers/`下的`cudnn_conv_layer.cpp`和`cudnn_deconv_layer.cpp`两个文件，分别将他们内容替换为：

<Details summary="cudnn_conv_layer.cpp（点击展开）">
`cudnn_conv_layer.cpp`

```cpp
/**
 * @@file: cudnn_conv_layer.cpp
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
 * @@file: cudnn_deconv_layer.cpp
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

由于`cuDNN`修改了`API`，在`cudnn.h`文件中不再指出`cuDNN`的版本号，而是放在了`cudnn_version.h`文件中，所以，将`cudnn_version.h`中对于版本段的代码复制到`cudnn.h`文件中，代码如下：

```bash
locate cudnn_version.h
```

```bash
sudo vi /usr/local/cuda/targets/x86_64-linux/include/cudnn_version.h
```

复制其中的非注释部分：

![image-20240826110741277](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/11:07:41_image-20240826110741277.png)

```bash
sudo vi /usr/local/cuda/targets/x86_64-linux/include/cudnn.h
```

粘贴到最开头：

![image-20240826110911870](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/11:09:12_image-20240826110911870.png)

然后打开`caffe/include/caffe/util/cudnn.hpp`文件并指定`cudnn.h`路径：

```bash
vi include/caffe/util/cudnn.hpp
```

![image-20240826111522635](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/11:15:23_image-20240826111522635.png)

之后重新执行编译：

```bash
sudo make all -j$(nproc)
```

生成以下静态库和共享库文件：

![b0c511e20a3d8e](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:10:35_b0c511e20a3d8e.png)

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

### VTK-8.2.0及PCL-1.9.1 (EOL)

[https://vtk.org/download/](https://vtk.org/download/)

下载`VTK-8.2.0.zip`：

![image-20240826101145189](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:11:45_image-20240826101145189.png)

解压之后，进入文件夹打开终端：

```bash
sudo apt install -y cmake-gui && mkdir build && cd build/ && cmake-gui ..
```

单击`Configure`：

![image-20240826112011057](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/11:20:11_image-20240826112011057.png)

勾选以下两项后单击`Configure`和`Generate`：

`Module/Module_vtkGUISupportQt`：

![image-20240826112039914](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/11:20:40_image-20240826112039914.png)

`VTK/VTK_Group_Qt`：

![image-20240826112123662](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/11:21:24_image-20240826112123662.png)

```bash
sudo make -j$(nproc)
```

```bash
sudo make -j$(nproc) install
```

接下来安装`pcl`：

```bash
git clone -b pcl-1.9.1 https://github.com/PointCloudLibrary/pcl.git pcl-1.9.1
```

或公益加速源：

```bash
git clone -b pcl-1.9.1 https://ghp.ci/https://github.com/PointCloudLibrary/pcl.git pcl-1.9.1
```

之后进入文件夹打开终端输入：

```bash
mkdir build && cd build/
```

```bash
cmake \
-D CMAKE_BUILD_TYPE=None \
-D CMAKE_INSTALL_PREFIX=/usr \
-D BUILD_GPU=ON-DBUILD_apps=ON \
-D BUILD_examples=ON \
-D CMAKE_INSTALL_PREFIX=/usr \
..
```

```bash
sudo make -j$(nproc)
```

```bash
sudo make -j$(nproc) install
```

## NOT RECOMMENDED (EOL)

### ROS-melodic（有些图忘记截了）

```bash
sudo gpg --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```bash
sudo gpg --export C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654 | sudo tee /usr/share/keyrings/ros.gpg > /dev/null
```

```bash
sudo tee /etc/apt/sources.list.d/ros-latest.list > /dev/null << EOF
deb [signed-by=/usr/share/keyrings/ros.gpg] https://mirrors.hust.edu.cn/ros/ubuntu/ $(lsb_release -sc) main
EOF
```

```bash
sudo apt update -y
```

```bash
sudo apt install -y ros-melodic-desktop-full
```

```bash
echo 'source /opt/ros/melodic/setup.bash' >> ~/.bashrc
source ~/.bashrc
```

```bash
sudo apt install -y python-rosdep python-rosinstall python-rosinstall-generator python-wstool build-essential
```

```bash
sudo apt install -y python3-pip
```

使用镜像源加速`pip`下载：

```bash
sudo pip3 install rosdepc -i https://mirrors.hust.edu.cn/pypi/web/simple
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

![b74322abe50bc](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:12:43_b74322abe50bc.png)

再新建两个终端，分别输入：

```bash
rosrun turtlesim turtlesim_node
```

```bash
rosrun turtlesim turtle_teleop_key
```

在`rosrun turtlesim turtle_teleop_key`所在终端点击一下任意位置，然后使用`←↕→`小键盘控制，看小海龟会不会动，如果会动则安装成功。

![d386c21ba465449](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:13:37_d386c21ba465449.png)

### OpenCV-3.4.16及其扩展模块（Ubuntu18.04）

安装所需依赖库，打开终端，输入：

```bash
sudo tee -a /etc/apt/sources.list > /dev/null << EOF
# libjasper1, libjasper-dev
deb https://mirrors.hust.edu.cn/ubuntu/ xenial-security main
EOF
sudo apt update -y
sudo apt install -y libjasper1 libjasper-dev
```

```bash
# 注释掉xenial软件源
sudo sed -i '/^deb https:\/\/mirrors.hust.edu.cn\/ubuntu\/ xenial-security main/s/^/# /' /etc/apt/sources.list && sudo apt update -y
```

```bash
sudo apt install -y cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libdc1394-22-dev liblapacke-dev checkinstall
```

```bash
git clone -b 3.4.16 https://github.com/opencv/opencv.git opencv-3.4.16
```

或公益加速源：

```bash
git clone -b 3.4.16 https://ghp.ci/https://github.com/opencv/opencv.git opencv-3.4.16
```

```bash
cd opencv-3.4.16/
```

```bash
git clone -b 3.4.16 https://github.com/opencv/opencv_contrib.git opencv-3.4.16
```

或公益加速源：

```bash
git clone -b 3.4.16 https://ghp.ci/https://github.com/opencv/opencv_contrib.git opencv_contrib-3.4.16
```

```bash
mkdir build && cd build/
```

**接下来编译安装，注意此命令的**`OPENCV_EXTRA_MODULES_PATH=`**后边的路径是你电脑下的绝对路径，请自行修改：**

```bash
cmake \
-D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK=ON \
-D WITH_VTK=ON \
-D WITH_ADE=OFF \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_OPENMP=ON \
-D WITH_LAPACK=OFF \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_GENERATION=Auto \
-D CUDA_CUDA_LIBRARY=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-3.4.16/opencv_contrib-3.4.16/modules \
..
```

过程中会出现`IPPICV: Download: ippicv_2020_lnx_intel64_20191018_general.tgz`。

解决方法：

```bash
cd $(git rev-parse --show-toplevel)/ && mkdir downloads && realpath downloads/
```

复制绝对路径后：

打开这个`ippicv.cmake`：

![99f88634f470](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:14:20_99f88634f470.png)

把绝对路径复制进去：

![image-20240902115158065](https://static.m0rtzz.com/images/Year:2024/Month:09/Day:02/11:52:03_image-20240902115158065.png)

然后把下面网址下载的文件`cp`进去就行了（或者开头百度云分享链接中自取~）。

[https://github.com/opencv/opencv_3rdparty](https://github.com/opencv/opencv_3rdparty)

然后重新打开终端，再次输入（**别忘了改路径**）：

```bash
cmake \
-D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK=ON \
-D WITH_VTK=ON \
-D WITH_ADE=OFF \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_OPENMP=ON \
-D WITH_LAPACK=OFF \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_GENERATION=Auto \
-D CUDA_CUDA_LIBRARY=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-3.4.16/opencv_contrib-3.4.16/modules \
..
```

![1df6fa04c0a168](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:15:15_1df6fa04c0a168.png)

这些`.i`文件需要在国外服务器上下载，网上说下载好文件直接把他们放进相对应的目录下就行，实测不行（建议科学的上网，想试试网上说法的：

[https://blog.csdn.net/curious_undergather/article/details/111639199](https://blog.csdn.net/curious_undergather/article/details/111639199)

文件的话，开头百度云分享链接里都有)

```bash
sudo make -j$(nproc)
```

![06162428124](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:16:08_06162428124.png)

打开那个头文件，把报错所在行改为：

```cpp
#include "lapacke.h"
```

```bash
sudo make -j$(nproc)
```

```bash
sudo make -j$(nproc) install
```

```bash
sudo tee /etc/ld.so.conf.d/opencv.conf > /dev/null << EOF
/usr/local/lib
EOF
```

```bash
sudo ldconfig
```

```bash
sudo tee -a /etc/profile > /dev/null << 'EOF'
export PKG_CONFIG_PATH=${PKG_CONFIG_PATH}:/usr/local/lib/pkgconfig
EOF
```

```bash
source /etc/profile
```

测试：

```bash
cd ../samples/cpp/example_cmake/
cmake -j$(nproc) .
sudo make -j$(nproc)
./opencv_example
```

![image-20240826153120724](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/15:31:20_image-20240826153120724.png)

安装成功！

***设置***`cv_bridge`***的版本（***`ROS-melodic`***，经实践发现毫无效果）：***

```bash
sudo gedit /opt/ros/melodic/share/cv_bridge/cmake/cv_bridgeConfig.cmake
```

修改其中的以下内容：

```cmake
# @line: 94行左右
if(NOT "include;/usr/include;/usr/include/opencv " STREQUAL " ") # [!code --]
  set(cv_bridge_INCLUDE_DIRS "") # [!code --]
  set(_include_dirs "include;/usr/include;/usr/include/opencv") # [!code --]
if(NOT "include;/usr/local/include/opencv;/usr/local/include/opencv2 " STREQUAL " ") # [!code ++]
  set(cv_bridge_INCLUDE_DIRS "") # [!code ++]
  set(_include_dirs "include;/usr/local/include/opencv;/usr/local/include/opencv;/usr/local/include/;/usr/include") # [!code ++]

#################################分割线#################################

# @line: 119行左右
set(libraries "cv_bridge;/usr/lib/x86_64-linux-gnu/libopencv_core.so.3.2.0;/usr/lib/x86_64-linux-gnu/libopencv_imgproc.so.3.2.0;/usr/lib/x86_64-linux-gnu/libopencv_imgcodecs.so.3.2.0") # [!code --]
set(libraries "cv_bridge;/usr/local/lib/libopencv_core.so.3.4.16;/usr/local/lib/libopencv_imgproc.so.3.4.16;/usr/local/lib/libopencv_imgcodecs.so.3.4.16") # [!code ++]
```

`opencv-3.4.4`的`cmake`命令：

```bash
cmake \
-D CMAKE_BUILD_TYPE=RELEASE \
-D WITH_GTK_2_X=ON \
-D WITH_CUDA=ON \
-D WITH_CUDNN=ON \
-D WITH_OPENMP=ON \
-D WITH_FFMPEG=ON \
-D WITH_OPENGL=ON \
-D WITH_LAPACK=OFF \
-D BUILD_TESTS=OFF \
-D WITH_NVCUVID=ON \
-D CUDA_ARCH_BIN=8.6 \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_GENERATION=Auto \
-D OPENCV_ENABLE_NONFREE=ON \
-D BUILD_opencv_xfeatures2d=ON \
-D OPENCV_GENERATE_PKGCONFIG=YES \
-D ENABLE_PRECOMPILED_HEADERS=OFF \
-D CMAKE_EXE_LINKER_FLAGS=-lcblas \
-D CMAKE_INSTALL_PREFIX=/usr/local \
-D CUDA_HOST_COMPILER:FILEPATH=/usr/bin/gcc-7 \
-D OPENCV_EXTRA_MODULES_PATH=/home/m0rtzz/Programs/opencv-3.4.4/opencv_contrib-3.4.4/modules \
..
```

### OpenCV3配置darknet_ros工作空间（OpenCV3）

```bash
git clone --recursive https://github.com/leggedrobotics/darknet_ros.git darknet_ros
```

或公益加速源：

```bash
git clone --recursive https://ghp.ci/https://github.com/leggedrobotics/darknet_ros.git darknet_ros
```

后边内容和**ESSENTIAL**部分中的步骤类似。

### Azure Kinect SDK-v1.4.0（源码编译）

> ***Reference:***
>
> [https://blog.csdn.net/BlacKingZ/article/details/119115883](https://blog.csdn.net/BlacKingZ/article/details/119115883)

```bash
git clone -b v1.4.0 https://github.com/microsoft/Azure-Kinect-Sensor-SDK.git Azure-Kinect-Sensor-SDK-v1.4.0
```

或公益加速源：

```bash
git clone -b v1.4.0 https://ghp.ci/https://github.com/microsoft/Azure-Kinect-Sensor-SDK.git Azure-Kinect-Sensor-SDK-v1.4.0
```

```bash
sudo dpkg --add-architecture amd64
```

```bash
sudo apt update -y
```

```bash
sudo apt install -y ninja-build doxygen clang gcc-multilib g++-multilib python3 nasm libsoundio-dev libvulkan-dev libx11-dev libxcursor-dev libxinerama-dev libxrandr-dev libudev-dev mesa-common-dev uuid-dev
```

```bash
wget -q --show-progress https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/libk/libk4a1.4/libk4a1.4_1.4.2_amd64.deb -O ./libk4a1.4_1.4.2_amd64.deb
```

解压`.deb`文件，再解压内部的`data.tar.gz`文件,并进入`data/usr/lib/x86_64-linux-gnu/`文件夹，打开终端输入：

```bash
sudo cp libdepthengine.so.2.0 /usr/lib/x86_64-linux-gnu/
sudo cp /usr/lib/x86_64-linux-gnu/libdepthengine.so.2.0 /usr/lib/
```

随后进入下载好的`Azure-Kinect-Sensor-SDK-v1.4.0/`文件夹下打开终端输入：

```bash
cmake -GNinja ..
```

注意此步过程中`extern/libyuv/src`克隆较慢原因是使用了`google`的网站，我们把对应文件的克隆`url`改为`GitHub`的就能正常克隆了，在`Azure-Kinect-Sensor-SDK-v1.4.0/`文件夹下键盘`Ctrl+H`显示隐藏文件，打开`.gitmodules`文件，修改`libyuv`的部分为：

```ini
[submodule "extern/libyuv/src"]
	path = extern/libyuv/src
	url = https://github.com/lemenkov/libyuv.git
```

保存后关闭

之后打开`.git/`文件夹下的`config`文件，修改`libyuv`的部分为：

```ini
[submodule "extern/libyuv/src"]
	active = true
	url = https://github.com/lemenkov/libyuv.git
```

接下来就能正常克隆了，但是速度还是很慢，请耐心等待~

保存后关闭，打开终端，输入：

```bash
cmake -GNinja ..
```

克隆完成后为如图所示：

之后输入：

```bash
sudo ninja -j$(nproc)
```

最后输入：

```bash
sudo ninja install
```

之后测试一下：

```bash
sudo ./bin/k4aviewer
```

![3e864efb7912](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:17:05_3e864efb7912.png)

授予权限：

```bash
cd .. && sudo cp scripts/99-k4a.rules /etc/udev/rules.d
```

## NOT REQUIRED

### libfreenect2 (EOL)

```bash
git clone https://github.com/OpenKinect/libfreenect2.git libfreenect2
```

或公益加速源：

```bash
git clone https://ghp.ci/https://github.com/OpenKinect/libfreenect2.git libfreenect2
```

```bash
cd libfreenect2/ && mkdir build && cd build/
```

```bash
cmake \
-D ENABLE_CXX11=ON \
..
```

```bash
sudo make -j$(nproc)
```

```bash
sudo make -j$(nproc) install
```

```bash
sudo cp ../platform/linux/udev/90-kinect2.rules /etc/udev/rules.d/
```

> [!WARNING]
>
> 以下为科研项目所需，比赛无需安装。

### CarlaUE4

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

![6e34d3140e](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:17:35_6e34d3140e.png)

因`Epic`更新了`gitdeps`，但`Github`上却没有更新，所以需要进入`GitHub`官方仓库`Release`界面寻找对应版本的`Commit.gitdeps.xml`替换原来的文件即可：

[https://github.com/EpicGames/UnrealEngine/releases/tag](https://github.com/EpicGames/UnrealEngine/releases/tag)

若报错：

![549b6b2322](https://static.m0rtzz.com/images/Year:2024/Month:08/Day:26/10:18:18_549b6b2322.png)

鄙人认为是因执行`Setup.sh`脚本未赋予`root`权限导致依赖未安装完整，所以再次执行：

```bash
sudo ./Setup.sh
```

```cpp
// @file: CubemapUnwrapUtils.cpp

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

### CARLA-0.9.14（添加fisheye sensor模块）

修改`Update.sh`下载网址为南方科技大学镜像站的网址：

```bash
# CONTENT_LINK=http://carla-assets.s3.amazonaws.com/${CONTENT_ID}.tar.gz
CONTENT_LINK=https://mirrors.sustech.edu.cn/carla/carla_content/${CONTENT_ID}.tar.gz
```

```cpp
// @file: test_streaming.cpp

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
# @file: Package.sh(https://github.com/annaornatskaya/carla/tree/fisheye-sensor)

  # copy_if_changed "./Plugins/" "${DESTINATION}/Plugins/"

  copy_if_changed "./Unreal/CarlaUE4/Content/Carla/HDMaps/*.pcd" "${DESTINATION}/HDMaps/"
  copy_if_changed "./Unreal/CarlaUE4/Content/Carla/HDMaps/Readme.md" "${DESTINATION}/HDMaps/README"

  # NOTE: Modified by M0rtzz
  if [ -d "./Plugins/" ] ; then
    copy_if_changed "./Plugins/" "${DESTINATION}/Plugins/"
  fi
```
