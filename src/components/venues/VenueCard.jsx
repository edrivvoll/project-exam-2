import { Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'

export default function VenueCard({ venue }) {
  const img = venue.media?.[0]?.url || FALLBACK
  const alt = venue.media?.[0]?.alt || venue.name

  return (
    <Card as={Link} to={`/venues/${venue.id}`} className="venue-card text-decoration-none text-dark">
      <Card.Img variant="top" src={img} alt={alt} onError={e => { e.target.src = FALLBACK }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold mb-1" style={{ fontSize: '1rem' }}>{venue.name}</Card.Title>
        <p className="text-muted small mb-2">
          {venue.location?.city || venue.location?.country
            ? `${venue.location.city || ''}${venue.location.city && venue.location.country ? ', ' : ''}${venue.location.country || ''}`
            : 'Location not specified'}
        </p>
        <div className="d-flex flex-wrap mb-2">
          {venue.meta?.wifi && <span className="venue-amenity">WiFi</span>}
          {venue.meta?.parking && <span className="venue-amenity">Parking</span>}
          {venue.meta?.breakfast && <span className="venue-amenity">Breakfast</span>}
          {venue.meta?.pets && <span className="venue-amenity">Pets</span>}
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="venue-price">${venue.price}<small className="text-muted fw-normal"> /night</small></span>
          {venue.rating > 0 && <span className="venue-rating">★ {venue.rating.toFixed(1)}</span>}
        </div>
        <div className="mt-1">
          <small className="text-muted">Up to {venue.maxGuests} guests</small>
        </div>
      </Card.Body>
    </Card>
  )
}
