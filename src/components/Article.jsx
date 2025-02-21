import api from "../api";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Comments from "./Comments";
import classes from "./Article.module.css";
import { UserContext } from "./UserContext";
import * as images from "../assets/images";

export default function Article() {
    const { id } = useParams();
    const [articleLoading, setArticleLoading] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const [error, setError] = useState(false);
    const [article, setArticle] = useState("");
    const [votes, setVotes] = useState(null);

    useEffect(() => {
        api.get(`articles/${id}`)
            .then((response) => {
                setArticle(response.data);
                setVotes(response.data.votes);
                document.body.style.backgroundImage = `url(${response.data.article_img_url})`;
            })
            .catch((err) => {
                if (err.response) setError(err.response.data.msg);
                else setError("No connection to server");
            })
            .finally(() => setArticleLoading(false));

        return () => {
            document.body.style.backgroundImage = "";
        };
    }, []);

    function handleVote(vote) {
        setVotes((votes) => votes + vote);
        api.patch(`articles/${id}`, {
            inc_votes: vote,
        });
    }

    return (
        <>
            <Header />
            {articleLoading ? (
                <div className={classes.article}>
                    <h1>Article loading...</h1>
                </div>
            ) : error ? (
                <h1>{error}</h1>
            ) : (
                <div>
                    <div className={classes.article}>
                        <h1>{article.title}</h1>
                        <h2>By {article.author}</h2>
                        <div className={classes.votes}>
                            {user ? (
                                <>
                                    <button id="thumbsDown" onClick={() => handleVote(-1)} className={classes.voteButton}>
                                        <img src={images.thumbsDown} className={classes.voteImage}></img>
                                    </button>
                                    <div className={classes.voteCount}>
                                        <p>{votes}</p>
                                    </div>
                                    <button id="thumbsUp" onClick={() => handleVote(+1)} className={classes.voteButton}>
                                        <img src={images.thumbsUp} className={classes.voteImage}></img>
                                    </button>
                                </>
                            ) : (
                                <div className={classes.voteCount}>
                                    <p>{votes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={classes.article}>{article.body}</div>
                    <Comments id={id} />
                </div>
            )}
        </>
    );
}
