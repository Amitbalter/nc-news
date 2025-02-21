import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import { UserContext } from "./UserContext";
import { useContext } from "react";

export default function Header() {
    const { user, setUser } = useContext(UserContext);
    return (
        <div className={classes.Header}>
            <Link to={"/"} className={classes.headerLink}>
                Home
            </Link>
            <Link to={"/login"} className={classes.headerLink}>
                {!user ? <p>Log In</p> : <p>Logged in as {user}</p>}
            </Link>
        </div>
    );
}
