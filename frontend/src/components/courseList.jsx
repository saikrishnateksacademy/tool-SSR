import React from "react";

export default function CourseList() {
  const sampleCourses = ["React Basics", "Next.js Advanced", "Node.js Mastery"];

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3">Existing Courses</h3>
      <ul className="space-y-2">
        {sampleCourses.map((course, i) => (
          <li
            key={i}
            className="border rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100"
          >
            {course}
          </li>
        ))}
      </ul>
    </div>
  );
}
