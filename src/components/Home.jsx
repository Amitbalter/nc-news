import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        api.get("/articles").then((response) => {
            setArticles(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Articles</h1>
            {articles.map((article, index) => {
                return (
                    <div key={index}>
                        <Link to={`article/${article.article_id}`}>{article.title}</Link>;
                    </div>
                );
            })}
        </div>
    );
}
