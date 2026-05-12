import { useEffect, useRef } from 'react'
import Prism from 'prismjs'

// 导入常用语言支持
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-markup' // HTML
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// Prism 主题
import 'prismjs/themes/prism-tomorrow.css'

interface CodePreviewProps {
  code: string
  language: string
  maxLines?: number
  showLineNumbers?: boolean
}

export default function CodePreview({
  code,
  language,
  maxLines,
  showLineNumbers = false
}: CodePreviewProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  // 限制行数
  const displayCode = maxLines
    ? code.split('\n').slice(0, maxLines).join('\n') + (code.split('\n').length > maxLines ? '\n...' : '')
    : code

  // 语言映射
  const languageMap: Record<string, string> = {
    'react': 'tsx',
    'vue': 'javascript',
    'text': 'text'
  }

  const prismLanguage = languageMap[language] || language

  return (
    <div className="relative">
      <pre
        className={`${showLineNumbers ? 'line-numbers' : ''} !m-0 !p-0 !bg-transparent`}
        style={{
          maxHeight: maxLines ? `${maxLines * 1.6 + 1}em` : undefined,
          overflow: 'hidden'
        }}
      >
        <code
          ref={codeRef}
          className={`language-${prismLanguage} code-editor`}
        >
          {displayCode}
        </code>
      </pre>
    </div>
  )
}
