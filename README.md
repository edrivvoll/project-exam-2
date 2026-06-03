# Holidaze

![Holidaze](https://github.com/user-attachments/assets/0f5e837e-adf6-4aed-8182-4e308e98399f)

A modern accommodation booking frontend where customers can browse and book holiday venues, and venue managers can list and manage their own properties.

## Description

Holidaze is a full-featured holiday venue booking application built as a Project Exam 2 at Noroff. It consumes the Noroff Holidaze API v2 and supports two user roles:

- **Customers** can browse venues, search by name or destination, view availability calendars, make and cancel bookings, and update their profile.
- **Venue Managers** can create, edit, and delete venue listings, and view all bookings made on their venues.

Key features include:

- Browse all venues with pagination and search
- Booking calendar with blocked-out unavailable dates
- Fully responsive design for mobile, tablet, and desktop
- Role-based access controlled by the Noroff API

## Built With

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Bootstrap 5](https://getbootstrap.com/)
- [React Router v6](https://reactrouter.com/)
- [react-datepicker](https://reactdatepicker.com/)

## Getting Started

### Installing

1. Clone the repo:

```bash
git clone https://github.com/edrivvoll/project-exam-2.git
```

2. Navigate into the project folder:

```bash
cd project-exam-2
```

3. Install the dependencies:

```bash
npm install
```

### Running

To run the app in development mode:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Contributing

Contributions are welcome. Please open a pull request with a clear description of the changes you'd like to make. Make sure your code follows the existing style and that all features are tested manually before submitting.

## Contact

[espendr@outlook.com](mailto:espendr@outlook.com)

## License

This project was created as a school assignment at Noroff and is not licensed for commercial use.

## Acknowledgments

- [Noroff API Documentation](https://docs.noroff.dev)
- [Noroff API Swagger](https://v2.api.noroff.dev/docs/static/index.html)
