import api from "../api";
import { UserContext } from "./UserContext";
import { useEffect, useState, useContext } from "react";
import classes from "./Article.module.css";
import * as images from "../assets/images";

export default function Comments({ id }) {
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const { user } = useContext(UserContext);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        api.get(`articles/${id}/comments`).then((response) => {
            setComments(response.data);
            setCommentsLoading(false);
        });
    }, []);

    function handleComment(e) {
        e.preventDefault();
        if (newComment) {
            document.getElementById("commentButton").disabled = true;
            document.getElementById("input").value = "";
            api.post(`articles/${id}/comments`, {
                username: user,
                body: newComment,
            }).then((response) => {
                setComments((comments) => [response.data, ...comments]);
                setNewComment("");
                document.getElementById("commentButton").disabled = false;
            });
        }
    }

    function deleteComment(index) {
        api.delete(`/comments/${comments[index].comment_id}`);
        setComments((comments) => {
            const copy = [...comments];
            copy.splice(index, 1);
            return copy;
        });
    }
    return (
        <>
            {commentsLoading ? (
                <div className={classes.comments}>
                    <h1>Comments loading...</h1>
                </div>
            ) : (
                <ul className={classes.comments}>
                    <h1 style={{ textAlign: "center" }}>Comments</h1>
                    {user ? (
                        <form onSubmit={(e) => handleComment(e)} className={classes.inputComment}>
                            <label htmlFor="comment">{user}</label>
                            <input
                                id="input"
                                name="input"
                                onChange={(e) => {
                                    setNewComment(e.target.value);
                                }}
                                className={classes.input}
                            ></input>
                            <button id="commentButton" type="submit" className={classes.commentButton}>
                                <img src={images.send} className={classes.commentImage}></img>
                            </button>
                        </form>
                    ) : (
                        <></>
                    )}
                    {comments.map((comment, index) => {
                        return (
                            <li key={index} className={classes.comment}>
                                <p className={classes.commentAuthor}>{comment.author}</p>
                                <p className={classes.commentBody}>{comment.body}</p>
                                {user === comment.author ? (
                                    <button
                                        id="deleteCommentButton"
                                        onClick={() => {
                                            deleteComment(index);
                                        }}
                                        className={classes.commentButton}
                                    >
                                        <img src={images.delete} className={classes.commentImage}></img>
                                    </button>
                                ) : (
                                    <></>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
