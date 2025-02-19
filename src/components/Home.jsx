import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { UserContext } from "./UserContext";
import Error from "./Error";
import PageLoading from "./PageLoading";
import Header from "./Header";
import classes from "./Home.module.css";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(true);
    const { topic } = useParams();
    const { user } = useContext(UserContext);
    const [articles, setArticles] = useState([]);
    const [topics, setTopics] = useState([]);
    const [sort, setSort] = useState("created_at");
    const [order, setOrder] = useState("DESC");

    useEffect(() => {
        api.get("/topics")
            .then((response) => {
                setTopics(response.data);
                if (!topic || response.data.filter((t) => t.slug === topic).length !== 0) {
                    setError(false);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        api.get(`/articles?sort_by=${sort}&order=${order}`).then((response) => {
            setArticles(response.data.filter((article) => (topic ? article.topic === topic : true)));
        });
    }, [topic, sort, order]);

    return isLoading ? (
        <PageLoading />
    ) : !error ? (
        <div>
            <Header />
            <div className={classes.topics}>
                <Link to={"/"} className={classes.topic}>
                    <h1>All</h1>
                </Link>
                {topics.map((topic, index) => {
                    return (
                        <Link to={`/${topic.slug}`} className={classes.topic} key={index}>
                            <h1>{topic.slug.charAt(0).toUpperCase() + topic.slug.slice(1)}</h1>
                        </Link>
                    );
                })}
            </div>
            <div className={classes.options}>
                <select id="sort" name="sort" value={sort} onChange={(e) => setSort(e.target.value)} className={classes.sort}>
                    <option value="created_at">Date</option>
                    <option value="comment_count">Comment Count</option>
                    <option value="votes">Votes</option>
                </select>
                <select id="order" name="order" value={order} onChange={(e) => setOrder(e.target.value)} className={classes.order}>
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                </select>
            </div>
            <div className={classes.articles}>
                {articles.map((article, index) => {
                    return (
                        <Link to={`/article/${article.article_id}`} className={classes.article} key={index}>
                            <p className={classes.articleTitle}>{article.title}</p>
                            <img src={article.article_img_url} className={classes.articleImage}></img>
                        </Link>
                    );
                })}
            </div>
        </div>
    ) : (
        <Error message={"Not a valid topic"} />
    );
}
