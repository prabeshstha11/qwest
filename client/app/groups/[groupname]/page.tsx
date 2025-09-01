"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

interface Group {
    id: number;
    groupname: string;
    description: string;
    category: string;
    is_private: boolean;
    created_by: string;
    created_at: string;
    members: string[];
    is_creator?: boolean;
}

export default function GroupPage() {
    const { groupname } = useParams();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = Cookies.get("access");

    const fetchGroup = () => {
        if (!groupname || !token) return;

        setLoading(true);
        axios
            .get(`http://127.0.0.1:8000/api/groups/${groupname}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setGroup(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.detail || "Something went wrong");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!token) {
            setError("You are not logged in");
            setLoading(false);
            return;
        }
        fetchGroup();
    }, [groupname]);

    const handleJoin = () => {
        if (!token) return;
        axios
            .post(`http://127.0.0.1:8000/api/groups/${groupname}/join/`, {}, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => fetchGroup())
            .catch((err) => setError(err.response?.data?.detail || "Failed to join"));
    };

    const handleLeave = () => {
        if (!token) return;
        axios
            .post(`http://127.0.0.1:8000/api/groups/${groupname}/leave/`, {}, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => fetchGroup())
            .catch((err) => setError(err.response?.data?.detail || "Failed to leave"));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!group) return <p>No group found</p>;

    return (
        <div className="max-w-xl mx-auto mt-10">
            <div className="card bg-base-100 shadow-xl p-6">
                <div className="card-body">
                    <h1 className="card-title text-2xl font-bold">{group.groupname}</h1>

                    <p className="mt-2 text-gray-700">{group.description || "No description provided."}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="badge badge-primary">Category: {group.category || "None"}</span>
                        <span className="badge badge-secondary">Created by: {group.created_by}</span>
                        <span className="badge badge-accent">Members: {group.members.length}</span>
                    </div>

                    {group.is_creator && <p className="mt-4 text-green-600 font-semibold">You are the creator of this group</p>}

                    <div className="mt-4 flex gap-2">
                        {!group.is_creator && (
                            <>
                                <button onClick={handleJoin} className="btn btn-sm btn-primary">
                                    Join
                                </button>
                                <button onClick={handleLeave} className="btn btn-sm btn-error">
                                    Leave
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
