import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import api from "../api";
import Header from "./Header";
import classes from "./Login.module.css";
import { login } from "../assets/images";

export default function Login() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [attempt, setAttempt] = useState(null);

    useEffect(() => {
        api.get("users")
            .then((response) => {
                setUsers(response.data.map((user) => user.username));
            })
            .catch(() => setError(true))
            .finally(() => setIsLoading(false));
    }, []);

    function handleUsername(e) {
        e.preventDefault();
        document.getElementById("username").value = "";
        const validUser = users.filter((user) => user === username)[0];
        setUser(validUser);
        setAttempt(true);
    }

    return (
        <>
            <Header />
            {isLoading ? (
                <h1>Page Loading...</h1>
            ) : error ? (
                <h1>No connection to server</h1>
            ) : (
                <div className={classes.login}>
                    <form onSubmit={(e) => handleUsername(e)} className={classes.form}>
                        <label>Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setAttempt(false);
                            }}
                            className={classes.input}
                        />
                        <button type="submit" className={classes.submit}>
                            <img src={login} className={classes.submitImg}></img>
                        </button>
                    </form>
                    {attempt ? (
                        user ? (
                            <p className={classes.message}>Welcome back {user}!</p>
                        ) : (
                            <p className={classes.message}>Invalid username, please try again</p>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </>
    );
}
