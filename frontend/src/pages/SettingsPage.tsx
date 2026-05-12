import { useState } from 'react'
import {
  Settings,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  FileJson,
  Info
} from 'lucide-react'
import { snippetApi } from '../utils/api'

export default function SettingsPage() {
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleExport = async () => {
    try {
      setExporting(true)
      const data = await snippetApi.exportSnippets()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `snippetvault-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert('导出成功！')
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败')
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!data.snippets || !Array.isArray(data.snippets)) {
        alert('无效的文件格式')
        return
      }

      const result = await snippetApi.importSnippets(data.snippets)
      alert(`导入成功: ${result.imported} 个片段, 跳过 ${result.skipped} 个重复片段`)
    } catch (error) {
      console.error('导入失败:', error)
      alert('导入失败')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const handleClearAll = async () => {
    if (!confirm('警告：此操作将删除所有代码片段，且不可恢复！\n\n确定要继续吗？')) {
      return
    }
    
    if (!confirm('再次确认：你真的要删除所有代码片段吗？')) {
      return
    }

    try {
      setClearing(true)
      // 获取所有片段并逐个删除
      const data = await snippetApi.exportSnippets()
      for (const snippet of data.snippets) {
        await snippetApi.deleteSnippet(snippet.id)
      }
      alert('所有代码片段已清除')
      window.location.reload()
    } catch (error) {
      console.error('清除失败:', error)
      alert('清除失败')
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary-400" />
          设置
        </h1>
        <p className="text-gray-400 mt-1">管理你的代码片段数据</p>
      </div>

      {/* 数据管理 */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">数据管理</h2>
            <p className="text-gray-400 text-sm">导入、导出或清理你的代码片段数据</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* 导出 */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">导出数据</h3>
                <p className="text-gray-400 text-sm">将所有代码片段导出为 JSON 文件</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-secondary"
            >
              {exporting ? '导出中...' : '导出'}
            </button>
          </div>

          {/* 导入 */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">导入数据</h3>
                <p className="text-gray-400 text-sm">从 JSON 文件导入代码片段</p>
              </div>
            </div>
            <label className="btn-secondary cursor-pointer">
              {importing ? '导入中...' : '导入'}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>

          {/* 清除数据 */}
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">清除所有数据</h3>
                <p className="text-gray-400 text-sm">删除所有代码片段，此操作不可恢复</p>
              </div>
            </div>
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="btn-danger"
            >
              {clearing ? '清除中...' : '清除'}
            </button>
          </div>
        </div>
      </div>

      {/* 关于 */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">关于 SnippetVault</h2>
            <p className="text-gray-400 text-sm">版本信息和说明</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-300">
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span>版本</span>
            <span className="text-white font-mono">v1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span>后端技术</span>
            <span className="text-white">Python + FastAPI + SQLite</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
            <span>前端技术</span>
            <span className="text-white">React + TypeScript + Tailwind CSS</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>开源协议</span>
            <span className="text-white">MIT License</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
          <div className="flex items-start gap-3">
            <FileJson className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p className="mb-2">数据文件存储在本地，路径：</p>
              <code className="bg-gray-700/50 px-2 py-1 rounded text-gray-300">
                backend/data/snippets.db
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* 警告提示 */}
      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <p className="font-medium text-yellow-400 mb-1">注意事项</p>
          <p>建议定期导出备份你的代码片段数据。虽然数据存储在本地，但意外的文件损坏或误操作可能导致数据丢失。</p>
        </div>
      </div>
    </div>
  )
}
