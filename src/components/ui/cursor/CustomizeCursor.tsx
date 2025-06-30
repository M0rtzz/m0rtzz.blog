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
      // 默认
      setANICursorWithGroupElement(
        ["body", "html", "img", "div.relative:nth-child(n)", "div.relative:nth-child(n) > div:nth-child(n) > a:nth-child(n) > h2:nth-child(n)", "div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n)"],
        "/cursor/ani/arrow.ani"
      );

      // 文本输入状态
      setANICursorWithGroupElement(
        ["input", "textarea", "[contenteditable]"],
        "/cursor/ani/cross.ani"
      );

      // 可拖动元素
      setANICursor(
        "[draggable='true']",
        "/cursor/ani/move.ani"
      );

      // 禁用状态
      setANICursor(
        "[disabled]",
        "/cursor/ani/no.ani"
      );

      // 文本元素
      setANICursorWithGroupElement(
        ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th"],
        "/cursor/ani/beam.ani"
      );

      // 链接和可点击元素
      setANICursorWithGroupElement(
        ["a", "button", "[onclick]", "summary", "details > summary", ".col-span-3", "label.relative", "a.group\\/note:nth-child(n) > p:nth-child(n)", "div.relative:nth-child(n) > a:nth-child(n) > span:nth-child(n)", "div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n) > a:nth-child(n)"],
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
