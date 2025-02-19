import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import api from "../api";
import Header from "./Header";
import classes from "./Login.module.css";
import { login } from "../assets/images";

export default function Login() {
    const [isLoading, setIsLoading] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("users")
            .then((response) => {
                setUsers(response.data.map((user) => user.username));
            })
            .finally(() => setIsLoading(false));
    }, []);

    function handleUsername(e) {
        e.preventDefault();
        document.getElementById("username").value = "";
        const validUser = users.filter((user) => user === username)[0];
        setUser(validUser);
    }

    return isLoading ? (
        <p>Page loading</p>
    ) : (
        <>
            <Header />
            <form onSubmit={(e) => handleUsername(e)} className={classes.login}>
                <label>Enter your username:</label>
                <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} className={classes.input} />
                <button type="submit" className={classes.submit}>
                    <img src={login} className={classes.submitImg}></img>
                </button>
            </form>
        </>
    );
}
