import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from 'react-bootstrap';
import NavBar from './components/NavBar';
import ChatPage from './pages/ChatPage';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ChatContextProvider } from './context/ChatContext';

function App() {
  const {user} = useContext(AuthContext);
  
  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container >
        <Routes>
          <Route path="/chat" element={user ? <ChatPage/> : <LoginPage />}/>
          <Route path="/register" element={user ? <ChatPage/> : <RegisterPage />}/>
          <Route path="/login" element={user ? <ChatPage/> : <LoginPage />}/>
          <Route path="*" element={<Navigate to="/chat" />}/>
        </Routes>
      </Container>
    </ChatContextProvider>
  )
}

export default App;
