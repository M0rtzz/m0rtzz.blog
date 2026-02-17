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
      const exclude_element = ':not(.skills):not(.skills *):not(.music):not(.music *)';

      // 默认
      setANICursorWithGroupElement(
        [
          `body${exclude_element}`,
          `html${exclude_element}`,
          `img${exclude_element}`,
          `div.relative:nth-child(n)${exclude_element}`,
          `div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n)${exclude_element}`,
          `div.relative:nth-child(n) > div:nth-child(n) > a:nth-child(n) > h2:nth-child(n)${exclude_element}`,
        ],
        "/cursor/ani/arrow.ani"
      );

      // 文本输入状态
      setANICursorWithGroupElement(
        [
          `input${exclude_element}`,
          `textarea${exclude_element}`,
          `[contenteditable]${exclude_element}`,
        ],
        "/cursor/ani/cross.ani"
      );

      // 可拖动元素
      setANICursor(
        `[draggable='true']${exclude_element}`,
        "/cursor/ani/move.ani"
      );

      // 禁用状态
      setANICursor(
        `[disabled]${exclude_element}`,
        "/cursor/ani/no.ani"
      );

      // 文本元素
      setANICursorWithGroupElement(
        [
          `p${exclude_element}`,
          `h1${exclude_element}`,
          `h2${exclude_element}`,
          `h3${exclude_element}`,
          `h4${exclude_element}`,
          `h5${exclude_element}`,
          `h6${exclude_element}`,
          `li${exclude_element}`,
          `td${exclude_element}`,
          `th${exclude_element}`,
          `code${exclude_element}`,
        ],
        "/cursor/ani/beam.ani"
      );

      // 链接和可点击元素
      setANICursorWithGroupElement(
        [
          `a${exclude_element}`,
          `button${exclude_element}`,
          `summary${exclude_element}`,
          `[onclick]${exclude_element}`,
          `.toc-left${exclude_element}`,
          `.col-span-3${exclude_element}`,
          `label.relative${exclude_element}`,
          `details > summary${exclude_element}`,
          `a.group\\/note:nth-child(n) > p:nth-child(n)${exclude_element}`,
          `div.relative:nth-child(n) > a:nth-child(n) > span:nth-child(n)${exclude_element}`,
          `div.relative:nth-child(n) > div:nth-child(n) > p:nth-child(n) > a:nth-child(n)${exclude_element}`,
        ],
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
