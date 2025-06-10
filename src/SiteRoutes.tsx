import { BrowserRouter, Routes, Route } from "react-router-dom";
import Leaderboard from "./components/Leaderboard";
import App from "./App.tsx";
import Adduser from './components/Adduser'
import Navbar from "./components/Navbar";
import TeamDetails from "./components/TeamDetails";
import AddProblems from "./components/Addproblems";
<<<<<<< HEAD
import UserDetails from "./components/UserDetails";
import GetAllProblems from "./components/GetAllProblems";
import UserProblemMap from "./components/UserProblemMap";
=======
// import UserDetails from "./components/UserDetails";
import QrScanner from './components/QrScanner'
>>>>>>> 6113b09301243d0e4c6c711ab8069353873bdd98

export default function SiteRoutes() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/adduser" element={<Adduser />} />
        <Route path="/teamdetails" element={<TeamDetails />} />
        <Route path="/userdetails" element={<QrScanner />} />
        <Route path="/addproblems" element={<AddProblems />} />
        <Route path="/problemList" element={<GetAllProblems />} />
        <Route path="/usersProblemSolved" element={<UserProblemMap />} />
      </Routes>
    </BrowserRouter>
  );
}