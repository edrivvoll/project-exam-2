import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Layout, Home, About, Contact } from './components';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
