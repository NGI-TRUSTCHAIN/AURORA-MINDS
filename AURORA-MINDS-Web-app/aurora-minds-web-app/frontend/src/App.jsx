import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";  // Do not delete that line
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterLogout from "./components/RegisterLogout.jsx";
import ChildRecords from "./pages/ChildRecords.jsx";
import AdhdRecords from "./pages/AdhdRecords.jsx";
import LoginCookie from "./pages/LoginCookie.jsx";

// Setting also the protected and non-protected routes
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
                    <Route path="child-records" element={<ChildRecords/>}/>
                    <Route path="adhd-records" element={<AdhdRecords/>}/>
                    {/* Add other nested routes here */}
                </Route>
                {/*<Route path="/login" element={<Login/>}/>*/}
                <Route path="/login" element={<LoginCookie/>}/>
                <Route path="/logout" element={<RegisterLogout.Logout/>}/>
                {/*<Route path="/register" element={<RegisterLogout.RegisterAndLogout/>}/>*/}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
