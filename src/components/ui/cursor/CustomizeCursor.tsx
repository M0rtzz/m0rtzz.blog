'use client'

import { useEffect } from 'react'
import { setANICursor, setANICursorWithGroupElement } from "ani-cursor.js"

export default function CursorInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDesktop = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = isDesktop ? false : /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || isTouchDevice;

    if (isMobile) return;

    try {
      // 需要排除的选择器
      const excludeGalton = ':not(.skills):not(.skills *)';

      // 默认
      setANICursorWithGroupElement(
        [`body${excludeGalton}`, `html${excludeGalton}`, `img${excludeGalton}`, `div.relative:nth-child(n)${excludeGalton}`, `div.relative:nth-child(n) > div:nth-child(n) > a:nth-child(n) > h2:nth-child(n)${excludeGalton}`, `div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n)${excludeGalton}`],
        "/cursor/ani/arrow.ani"
      );

      // 文本输入状态
      setANICursorWithGroupElement(
        [`input${excludeGalton}`, `textarea${excludeGalton}`, `[contenteditable]${excludeGalton}`],
        "/cursor/ani/cross.ani"
      );

      // 可拖动元素
      setANICursor(
        `[draggable='true']${excludeGalton}`,
        "/cursor/ani/move.ani"
      );

      // 禁用状态
      setANICursor(
        `[disabled]${excludeGalton}`,
        "/cursor/ani/no.ani"
      );

      // 文本元素
      setANICursorWithGroupElement(
        [`p${excludeGalton}`, `h1${excludeGalton}`, `h2${excludeGalton}`, `h3${excludeGalton}`, `h4${excludeGalton}`, `h5${excludeGalton}`, `h6${excludeGalton}`, `li${excludeGalton}`, `td${excludeGalton}`, `th${excludeGalton}`],
        "/cursor/ani/beam.ani"
      );

      // 链接和可点击元素
      setANICursorWithGroupElement(
        [`a${excludeGalton}`, `button${excludeGalton}`, `[onclick]${excludeGalton}`, `summary${excludeGalton}`, `details > summary${excludeGalton}`, `.col-span-3${excludeGalton}`, `label.relative${excludeGalton}`, `a.group\\/note:nth-child(n) > p:nth-child(n)${excludeGalton}`, `div.relative:nth-child(n) > a:nth-child(n) > span:nth-child(n)${excludeGalton}`, `div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n) > a:nth-child(n)${excludeGalton}`],
        "/cursor/ani/link.ani"
      );

    } catch (error) {
      console.error('Cursor initialization failed:', error)
      // 回退到普通光标
      document.body.style.cursor = 'auto'
    }

    const fallback = () => {
      document.body.style.cursor = 'auto'
    }
    window.addEventListener('error', fallback)
    return () => window.removeEventListener('error', fallback)
  }, [])

  return null
}
