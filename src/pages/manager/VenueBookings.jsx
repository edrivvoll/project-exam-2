import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert, Badge, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { getVenue } from '../../api/venues'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function nightsBetween(from, to) {
  return Math.ceil((new Date(to) - new Date(from)) / 86400000)
}

function BookingCard({ booking, status }) {
  const c = booking.customer
  const nights = nightsBetween(booking.dateFrom, booking.dateTo)

  return (
    <div className="d-flex align-items-start gap-3 p-3 bg-white rounded-4 shadow-sm mb-3">
      {c?.avatar?.url ? (
        <img src={c.avatar.url} alt={c.name} className="rounded-circle flex-shrink-0" width={44} height={44} style={{ objectFit: 'cover' }} />
      ) : (
        <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 44, height: 44, fontWeight: 700, color: 'var(--hz-primary)' }}>
          {c?.name?.[0]?.toUpperCase() || '?'}
        </div>
      )}

      <div className="flex-grow-1 min-w-0">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-1 mb-2">
          <div>
            <div className="fw-semibold">{c?.name || 'Guest'}</div>
            <div className="text-muted small text-truncate">{c?.email}</div>
          </div>
          <Badge bg={status === 'upcoming' ? 'success' : 'secondary'}>
            {status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </Badge>
        </div>

        <div className="d-flex flex-wrap gap-3 small">
          <div>
            <div className="text-muted">Check-in</div>
            <div className="fw-semibold">{formatDate(booking.dateFrom)}</div>
          </div>
          <div>
            <div className="text-muted">Check-out</div>
            <div className="fw-semibold">{formatDate(booking.dateTo)}</div>
          </div>
          <div>
            <div className="text-muted">Duration</div>
            <div className="fw-semibold">{nights} night{nights !== 1 ? 's' : ''}</div>
          </div>
          <div>
            <div className="text-muted">Guests</div>
            <div className="fw-semibold">{booking.guests}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VenueBookings() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getVenue(id)
      .then(res => setVenue(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading-overlay"><Spinner animation="border" variant="success" /></div>
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>

  const now = new Date()
  const bookings = venue?.bookings || []
  const upcoming = bookings.filter(b => new Date(b.dateTo) >= now).sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
  const past = bookings.filter(b => new Date(b.dateTo) < now)

  return (
    <div className="page-wrapper">
      <Container>
        <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
          <Button variant="link" className="text-muted ps-0" onClick={() => navigate('/manager')}>← Dashboard</Button>
          <div>
            <h2 className="fw-bold mb-0">{venue?.name}</h2>
            <p className="text-muted mb-0 small">Booking overview</p>
          </div>
        </div>

        <Row className="g-4 mb-5">
          <Col xs={6} md={3}>
            <div className="stat-card">
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{bookings.length}</div>
              <div className="small opacity-75">Total Bookings</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="stat-card secondary">
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{upcoming.length}</div>
              <div className="small opacity-75">Upcoming</div>
            </div>
          </Col>
        </Row>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>📅</div>
            <h4>No bookings yet</h4>
            <p>This venue has no bookings yet.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-5">
                <h5 className="fw-semibold mb-3">Upcoming Bookings ({upcoming.length})</h5>
                {upcoming.map(b => <BookingCard key={b.id} booking={b} status="upcoming" />)}
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h5 className="fw-semibold mb-3">Past Bookings ({past.length})</h5>
                {past.map(b => <BookingCard key={b.id} booking={b} status="past" />)}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  )
}
