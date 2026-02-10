import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Workshops from './pages/Workshops';
import Products from './pages/Products';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Detail from './pages/Detail';
import ApiDemo from './pages/ApiDemo';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Events from './pages/Events';
import ApiDetail from './pages/ApiDetail';
import ProductCheckout from './pages/ProductCheckout';

function App() {
  return (
    <Router>
      <a href="#main-content" className="sr-only focus-ring-eco rounded">
        Skip to main content
      </a>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" role="application" aria-label="Urban Harvest Hub">
        <Navbar />
        <main id="main-content" role="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/products" element={<Products />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/order-product" element={<ProductCheckout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/item/:id" element={<Detail />} />
            <Route path="/products/:id" element={<Detail />} />
            <Route path="/api-demo" element={<ApiDemo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/events" element={<Events />} />
            <Route path="/workshop/:id" element={<ApiDetail />} />
            <Route path="/event/:id" element={<ApiDetail />} />
            <Route path="/product/:id" element={<ApiDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;