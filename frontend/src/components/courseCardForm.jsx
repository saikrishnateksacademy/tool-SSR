import React, { useState } from "react";

export default function CourseCardForm() {
  const [courseName, setCourseName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Course Added: ${courseName}`);
    setCourseName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm"
    >
      <h3 className="font-semibold text-gray-700 mb-3">Add New Course</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter course name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </form>
  );
}
