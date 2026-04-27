import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { createVenue } from '../../api/venues'
import VenueForm from '../../components/venues/VenueForm'

export default function CreateVenue() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await createVenue(data)
      navigate('/manager')
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
          <Col xs={12} lg={8}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <Button variant="link" className="text-muted ps-0" onClick={() => navigate('/manager')}>← Back</Button>
              <h2 className="fw-bold mb-0">Create New Venue</h2>
            </div>
            <VenueForm onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Create Venue" />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
