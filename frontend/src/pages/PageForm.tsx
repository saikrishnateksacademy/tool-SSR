import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_TYPES, STATUS_OPTIONS } from '@/constants';
import { toast } from 'sonner';

const PageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    type: '',
    slug: '',
    title: '',
    heroHeading: '',
    heroDescription: '',
    heroImage: '',
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    canonical: '',
    status: 'draft',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to API
    toast.success(isEdit ? 'Page updated successfully!' : 'Page created successfully!');
    navigate('/pages');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/pages')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? 'Edit Page' : 'Create New Page'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your dynamic page content
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Page Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="my-page-url"
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be the URL: /{formData.slug || 'my-page-url'}
              </p>
            </div>
          </div>
        </Card>

        {/* Hero Section */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroHeading">Hero Heading</Label>
              <Input
                id="heroHeading"
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                placeholder="Master Data Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Hero Description</Label>
              <Textarea
                id="heroDescription"
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                placeholder="Join our comprehensive program..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Image URL</Label>
              <Input
                id="heroImage"
                type="url"
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                placeholder="https://example.com/hero-image.jpg"
              />
            </div>
          </div>
        </Card>

        {/* SEO Metadata */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">SEO Metadata</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title *</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Page Title | Your Brand"
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.metaTitle.length}/60 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description *</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Brief description for search results (max 160 characters)"
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogImage">OG Image URL</Label>
              <Input
                id="ogImage"
                type="url"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canonical">Canonical URL</Label>
              <Input
                id="canonical"
                type="url"
                value={formData.canonical}
                onChange={(e) => setFormData({ ...formData, canonical: e.target.value })}
                placeholder="https://yourdomain.com/page-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" size="lg">
            {isEdit ? 'Update Page' : 'Create Page'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/pages')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PageForm;
