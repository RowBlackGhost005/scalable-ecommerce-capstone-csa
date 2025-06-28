import React from 'react';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import './styles.css';

import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ProductDetails from './pages/ProductDetails';
import Header from './components/Header'


function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/register" element={<ProductForm />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
