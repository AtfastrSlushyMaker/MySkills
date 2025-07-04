import { Routes, Route } from 'react-router-dom'

// Import page components
import HomePage from './pages/HomePage'
import SimpleLoginPage2 from './pages/SimpleLoginPage2'
import DashboardPage from './pages/DashboardPage'
import CoursesPage from './pages/CoursesPage'

// Import navigation component
import Navigation from './components/Navigation'

function App() {
  return (
    <div>
      {/* Navigation will be visible on all pages */}
      <Navigation />

      {/* Main content area with proper spacing */}
      <main>
        {/* Routes define which component to show for each URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SimpleLoginPage2 />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          {/* 404 page for unknown routes */}
          <Route path="*" element={
            <div>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
