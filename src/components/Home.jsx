import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { UserContext } from "./UserContext";

export default function Home() {
    const { topic } = useParams();
    const { user } = useContext(UserContext);
    const [articles, setArticles] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        api.get("/topics").then((response) => {
            setTopics(response.data);
        });
        api.get("/articles").then((response) => {
            setArticles(response.data.filter((article) => (topic ? article.topic === topic : true)));
        });
    }, [topic]);

    return (
        <div>
            <h1>Browse by Topic:</h1>
            {topics.map((topic, index) => {
                return (
                    <div key={index}>
                        <Link to={`/${topic.slug}`}>{topic.slug}</Link>
                    </div>
                );
            })}
            <p>User: {user}</p>
            <h1>Articles</h1>
            {articles.map((article, index) => {
                return (
                    <div key={index}>
                        <Link to={`/article/${article.article_id}`}>{article.title}</Link>;
                    </div>
                );
            })}
            <Link to={"login"}>Login</Link>
            {topic ? <Link to="/">Home</Link> : <></>}
        </div>
    );
}
