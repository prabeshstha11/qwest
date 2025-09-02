"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";

interface Post {
    id: number;
    title: string;
    description: string;
    author: string;
    group: string;
    created_at: string;
    updated_at: string;
}

export default function page() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = Cookies.get("access");
                const res = await axios.get(`http://localhost:8000/api/posts/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPost(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch post");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading post...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!post) return <div className="text-center mt-10">Post not found</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 card bg-base-100 shadow-lg">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
                By {post.author} in <span className="font-medium">{post.group}</span> • {new Date(post.created_at).toLocaleString()}
            </p>
            <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
            <button className="btn btn-outline mt-6" onClick={() => router.back()}>
                Back
            </button>
        </div>
    );
}
