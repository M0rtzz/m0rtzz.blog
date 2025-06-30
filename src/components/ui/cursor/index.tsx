'use client'

import { useEffect } from 'react'
import { setANICursor, setANICursorWithGroupElement } from "ani-cursor.js"

export default function CursorInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const is_desktop = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
    const is_touch_device = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const is_mobile = is_desktop ? false : /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || is_touch_device;

    if (is_mobile) return;

    try {
      // 需要排除的选择器
      const exclude_skills_block = ':not(.skills):not(.skills *)';

      // 默认
      setANICursorWithGroupElement(
        [`body${exclude_skills_block}`, `html${exclude_skills_block}`, `img${exclude_skills_block}`, `div.relative:nth-child(n)${exclude_skills_block}`, `div.relative:nth-child(n) > div:nth-child(n) > a:nth-child(n) > h2:nth-child(n)${exclude_skills_block}`, `div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n)${exclude_skills_block}`],
        "/cursor/ani/arrow.ani"
      );

      // 文本输入状态
      setANICursorWithGroupElement(
        [`input${exclude_skills_block}`, `textarea${exclude_skills_block}`, `[contenteditable]${exclude_skills_block}`],
        "/cursor/ani/cross.ani"
      );

      // 可拖动元素
      setANICursor(
        `[draggable='true']${exclude_skills_block}`,
        "/cursor/ani/move.ani"
      );

      // 禁用状态
      setANICursor(
        `[disabled]${exclude_skills_block}`,
        "/cursor/ani/no.ani"
      );

      // 文本元素
      setANICursorWithGroupElement(
        [`p${exclude_skills_block}`, `h1${exclude_skills_block}`, `h2${exclude_skills_block}`, `h3${exclude_skills_block}`, `h4${exclude_skills_block}`, `h5${exclude_skills_block}`, `h6${exclude_skills_block}`, `li${exclude_skills_block}`, `td${exclude_skills_block}`, `th${exclude_skills_block}`],
        "/cursor/ani/beam.ani"
      );

      // 链接和可点击元素
      setANICursorWithGroupElement(
        [`a${exclude_skills_block}`, `button${exclude_skills_block}`, `[onclick]${exclude_skills_block}`, `summary${exclude_skills_block}`, `details > summary${exclude_skills_block}`, `.col-span-3${exclude_skills_block}`, `label.relative${exclude_skills_block}`, `a.group\\/note:nth-child(n) > p:nth-child(n)${exclude_skills_block}`, `div.relative:nth-child(n) > a:nth-child(n) > span:nth-child(n)${exclude_skills_block}`, `div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n) > a:nth-child(n)${exclude_skills_block}`],
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
