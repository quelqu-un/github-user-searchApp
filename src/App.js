import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchUsers from '../src/pages/SearchUsers.jsx';
import UserDetails from '../src/pages/UserDetails.jsx';
 
function App() {
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SearchUsers />} />
      <Route path="/user/:username" element={<UserDetails />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
)
}

export default App;
