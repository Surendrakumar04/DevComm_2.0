import React, { Fragment } from 'react'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './App.css';

const App = () => { 
  return ( 
    <Router>
      <Fragment>
        <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<section className="container">
              <Register />
            </section>}/>
            <Route path="/login" element={<section className="container">
              <Login />
            </section>} />
         </Routes> 
      </Fragment> 
    </Router>
  );
}

export default App;