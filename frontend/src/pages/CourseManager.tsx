import { useEffect, useState } from "react";
import { courseAPI } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Search, Edit2, Trash2, Plus, Eye, XSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CourseManager = () => {
  const navigate = useNavigate();

  // ✅ STATE (Correctly typed, no duplicates)
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ open: boolean; ids: string[] }>({
    open: false,
    ids: [],
  });

  /* ------------------------ FETCH COURSES ------------------------ */
  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await courseAPI.getAll();
      setCourses(data);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* ------------------------ FILTERED LIST ------------------------ */
  const filtered = courses.filter((c) => {
    const t = search.toLowerCase();
    return (
      c.programTitle?.toLowerCase().includes(t) ||
      c.programInternalName?.toLowerCase().includes(t) ||
      c.category?.toLowerCase().includes(t)
    );
  });

  /* ------------------------ SELECTION LOGIC ------------------------ */
  const toggleSelect = (id: string) => {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelected(copy);
  };

  const toggleSelectAll = () => {
    selected.size === filtered.length
      ? setSelected(new Set())
      : setSelected(new Set(filtered.map((c) => c._id)));
  };

  /* ------------------------ BULK UPDATE ------------------------ */
  const runBulkUpdate = async (status: "draft" | "published") => {
    try {
      await courseAPI.bulkUpdateStatus([...selected], status);

      toast.success(`Updated ${selected.size} course(s)`);

      await loadCourses();
      setSelected(new Set());
    } catch {
      toast.error("Bulk update failed");
    }
  };

  /* ------------------------ BULK DELETE ------------------------ */
  const confirmDelete = (ids: string[]) => {
    setConfirm({ open: true, ids });
  };

  const processDelete = async () => {
    try {
      await courseAPI.bulkDelete(confirm.ids);

      toast.success(`Deleted ${confirm.ids.length} course(s)`);

      setCourses((c) => c.filter((x) => !confirm.ids.includes(x._id)));
    } catch {
      toast.error("Delete failed");
    } finally {
      setConfirm({ open: false, ids: [] });
      setSelected(new Set());
    }
  };

  /* ------------------------ SINGLE DELETE ------------------------ */
  const deleteOne = (id: string) => confirmDelete([id]);

  /* ------------------------ RENDER ------------------------ */
  if (loading)
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Loading courses...</p>
      </Card>
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">
            Create & manage your course catalog
          </p>
        </div>
        <Button onClick={() => navigate("/courses/new")}>
          <Plus className="h-4 w-4 mr-2" /> Add Course
        </Button>
      </div>

      {/* BULK BAR */}
      {selected.size > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20 flex justify-between items-center">
          <span className="text-sm font-medium">{selected.size} selected</span>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => runBulkUpdate("published")}>
              Publish
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => runBulkUpdate("draft")}
            >
              Unpublish
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => confirmDelete([...selected])}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>

            <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>
              <XSquare className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
        </Card>
      )}

      {/* SEARCH */}
      <Card className="p-4 flex gap-4 items-center">
        {filtered.length > 0 && (
          <Checkbox
            checked={selected.size === filtered.length}
            onCheckedChange={toggleSelectAll}
          />
        )}

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* LIST */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No courses found</p>
        </Card>
      ) : (
        filtered.map((c) => (
          <Card
            key={c._id}
            className={`p-6 flex items-start gap-4 ${
              selected.has(c._id) ? "ring-2 ring-primary" : ""
            }`}
          >
            <Checkbox
              checked={selected.has(c._id)}
              onCheckedChange={() => toggleSelect(c._id)}
              className="mt-1"
            />

            {/* INFO */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold">{c.programTitle}</h3>

                <Badge
                  variant={
                    c.meta?.status === "published" ? "default" : "secondary"
                  }
                >
                  {c.meta?.status || "draft"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{c.category}</Badge>
                {c.subCategory && <Badge variant="outline">{c.subCategory}</Badge>}
                {c.duration?.label && <>📅 {c.duration.label}</>}
                {c.delivery?.mode && <>🎓 {c.delivery.mode}</>}
                {c.pricing?.feeRange && <>💰 {c.pricing.feeRange}</>}
              </div>

              {c.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.tags.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-secondary px-2 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                  {c.tags.length > 5 && (
                    <span className="text-xs text-muted-foreground">
                      +{c.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-1">
                Internal: {c.programInternalName}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toast.info("Preview coming soon")}
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate(`/courses/${c._id}`)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => deleteOne(c._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))
      )}

      {/* DELETE CONFIRM DIALOG */}
      <AlertDialog
        open={confirm.open}
        onOpenChange={(v) => setConfirm({ ...confirm, open: v })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {confirm.ids.length} course(s)?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={processDelete}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseManager;
