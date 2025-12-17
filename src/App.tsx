import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './adapters/primary/contexts/AuthContext'
import { useAnonymousSession } from './adapters/primary/hooks/useAnonymousSession'
import HomePage from './adapters/primary/pages/HomePage'
import FileInfoPage from './adapters/primary/pages/FileInfoPage'
import DashboardPage from './adapters/primary/pages/DashboardPage'
import AuthPage from './adapters/primary/pages/AuthPage'
import AuthCallbackPage from './adapters/primary/pages/AuthCallbackPage'
import AdminPage from './adapters/primary/pages/AdminPage'
import ProtectedRoute from './adapters/primary/components/ProtectedRoute'

function AppContent() {
  // Initialize VAULT-KRATE-ANON-KEY cookie on app load
  useAnonymousSession()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/file/:fileId" element={<FileInfoPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
