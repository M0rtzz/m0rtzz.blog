import dynamic from 'next/dynamic'
import { type StaticImageData } from 'next/image'

import anacondaSvg from '@/images/logos/anaconda.svg'
import arduinoSvg from '@/images/logos/arduino.svg'
import bashSvg from '@/images/logos/bash.svg'
import cSvg from '@/images/logos/c.svg'
import centosSvg from '@/images/logos/centos.svg'
import cloudflareSvg from '@/images/logos/cloudflare.svg'
import cmakeSvg from '@/images/logos/cmake.svg'
import cppSvg from '@/images/logos/cpp.svg'
import debianSvg from '@/images/logos/debian.svg'
import dockerSvg from '@/images/logos/docker.svg'
import excelSvg from '@/images/logos/excel.svg'
import gccSvg from '@/images/logos/gcc.svg'
import gitSvg from '@/images/logos/git.svg'
import githubSvg from '@/images/logos/github.svg'
import gitlabSvg from '@/images/logos/gitlab.svg'
import gnomeSvg from '@/images/logos/gnome.svg'
import gnuSvg from '@/images/logos/gnu.svg'
// import googleDriveSvg from '@/images/logos/googleDrive.svg'
import hppSvg from '@/images/logos/hpp.svg'
import huggingfaceSvg from '@/images/logos/huggingface.svg'
import huskySvg from '@/images/logos/husky.svg'
// import ideaSvg from '@/images/logos/idea.svg'
import javaSvg from '@/images/logos/java.svg'
import jsonSvg from '@/images/logos/json.svg'
import kubernetesSvg from '@/images/logos/kubernetes.svg'
import latexSvg from '@/images/logos/latex.svg'
import linuxSvg from '@/images/logos/linux.svg'
import llvmSvg from '@/images/logos/llvm.svg'
// import makefileSvg from '@/images/logos/makefile.svg'
// import mdSvg from '@/images/logos/md.svg'
import mdxSvg from '@/images/logos/mdx.svg'
import neovimSvg from '@/images/logos/neovim.svg'
import nginxSvg from '@/images/logos/nginx.svg'
import nodejsSvg from '@/images/logos/nodejs.svg'
import npmSvg from '@/images/logos/npm.svg'
import nvmSvg from '@/images/logos/nvm.svg'
import ollamaSvg from '@/images/logos/ollama.svg'
// import onedriveSvg from '@/images/logos/onedrive.svg'
import opencvSvg from '@/images/logos/opencv.svg'
// import outlookSvg from '@/images/logos/outlook.svg'
import pdfSvg from '@/images/logos/pdf.svg'
import pnpmSvg from '@/images/logos/pnpm.svg'
import powershellSvg from '@/images/logos/powershell.svg'
import pptSvg from '@/images/logos/ppt.svg'
import prSvg from '@/images/logos/pr.svg'
import psSvg from '@/images/logos/ps.svg'
// import pycharmSvg from '@/images/logos/pycharm.svg'
import pythonSvg from '@/images/logos/python.svg'
import pytorchSvg from '@/images/logos/pytorch.svg'
import rosSvg from '@/images/logos/ros.svg'
// import shellSvg from '@/images/logos/shell.svg'
import tomlSvg from '@/images/logos/toml.svg'
import ubuntuSvg from '@/images/logos/ubuntu.svg'
import vimSvg from '@/images/logos/vim.svg'
import visioSvg from '@/images/logos/visio.svg'
import vmwareSvg from '@/images/logos/vmware.svg'
// import vsSvg from '@/images/logos/vs.svg'
// import vscodeSvg from '@/images/logos/vscode.svg'
import windowsSvg from '@/images/logos/windows.svg'
import wordSvg from '@/images/logos/word.svg'
import xmlSvg from '@/images/logos/xml.svg'
import yamlSvg from '@/images/logos/yaml.svg'
import yarnSvg from '@/images/logos/yarn.svg'
import zshSvg from '@/images/logos/zsh.svg'

import { Block } from '@/components/blocks/block'

const Galton = dynamic(() => import('./galton').then(module => module.Galton), {
  ssr: false,
})

const images: StaticImageData[] = [
  anacondaSvg,
  arduinoSvg,
  bashSvg,
  cSvg,
  centosSvg,
  cloudflareSvg,
  cmakeSvg,
  cppSvg,
  debianSvg,
  dockerSvg,
  excelSvg,
  gccSvg,
  gitSvg,
  githubSvg,
  gitlabSvg,
  gnomeSvg,
  gnuSvg,
  // googleDriveSvg,
  hppSvg,
  huggingfaceSvg,
  huskySvg,
  // ideaSvg,
  javaSvg,
  jsonSvg,
  kubernetesSvg,
  latexSvg,
  linuxSvg,
  llvmSvg,
  // makefileSvg,
  // mdSvg,
  mdxSvg,
  neovimSvg,
  nginxSvg,
  nodejsSvg,
  npmSvg,
  nvmSvg,
  ollamaSvg,
  // onedriveSvg,
  opencvSvg,
  // outlookSvg,
  pdfSvg,
  pnpmSvg,
  powershellSvg,
  pptSvg,
  prSvg,
  psSvg,
  // pycharmSvg,
  pythonSvg,
  pytorchSvg,
  rosSvg,
  // shellSvg,
  tomlSvg,
  ubuntuSvg,
  vimSvg,
  visioSvg,
  vmwareSvg,
  // vsSvg,
  // vscodeSvg,
  windowsSvg,
  wordSvg,
  xmlSvg,
  yamlSvg,
  yarnSvg,
  zshSvg,
]
export const Skills = () => {
  return (
    <Block
      data-type='about'
      className='z-20 row-span-4 bg-surface !p-0 max-sm:col-span-2 sm:row-span-2'
    >
      <div className='absolute right-0 top-0 w-20 -translate-y-1/2 translate-x-1/4 rotate-12 scale-75 rounded-lg p-1 shadow-lg before:absolute before:inset-x-0 before:bottom-0 before:z-20 before:origin-bottom before:scale-y-50 before:rounded-lg before:border-[40px] before:border-transparent before:border-b-red-500 before:border-l-red-500 before:content-["_"] after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:origin-bottom after:scale-y-50 after:rounded-lg after:border-[40px] after:border-transparent after:border-b-red-500 after:border-r-red-500 after:brightness-75 after:content-["_"] dark:before:border-b-blue-950 dark:before:border-l-blue-950 dark:after:border-b-blue-950 dark:after:border-r-blue-950 xl:scale-100'>
        <span className='block h-10 -translate-y-4 rounded bg-amber-50 px-2 py-1 uppercase text-slate-800 shadow dark:bg-gray-200'>
          Skills
        </span>
      </div>
      <Galton images={images} />
    </Block>
  )
}
