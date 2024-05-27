import Link from 'next/link'

import { IconX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type Metadata, type Viewport } from 'next'

import { Dot } from '@/components/blocks/resume'
import { Typed, TypedContent, TypedText } from '@/components/typed'

export const metadata: Metadata = {
  title: 'Resume',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#282935' },
    { media: '(prefers-color-scheme: dark)', color: '#282935' },
  ],
  colorScheme: 'dark',
}

export default function Page() {
  return (
    <div className='flex min-h-svh items-center justify-center bg-[#282935] p-4'>
      <main className='flex max-h-[90svh] max-w-[65ch] flex-1 flex-col overflow-hidden rounded-2xl border border-gray-600 shadow-2xl shadow-black'>
        <header className='grid h-11 flex-none grid-cols-[1fr_2fr_1fr] items-center border-b border-gray-800 bg-zinc-700 px-4 text-xs font-semibold'>
          <span className='flex gap-2'>
            <Link aria-label='Back to home page' href='/'>
              <Dot className='group relative flex items-center justify-center bg-red-500 before:absolute before:-inset-4 before:content-["_"]'>
                <IconX className='invisible size-2.5 group-hover:visible' />
              </Dot>
            </Link>
            <Dot className='cursor-not-allowed bg-yellow-400' />
            <Dot className='cursor-not-allowed bg-green-500' />
          </span>
          <span className='text-center text-gray-400'>
            m0rtzz@zzu:~
          </span>
          <span className='text-end text-gray-500'>⌥⌘1</span>
        </header>
        <div className='min-h-60 flex-1 overflow-y-auto p-2 text-sm text-gray-200 duration-300 animate-in fade-in'>
          <p className='mb-2'>
            Last login: {dayjs().format('ddd MMM DD HH:mm:ss')} on ttys003
          </p>
          <Typed>
            <TypedText>whoami</TypedText>
            <TypedContent>
              <p>
                Hi, I&apos;m <strong>M0rtzz</strong>, in Chinese my name is{' '}
                <strong>徐梓航</strong>.
              </p>
              <p>
                I am a student majoring in computer science at Zhengzhou University,
                and I have been studying computer knowledge since <strong>2021</strong>, focusing on
                writing software to contribute to the open source world and
                <code>share knowledge and innovation</code>.
              </p>
              <p>
                I have amassed substantial practical experience in the{' '}
                <code>ROS</code> technology stack.
              </p>
            </TypedContent>
            <TypedText afterDelay={1000}>ls</TypedText>
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
            <TypedText afterDelay={700}>competitions</TypedText>
            <TypedContent>
              <p>
                I won three national first prizes in the field of robotics in 2023, with two championships and one bronze medal.
              </p>
              <p>
                In the 2023 RoboCup China tournament（2023RoboCup机器人世界杯中国赛）, I led a team to develop an intelligent home service robot that can inquire about customer information, independently search for items that customers need, and submit them to customers. Comprehensive application of SeetaFace6 facial recognition technology YOLO object detection algorithm LiDAR-SLAM mapping method and A * path planning algorithm are used to integrate various functions through ROS communication framework, enabling robots to complete corresponding operations. The main challenge is to focus on implementing human-machine tracking systems through depth and CV, in order to solve the problem of short maximum distance and low accuracy in LiDAR tracking.<br></br>Finally, in the competition, <code><i>I led the team to surpass teams from Tsinghua University, Southeast University, Shanghai University, and others to win the championship with an absolute advantage</i></code>.
              </p>
              <p>
                In the 2023 China Robot Competition Special Competition General Purpose Service Robot Project（2023中国机器人大赛专项赛通用服务机器人赛项）, the General Purpose Service Robot Project focuses on examining the comprehensive human-machine interaction ability of robots. I focused my main challenge on building the GGCNN model, predicting grasping coordinates and angles in a multi object plane scene, and obtaining them through a RealSense camera Depth information to achieve the planar grasping effect of the robotic arm.<br></br>Finally, in the competition, <code><i>I led the team to surpass teams from Xi&apos;an Jiaotong University, Northwestern Polytechnical University, and others to win the championship with an absolute advantage</i></code>.
              </p>
            </TypedContent>
            <TypedText afterDelay={1000}>projects</TypedText>
            <TypedContent>
              <ul>
                <li>
                  <strong>
                    <a href='https://gitcode.com/M0rtzz/VisionVoyage'>
                      VisionVoyage
                    </a>
                  </strong>
                </li>
                <li>An autonomous driving simulation system based on fish eye camera and other perception technologies has been implemented using UE4.</li>
              </ul>
              <ul>
                <li>
                  <strong>
                    <a href='https://gitcode.com/M0rtzz/zzu-cs-os-design'>
                      os-design
                    </a>
                  </strong>
                </li>
                <li>Modify the Linux-0.12 kernel source code by adding two system calls. The first system call copies the user state string content to the kernel state and saves it, while the second system call copies the saved string back from the kernel state to the user state. I have written an automated configuration script that automatically installs compilation toolchains such as gcc-3.4 and downloads the source code of bochs-2.2.5. Use the sed command modification configure script to add gcc compilation parameters to prevent compilation errors. Then, debug the modified Linux-0.12 kernel using the compiled bochs-x86 emulator. The Git submission style of this repo fully follows the Angular + gitmoji specificationn.</li>
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
                  Using LaTeX, a resume template was designed by writing the font of fontame-4.7.0 as a .sty style file and introducing it.
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
                  Through research, I have discovered a method of unpacking scene.pkg and generating .mp4 files.
                </li>
              </ul>
              <ul>
                <li>
                  <strong>
                    <a href='https://github.com/M0rtzz/m0rtzz.blog'>
                      blog-template
                    </a>
                  </strong>
                </li>
                <li>
                  My website&apos;s front-end source code.
                </li>
              </ul>
            </TypedContent>
            <TypedText>research</TypedText>
            <TypedContent>
              <p>FisheyeSegNet: Restricted Deformable Convolution based Semantic Segmentation Using Surround-View Fisheye Camera for Autonomous Driving</p>
              <p>
                In response to the lack of research data on fisheye vision, a Cubemap algorithm was designed to construct a large-scale semantic segmentation dataset for M0rtzzWoodscape using CARLA. To address the impact of geometric distortions in panoramic fisheye images on semantic segmentation models, a multi branch stacking module based on DCN is designed to extract distorted features.
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
                In addition to my daily backend development tasks, I can also handle basic website construction and deployment.
              </p>
              <p>
                Furthermore, I have experience developing service robots using C/C++, Python and ROS.
              </p>
            </TypedContent>
            <TypedText>blog-info</TypedText>
            <TypedContent>
              <p>
                I am keen on sharing knowledge as well as writing articles and
                tutorials regularly.
              </p>
              <p>
                Previously, I primarily wrote in Chinese, but currently, my goal
                is to write articles in English.
              </p>
            </TypedContent>
            <TypedText>Contact</TypedText>
            <TypedContent>
              <div className='my-4 flex items-center'>
                <p className='basis-1/4 text-center font-semibold'>Social</p>
                <div className='grid flex-1 grid-cols-2 justify-items-start gap-2'>
                  <a href='https://github.com/M0rtzz'>Github</a>
                  <a href='https://gitcode.com/M0rtzz'>Gitcode</a>
                  <a href='https://blog.csdn.net/M0rtzz'>CSDN</a>
                  <a href='https://www.youtube.com/@M0rtzzGod'>YouTube</a>
                </div>
              </div>
              <div className='flex items-center'>
                <p className='basis-1/4 text-center font-semibold'>Email</p>
                <a href='mailto:m0rtzz@stu.zzu.edu.cn'>m0rtzz@stu.zzu.edu.cn</a>
              </div>
            </TypedContent>
          </Typed>
        </div>
      </main>
    </div>
  )
}
