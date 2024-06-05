'use client'

import React from 'react'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const pathname = usePathname()

  if (pathname === '/resume') {
    return null
  }

  return (
    <footer className='footer'>
      <div className='container mx-auto flex items-center justify-center py-8 text-center text-xs'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src='/icon/police.png'
            alt='Police Logo'
            width={15}
            height={15}
            style={{ marginTop: '-2.6px', marginRight: '5px' }}
          />
          <a
            href='https://beian.mps.gov.cn/#/query/webSearch'
            target='_blank'
            style={{ color: '#1E90FF', textDecoration: 'none' }}
          >
            公安备案号待审核
          </a>
        </div>
        <div style={{ margin: '0 10px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src='/icon/icp.png'
            alt='ICP Logo'
            width={18}
            height={18}
            style={{ marginTop: '-1.8px', marginRight: '5px' }}
          />
          <a
            href='https://beian.miit.gov.cn'
            target='_blank'
            style={{ color: '#1E90FF', textDecoration: 'none' }}
          >
            豫ICP备2024072448号
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
