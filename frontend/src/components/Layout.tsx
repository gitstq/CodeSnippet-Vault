import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Code2,
  PlusCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Github
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: '首页' },
    { path: '/snippets', icon: Code2, label: '代码片段' },
    { path: '/snippets/new', icon: PlusCircle, label: '新建片段' },
    { path: '/stats', icon: BarChart3, label: '统计' },
    { path: '/settings', icon: Settings, label: '设置' },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-dark-900 border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">SnippetVault</h1>
                <p className="text-xs text-gray-500">智能代码管理</p>
              </div>
            </div>
          </div>

          {/* 导航 */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* 底部 */}
          <div className="p-4 border-t border-gray-800">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">开源项目</span>
            </a>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航栏 */}
        <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-gray-500">
              <Search className="w-4 h-4" />
              <span className="text-sm">按 Ctrl+K 快速搜索</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">v1.0.0</span>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
