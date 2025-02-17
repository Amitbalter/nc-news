import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { UserContext } from "./UserContext";

export default function Home() {
    const { user } = useContext(UserContext);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        api.get("/articles").then((response) => {
            setArticles(response.data);
        });
    }, []);

    return (
        <div>
            <p>User: {user}</p>
            <h1>Articles</h1>
            {articles.map((article, index) => {
                return (
                    <div key={index}>
                        <Link to={`article/${article.article_id}`}>{article.title}</Link>;
                    </div>
                );
            })}
            <Link to={"login"}>Login</Link>
        </div>
    );
}
