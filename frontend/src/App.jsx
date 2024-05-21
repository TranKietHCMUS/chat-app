import {Routes, Route, Navigate} from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from 'react-bootstrap';
import NavBar from './components/NavBar';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import FriendPage from './pages/FriendPage';

function App() {
  const {user} = useContext(AuthContext);
  return (
    <>
      <NavBar />
      <Container >
        <Routes>
          <Route path="/friend" element={user ? <FriendPage/> : <LoginPage/>} />
          <Route path="/register" element={ <RegisterPage />}/>
          <Route path="/login" element={ user ? <FriendPage /> : <LoginPage />} />
          <Route path="*"  element={<Navigate to="/friend" />}/>
        </Routes>
      </Container>
    </>
  )
}

export default App;
