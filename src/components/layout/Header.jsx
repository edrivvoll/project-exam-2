import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, isLoggedIn, isManager, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar expand="lg" className="navbar-holidaze" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🏖️ Holidaze
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Venues</Nav.Link>
            {isManager && (
              <Nav.Link as={NavLink} to="/manager">Dashboard</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-2">
                    {user?.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.avatar.alt || user.name} className="rounded-circle" width={28} height={28} style={{ objectFit: 'cover' }} />
                    ) : (
                      <span className="rounded-circle bg-white text-success d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, fontWeight: 700, fontSize: 13 }}>
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    )}
                    {user?.name}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                {!isManager && <NavDropdown.Item as={Link} to="/my-bookings">My Bookings</NavDropdown.Item>}
                {isManager && <NavDropdown.Item as={Link} to="/manager">Manager Dashboard</NavDropdown.Item>}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-light" size="sm">Log In</Button>
                <Button as={Link} to="/register" variant="light" size="sm" className="text-success fw-semibold">Register</Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
