import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getVenue, updateVenue } from '../../api/venues'
import VenueForm from '../../components/venues/VenueForm'

export default function EditVenue() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getVenue(id)
      .then(res => setVenue(res.data))
      .catch(err => setFetchError(err.message))
      .finally(() => setFetchLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await updateVenue(id, data)
      navigate('/manager')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <div className="loading-overlay"><Spinner animation="border" variant="success" /></div>
  if (fetchError) return <Container className="py-5"><Alert variant="danger">{fetchError}</Alert></Container>

  const initial = {
    name: venue.name || '',
    description: venue.description || '',
    price: venue.price || '',
    maxGuests: venue.maxGuests || '',
    rating: venue.rating || '',
    media: venue.media?.length ? venue.media : [{ url: '', alt: '' }],
    meta: { wifi: false, parking: false, breakfast: false, pets: false, ...venue.meta },
    location: { address: '', city: '', zip: '', country: '', continent: '', ...venue.location },
  }

  return (
    <div className="page-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <Button variant="link" className="text-muted ps-0" onClick={() => navigate('/manager')}>← Back</Button>
              <h2 className="fw-bold mb-0">Edit Venue</h2>
            </div>
            <VenueForm initialValues={initial} onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Save Changes" />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
