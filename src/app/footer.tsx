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
            src='/iconspolice.png'
            alt='Police Logo'
            width={15}
            height={15}
            style={{ marginTop: '-2.6px', marginRight: '5px' }}
          />
          <a
            href='http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41020002000132'
            target='_blank'
            style={{ color: '#1E90FF', textDecoration: 'none' }}
          >
            豫公网安备41020002000132号
          </a>
        </div>
        <div style={{ margin: '0 10px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src='/iconsicp.png'
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
        <div style={{ margin: '0 10px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#1E90FF' }}>本站由</span>
            <a href='https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral'>
              <Image
                src='/iconsupyun.png'
                alt='UpYun Logo'
                width={40}
                height={40}
                style={{
                  marginLeft: '2px',
                  marginRight: '2px',
                }}
              />
            </a>
            <span style={{ color: '#1E90FF' }}>提供CDN/云存储服务</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
