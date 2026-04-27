import { useState } from 'react'
import { Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await login(form)
      const { accessToken, ...user } = res.data
      authLogin(user, accessToken)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex' }}>
      {/* Left panel - image */}
      <div
        className="d-none d-lg-flex flex-column justify-content-end p-5"
        style={{
          flex: '0 0 45%',
          background: 'linear-gradient(160deg, #1a6b5c 0%, #0d4035 60%, #0a2e26 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80"
          alt="Beautiful resort"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-white fw-bold mb-2" style={{ fontSize: '2rem' }}>Your next adventure awaits</h2>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem' }}>
            Thousands of unique venues ready to be discovered and booked.
          </p>
          <div className="d-flex gap-4 mt-4">
            {[['1200+', 'Venues'], ['50k+', 'Bookings'], ['4.8★', 'Avg. rating']].map(([val, label]) => (
              <div key={label}>
                <div className="fw-bold text-white" style={{ fontSize: '1.4rem' }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4" style={{ background: '#f8f9fa' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="text-center mb-4">
            <span style={{ fontSize: '2.5rem' }}>🏖️</span>
            <h2 className="fw-bold mt-2 mb-1">Welcome back</h2>
            <p className="text-muted">Log in to your Holidaze account</p>
          </div>
          <div className="auth-card bg-white">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@stud.noroff.no"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100" size="lg" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Log In'}
              </Button>
            </Form>
            <p className="text-center mt-4 mb-0 text-muted">
              Don't have an account? <Link to="/register" className="text-decoration-none fw-semibold">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
