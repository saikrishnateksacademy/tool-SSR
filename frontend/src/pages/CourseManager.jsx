import React from "react";
import CourseCardForm from "../components/courseCardForm.jsx";
import CourseList from "../components/courseList.jsx";

export default function CourseManager() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Course Manager</h2>
      <CourseCardForm />
      <CourseList />
    </div>
  );
}
