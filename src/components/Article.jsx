import api from "../api";
import { UserContext } from "./UserContext";
import { useEffect, useState, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Error from "./Error";

export default function Article() {
    const [error, setError] = useState(true);
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [article, setArticle] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        api.get(`articles/${id}`).then((response) => {
            setArticle(response.data);
            setError(false);
        });

        api.get(`articles/${id}/comments`).then((response) => {
            setComments(response.data);
        });
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

    return !error ? (
        <div>
            <p>User: {user}</p>
            <h1>{article.title}</h1>
            <p>{article.author}</p>
            <p>{article.body}</p>
            <h1>Comments</h1>
            {comments.map((comment, index) => {
                return (
                    <div key={index}>
                        <p>{comment.author}</p>
                        <p>{comment.body}</p>
                        {user === comment.author ? (
                            <button
                                id="deleteCommentButton"
                                onClick={() => {
                                    deleteComment(index);
                                }}
                            >
                                delete comment
                            </button>
                        ) : (
                            <></>
                        )}
                        <br></br>
                    </div>
                );
            })}
            <form onSubmit={(e) => handleComment(e)}>
                <label htmlFor="comment">Comment:</label>
                <textarea
                    id="commentArea"
                    name="comment"
                    rows="1"
                    cols="50"
                    onChange={(e) => {
                        setNewComment(e.target.value);
                    }}
                ></textarea>
                <button id="commentButton" type="submit">
                    Post
                </button>
            </form>
            <h1>Votes</h1>
            <p>{article.votes}</p>
            <button onClick={() => handleVote(1)}>Upvote</button>
            <button onClick={() => handleVote(-1)}>Downvote</button>
            <Link to="/">Home</Link>
            <Link to={"/login"}>Login</Link>
        </div>
    ) : (
        <Error message="Article does not exist" />
    );
}
