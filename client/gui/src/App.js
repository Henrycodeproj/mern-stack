import './App.css';
import  { Signup } from './components/homepage/Signup';
import { Display } from './components/display';
import { Navbar } from './components/navigation/navbar'
import { Errorpage } from './components/config/ErrorPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserAuthentication } from "./components/config/userAuth"
import { ExpiredVerification } from "./components/config/ExpiredVerified"
import { Confirmation } from "./components/config/ConfirmationPage"
import { Authentication } from "./components/Contexts/authentication"

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path="/" element ={<Signup/>}/>
          <Route element = {<UserAuthentication/>}>
            <Route path="/display" element = {<Display/>}/>
          </Route>
      <Route path = "/invalid/expired/" element = {<ExpiredVerification/>}/>
      <Route path = "/valid" element = {<Confirmation/>}/>
      <Route path = "*" element ={<Errorpage/> }/>
      </Routes>
    </Router>
  );
}

export default App;
