import { useState, useEffect } from "react";
import { courseAPI } from "@/api/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Edit2, Trash2, Plus, Eye, MoreVertical, CheckSquare, XSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Course {
  _id: string;
  programTitle: string;
  programInternalName: string;
  category: string;
  subCategory?: string;
  duration?: { label?: string };
  meta?: { status?: string; slug?: string };
  delivery?: { mode?: string };
  pricing?: { feeRange?: string };
  tags?: string[];
  createdAt?: string;
}

const CourseManager = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk operation states
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      setCourses(response.data);
      setError("");
    } catch (err: any) {
      console.error("❌ Failed to fetch courses:", err);
      setError("Failed to load courses. Please check backend connection.");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedCourses.size === filteredCourses.length) {
      setSelectedCourses(new Set());
    } else {
      setSelectedCourses(new Set(filteredCourses.map((c) => c._id)));
    }
  };

  const toggleSelectCourse = (courseId: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const clearSelection = () => {
    setSelectedCourses(new Set());
  };

  // Bulk action handlers
  const handleBulkPublish = async () => {
    try {
      setBulkActionLoading(true);
      const ids = Array.from(selectedCourses);
      await courseAPI.bulkUpdateStatus(ids, "published");
      toast.success(`${ids.length} course(s) published successfully!`);
      await fetchCourses();
      clearSelection();
    } catch (err: any) {
      console.error("❌ Bulk publish failed:", err);
      toast.error("Failed to publish courses");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      setBulkActionLoading(true);
      const ids = Array.from(selectedCourses);
      await courseAPI.bulkUpdateStatus(ids, "draft");
      toast.success(`${ids.length} course(s) unpublished successfully!`);
      await fetchCourses();
      clearSelection();
    } catch (err: any) {
      console.error("❌ Bulk unpublish failed:", err);
      toast.error("Failed to unpublish courses");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      setBulkActionLoading(true);
      const ids = Array.from(selectedCourses);
      await courseAPI.bulkDelete(ids);
      toast.success(`${ids.length} course(s) deleted successfully!`);
      setCourses(courses.filter((c) => !selectedCourses.has(c._id)));
      clearSelection();
      setBulkDeleteDialogOpen(false);
    } catch (err: any) {
      console.error("❌ Bulk delete failed:", err);
      toast.error("Failed to delete courses");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Single course actions
  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
      setDeleting(true);
      await courseAPI.delete(courseToDelete._id);
      toast.success("Course deleted successfully!");
      setCourses(courses.filter((c) => c._id !== courseToDelete._id));
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (err: any) {
      console.error("❌ Failed to delete course:", err);
      toast.error(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleViewPreview = (course: Course) => {
    toast.info(`Preview feature coming soon for: ${course.programTitle}`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure your backend server is running on http://localhost:4000
          </p>
        </div>
        <Button onClick={fetchCourses}>Retry</Button>
      </div>
    );
  }

  const filteredCourses = courses.filter(
    (c) =>
      c.programTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.programInternalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected = selectedCourses.size === filteredCourses.length && filteredCourses.length > 0;
  const someSelected = selectedCourses.size > 0 && selectedCourses.size < filteredCourses.length;

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

      {/* Bulk Actions Bar */}
      {selectedCourses.size > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedCourses.size} course(s) selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                <XSquare className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleBulkPublish}
                disabled={bulkActionLoading}
              >
                Publish Selected
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkUnpublish}
                disabled={bulkActionLoading}
              >
                Unpublish Selected
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteDialogOpen(true)}
                disabled={bulkActionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search & Filters */}
      <Card className="p-4 shadow-card">
        <div className="flex gap-4 items-center">
          {filteredCourses.length > 0 && (
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleSelectAll}
              className="ml-2"
              aria-label="Select all courses"
            />
          )}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses by title, name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Courses</div>
          <div className="text-2xl font-bold mt-1">{courses.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Published</div>
          <div className="text-2xl font-bold mt-1">
            {courses.filter((c) => c.meta?.status === "published").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Drafts</div>
          <div className="text-2xl font-bold mt-1">
            {courses.filter((c) => c.meta?.status === "draft").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Selected</div>
          <div className="text-2xl font-bold mt-1">{selectedCourses.size}</div>
        </Card>
      </div>

      {/* Course List */}
      {loading ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Loading courses...</p>
        </Card>
      ) : filteredCourses.length > 0 ? (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card
              key={course._id}
              className={`p-6 hover:shadow-lg-custom transition-all ${
                selectedCourses.has(course._id) ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedCourses.has(course._id)}
                  onCheckedChange={() => toggleSelectCourse(course._id)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {course.programTitle}
                    </h3>
                    <Badge
                      variant={
                        course.meta?.status === "published"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {course.meta?.status || "draft"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-2">
                    <Badge variant="outline">{course.category}</Badge>
                    {course.subCategory && (
                      <Badge variant="outline">{course.subCategory}</Badge>
                    )}
                    {course.duration?.label && (
                      <span className="flex items-center gap-1">
                        📅 {course.duration.label}
                      </span>
                    )}
                    {course.delivery?.mode && (
                      <span className="flex items-center gap-1">
                        🎓 {course.delivery.mode}
                      </span>
                    )}
                    {course.pricing?.feeRange && (
                      <span className="flex items-center gap-1">
                        💰 {course.pricing.feeRange}
                      </span>
                    )}
                  </div>

                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {course.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-secondary px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 5 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{course.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mt-2">
                    Internal Name: {course.programInternalName}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Preview"
                    onClick={() => handleViewPreview(course)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Edit"
                    onClick={() => handleEditClick(course._id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    title="Delete"
                    onClick={() => handleDeleteClick(course)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchTerm
              ? "No courses found matching your search."
              : "No courses found. Create your first course to get started."}
          </p>
          {!searchTerm && (
            <Button className="mt-4" onClick={() => navigate("/courses/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Course
            </Button>
          )}
        </Card>
      )}

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course "
              {courseToDelete?.programTitle}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCourses.size} courses?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCourses.size} selected course(s). 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              disabled={bulkActionLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {bulkActionLoading ? "Deleting..." : `Delete ${selectedCourses.size} Courses`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseManager;