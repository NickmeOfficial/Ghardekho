import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PropertyProvider } from './contexts/PropertyContext';
import { Home } from './pages/Home';
// import { PropertyDetails } from './pages/Properties';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Button } from "./components/ui/button";
import { LayoutDashboard, User } from 'lucide-react';
import Properties from './pages/Properties';
import {PropertyDashboard} from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <PropertyProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex items-center gap-2">
                  <span className="bg-yellow-400 px-2 py-1 text-black font-bold">GharDekho</span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                  <Link to="/" className="text-sm font-medium hover:text-yellow-400 transition-colors">Home</Link>
                  <Link to="/properties" className="text-sm font-medium hover:text-yellow-400 transition-colors">Properties</Link>
                  <Link to="/about" className="text-sm font-medium hover:text-yellow-400 transition-colors">About</Link>
                  <Link to="/contact" className="text-sm font-medium hover:text-yellow-400 transition-colors">Contact</Link>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  {/* <Button variant="ghost" asChild>
                    <Link to="/login">
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button> */}
                  {/* <Button asChild>
                    <Link to="/register">Register</Link>
                  </Button> */}
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/property/:id" element={<PropertyDetails />} /> */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/dashboard" element={<PropertyDashboard />} />
            {/* <Route path="/register" element={<Register />} /> */}
          </Routes>

          <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">About GharDekho</h3>
                  <p className="text-sm">
                    GharDekho is Goa's leading real estate platform helping people find their perfect property.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/properties" className="hover:text-yellow-400">Browse Properties</Link></li>
                    <li><Link to="/about" className="hover:text-yellow-400">About Us</Link></li>
                    <li><Link to="/contact" className="hover:text-yellow-400">Contact Us</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Popular Locations</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/property?city=Panjim" className="hover:text-yellow-400">Panjim</Link></li>
                    <li><Link to="/property?city=Valpoi" className="hover:text-yellow-400">Valpoi</Link></li>
                    <li><Link to="/property?city=Margao" className="hover:text-yellow-400">Margao</Link></li>
                    <li><Link to="/property?city=Mapusa" className="hover:text-yellow-400">Mapusa</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                  <ul className="space-y-2 text-sm">
                    <li>Email: contact@ghardekho.com</li>
                    <li>Phone: </li>
                    <li>Address: Pamjim, Goa</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                <p>&copy; {new Date().getFullYear()} GharDekho. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </PropertyProvider>
  );
};

export default App;

