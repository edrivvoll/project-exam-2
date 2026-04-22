import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <header>
        <h1>My Website</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2023 My Website</p>
      </footer>
    </div>
  );
}

export function Home() {
  return <h2>Home</h2>;
}

export function About() {
  return <h2>About</h2>;
}

export function Contact() {
  return <h2>Contact</h2>;
}