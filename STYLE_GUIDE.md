# Holidaze Style Guide

## Table of Contents

1. [Project Structure](#project-structure)
2. [Colors & Design Tokens](#colors--design-tokens)
3. [Typography](#typography)
4. [CSS & Styling](#css--styling)
5. [Component Patterns](#component-patterns)
6. [File & Naming Conventions](#file--naming-conventions)
7. [Import Ordering](#import-ordering)
8. [State Management](#state-management)
9. [API Layer](#api-layer)
10. [Forms](#forms)
11. [Loading & Error States](#loading--error-states)

---

## Project Structure

```
src/
├── api/              # API client layer — one file per resource
│   ├── client.js     # Base fetch wrapper with auth injection
│   ├── auth.js
│   ├── bookings.js
│   ├── venues.js
│   └── profiles.js
├── components/       # Reusable UI components
│   ├── layout/       # App shell (Header, Footer)
│   └── venues/       # Domain-specific components
├── context/          # React Context providers
│   └── AuthContext.jsx
├── pages/            # One file per route
│   └── manager/      # Manager-only pages
├── App.jsx           # Router and layout wrapper
├── main.jsx          # Entry point
└── index.css         # Global styles and CSS variables
```

---

## Colors & Design Tokens

All colors are defined as CSS custom properties in `:root` inside `index.css`. Never use raw hex values in components — always reference a CSS variable or Bootstrap utility.

```css
:root {
  --hz-primary:     #1a6b5c;  /* Teal — brand, buttons, inputs */
  --hz-primary-dark:#134f44;  /* Dark teal — hover, gradients  */
  --hz-secondary:   #f4a83a;  /* Orange/gold — ratings, accents */
  --hz-bg:          #f8f9fa;  /* Page background                */
  --hz-card-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
```

**Usage rules:**

| Purpose | Value |
|---|---|
| Primary CTA, active nav, focus rings | `var(--hz-primary)` |
| Hover / darker states | `var(--hz-primary-dark)` |
| Star ratings, stat highlights | `var(--hz-secondary)` |
| Page background | `var(--hz-bg)` / `#f8f9fa` |
| Muted / secondary text | Bootstrap `.text-muted` (#6c757d) |
| Alerts | Bootstrap variants (`danger`, `success`, `warning`, `info`) |

**Gradients** use the primary palette:

```css
background: linear-gradient(135deg, var(--hz-primary) 0%, var(--hz-primary-dark) 100%);
```

---

## Typography

**Font stack:**

```css
body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}
```

**Weight conventions — use Bootstrap utility classes:**

| Class | Weight | Usage |
|---|---|---|
| `fw-bold` | 700 | Headings, card titles |
| `fw-semibold` | 600 | Form labels, button text |
| `fw-normal` | 400 | Body copy |
| `style={{ fontWeight: 800 }}` | 800 | Large stat numbers only |

**Size conventions:**

- Hero `h1`: `clamp(2rem, 5vw, 3.5rem)` (set in CSS, not inline)
- Card titles: `style={{ fontSize: '1rem' }}`
- Secondary text: Bootstrap `.small` or `.text-muted`
- Section headings (`h2`): let Bootstrap default apply; add `fw-bold`

---

## CSS & Styling

The project uses **React-Bootstrap 5** components with **custom CSS overrides** in `index.css`. There are no CSS Modules, Sass, or CSS-in-JS libraries.

### Bootstrap utilities first

Reach for Bootstrap utility classes before writing custom CSS:

```jsx
// Good
<div className="d-flex justify-content-between align-items-center gap-3 mb-4">

// Avoid — don't write a class just to set display:flex
<div className="my-custom-flex-row">
```

### Custom CSS classes

Use **kebab-case** class names prefixed by feature context:

```
.navbar-holidaze
.hero-section
.venue-card
.venue-amenity
.venue-price
.venue-rating
.auth-card
.stat-card
.page-wrapper
.empty-state
.loading-overlay
```

All custom classes live in `index.css`. Do not create additional CSS files unless a component has enough unique styles to warrant one.

### Inline styles

Only use inline styles when the value is dynamic or cannot be expressed as a utility:

```jsx
// OK — dynamic value
<div style={{ backgroundImage: `url(${imgUrl})` }}>

// OK — one-off layout not worth a class
<div style={{ maxWidth: 420, width: '100%' }}>

// Avoid — static values that belong in CSS
<div style={{ display: 'flex', gap: '8px' }}>
```

### Page wrapper

Every page component should be wrapped in `.page-wrapper` for consistent vertical padding:

```jsx
return (
  <div className="page-wrapper">
    <Container>
      {/* content */}
    </Container>
  </div>
)
```

---

## Component Patterns

### Functional components only

All components are functional. No class components.

```jsx
export default function VenueCard({ venue }) {
  // ...
}
```

### Props

- **camelCase** for all prop names
- Event handler props prefixed with `on`: `onSubmit`, `onCancel`, `onDelete`
- Boolean props for flags: `loading`, `disabled`, `isPast`, `isManager`
- Provide default values inline for optional props:

```jsx
export default function VenueForm({ initialValues = {}, submitLabel = 'Save', onSubmit, loading, error }) {
```

### Fallback images

Define `FALLBACK` as a module-level constant, not inline:

```jsx
const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'

// In JSX:
<Card.Img src={venue.media?.[0]?.url || FALLBACK} onError={e => { e.target.src = FALLBACK }} />
```

### Conditional rendering

Use ternary for two branches, short-circuit (`&&`) for one:

```jsx
{loading ? <Spinner animation="border" /> : <div>{content}</div>}

{error && <Alert variant="danger">{error}</Alert>}
```

### Empty states

Every list view should have an empty state with a relevant emoji:

```jsx
{venues.length === 0 ? (
  <div className="empty-state">
    <div style={{ fontSize: '4rem' }}>🏠</div>
    <h4>No venues yet</h4>
    <p className="text-muted">Add your first venue to get started.</p>
  </div>
) : (
  <Row>{/* list */}</Row>
)}
```

### Responsive grids

Use Bootstrap responsive grid props rather than breakpoint classes inline:

```jsx
<Row xs={1} md={2} lg={3} className="g-4">
  {items.map(item => (
    <Col key={item.id}>
      <Card className="h-100">...</Card>
    </Col>
  ))}
</Row>
```

---

## File & Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase + `.jsx` | `VenueCard.jsx` |
| Pages | PascalCase + `.jsx` | `ManagerDashboard.jsx` |
| Contexts | PascalCase + `.jsx` | `AuthContext.jsx` |
| API modules | camelCase + `.js` | `venues.js`, `client.js` |
| CSS classes | kebab-case | `.venue-card`, `.auth-card` |
| Props & variables | camelCase | `initialValues`, `onSubmit` |
| Constants | UPPER_SNAKE_CASE | `FALLBACK`, `BASE_URL` |

---

## Import Ordering

Order imports in four groups, separated by a blank line:

```jsx
// 1. React and hooks
import { useState, useEffect, useCallback } from 'react'

// 2. Router
import { useParams, useNavigate, Link } from 'react-router-dom'

// 3. Third-party UI / libraries (CSS imports follow their component)
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// 4. Internal — API, context, components
import { getVenue } from '../api/venues'
import { useAuth } from '../context/AuthContext'
import VenueCard from '../components/venues/VenueCard'
```

---

## State Management

### Auth (global)

Auth state lives in `AuthContext`. Access it via the `useAuth()` hook:

```jsx
const { user, isLoggedIn, isManager, login, logout, updateUser } = useAuth()
```

Auth data is persisted to `localStorage` under the keys `hz_token` and `hz_user`. Never read these keys directly in components — go through the context.

### Local state

Components own their local state with `useState`. Standard pattern for a data-fetching page:

```jsx
const [data, setData]       = useState([])
const [loading, setLoading] = useState(true)
const [error, setError]     = useState(null)
```

### Immutable updates

Always produce new state — never mutate:

```jsx
// Add
setItems(prev => [...prev, newItem])

// Remove
setItems(prev => prev.filter(item => item.id !== id))

// Update one field
setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
```

### Modal state

Use a single state value that holds the relevant ID (or `null` for closed):

```jsx
const [deleteId, setDeleteId] = useState(null)

<Modal show={!!deleteId} onHide={() => setDeleteId(null)}>
```

---

## API Layer

### Base client

All requests go through `apiFetch` in `src/api/client.js`. It injects the auth token and API key automatically.

### Endpoint modules

One file per API resource. Functions are named for the operation:

```js
// venues.js
export function getVenues(page = 1, limit = 12) { ... }
export function getVenue(id) { ... }
export function createVenue(data) { ... }
export function updateVenue(id, data) { ... }
export function deleteVenue(id) { ... }
```

### Fetching in components

Use `.then().catch().finally()` inside `useEffect` for initial data loads:

```jsx
useEffect(() => {
  getVenue(id)
    .then(res => setVenue(res.data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
}, [id])
```

Use `async/await` with `try/catch/finally` for user-initiated actions:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)
  try {
    await updateVenue(id, form)
    navigate('/manager')
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

---

## Forms

### Controlled inputs

All form fields are fully controlled. Use a single `handleChange` for simple forms:

```jsx
const [form, setForm] = useState({ email: '', password: '' })

const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

<Form.Control name="email" value={form.email} onChange={handleChange} />
```

For complex/nested forms (e.g. `VenueForm`), use a `setField(path, value)` helper that handles dot-notation paths.

### Form structure

```jsx
<Form onSubmit={handleSubmit}>
  <Form.Group className="mb-3">
    <Form.Label className="fw-semibold">Field Label</Form.Label>
    <Form.Control
      type="text"
      name="fieldName"
      value={form.fieldName}
      onChange={handleChange}
      required
    />
    <Form.Text className="text-muted">Optional help text.</Form.Text>
  </Form.Group>

  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
    {loading ? <Spinner size="sm" /> : 'Submit'}
  </Button>
</Form>
```

---

## Loading & Error States

### Full-page loading

```jsx
if (loading) {
  return (
    <div className="loading-overlay">
      <Spinner animation="border" variant="success" />
    </div>
  )
}
```

### Inline loading (buttons)

Replace button text with a small spinner while the request is in flight:

```jsx
<Button type="submit" disabled={loading}>
  {loading ? <Spinner size="sm" /> : 'Save Changes'}
</Button>
```

### Errors

Display errors in a Bootstrap `Alert` above the relevant content:

```jsx
{error && <Alert variant="danger">{error}</Alert>}
```

Reset `error` to `null` at the start of each new request attempt.
