"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

interface Group {
    id: number;
    groupname: string;
    created_by: string;
}

export default function page() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = Cookies.get("access");
                if (!token) throw new Error("Not authenticated");

                const response = await axios.get("http://127.0.0.1:8000/api/groups/all/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setGroups(response.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    if (loading) return <p className="p-3">Loading groups...</p>;
    if (error) return <p className="p-3 text-error">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Groups</h1>
            <Link href={"/groups/my"}>
                <button className="btn btn-primary">View My Groups</button>
            </Link>
            <div className="flex flex-col gap-2">
                {groups.map((group) => (
                    <div key={group.id} className="card bg-base-100 shadow p-3 flex justify-between">
                        <span className="font-medium">{group.groupname}</span>
                        <span className="text-sm text-gray-500">{group.created_by}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
