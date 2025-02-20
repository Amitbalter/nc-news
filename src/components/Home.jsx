import { useState, useEffect, useContext } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../api";
import Header from "./Header";
import classes from "./Home.module.css";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "DESC";
    const topic = searchParams.get("topic") || "all";
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [articles, setArticles] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        api.get("/topics").then((response) => {
            setTopics(response.data);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        let url = `/articles?sort_by=${sort}&order=${order}`;
        if (topic !== "all") url += `&topic=${topic}`;
        api.get(url)
            .then((response) => {
                setArticles(response.data);
                setError(false);
            })
            .catch(() => {
                setError(true);
            });
    }, [topic, sort, order]);

    function changeSearchParams(param, value) {
        setSearchParams(
            (prev) => {
                prev.set(param, value);
                return prev;
            },
            { replace: true }
        );
    }

    return (
        <>
            {isLoading ? (
                <h1>Page loading...</h1>
            ) : (
                <>
                    <Header />
                    {error ? (
                        <h1>{"There are no such topics or search options"} </h1>
                    ) : (
                        <>
                            <div className={classes.topics}>
                                <button onClick={(e) => changeSearchParams("topic", "all")} className={classes.topic}>
                                    <h1>All</h1>
                                </button>
                                {topics.map((topic, index) => {
                                    return (
                                        <button className={classes.topic} key={index} onClick={(e) => changeSearchParams("topic", topic.slug)}>
                                            <h1>{topic.slug.charAt(0).toUpperCase() + topic.slug.slice(1)}</h1>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className={classes.options}>
                                <select
                                    id="sort"
                                    name="sort"
                                    value={sort}
                                    onChange={(e) => changeSearchParams("sort", e.target.value)}
                                    className={classes.dropdown}
                                >
                                    <option value="created_at">Date</option>
                                    <option value="comment_count">Comment Count</option>
                                    <option value="votes">Votes</option>
                                </select>
                                <select
                                    id="order"
                                    name="order"
                                    value={order}
                                    onChange={(e) => changeSearchParams("order", e.target.value)}
                                    className={classes.dropdown}
                                >
                                    <option value="ASC">Ascending</option>
                                    <option value="DESC">Descending</option>
                                </select>
                            </div>
                            <ul className={classes.articles}>
                                {articles.map((article, index) => {
                                    return (
                                        <li key={index} className={classes.article}>
                                            <Link to={`/article/${article.article_id}`}>
                                                <img src={article.article_img_url} className={classes.articleImage}></img>
                                                <div className={classes.articleTitle}>
                                                    <h2>{article.title}</h2>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}
                </>
            )}
        </>
    );
}
