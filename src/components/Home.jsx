import { useState, useEffect } from "react";
import api from "../api";

export default function Home() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        api.get("/articles").then((response) => {
            console.log(response.data);
            setArticles(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Articles</h1>
            {articles.map((article) => {
                return <p>{article.title}</p>;
            })}
        </div>
    );
}
