import { useState } from 'react'
import { Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    venueManager: false, avatarUrl: '', bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError(null)
    try {
      await register({ name: form.name, email: form.email, password: form.password, venueManager: form.venueManager, bio: form.bio, avatarUrl: form.avatarUrl })
      const loginRes = await login({ email: form.email, password: form.password })
      const { accessToken, ...user } = loginRes.data
      authLogin(user, accessToken)
      navigate(form.venueManager ? '/manager' : '/')
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
          flex: '0 0 40%',
          background: 'linear-gradient(160deg, #1a6b5c 0%, #0d4035 60%, #0a2e26 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80"
          alt="Luxury pool"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-white fw-bold mb-2" style={{ fontSize: '1.8rem' }}>Join thousands of travellers</h2>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Book unique stays or list your own venue — all in one place.
          </p>
          <div className="d-flex gap-3 mt-4 flex-wrap">
            {[['Free', 'to register'], ['Instant', 'confirmation'], ['Secure', 'payments']].map(([val, label]) => (
              <div key={label} className="d-flex align-items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f4a83a' }} />
                <span className="text-white small"><strong>{val}</strong> {label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4" style={{ background: '#f8f9fa', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div className="text-center mb-4">
            <span style={{ fontSize: '2.5rem' }}>🏖️</span>
            <h2 className="fw-bold mt-2 mb-1">Create an account</h2>
            <p className="text-muted">Join Holidaze with a <strong>stud.noroff.no</strong> email</p>
          </div>
          <div className="auth-card bg-white">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Role selector */}
            <div className="mb-4">
              <Form.Label className="fw-semibold d-block mb-2">I want to...</Form.Label>
              <div className="d-flex gap-3">
                {[
                  { value: false, icon: '🏖️', title: 'Book venues', sub: 'Customer' },
                  { value: true, icon: '🏠', title: 'Manage venues', sub: 'Venue Manager' },
                ].map(opt => (
                  <div
                    key={String(opt.value)}
                    onClick={() => setForm(f => ({ ...f, venueManager: opt.value }))}
                    className={`flex-fill text-center p-3 rounded-3 border ${form.venueManager === opt.value ? 'border-success bg-success bg-opacity-10' : 'border-light bg-light'}`}
                    style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    <div style={{ fontSize: '1.8rem' }}>{opt.icon}</div>
                    <div className="fw-semibold mt-1 small">{opt.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{opt.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Name</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="your_name" required pattern="^\w+$" title="Only letters, numbers and underscores" />
                    <Form.Text className="text-muted">No spaces or special characters</Form.Text>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@stud.noroff.no" required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" required minLength={8} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                    <Form.Control type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required minLength={8} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Avatar URL <span className="text-muted fw-normal">(optional)</span></Form.Label>
                <Form.Control type="url" name="avatarUrl" value={form.avatarUrl} onChange={handleChange} placeholder="https://example.com/avatar.jpg" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Bio <span className="text-muted fw-normal">(optional)</span></Form.Label>
                <Form.Control as="textarea" name="bio" value={form.bio} onChange={handleChange} rows={2} placeholder="Tell us a bit about yourself" />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100" size="lg" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Create Account'}
              </Button>
            </Form>
            <p className="text-center mt-4 mb-0 text-muted">
              Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
