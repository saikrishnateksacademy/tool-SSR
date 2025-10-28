import React from "react";
import PageForm from "../components/pageForm.jsx";
import PageList from "../components/pageList.jsx";

export default function PageManager() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Page Manager</h2>
      <PageForm />
      <PageList />
    </div>
  );
}
