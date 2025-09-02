"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Group {
    id: number;
    groupname: string;
}

export default function page() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [group, setGroup] = useState<string>("");
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = Cookies.get("access");
                const res = await axios.get("http://localhost:8000/api/groups/all/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGroups(res.data);

                if (res.data.length > 0) {
                    setGroup(res.data[0].groupname);
                }
            } catch (err) {
                console.error("Failed to fetch groups", err);
                setError("Failed to load groups");
            }
        };
        fetchGroups();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = Cookies.get("access");
            console.log(token);

            await axios.post(`http://localhost:8000/api/groups/${group}/posts/`, { title, description }, { headers: { Authorization: `Bearer ${token}` } });

            setSuccess(true);
            setTitle("");
            setDescription("");

            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Something went wrong");

            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 card bg-base-100 shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Create Post</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full" required />

                <textarea placeholder="Post description..." value={description} onChange={(e) => setDescription(e.target.value)} className="textarea textarea-bordered w-full h-32" required />

                <select className="select select-bordered w-full" value={group} onChange={(e) => setGroup(e.target.value)} required>
                    {groups.map((g) => (
                        <option key={g.id} value={g.groupname}>
                            {g.groupname}
                        </option>
                    ))}
                </select>

                <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
                    {loading ? "Posting..." : "Create Post"}
                </button>
            </form>

            {success && (
                <div className="alert alert-success mt-4">
                    <span>Post created successfully ✅</span>
                </div>
            )}

            {error && (
                <div className="alert alert-error mt-4">
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
