import { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../api/profiles'

export default function Profile() {
  const { user, updateUser } = useAuth()

  const [form, setForm] = useState({
    avatarUrl: user?.avatar?.url || '',
    avatarAlt: user?.avatar?.alt || '',
    bio: user?.bio || '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const body = {}
      if (form.bio !== undefined) body.bio = form.bio
      if (form.avatarUrl) body.avatar = { url: form.avatarUrl, alt: form.avatarAlt || user.name }

      const res = await updateProfile(user.name, body)
      updateUser({ avatar: res.data.avatar, bio: res.data.bio })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h2 className="fw-bold mb-4">My Profile</h2>

            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 d-flex align-items-center gap-4">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.avatar.alt || user.name} className="avatar-circle" />
                ) : (
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                    style={{ width: 80, height: 80, fontSize: '2rem', fontWeight: 700, color: 'var(--hz-primary)' }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h5 className="fw-bold mb-0">{user?.name}</h5>
                  <p className="text-muted mb-1">{user?.email}</p>
                  <span className={`badge ${user?.venueManager ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {user?.venueManager ? '🏠 Venue Manager' : '🏖️ Customer'}
                  </span>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Update Profile</h5>
                {success && <Alert variant="success">Profile updated successfully!</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Avatar URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="avatarUrl"
                      value={form.avatarUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Avatar Alt Text</Form.Label>
                    <Form.Control
                      name="avatarAlt"
                      value={form.avatarAlt}
                      onChange={handleChange}
                      placeholder="Description of your avatar"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Tell us about yourself"
                    />
                  </Form.Group>

                  {form.avatarUrl && (
                    <div className="mb-4 text-center">
                      <p className="text-muted small mb-2">Preview:</p>
                      <img
                        src={form.avatarUrl}
                        alt="Preview"
                        className="rounded-circle border"
                        style={{ width: 80, height: 80, objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}

                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Save Changes'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
