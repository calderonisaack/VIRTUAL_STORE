import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProductDetail from './pages/ProductDetail/ProductDetail';

function Layout({ children }) {
  const location = useLocation();
  const showHeader = location.pathname !== '/admin';

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;