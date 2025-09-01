"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const access = Cookies.get("access");
            if (!access) {
                router.push("/login");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/me/", {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                });
                setUsername(response.data.username);
            } catch (err: any) {
                setError("Failed to fetch user");
                console.error(err);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/logout/", null, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("access")}`,
                },
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            Cookies.remove("access");
            Cookies.remove("refresh");
            router.push("/login");
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex flex-col gap-3 justify-center items-center min-h-screen">
            {username ? (
                <>
                    <h1 className="text-2xl font-bold">Hello {username}!</h1>
                    <button className="btn btn-primary" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
