import { useState } from 'react'
import { Form, Button, Row, Col, Spinner, Alert, Card } from 'react-bootstrap'

const DEFAULT = {
  name: '',
  description: '',
  price: '',
  maxGuests: '',
  rating: '',
  media: [{ url: '', alt: '' }],
  meta: { wifi: false, parking: false, breakfast: false, pets: false },
  location: { address: '', city: '', zip: '', country: '', continent: '' },
}

export default function VenueForm({ initialValues = {}, onSubmit, loading, error, submitLabel = 'Save' }) {
  const [form, setForm] = useState({ ...DEFAULT, ...initialValues })

  const setField = (path, value) => {
    setForm(prev => {
      const next = { ...prev }
      const parts = path.split('.')
      if (parts.length === 1) {
        next[parts[0]] = value
      } else if (parts.length === 2) {
        next[parts[0]] = { ...next[parts[0]], [parts[1]]: value }
      }
      return next
    })
  }

  const setMedia = (index, field, value) => {
    setForm(prev => {
      const media = [...prev.media]
      media[index] = { ...media[index], [field]: value }
      return { ...prev, media }
    })
  }

  const addMedia = () => setForm(prev => ({ ...prev, media: [...prev.media, { url: '', alt: '' }] }))
  const removeMedia = (i) => setForm(prev => ({ ...prev, media: prev.media.filter((_, idx) => idx !== i) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      maxGuests: parseInt(form.maxGuests),
      rating: form.rating ? parseFloat(form.rating) : 0,
      media: form.media.filter(m => m.url.trim()),
      meta: form.meta,
      location: {
        address: form.location.address,
        city: form.location.city,
        zip: form.location.zip,
        country: form.location.country,
        continent: form.location.continent,
      },
    }
    onSubmit(payload)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-3">Basic Info</h6>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Venue Name *</Form.Label>
            <Form.Control value={form.name} onChange={e => setField('name', e.target.value)} required placeholder="e.g. Cozy Beach House" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control as="textarea" rows={4} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Describe the venue..." />
          </Form.Group>
          <Row>
            <Col sm={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Price per night ($) *</Form.Label>
                <Form.Control type="number" min={0} value={form.price} onChange={e => setField('price', e.target.value)} required placeholder="100" />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Max Guests *</Form.Label>
                <Form.Control type="number" min={1} value={form.maxGuests} onChange={e => setField('maxGuests', e.target.value)} required placeholder="4" />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Rating (0–5)</Form.Label>
                <Form.Control type="number" min={0} max={5} step={0.1} value={form.rating} onChange={e => setField('rating', e.target.value)} placeholder="4.5" />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-3">Images</h6>
          {form.media.map((m, i) => (
            <Row key={i} className="mb-2 align-items-center">
              <Col sm={6}>
                <Form.Control value={m.url} onChange={e => setMedia(i, 'url', e.target.value)} placeholder="Image URL" type="url" />
              </Col>
              <Col sm={5}>
                <Form.Control value={m.alt} onChange={e => setMedia(i, 'alt', e.target.value)} placeholder="Alt text" />
              </Col>
              <Col sm={1}>
                {form.media.length > 1 && (
                  <Button variant="outline-danger" size="sm" onClick={() => removeMedia(i)} type="button">✕</Button>
                )}
              </Col>
            </Row>
          ))}
          <Button variant="outline-secondary" size="sm" onClick={addMedia} type="button" className="mt-1">+ Add Image</Button>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-3">Amenities</h6>
          <div className="d-flex flex-wrap gap-4">
            {[['wifi', '📶 WiFi'], ['parking', '🚗 Parking'], ['breakfast', '🍳 Breakfast'], ['pets', '🐾 Pets']].map(([key, label]) => (
              <Form.Check
                key={key}
                type="switch"
                id={`meta-${key}`}
                label={label}
                checked={form.meta[key]}
                onChange={e => setField(`meta.${key}`, e.target.checked)}
              />
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-3">Location</h6>
          <Row>
            <Col sm={8}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control value={form.location.address} onChange={e => setField('location.address', e.target.value)} placeholder="123 Main St" />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3">
                <Form.Label>ZIP</Form.Label>
                <Form.Control value={form.location.zip} onChange={e => setField('location.zip', e.target.value)} placeholder="12345" />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control value={form.location.city} onChange={e => setField('location.city', e.target.value)} placeholder="Oslo" />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control value={form.location.country} onChange={e => setField('location.country', e.target.value)} placeholder="Norway" />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3">
                <Form.Label>Continent</Form.Label>
                <Form.Control value={form.location.continent} onChange={e => setField('location.continent', e.target.value)} placeholder="Europe" />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Button type="submit" variant="primary" size="lg" className="w-100" disabled={loading}>
        {loading ? <Spinner size="sm" /> : submitLabel}
      </Button>
    </Form>
  )
}
