"use client";

import Link from "next/link";
import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const searchEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim() === "") return;
        router.push(`/result?search_query=${encodeURIComponent(query)}`);
    };
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {" "}
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />{" "}
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <Link href={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link href={"/groups"}>Groups</Link>
                        </li>
                        <li>
                            <Link href={"/profile"}>Profile</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <h1 className="text-3xl font-bold">
                    qwest <span className="text-primary">.</span>
                </h1>
            </div>
            <div className="navbar-end">
                <form onSubmit={searchEventHandler}>
                    <label className="input">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" required placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
                    </label>
                </form>
                <Link href={"/notifications"}>
                    <button className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {" "}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />{" "}
                            </svg>
                            <span className="badge badge-xs badge-primary indicator-item">11</span>
                        </div>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
