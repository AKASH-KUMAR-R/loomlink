import {BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import NavBar from './components/NavBar';
import ImageGallery from './components/ImageGallery';
import { LoginProvider } from './components/Context/LoginContext';

function App() {
  return (
    <div className=' w-screen '>
      <Router>
        <LoginProvider>
          <NavBar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/gallery' element={<ImageGallery />} />
          </Routes>
        </LoginProvider>
      </Router>
    </div>

  );
}

export default App;
