import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockPages = [
  {
    id: '1',
    title: 'Data Science Course Landing',
    type: 'course_landing',
    slug: 'data-science-course',
    status: 'published',
    lastModified: '2025-01-20',
  },
  {
    id: '2',
    title: 'About Us',
    type: 'about',
    slug: 'about',
    status: 'published',
    lastModified: '2025-01-18',
  },
  {
    id: '3',
    title: 'AI & ML Landing Page',
    type: 'course_landing',
    slug: 'ai-ml-course',
    status: 'draft',
    lastModified: '2025-01-22',
  },
];

const PageManager = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pages] = useState(mockPages);

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Page Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your dynamic pages
          </p>
        </div>
        <Button onClick={() => navigate('/pages/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Page List */}
      <div className="grid gap-4">
        {filteredPages.map((page) => (
          <Card key={page.id} className="p-6 shadow-card hover:shadow-lg-custom transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {page.title}
                  </h3>
                  <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                    {page.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Badge variant="outline">{page.type}</Badge>
                  </span>
                  <span>/{page.slug}</span>
                  <span>Modified: {page.lastModified}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/pages/${page.id}`)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <Card className="p-12 text-center shadow-card">
          <p className="text-muted-foreground">No pages found. Create your first page to get started.</p>
        </Card>
      )}
    </div>
  );
};

export default PageManager;
