import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getProfileBookings } from '../api/profiles'
import { deleteBooking } from '../api/bookings'
import { useAuth } from '../context/AuthContext'

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function nightsBetween(from, to) {
  return Math.ceil((new Date(to) - new Date(from)) / 86400000)
}

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelId, setCancelId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    getProfileBookings(user.name)
      .then(res => setBookings(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.name])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await deleteBooking(cancelId)
      setBookings(bs => bs.filter(b => b.id !== cancelId))
      setCancelId(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCancelling(false)
    }
  }

  const now = new Date()
  const upcoming = bookings.filter(b => new Date(b.dateTo) >= now)
  const past = bookings.filter(b => new Date(b.dateTo) < now)

  if (loading) return <div className="loading-overlay"><Spinner animation="border" variant="success" /></div>

  return (
    <div className="page-wrapper">
      <Container>
        <h2 className="fw-bold mb-4">My Bookings</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>📅</div>
            <h4>No bookings yet</h4>
            <p className="mb-4">Start exploring venues and book your next getaway!</p>
            <Button as={Link} to="/" variant="primary">Browse Venues</Button>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <h5 className="fw-semibold text-muted mb-3">Upcoming ({upcoming.length})</h5>
                <Row xs={1} md={2} lg={3} className="g-4 mb-5">
                  {upcoming.map(b => <BookingItem key={b.id} booking={b} onCancel={setCancelId} />)}
                </Row>
              </>
            )}
            {past.length > 0 && (
              <>
                <h5 className="fw-semibold text-muted mb-3">Past ({past.length})</h5>
                <Row xs={1} md={2} lg={3} className="g-4">
                  {past.map(b => <BookingItem key={b.id} booking={b} isPast />)}
                </Row>
              </>
            )}
          </>
        )}
      </Container>

      <Modal show={!!cancelId} onHide={() => setCancelId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this booking? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setCancelId(null)}>Keep it</Button>
          <Button variant="danger" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? <Spinner size="sm" /> : 'Yes, Cancel'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

function BookingItem({ booking, onCancel, isPast = false }) {
  const venue = booking.venue
  const img = venue?.media?.[0]?.url || FALLBACK
  const nights = nightsBetween(booking.dateFrom, booking.dateTo)

  return (
    <Col>
      <Card className="booking-card h-100">
        <div style={{ position: 'relative' }}>
          <Card.Img
            variant="top"
            src={img}
            alt={venue?.name}
            style={{ height: 160, objectFit: 'cover' }}
            onError={e => { e.target.src = FALLBACK }}
          />
          <Badge
            bg={isPast ? 'secondary' : 'success'}
            className="booking-status position-absolute top-0 end-0 m-2"
          >
            {isPast ? 'Completed' : 'Upcoming'}
          </Badge>
        </div>
        <Card.Body>
          <h6 className="fw-bold mb-1">{venue?.name || 'Venue'}</h6>
          <p className="text-muted small mb-2">
            {[venue?.location?.city, venue?.location?.country].filter(Boolean).join(', ')}
          </p>
          <div className="d-flex gap-3 small mb-3">
            <div>
              <div className="text-muted">Check-in</div>
              <div className="fw-semibold">{formatDate(booking.dateFrom)}</div>
            </div>
            <div>
              <div className="text-muted">Check-out</div>
              <div className="fw-semibold">{formatDate(booking.dateTo)}</div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center small text-muted mb-3">
            <span>{nights} nights · {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
            {venue?.price && <span className="fw-bold text-success">${venue.price * nights}</span>}
          </div>
          {!isPast && (
            <div className="d-flex gap-2">
              <Button as={Link} to={`/venues/${venue?.id}`} variant="outline-primary" size="sm" className="flex-fill">View Venue</Button>
              <Button variant="outline-danger" size="sm" onClick={() => onCancel(booking.id)}>Cancel</Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  )
}
