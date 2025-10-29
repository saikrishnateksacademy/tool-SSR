import { useState, useEffect } from "react";
import { getCourses } from "@/api/courseApi"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseManager = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error("❌ Failed to fetch courses:", err);
        setError("Failed to load courses. Please check backend connection.");
      }
    };
    fetchCourses();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  const filtered = courses.filter((c) =>
    c.programTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your course catalog
          </p>
        </div>
        <Button onClick={() => navigate("/courses/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Course List */}
      {filtered.length > 0 ? (
        filtered.map((course) => (
          <Card key={course._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{course.programTitle}</h3>
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  <Badge>{course.category}</Badge>
                  <span>{course.duration?.label}</span>
                  <span>{course.subCategory}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No courses found.</p>
        </Card>
      )}
    </div>
  );
};

export default CourseManager;
