import api from "../api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState("");
    const [comments, setComments] = useState([]);

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

    return (
        <div>
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
            <h1>Votes</h1>
            <p>{article.votes}</p>
            <button onClick={() => handleVote(1)}>Upvote</button>
            <button onClick={() => handleVote(-1)}>Downvote</button>
        </div>
    );
}
