import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from './Component/Navbar';
import Content from './Component/content';
import Form from './Component/form';




function App() {
 
  return (
    <Router>
    <Routes>
      <Route exact path='/' element={<Form/>}/>
      <Route path='/nav' element={<Dropdown/>}/>
      <Route path='/con' element={<Content/>}/>
      </Routes>
    </Router>


  
  );
}


export default App;

