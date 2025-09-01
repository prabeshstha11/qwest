"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function page() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        bio: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const token = Cookies.get("access");
        if (token) {
            router.push("/");
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await axios.post("http://127.0.0.1:8000/api/register/", formData);
            router.push("/login");
        } catch (err: any) {
            if (err.response?.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="card w-full max-w-md shadow-md p-8 space-y-4">
                <h2 className="text-2xl font-bold text-center">Register</h2>

                {error && <div className="alert alert-error shadow-lg">{error}</div>}

                <input type="text" name="username" placeholder="Username" className="input input-bordered w-full" value={formData.username} onChange={handleChange} required />

                <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" value={formData.email} onChange={handleChange} required />

                <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" value={formData.password} onChange={handleChange} required />

                <input type="text" name="name" placeholder="Name" className="input input-bordered w-full" value={formData.name} onChange={handleChange} />

                <textarea name="bio" placeholder="Bio" className="textarea textarea-bordered w-full" value={formData.bio} onChange={handleChange} />

                <button type="submit" className="btn btn-primary w-full">
                    Register
                </button>

                <p className="text-center">
                    Already have an account?
                    <Link href={"login"} className="text-primary">
                        {" "}
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
