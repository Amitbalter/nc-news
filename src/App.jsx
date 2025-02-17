import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Article from "./components/Article";
import Login from "./components/Login";
import { UserProvider } from "./components/UserContext";
function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="article/:id" element={<Article />} />
                    <Route path="login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
