import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import VenueDetail from './pages/VenueDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import CreateVenue from './pages/manager/CreateVenue'
import EditVenue from './pages/manager/EditVenue'
import VenueBookings from './pages/manager/VenueBookings'

function ProtectedRoute({ children, requireManager = false }) {
  const { isLoggedIn, isManager } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (requireManager && !isManager) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute requireManager><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/venues/new" element={<ProtectedRoute requireManager><CreateVenue /></ProtectedRoute>} />
          <Route path="/manager/venues/:id/edit" element={<ProtectedRoute requireManager><EditVenue /></ProtectedRoute>} />
          <Route path="/manager/venues/:id/bookings" element={<ProtectedRoute requireManager><VenueBookings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
