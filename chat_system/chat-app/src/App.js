import Home from "./components/Home";
import Login from "./components/Login";
import Protected from "./components/Protected";
import Register from "./components/Register";
import Layout from "./components/Layout";
import RequireAuth from "./utils/RequireAuth";
import RequireNoAuth from "./utils/RequireNoAuth";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="" element={<Home />} />
        {/* public routes but no accessible for private */}
        <Route path="/" element={<RequireNoAuth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        {/* private routes */}
        <Route path="/" element={<RequireAuth />}>
          <Route path="protected" element={<Protected />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
