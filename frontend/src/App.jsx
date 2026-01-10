import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Signin from './components/Signin';
import Signup from './components/Signup';
import PrivateRoute from './PrivateRoute';
import Home from './components/Home';
import Updates from './components/Updates';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Community from './components/Community';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

const client_id=import.meta.env.VITE_GOOGLE_CLIENT_ID

function App() {
  return (
    <GoogleOAuthProvider clientId={client_id}>
    <div className="App">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/updates' element={<Updates />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/community' element={<Community/>}/>
        </Route>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/*" element={<h1>Page Not Found</h1>} />
      </Routes>
      <ToastContainer />
    </div>
    </GoogleOAuthProvider>
  );
}
export default App;