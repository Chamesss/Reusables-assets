import './App.css';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/login';
import Welcome from './features/auth/Welcome';
import RequireAuth from './features/auth/requireAuth';

function App() {
  return (
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* public routes */}
          <Route index element={<Public />} />
          <Route path='login' element={<Login />} />
          {/* private routes */}
          <Route element={<RequireAuth />}>
            <Route path='welcome' element={<Welcome />} />
          </Route>
        </Route>
      </Routes>
  );
}

export default App;
