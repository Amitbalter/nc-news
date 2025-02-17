import api from "../api";
import { UserContext } from "./UserContext";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Article() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [article, setArticle] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        api.get(`articles/${id}`).then((response) => {
            setArticle(response.data);
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
        api.post(`articles/${id}/comments`, {
            username: user,
            body: newComment,
        })
            .then((response) => {
                setComments((comments) => [response.data, ...comments]);
            })
            .catch(() => window.alert("Log in before making comment"));
    }

    return (
        <div>
            <p>User: {user}</p>
            <h1>{article.title}</h1>
            <p>{article.author}</p>
            <p>{article.body}</p>
            <h1>Comments</h1>
            {comments.map((comment, index) => {
                return (
                    <div key={index}>
                        <p>{comment.body}</p>
                    </div>
                );
            })}
            <form onSubmit={(e) => handleComment(e)}>
                <label htmlFor="comment">Comment:</label>
                <textarea
                    id="comment"
                    name="comment"
                    rows="1"
                    cols="50"
                    onChange={(e) => {
                        setNewComment(e.target.value);
                    }}
                ></textarea>
                <button type="submit">Post</button>
            </form>
            <h1>Votes</h1>
            <p>{article.votes}</p>
            <button onClick={() => handleVote(1)}>Upvote</button>
            <button onClick={() => handleVote(-1)}>Downvote</button>
            <Link to="/">Home</Link>
            <Link to={"/login"}>Login</Link>
        </div>
    );
}
