import dynamic from 'next/dynamic'
import { type StaticImageData } from 'next/image'

import anacondaSvg from '@/images/logo/anaconda.svg'
import arduinoSvg from '@/images/logo/arduino.svg'
import bashSvg from '@/images/logo/bash.svg'
import cSvg from '@/images/logo/c.svg'
import centosSvg from '@/images/logo/centos.svg'
import cloudflareSvg from '@/images/logo/cloudflare.svg'
import cmakeSvg from '@/images/logo/cmake.svg'
import cppSvg from '@/images/logo/cpp.svg'
import debianSvg from '@/images/logo/debian.svg'
import dockerSvg from '@/images/logo/docker.svg'
import excelSvg from '@/images/logo/excel.svg'
import gccSvg from '@/images/logo/gcc.svg'
import gitSvg from '@/images/logo/git.svg'
import githubSvg from '@/images/logo/github.svg'
import gnomeSvg from '@/images/logo/gnome.svg'
import gnuSvg from '@/images/logo/gnu.svg'
// import googleDriveSvg from '@/images/logo/googleDrive.svg'
import hppSvg from '@/images/logo/hpp.svg'
import huggingfaceSvg from '@/images/logo/huggingface.svg'
import huskySvg from '@/images/logo/husky.svg'
// import ideaSvg from '@/images/logo/idea.svg'
import javaSvg from '@/images/logo/java.svg'
import jsonSvg from '@/images/logo/json.svg'
import kubernetesSvg from '@/images/logo/kubernetes.svg'
import latexSvg from '@/images/logo/latex.svg'
import linuxSvg from '@/images/logo/linux.svg'
import llvmSvg from '@/images/logo/llvm.svg'
// import makefileSvg from '@/images/logo/makefile.svg'
import markdownSvg from '@/images/logo/markdown.svg'
import neovimSvg from '@/images/logo/neovim.svg'
import nginxSvg from '@/images/logo/nginx.svg'
import nodejsSvg from '@/images/logo/nodejs.svg'
import npmSvg from '@/images/logo/npm.svg'
import nvmSvg from '@/images/logo/nvm.svg'
import ollamaSvg from '@/images/logo/ollama.svg'
// import onedriveSvg from '@/images/logo/onedrive.svg'
import opencvSvg from '@/images/logo/opencv.svg'
// import outlookSvg from '@/images/logo/outlook.svg'
import pdfSvg from '@/images/logo/pdf.svg'
import pnpmSvg from '@/images/logo/pnpm.svg'
import powershellSvg from '@/images/logo/powershell.svg'
import pptSvg from '@/images/logo/ppt.svg'
import prSvg from '@/images/logo/pr.svg'
import psSvg from '@/images/logo/ps.svg'
// import pycharmSvg from '@/images/logo/pycharm.svg'
import pythonSvg from '@/images/logo/python.svg'
import pytorchSvg from '@/images/logo/pytorch.svg'
import rosSvg from '@/images/logo/ros.svg'
// import shellSvg from '@/images/logo/shell.svg'
import tomlSvg from '@/images/logo/toml.svg'
import ubuntuSvg from '@/images/logo/ubuntu.svg'
import vimSvg from '@/images/logo/vim.svg'
import visioSvg from '@/images/logo/visio.svg'
import vmwareSvg from '@/images/logo/vmware.svg'
// import vsSvg from '@/images/logo/vs.svg'
// import vscodeSvg from '@/images/logo/vscode.svg'
import windowsSvg from '@/images/logo/windows.svg'
import wordSvg from '@/images/logo/word.svg'
import xmlSvg from '@/images/logo/xml.svg'
import yamlSvg from '@/images/logo/yaml.svg'
import yarnSvg from '@/images/logo/yarn.svg'
import zshSvg from '@/images/logo/zsh.svg'

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
  markdownSvg,
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
