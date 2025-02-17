import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { UserContext } from "./UserContext";

export default function Home() {
    const { topic } = useParams();
    const { user } = useContext(UserContext);
    const [articles, setArticles] = useState([]);
    const [topics, setTopics] = useState([]);
    const [sort, setSort] = useState("created_at");
    const [order, setOrder] = useState("DESC");

    useEffect(() => {
        api.get("/topics").then((response) => {
            setTopics(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/articles?sort_by=${sort}&order=${order}`).then((response) => {
            setArticles(response.data.filter((article) => (topic ? article.topic === topic : true)));
        });
    }, [topic, sort, order]);

    return (
        <div>
            <p>User: {user}</p>
            <h1>Browse by Topic:</h1>
            {topics.map((topic, index) => {
                return (
                    <div key={index}>
                        <Link to={`/${topic.slug}`}>{topic.slug}</Link>
                    </div>
                );
            })}
            <label htmlFor="sort">Sort By:</label>
            <select id="sort" name="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="created_at">Date</option>
                <option value="comment_count">Comment Count</option>
                <option value="votes">Votes</option>
            </select>
            <select id="order" name="order" value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
            </select>
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
