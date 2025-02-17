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
        </div>
    );
}
