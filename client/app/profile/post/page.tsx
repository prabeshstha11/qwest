"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Post {
    id: number;
    title: string;
    description: string;
    group: string;
    created_at: string;
}

export default function page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const token = Cookies.get("access");
                const res = await axios.get("http://localhost:8000/api/posts/my/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPosts(res.data);
            } catch (err: any) {
                console.error("Failed to fetch posts", err);
                setError(err.response?.data?.detail || "Failed to load posts");
            } finally {
                setLoading(false);
            }
        };
        fetchMyPosts();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading your posts...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (posts.length === 0) return <p className="text-center mt-10">You have no posts yet.</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">My Posts</h1>
            {posts.map((post) => (
                <div key={post.id} className="card bg-base-100 shadow p-4">
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                    <p className="text-gray-600">{post.description}</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Group: {post.group} | Created at: {new Date(post.created_at).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
