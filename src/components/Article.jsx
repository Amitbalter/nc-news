import api from "../api";
import { UserContext } from "./UserContext";
import { useEffect, useState, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Error from "./Error";
import Header from "./Header";
import PageLoading from "./PageLoading";
import classes from "./Article.module.css";
import * as images from "../assets/images";

export default function Article() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(true);
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [article, setArticle] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        api.get(`articles/${id}`)
            .then((response) => {
                setArticle(response.data);
                setError(false);
                document.body.style.backgroundImage = `url(${response.data.article_img_url})`;
            })
            .finally(() => setIsLoading(false));

        api.get(`articles/${id}/comments`).then((response) => {
            setComments(response.data);
        });
        return () => {
            document.body.style.backgroundImage = "";
        };
    }, []);

    function handleVote(vote) {
        api.patch(`articles/${id}`, {
            inc_votes: vote,
        })
            .then((response) => setArticle(response.data))
            .catch((err) => window.alert(err));
    }

    function handleComment(e) {
        e.preventDefault();
        document.getElementById("commentButton").disabled = true;
        document.getElementById("commentArea").value = "";

        api.post(`articles/${id}/comments`, {
            username: user,
            body: newComment,
        })
            .then((response) => {
                setComments((comments) => [response.data, ...comments]);
                document.getElementById("commentButton").disabled = false;
            })
            .catch(() => window.alert("Log in before making comment"));
    }

    function deleteComment(index) {
        api.delete(`/comments/${comments[index].comment_id}`);
        setComments((comments) => {
            const copy = [...comments];
            copy.splice(index, 1);
            return copy;
        });
    }

    return isLoading ? (
        <PageLoading />
    ) : !error ? (
        <div>
            <Header />
            <div className={classes.article}>
                <h1 style={{ textAlign: "center" }}>{article.title}</h1>
                <h2 style={{ textAlign: "center" }}>By {article.author}</h2>
                <div className={classes.votes}>
                    <button onClick={() => handleVote(-1)} className={classes.vote}>
                        <img src={images.thumbsDown} className={classes.buttonPic}></img>
                    </button>
                    <div className={classes.voteCount}>
                        <p>{article.votes}</p>
                    </div>
                    <button onClick={() => handleVote(1)} className={classes.vote}>
                        <img src={images.thumbsUp} className={classes.buttonPic}></img>
                    </button>
                </div>
            </div>
            <div className={classes.article}>{article.body}</div>
            <div className={classes.comments}>
                <h1 style={{ textAlign: "center" }}>Comments</h1>
                {comments.map((comment, index) => {
                    return (
                        <div key={index} className={classes.comment}>
                            <p>{comment.author}</p>
                            <p className={classes.body}>{comment.body}</p>
                            {user === comment.author ? (
                                <button
                                    id="deleteCommentButton"
                                    onClick={() => {
                                        deleteComment(index);
                                    }}
                                    className={classes.deleteButton}
                                >
                                    <img src={images.delete} className={classes.deleteImage}></img>
                                </button>
                            ) : (
                                <></>
                            )}
                            <br></br>
                        </div>
                    );
                })}
                {user ? (
                    <form onSubmit={(e) => handleComment(e)} className={classes.comment}>
                        <label htmlFor="comment">{user}:</label>
                        <textarea
                            id="commentArea"
                            name="comment"
                            rows="4"
                            cols="50"
                            onChange={(e) => {
                                setNewComment(e.target.value);
                            }}
                            className={classes.input}
                        ></textarea>
                        <button id="commentButton" type="submit" className={classes.deleteButton}>
                            <img src={images.send} className={classes.deleteImage}></img>
                        </button>
                    </form>
                ) : (
                    <></>
                )}
            </div>
        </div>
    ) : (
        <Error message="Article does not exist" />
    );
}
