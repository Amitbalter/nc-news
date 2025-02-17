import api from "../api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState("");
    useEffect(() => {
        console.log(id);
        api.get(`articles/${id}`).then((response) => {
            console.log(response);
            setArticle(response.data);
        });
    }, []);

    return (
        <div>
            <p>{article.title}</p>
            <p>{article.author}</p>
            <p>{article.body}</p>
        </div>
    );
}
