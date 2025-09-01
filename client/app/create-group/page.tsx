"use client";

import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function page() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        groupname: "",
        description: "",
        category: "",
        is_private: false,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = Cookies.get("access");
            console.log("Token:", Cookies.get("access"));

            if (!token) throw new Error("Not authenticated");

            await axios.post("http://127.0.0.1:8000/api/groups/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <div className="card w-full max-w-lg shadow-xl bg-base-100">
                <div className="card-body">
                    <h1 className="card-title text-2xl">Create a Group</h1>
                    {error && <p className="text-error">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="groupname" placeholder="Group name" value={formData.groupname} onChange={handleChange} required className="input input-bordered w-full" />

                        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" />

                        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="input input-bordered w-full" />

                        <label className="label cursor-pointer">
                            <span className="label-text">Private group?</span>
                            <input type="checkbox" name="is_private" checked={formData.is_private} onChange={handleChange} className="checkbox" />
                        </label>

                        <div className="card-actions justify-end">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? "Creating..." : "Create Group"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
