import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Button, Badge, Spinner, Alert, Form, Card, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getVenue } from '../api/venues'
import { createBooking } from '../api/bookings'
import { useAuth } from '../context/AuthContext'

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'

function getBookedDates(bookings = []) {
  const booked = []
  bookings.forEach(b => {
    const from = new Date(b.dateFrom)
    const to = new Date(b.dateTo)
    const cur = new Date(from)
    while (cur <= to) {
      booked.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }
  })
  return booked
}

export default function VenueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, isManager } = useAuth()

  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)
  const [guests, setGuests] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    getVenue(id)
      .then(res => setVenue(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading-overlay"><Spinner animation="border" variant="success" /></div>
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>
  if (!venue) return null

  const bookedDates = getBookedDates(venue.bookings)
  const nights = dateFrom && dateTo ? Math.ceil((dateTo - dateFrom) / 86400000) : 0
  const total = nights * venue.price

  const handleBook = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) { navigate('/login'); return }
    if (!dateFrom || !dateTo) { setBookingError('Please select check-in and check-out dates.'); return }
    setBookingLoading(true)
    setBookingError(null)
    try {
      await createBooking({ venueId: id, dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString(), guests })
      setShowSuccess(true)
      setDateFrom(null)
      setDateTo(null)
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setBookingLoading(false)
    }
  }

  const images = venue.media?.length ? venue.media : [{ url: FALLBACK, alt: venue.name }]

  return (
    <div className="page-wrapper">
      <Container>
        <Button variant="link" className="text-muted ps-0 mb-3" onClick={() => navigate(-1)}>← Back</Button>

        {/* Image gallery */}
        <Row className="mb-4">
          <Col>
            <img
              src={images[activeImg]?.url || FALLBACK}
              alt={images[activeImg]?.alt || venue.name}
              className="venue-detail-img"
              onError={e => { e.target.src = FALLBACK }}
            />
            {images.length > 1 && (
              <div className="d-flex gap-2 mt-2 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.alt}
                    onClick={() => setActiveImg(i)}
                    style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: i === activeImg ? '3px solid var(--hz-primary)' : '3px solid transparent' }}
                    onError={e => { e.target.src = FALLBACK }}
                  />
                ))}
              </div>
            )}
          </Col>
        </Row>

        <Row className="g-5">
          {/* Left: details */}
          <Col lg={7}>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <h1 className="fw-bold mb-1">{venue.name}</h1>
                <p className="text-muted mb-0">
                  {[venue.location?.address, venue.location?.city, venue.location?.country].filter(Boolean).join(', ') || 'Location not specified'}
                </p>
              </div>
              <div className="text-end">
                <div className="venue-price fs-4">${venue.price}<small className="text-muted fw-normal fs-6"> /night</small></div>
                <div className="venue-rating">★ {venue.rating?.toFixed(1) || '—'}</div>
              </div>
            </div>

            <div className="mb-3">
              <Badge bg="secondary" className="me-2">Up to {venue.maxGuests} guests</Badge>
              {venue.meta?.wifi && <Badge bg="success" className="me-1">WiFi</Badge>}
              {venue.meta?.parking && <Badge bg="success" className="me-1">Parking</Badge>}
              {venue.meta?.breakfast && <Badge bg="success" className="me-1">Breakfast</Badge>}
              {venue.meta?.pets && <Badge bg="success" className="me-1">Pets OK</Badge>}
            </div>

            {venue.description && (
              <div className="mb-4">
                <h5 className="fw-bold">About this venue</h5>
                <p className="text-muted" style={{ lineHeight: 1.7 }}>{venue.description}</p>
              </div>
            )}

            {/* Availability calendar */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Availability</h5>
              <div className="border rounded-3 p-3">
                <DatePicker
                  inline
                  selectsRange
                  startDate={dateFrom}
                  endDate={dateTo}
                  onChange={([start, end]) => { setDateFrom(start); setDateTo(end) }}
                  excludeDates={bookedDates}
                  highlightDates={bookedDates}
                  minDate={new Date()}
                  monthsShown={1}
                />
                <div className="d-flex gap-3 mt-2 small text-muted">
                  <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#fee2e2', marginRight: 4 }} />Booked</span>
                  <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#bbf7d0', marginRight: 4 }} />Selected</span>
                </div>
              </div>
            </div>

            {venue.owner && (
              <div>
                <h5 className="fw-bold">Hosted by</h5>
                <div className="d-flex align-items-center gap-3">
                  {venue.owner.avatar?.url && (
                    <img src={venue.owner.avatar.url} alt={venue.owner.name} className="rounded-circle" width={48} height={48} style={{ objectFit: 'cover' }} />
                  )}
                  <div>
                    <div className="fw-semibold">{venue.owner.name}</div>
                    <div className="text-muted small">{venue.owner.email}</div>
                  </div>
                </div>
              </div>
            )}
          </Col>

          {/* Right: booking form */}
          <Col lg={5}>
            <Card className="border-0 shadow" style={{ borderRadius: 16, position: 'sticky', top: 20 }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Book this venue</h5>

                {isManager ? (
                  <Alert variant="info">Venue managers cannot make bookings.</Alert>
                ) : !isLoggedIn ? (
                  <Alert variant="warning">
                    <Link to="/login">Log in</Link> or <Link to="/register">register</Link> to book.
                  </Alert>
                ) : (
                  <Form onSubmit={handleBook}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Check-in</Form.Label>
                      <DatePicker
                        selected={dateFrom}
                        onChange={date => { setDateFrom(date); if (dateTo && date >= dateTo) setDateTo(null) }}
                        excludeDates={bookedDates}
                        minDate={new Date()}
                        placeholderText="Select date"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Check-out</Form.Label>
                      <DatePicker
                        selected={dateTo}
                        onChange={date => setDateTo(date)}
                        excludeDates={bookedDates}
                        minDate={dateFrom ? new Date(dateFrom.getTime() + 86400000) : new Date()}
                        placeholderText="Select date"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Guests</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        max={venue.maxGuests}
                        value={guests}
                        onChange={e => setGuests(parseInt(e.target.value))}
                      />
                      <Form.Text className="text-muted">Max {venue.maxGuests} guests</Form.Text>
                    </Form.Group>

                    {nights > 0 && (
                      <div className="bg-light rounded-3 p-3 mb-4">
                        <div className="d-flex justify-content-between">
                          <span>${venue.price} × {nights} nights</span>
                          <span>${total}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total</span>
                          <span>${total}</span>
                        </div>
                      </div>
                    )}

                    {bookingError && <Alert variant="danger" className="py-2">{bookingError}</Alert>}

                    <Button type="submit" variant="primary" className="w-100" size="lg" disabled={bookingLoading}>
                      {bookingLoading ? <Spinner size="sm" /> : 'Reserve Now'}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center p-5">
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <h4 className="fw-bold mt-3">Booking Confirmed!</h4>
          <p className="text-muted">Your stay at <strong>{venue.name}</strong> has been booked.</p>
          <Button variant="primary" onClick={() => { setShowSuccess(false); navigate('/my-bookings') }}>View My Bookings</Button>
        </Modal.Body>
      </Modal>
    </div>
  )
}
