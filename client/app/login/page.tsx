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
        password: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const token = Cookies.get("access");
        if (token) {
            router.push("/");
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", formData);
            const { access, refresh } = response.data;

            Cookies.set("access", access);
            Cookies.set("refresh", refresh);

            router.push("/");
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
                <h2 className="text-2xl font-bold text-center">Sign In</h2>

                {error && <div className="alert alert-error shadow-lg">{error}</div>}

                <input type="text" name="username" placeholder="Username" className="input input-bordered w-full" value={formData.username} onChange={handleChange} required />

                <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" value={formData.password} onChange={handleChange} required />

                <button type="submit" className="btn btn-primary w-full">
                    Sign In
                </button>

                <p className="text-center">
                    Don't have an account?
                    <Link href={"signup"} className="text-primary">
                        {" "}
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
