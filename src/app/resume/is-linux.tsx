'use client'

import { useState, useEffect } from 'react'

import { Typed, TypedContent, TypedText } from '@/components/typed'

function useIsLinux(): boolean {
  const [isLinux, setIsLinux] = useState<boolean>(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      const userAgent = navigator.userAgent
      setIsLinux(userAgent.includes('Linux'))
    }
  }, [])

  return isLinux
}

const LinuxAwareComponent = () => {
  const isLinux = useIsLinux()

  return (
    <div
      className={`thin-scrollbar min-h-60 flex-1 overflow-y-auto p-2 text-sm text-gray-200 duration-300 animate-in fade-in ${isLinux ? 'linux-special-scroll-bar' : ''}`}
    >
      <Typed>
        <TypedText>whoami</TypedText>
        <TypedContent>
          <p>
            Hi, I&rsquo;m <strong>M0rtzz</strong>, in Chinese my name is <strong>徐梓航</strong>.
          </p>
          <p>
            I am a Computer Science PhD student at Huazhong University of Science and Technology,
            starting in <strong>2025</strong>. With a background in computer science from Zhengzhou University since <strong>2021</strong>, I have been dedicated to developing software that contributes to the open source world and <code>share knowledge and innovation</code>.
          </p>
          <p>
            I have amassed substantial practical experience in the <code>ROS</code> technology stack.
          </p>
        </TypedContent>
        <TypedText>ls</TypedText>
        <TypedContent>
          <div className='grid grid-cols-2 gap-2 px-4 font-semibold text-sky-500'>
            <span>competitions</span>
            <span>projects</span>
            <span>research</span>
            <span>skills</span>
            <span>blog-info</span>
            <span>contact</span>
          </div>
        </TypedContent>
        <TypedText>competitions</TypedText>
        <TypedContent>
          <p>
            I won three national first prizes in the field of robotics in 2023,
            with two championships and one bronze medal.
          </p>
          <p>
            In the 2023 RoboCup China
            tournament（2023RoboCup机器人世界杯中国赛）, to realize a general
            service robot that can respond to natural language commands, the
            large language model (LLM) is used as the core of the robot. By
            leveraging the LLM&rsquo;s In-context Learning (ICL) capability,
            providing the LLM with some instructive examples allows it to
            autonomously deduce which basic functions are needed to execute
            complex instructions, and to arrange the execution order and logical
            hierarchy of these functions. Subsequently, it activates the pre-set
            functional modules in ROS in an orderly manner, thereby efficiently
            and accurately completing the natural language tasks given by the
            user. Our method achieved the highest score in the GPSR project of
            the 2023 RoboCup@Home-Open Platform.
          </p>
          <p>
            To address the issue of building a high-quality dataset within a
            short race course, we first manually annotated a small dataset and
            trained initial weights. Subsequently, we innovatively used an AI
            engine-driven X-AnyLabeling for semi-automatic annotation of a large
            dataset, avoiding the tedious and inefficient manual annotation
            process. Ultimately, all data will be used for the training of
            YOLOv5.
          </p>
          <p>
            Finally,{' '}
            <code>
              <i>
                The implementation of these strategies made us the first team in
                the history of the RoboCup@Home to achieve a full score in the
                robot vision project &ldquo;What is That&rdquo;, leading with an
                absolute advantage over teams from Tsinghua University,
                Southeast University, Shanghai University, and others, to win
                the championship.
              </i>
            </code>
            .
          </p>
          <p>
            In the 2023 China Robot Competition Special Competition General
            Purpose Service Robot
            Project（2023中国机器人大赛专项赛通用服务机器人赛项）, To achieve
            planar grasping of a robotic arm, a GGCNN (Generative Grasping CNN)
            model is constructed. It takes high-precision depth maps captured by
            RealSense as input and utilizes the end-to-end learning mechanism of
            CNN to output a pixel-level grasp pose map. This includes the
            optimal grasping point, grasping width, and rotation angle around
            the Z-axis. The model training enhances the authenticity of the
            dataset through Gaussian noise, thereby improving the grasping
            accuracy and robustness of the robotic arm in complex environments.
          </p>
          <p>
            Finally, in the competition,{' '}
            <code>
              <i>
                I led the team to surpass teams from Xi&rsquo;an Jiaotong
                University, Northwestern Polytechnical University, and others to
                win the championship with an absolute advantage
              </i>
            </code>
            .
          </p>
        </TypedContent>
        <TypedText>projects</TypedText>
        <TypedContent>
          <ul>
            <li>
              <strong>
                <a href='https://github.com/M0rtzz/VisionVoyage'>
                  VisionVoyage
                </a>
              </strong>
            </li>
            <li>
              An autonomous driving simulation system based on fish eye camera
              and other perception technologies has been implemented using UE4.
            </li>
          </ul>
          <ul>
            <li>
              <strong>
                <a href='https://github.com/M0rtzz/zzu-cs-os-design'>
                  os-design
                </a>
              </strong>
            </li>
            <li>
              Modify the Linux-0.12 kernel source code by adding two system
              calls. The first system call copies the user state string content
              to the kernel state and saves it, while the second system call
              copies the saved string back from the kernel state to the user
              state. I have written an automated configuration script that
              automatically installs compilation toolchains such as gcc-3.4 and
              downloads the source code of bochs-2.2.5. Use the sed command
              modification configure script to add gcc compilation parameters to
              prevent compilation errors. Then, debug the modified Linux-0.12
              kernel using the compiled bochs-x86 emulator. The Git submission
              style of this repo fully follows the Angular + gitmoji
              specificationn.
            </li>
          </ul>
          <ul>
            <li>
              <strong>
                <a href='https://github.com/M0rtzz/m0rtzz.blog'>m0rtzz.blog</a>
              </strong>
            </li>
            <li>My website&rsquo;s front-end source code.</li>
          </ul>
          <ul>
            <li>
              <strong>
                <a href='https://github.com/M0rtzz/zzu-resume-template'>
                  latex-resume-template
                </a>
              </strong>
            </li>
            <li>
              Using LaTeX, a resume template was designed by writing the font of
              fontame-4.7.0 as a .sty style file and introducing it.
            </li>
          </ul>
          <ul>
            <li>
              <strong>
                <a href='https://github.com/dependon/fantascene-dynamic-wallpaper'>
                  linux-dynamic-wallpaper
                </a>
              </strong>
            </li>
            <li>
              Through research, I have discovered a method of unpacking
              scene.pkg and generating .mp4 files.
            </li>
          </ul>
        </TypedContent>
        <TypedText>research</TypedText>
        <TypedContent>
          <p>
            <strong>
              <i>
                FishSegMSLA: Real-Time Semantic Segmentation Using Multi-Scale Linear Attention and Content-Guided Attention for Surround-View Fisheye Images
              </i>
            </strong>
          </p>
          <p>
            To address the issue of significant geometric distortion of targets
            in panoramic fisheye images, an end-to-end semantic segmentation
            network for panoramic fisheye images, FisheyeSegNet, has been
            constructed. The Multi-Scale Depth Aggregation Network (MSDAN),
            designed with the integration of constrained deformable convolution,
            effectively processes and represents multi-scale features, enhancing
            the network&rsquo;s ability to model distortion. The proposed
            constrained deformable convolution and Flexible Attention Module
            (FAM) establish a dynamic receptive field, enhancing the
            model&rsquo;s ability to adaptively capture distorted target
            features, increasing the model&rsquo;s representational capacity,
            and guiding the network to correctly focus on the target objects.
          </p>
          <p>
            To tackle the problem of data for fisheye vision research, the
            Cubemap algorithm was designed, and the M0rtzzWoodscape large-scale
            semantic segmentation dataset was constructed using CARLA. This
            dataset includes 8000 simulated images with precise pixel-level
            semantic annotations across 24 categories, compensating for the lack
            of large-scale training datasets.
          </p>
          <p>
            Extensive experiments on public datasets such as Woodscape have
            verified the effectiveness and excellent generalization of this
            method. The experiments have been completed, and the paper is
            currently being written.
          </p>
        </TypedContent>
        <TypedText>skills</TypedText>
        <TypedContent>
          <p>
            I excel in <code>Linux</code>, proficiently utilizing <code>Shell</code> to perform human-computer interaction.
          </p>
          <p>
            I am familiar with <code>C/C++, Python, Pytorch, Docker, Git, etc</code>.
          </p>
          <p>
            In addition to my daily backend development tasks, I can also handle
            basic website construction and deployment.
          </p>
          <p>
            Furthermore, I have experience developing service robots using
            C/C++, Python and ROS.
          </p>
        </TypedContent>
        <TypedText>blog-info</TypedText>
        <TypedContent>
          <p>
            I am keen on sharing knowledge as well as writing articles and
            tutorials regularly.
          </p>
          <p>
            Previously, I primarily wrote in Chinese, but currently, my goal is
            to write articles in English.
          </p>
        </TypedContent>
        <TypedText>contact</TypedText>
        <TypedContent>
          <div className='my-4 flex items-center'>
            <p className='basis-1/4 text-center font-semibold'>Social</p>
            <div className='grid flex-1 grid-cols-2 justify-items-start gap-2'>
              <a href='https://github.com/M0rtzz'>GitHub</a>
              <a href='https://gitcode.com/M0rtzz'>GitCode</a>
              <a href='https://blog.csdn.net/M0rtzz'>CSDN</a>
              <a href='https://www.youtube.com/@M0rtzzGod'>YouTube</a>
            </div>
          </div>
          <div className='flex items-center'>
            <p className='basis-1/4 text-center font-semibold'>E-mail</p>
            <a href='mailto:m0rtzz@outlook.com'>m0rtzz@outlook.com</a>
          </div>
        </TypedContent>
      </Typed>
    </div>
  )
}

export default LinuxAwareComponent