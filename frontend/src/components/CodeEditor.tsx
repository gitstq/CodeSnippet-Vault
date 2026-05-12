import { useEffect, useRef } from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'

// 导入语言支持
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
import 'prismjs/components/prism-markup'
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

import 'prismjs/themes/prism-tomorrow.css'

interface CodeEditorProps {
  code: string
  language: string
  onChange: (code: string) => void
  placeholder?: string
  height?: string
}

export default function CodeEditor({
  code,
  language,
  onChange,
  placeholder = '',
  height = '300px'
}: CodeEditorProps) {
  const highlightCode = (code: string) => {
    const languageMap: Record<string, string> = {
      'react': 'tsx',
      'vue': 'javascript',
      'text': 'text'
    }
    
    const prismLanguage = languageMap[language] || language
    
    if (prismLanguage === 'text') {
      return code
    }
    
    try {
      return Prism.highlight(code, Prism.languages[prismLanguage] || Prism.languages.text, prismLanguage)
    } catch {
      return code
    }
  }

  return (
    <div
      className="rounded-lg overflow-hidden border border-gray-700"
      style={{ height }}
    >
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={highlightCode}
        padding={16}
        placeholder={placeholder}
        className="code-editor"
        style={{
          fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
          fontSize: 14,
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          minHeight: '100%',
        }}
        textareaClassName="focus:outline-none"
      />
    </div>
  )
}
