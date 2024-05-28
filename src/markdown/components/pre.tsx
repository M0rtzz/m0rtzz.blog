'use client';

import React, { useState, useRef } from 'react';

type PreProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;

export const pre = (props: PreProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (preRef.current) {
      const code = preRef.current.innerText;
      try {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error('Error copying code:', error);
      }
    }
  };

  return (
    <div className="relative">
      <pre ref={preRef} {...props} />
      <button
        onClick={handleCopy}
        className="absolute top-2 right-1 bg-gray-800 from-surface-1 justify-center bg-gradient-to-b to-white dark:to-white/5 py-1 px-2 rounded "
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
