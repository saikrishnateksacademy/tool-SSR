import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  DELIVERY_FORMATS,
  STATUS_OPTIONS,
  PARTNERSHIP_TYPES,
} from "@/constants";
import { toast } from "sonner";
import { courseAPI } from "@/api";

interface University {
  name: string;
  logoUrl: string;
  sourceId: number;
  partnershipType: string;
}

interface Specialization {
  name: string;
  slug: string;
  productId: string;
}

interface CTAButton {
  label: string;
  url: string;
  opensForm: boolean;
}

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
    
    media: {
      thumbnailUrl: "",
      alt: ""
    },
    
    pricing: {
      feeRange: "",
      currency: "INR",
      scholarships: false,
      emiAvailable: false,
      noCostEmi: false
    },
    
    duration: {
      label: "",
      minMonths: 0,
      maxMonths: 0
    },
    
    delivery: {
      mode: "",
      format: [] as string[]
    },
    
    tags: [] as string[],
    universities: [] as University[],
    specializations: [] as Specialization[],
    ctaButtons: [] as CTAButton[],
    
    meta: {
      slug: "",
      canonicalUrl: "",
      status: "draft",
      visibility: "public",
      priority: 0.5
    },
    
    seo: {
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      schemaType: "Course"
    }
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      if (!isEdit || !id) return;
      try {
        setLoading(true);
        const response = await courseAPI.getById(id);
        const data = response.data;
        
        setFormData({
          programInternalName: data.programInternalName || "",
          programTitle: data.programTitle || "",
          category: data.category || "",
          subCategory: data.subCategory || "",
          media: data.media || { thumbnailUrl: "", alt: "" },
          pricing: data.pricing || { 
            feeRange: "", 
            currency: "INR", 
            scholarships: false, 
            emiAvailable: false, 
            noCostEmi: false 
          },
          duration: data.duration || { label: "", minMonths: 0, maxMonths: 0 },
          delivery: data.delivery || { mode: "", format: [] },
          tags: data.tags || [],
          universities: data.universities || [],
          specializations: data.specializations || [],
          ctaButtons: data.ctaButtons || [],
          meta: data.meta || { 
            slug: "", 
            canonicalUrl: "", 
            status: "draft", 
            visibility: "public", 
            priority: 0.5 
          },
          seo: data.seo || { 
            metaTitle: "", 
            metaDescription: "", 
            ogImage: "", 
            schemaType: "Course" 
          }
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
    
    // Validation
    if (!formData.programInternalName || !formData.programTitle || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.meta.slug) {
      toast.error("Slug is required");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && id) {
        await courseAPI.update(id, formData);
        toast.success("Course updated successfully!");
      } else {
        await courseAPI.create(formData);
        toast.success("Course created successfully!");
      }
      navigate("/courses");
    } catch (err: any) {
      console.error("❌ Error saving course:", err);
      toast.error(err.response?.data?.error || "Failed to save course");
    } finally {
      setLoading(false);
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

  const toggleFormat = (format: string) => {
    const updated = formData.delivery.format.includes(format)
      ? formData.delivery.format.filter((f) => f !== format)
      : [...formData.delivery.format, format];
    setFormData({
      ...formData,
      delivery: { ...formData.delivery, format: updated }
    });
  };

  const addUniversity = () => {
    setFormData({
      ...formData,
      universities: [
        ...formData.universities,
        { name: "", logoUrl: "", sourceId: 0, partnershipType: "" }
      ]
    });
  };

  const updateUniversity = (index: number, field: string, value: any) => {
    const updated = [...formData.universities];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, universities: updated });
  };

  const removeUniversity = (index: number) => {
    setFormData({
      ...formData,
      universities: formData.universities.filter((_, i) => i !== index)
    });
  };

  const addSpecialization = () => {
    setFormData({
      ...formData,
      specializations: [
        ...formData.specializations,
        { name: "", slug: "", productId: "" }
      ]
    });
  };

  const updateSpecialization = (index: number, field: string, value: any) => {
    const updated = [...formData.specializations];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, specializations: updated });
  };

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((_, i) => i !== index)
    });
  };

  const addCTA = () => {
    setFormData({
      ...formData,
      ctaButtons: [
        ...formData.ctaButtons,
        { label: "", url: "", opensForm: false }
      ]
    });
  };

  const updateCTA = (index: number, field: string, value: any) => {
    const updated = [...formData.ctaButtons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ctaButtons: updated });
  };

  const removeCTA = (index: number) => {
    setFormData({
      ...formData,
      ctaButtons: formData.ctaButtons.filter((_, i) => i !== index)
    });
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="programInternalName">Internal Name *</Label>
                <Input
                  id="programInternalName"
                  value={formData.programInternalName}
                  onChange={(e) =>
                    setFormData({ ...formData, programInternalName: e.target.value })
                  }
                  placeholder="e.g., mba-ai-ml-2024"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programTitle">Program Title *</Label>
                <Input
                  id="programTitle"
                  value={formData.programTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, programTitle: e.target.value })
                  }
                  placeholder="e.g., MBA in AI & Machine Learning"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sub Category</Label>
                <Select
                  value={formData.subCategory}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subCategory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUB_CATEGORIES.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Media */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Media</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={formData.media.thumbnailUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    media: { ...formData.media, thumbnailUrl: e.target.value }
                  })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnailAlt">Thumbnail Alt Text</Label>
              <Input
                id="thumbnailAlt"
                value={formData.media.alt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    media: { ...formData.media, alt: e.target.value }
                  })
                }
                placeholder="Describe the image"
              />
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="feeRange">Fee Range</Label>
                <Input
                  id="feeRange"
                  value={formData.pricing.feeRange}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, feeRange: e.target.value }
                    })
                  }
                  placeholder="₹50,000 - ₹1,00,000"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={formData.pricing.currency}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, currency: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="scholarships" className="cursor-pointer">Scholarships Available</Label>
                <Switch
                  id="scholarships"
                  checked={formData.pricing.scholarships}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, scholarships: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="emiAvailable" className="cursor-pointer">EMI Available</Label>
                <Switch
                  id="emiAvailable"
                  checked={formData.pricing.emiAvailable}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, emiAvailable: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="noCostEmi" className="cursor-pointer">No Cost EMI</Label>
                <Switch
                  id="noCostEmi"
                  checked={formData.pricing.noCostEmi}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, noCostEmi: checked }
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Duration & Delivery */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Duration & Delivery</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="durationLabel">Duration Label</Label>
              <Input
                id="durationLabel"
                value={formData.duration.label}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: { ...formData.duration, label: e.target.value }
                  })
                }
                placeholder="12-24 months"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minMonths">Min Duration (Months)</Label>
                <Input
                  id="minMonths"
                  type="number"
                  value={formData.duration.minMonths}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: { ...formData.duration, minMonths: Number(e.target.value) }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxMonths">Max Duration (Months)</Label>
                <Input
                  id="maxMonths"
                  type="number"
                  value={formData.duration.maxMonths}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: { ...formData.duration, maxMonths: Number(e.target.value) }
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Delivery Mode</Label>
              <Select
                value={formData.delivery.mode}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    delivery: { ...formData.delivery, mode: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Delivery Format</Label>
              <div className="flex flex-wrap gap-2">
                {DELIVERY_FORMATS.map((format) => (
                  <Button
                    key={format}
                    type="button"
                    variant={
                      formData.delivery.format.includes(format) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleFormat(format)}
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tags (e.g., AI, ML, Data Science)"
              />
              <Button type="button" onClick={addTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Universities */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Partner Universities</h2>
            <Button type="button" onClick={addUniversity} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add University
            </Button>
          </div>
          <div className="space-y-4">
            {formData.universities.map((uni, index) => (
              <Card key={index} className="p-4 bg-muted/50">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">University {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeUniversity(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="University Name"
                      value={uni.name}
                      onChange={(e) => updateUniversity(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Logo URL"
                      value={uni.logoUrl}
                      onChange={(e) => updateUniversity(index, "logoUrl", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Source ID"
                      value={uni.sourceId}
                      onChange={(e) => updateUniversity(index, "sourceId", Number(e.target.value))}
                    />
                    <Select
                      value={uni.partnershipType}
                      onValueChange={(value) => updateUniversity(index, "partnershipType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Partnership Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNERSHIP_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Specializations */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Specializations</h2>
            <Button type="button" onClick={addSpecialization} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Specialization
            </Button>
          </div>
          <div className="space-y-4">
            {formData.specializations.map((spec, index) => (
              <Card key={index} className="p-4 bg-muted/50">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Specialization {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecialization(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      placeholder="Specialization Name"
                      value={spec.name}
                      onChange={(e) => updateSpecialization(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Slug"
                      value={spec.slug}
                      onChange={(e) => updateSpecialization(index, "slug", e.target.value)}
                    />
                    <Input
                      placeholder="Product ID"
                      value={spec.productId}
                      onChange={(e) => updateSpecialization(index, "productId", e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* CTA Buttons */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">CTA Buttons</h2>
            <Button type="button" onClick={addCTA} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add CTA
            </Button>
          </div>
          <div className="space-y-4">
            {formData.ctaButtons.map((cta, index) => (
              <Card key={index} className="p-4 bg-muted/50">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">CTA Button {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCTA(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Button Label"
                      value={cta.label}
                      onChange={(e) => updateCTA(index, "label", e.target.value)}
                    />
                    <Input
                      placeholder="Button URL"
                      value={cta.url}
                      onChange={(e) => updateCTA(index, "url", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Opens Form</Label>
                    <Switch
                      checked={cta.opensForm}
                      onCheckedChange={(checked) => updateCTA(index, "opensForm", checked)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Meta & SEO */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Meta & SEO</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.meta.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meta: { ...formData.meta, slug: e.target.value }
                  })
                }
                placeholder="mba-ai-machine-learning"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /courses/{formData.meta.slug || "your-slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                type="url"
                value={formData.meta.canonicalUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meta: { ...formData.meta, canonicalUrl: e.target.value }
                  })
                }
                placeholder="https://yourdomain.com/courses/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.seo.metaTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, metaTitle: e.target.value }
                  })
                }
                placeholder="Course Title - Your Brand"
              />
              <p className="text-xs text-muted-foreground">
                {formData.seo.metaTitle.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.seo.metaDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, metaDescription: e.target.value }
                  })
                }
                placeholder="Brief description for search results"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {formData.seo.metaDescription.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">OG Image URL</Label>
              <Input
                id="ogImage"
                type="url"
                value={formData.seo.ogImage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, ogImage: e.target.value }
                  })
                }
                placeholder="https://example.com/og-image.jpg"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.meta.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      meta: { ...formData.meta, status: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={formData.meta.visibility}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      meta: { ...formData.meta, visibility: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority (0-1)</Label>
                <Input
                  id="priority"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.meta.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta: { ...formData.meta, priority: Number(e.target.value) }
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate("/courses")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;