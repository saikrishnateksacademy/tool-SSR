import React from "react";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Admin Dashboard
      </h1>
      <div className="flex items-center gap-3 text-gray-600">
        <span className="text-sm">Admin</span>
        <img
          src="/favicon.ico"
          alt="user"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </header>
  );
}
