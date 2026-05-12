import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SnippetsPage from './pages/SnippetsPage'
import CreateSnippetPage from './pages/CreateSnippetPage'
import EditSnippetPage from './pages/EditSnippetPage'
import SnippetDetailPage from './pages/SnippetDetailPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/snippets/new" element={<CreateSnippetPage />} />
        <Route path="/snippets/:id" element={<SnippetDetailPage />} />
        <Route path="/snippets/:id/edit" element={<EditSnippetPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
