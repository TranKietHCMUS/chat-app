import {Routes, Route, Navigate} from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from 'react-bootstrap';
import NavBar from './components/NavBar';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const {user} = useContext(AuthContext);
  return (
    <>
      <NavBar />
      <Container >
        <Routes>
          <Route path="/" element={user ? <ChatPage/> : <LoginPage />} />
          <Route path="/register" element={user ? <ChatPage /> : <RegisterPage />}/>
          <Route path="/login" element={user ? <ChatPage /> : <LoginPage />} />
          <Route path="*"  element={<Navigate to="/" />}/>
        </Routes>
      </Container>
    </>
  )
}

export default App;