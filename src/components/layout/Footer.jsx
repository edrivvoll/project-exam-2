import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="mb-3 mb-md-0">
            <span className="fw-bold text-white fs-5">🏖️ Holidaze</span>
            <p className="small mt-1 mb-0">Find and book your perfect getaway.</p>
          </Col>
          <Col md={4} className="text-md-center mb-3 mb-md-0">
            <div className="d-flex gap-3 justify-content-md-center">
              <Link to="/">Venues</Link>
              <Link to="/register">Register</Link>
              <Link to="/login">Log In</Link>
            </div>
          </Col>
          <Col md={4} className="text-md-end">
            <p className="small mb-0">&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
