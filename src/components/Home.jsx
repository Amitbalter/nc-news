import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import Header from "./Header";
import classes from "./Home.module.css";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "DESC";
    const topic = searchParams.get("topic") || "all";

    const [articles, setArticles] = useState([]);
    const [allArticles, setAllArticles] = useState([]);
    const [topics, setTopics] = useState([]);

    const [topicsLoading, setTopicsLoading] = useState(true);
    const [topicsError, setTopicsError] = useState(false);

    const [articlesLoading, setArticlesLoading] = useState(true);
    const [articlesError, setArticlesError] = useState(false);

    useEffect(() => {
        api.get("/topics")
            .then((response) => {
                setTopics(response.data);
            })
            .catch(() => {
                setTopicsError(true);
            })
            .finally(() => {
                setTopicsLoading(false);
            });

        api.get("/articles").then((response) => {
            const copyArticles = response.data.map((article) => {
                article.created_at = Date.parse(article.created_at);
                return article;
            });
            setAllArticles(copyArticles);
        });

        let url = `/articles?sort_by=${sort}&order=${order}`;
        if (topic !== "all") url += `&topic=${topic}`;
        api.get(url)
            .then((response) => {
                setArticles(response.data);
            })
            .catch(() => {
                setArticlesError(true);
            })
            .finally(() => {
                setArticlesLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchParams.size === 0) {
            setArticlesError(false);
        }
        const sign = order === "ASC" ? 1 : -1;
        setArticles(() => {
            const copyArticles = [...allArticles];
            copyArticles.sort((a1, a2) => sign * (a1[sort] - a2[sort]));
            return copyArticles.filter((article) => (topic === "all" ? true : article.topic === topic));
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
            {topicsLoading ? (
                <h1>Page loading...</h1>
            ) : (
                <>
                    <Header />
                    {topicsError ? (
                        <h1>No connection to server</h1>
                    ) : articlesLoading ? (
                        <h1>Articles Loading...</h1>
                    ) : articlesError ? (
                        <h1>Invalid topic or search option</h1>
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
