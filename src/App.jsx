import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import Home from "./components/Home";
import Article from "./components/Article";
import Login from "./components/Login";
import Error from "./components/Error";
import "./variables.css";

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="article/:id" element={<Article />} />
                    <Route path="login" element={<Login />} />
                    <Route path="/:topic" element={<Home />} />
                    <Route path="*" element={<Error message="This page does not exist" />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
