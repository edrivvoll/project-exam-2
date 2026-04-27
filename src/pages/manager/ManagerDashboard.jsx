import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getProfileVenues } from '../../api/profiles'
import { deleteVenue } from '../../api/venues'
import { useAuth } from '../../context/AuthContext'

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getProfileVenues(user.name)
      .then(res => setVenues(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.name])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteVenue(deleteId)
      setVenues(vs => vs.filter(v => v.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const totalBookings = venues.reduce((acc, v) => acc + (v.bookings?.length || 0), 0)

  if (loading) return <div className="loading-overlay"><Spinner animation="border" variant="success" /></div>

  return (
    <div className="page-wrapper">
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Manager Dashboard</h2>
            <p className="text-muted mb-0">Manage your venues and bookings</p>
          </div>
          <Button as={Link} to="/manager/venues/new" variant="primary" size="lg">
            + Add New Venue
          </Button>
        </div>

        {/* Stats */}
        <Row className="g-4 mb-5">
          <Col xs={6} md={3}>
            <div className="stat-card">
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{venues.length}</div>
              <div className="small opacity-75">My Venues</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="stat-card secondary">
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalBookings}</div>
              <div className="small opacity-75">Total Bookings</div>
            </div>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {venues.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>🏠</div>
            <h4>No venues yet</h4>
            <p className="mb-4">Start by creating your first venue listing.</p>
            <Button as={Link} to="/manager/venues/new" variant="primary">Create First Venue</Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {venues.map(venue => (
              <Col key={venue.id}>
                <Card className="venue-card h-100">
                  <div style={{ position: 'relative' }}>
                    <Card.Img
                      variant="top"
                      src={venue.media?.[0]?.url || FALLBACK}
                      alt={venue.name}
                      style={{ height: 180, objectFit: 'cover' }}
                      onError={e => { e.target.src = FALLBACK }}
                    />
                    <Badge bg="success" className="position-absolute top-0 end-0 m-2">
                      {venue.bookings?.length || 0} bookings
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <h6 className="fw-bold mb-1">{venue.name}</h6>
                    <p className="text-muted small mb-2">
                      {[venue.location?.city, venue.location?.country].filter(Boolean).join(', ') || 'No location'}
                    </p>
                    <div className="venue-price mb-3">${venue.price}/night</div>
                    <div className="mt-auto d-flex gap-2 flex-wrap">
                      <Button
                        as={Link}
                        to={`/manager/venues/${venue.id}/bookings`}
                        variant="outline-primary"
                        size="sm"
                        className="flex-fill"
                      >
                        Bookings
                      </Button>
                      <Button
                        as={Link}
                        to={`/manager/venues/${venue.id}/edit`}
                        variant="outline-secondary"
                        size="sm"
                        className="flex-fill"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setDeleteId(venue.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this venue? All associated bookings will be cancelled.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" /> : 'Delete Venue'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
