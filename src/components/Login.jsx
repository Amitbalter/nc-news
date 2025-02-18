import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import api from "../api";

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
        const validUser = users.filter((user) => user === username)[0];
        setUser(validUser);
    }

    return isLoading ? (
        <p>Page loading</p>
    ) : (
        <>
            <p>User:{user}</p>
            <form onSubmit={(e) => handleUsername(e)}>
                <label>
                    Username:
                    <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                </label>
                <button type="submit">submit</button>
            </form>
            <Link to="/">Home</Link>
        </>
    );
}
