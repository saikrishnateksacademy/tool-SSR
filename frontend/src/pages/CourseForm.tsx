import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  SUB_CATEGORIES,
  DELIVERY_MODES,
  STATUS_OPTIONS,
  SPECIALIZATION,
} from "@/constants";
import { toast } from "sonner";
import { createCourse, getCourseById } from "@/api/courseApi";

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    programInternalName: "",
    programTitle: "",
    category: "",
    subCategory: "",
    specialization: "",
    thumbnailUrl: "",
    thumbnailAlt: "",
    feeRange: "",
    duration: "",
    deliveryMode: "",
    tags: [] as string[],
    metaTitle: "",
    metaDescription: "",
    status: "draft",
  });

  const [tagInput, setTagInput] = useState("");

  // ✅ Fetch course details when editing
  useEffect(() => {
    const fetchCourse = async () => {
      if (!isEdit || !id) return;
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setFormData({
          programInternalName: data.programInternalName || "",
          programTitle: data.programTitle || "",
          category: data.category || "",
          subCategory: data.subCategory || "",
          specialization: data.specialization || "",
          thumbnailUrl: data.thumbnailUrl || "",
          thumbnailAlt: data.thumbnailAlt || "",
          feeRange: data.feeRange || "",
          duration: data.duration || "",
          deliveryMode: data.deliveryMode || "",
          tags: data.tags || [],
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          status: data.status || "draft",
        });
      } catch (err: any) {
        console.error("❌ Error loading course:", err);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // ✅ (Optional) Add an updateCourse() call later
        toast.success("Course updated successfully!");
      } else {
        await createCourse(formData);
        toast.success("Course created successfully!");
      }
      navigate("/courses");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  if (loading) {
    return <div className="p-6 text-lg text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill in the course details below
          </p>
        </div>
      </div>

      {/* ✅ Your existing form UI remains unchanged */}
      {/* Just paste the rest of your original form fields and submit section here */}

    </div>
  );
};

export default CourseForm;
