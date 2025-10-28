import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome to the Tool SSR Dashboard
      </h2>
      <p className="text-gray-600">
        Use the sidebar to navigate between course management, page management,
        and settings.
      </p>
    </div>
  );
}
