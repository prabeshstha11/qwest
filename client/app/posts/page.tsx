"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
    id: number;
    title: string;
    description: string;
    author: string;
    group: string;
    created_at: string;
}

export default function page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = Cookies.get("access");
                const res = await axios.get("http://localhost:8000/api/posts/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPosts(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch posts");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading posts...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-4">
            <Link href={"/profile/post"}>
                <button className="btn btn-primary">View My Post</button>
            </Link>
            {posts.map((post) => (
                <div key={post.id} className="card bg-base-100 shadow p-4 cursor-pointer" onClick={() => router.push(`/posts/${post.id}`)}>
                    <h2 className="text-xl font-bold">{post.title}</h2>
                    <p className="text-sm">
                        By {post.author} in <span className="font-medium">{post.group}</span> • {new Date(post.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2 line-clamp-2 text-gray-700">{post.description}</p>
                </div>
            ))}
        </div>
    );
}
