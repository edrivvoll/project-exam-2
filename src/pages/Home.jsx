import { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { getVenues, searchVenues } from '../api/venues'
import VenueCard from '../components/venues/VenueCard'

export default function Home() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isSearch, setIsSearch] = useState(false)

  const loadVenues = useCallback(async (p = 1) => {
    try {
      setLoading(true)
      const res = await getVenues(p)
      const items = res.data || []
      if (p === 1) {
        setVenues(items)
      } else {
        setVenues(prev => [...prev, ...items])
      }
      setHasMore(items.length === 12)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadVenues(1)
  }, [loadVenues])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setIsSearch(false)
      setPage(1)
      loadVenues(1)
      return
    }
    setSearching(true)
    setError(null)
    try {
      const res = await searchVenues(query.trim())
      setVenues(res.data || [])
      setIsSearch(true)
      setHasMore(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  const handleClearSearch = () => {
    setQuery('')
    setIsSearch(false)
    setPage(1)
    loadVenues(1)
  }

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    loadVenues(next)
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={7}>
              <p className="mb-2" style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                🌍 Over 1,200 venues worldwide
              </p>
              <h1>Find Your Perfect Stay</h1>
              <p className="lead mb-5">Discover unique venues and book unforgettable experiences around the world</p>
              <div className="search-bar d-flex gap-2 mb-4">
                <Form className="d-flex flex-grow-1 gap-2" onSubmit={handleSearch}>
                  <Form.Control
                    type="text"
                    placeholder="Search destinations, venues..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-grow-1"
                  />
                  <Button type="submit" variant="primary" disabled={searching}>
                    {searching ? <Spinner size="sm" /> : '🔍 Search'}
                  </Button>
                  {isSearch && (
                    <Button variant="outline-secondary" onClick={handleClearSearch} type="button">Clear</Button>
                  )}
                </Form>
              </div>
              <div className="d-flex justify-content-center gap-4 flex-wrap" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                {[['🏖️', 'Beach'], ['🏔️', 'Mountains'], ['🏙️', 'City'], ['🌿', 'Nature'], ['🛖', 'Cabins']].map(([icon, label]) => (
                  <span key={label} style={{ cursor: 'pointer' }} onClick={() => { setQuery(label); handleSearch({ preventDefault: () => {} }) }}>
                    {icon} {label}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Venues grid */}
      <section className="page-wrapper">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">
              {isSearch ? `Results for "${query}"` : 'Available Venues'}
            </h2>
            <span className="text-muted">{venues.length} venues</span>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading && venues.length === 0 ? (
            <div className="loading-overlay"><Spinner animation="border" variant="success" /></div>
          ) : venues.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '4rem' }}>🏠</div>
              <h4>No venues found</h4>
              <p>Try a different search term.</p>
            </div>
          ) : (
            <>
              <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
                {venues.map(venue => (
                  <Col key={venue.id}>
                    <VenueCard venue={venue} />
                  </Col>
                ))}
              </Row>
              {!isSearch && hasMore && (
                <div className="text-center mt-5">
                  <Button variant="outline-primary" size="lg" onClick={handleLoadMore} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  )
}
