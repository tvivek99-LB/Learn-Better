import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Link, 
  File, 
  Search, 
  Filter,
  Calendar,
  Eye,
  Trash2,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Brain,
  Plus,
  Minus,
  CheckSquare,
  Square,
  X,
  Folder,
  ChevronDown,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useTopicData } from './TopicDataManager';
import { useContentData, ContentItem } from './ContentDataManager';
import { AddContentModal } from './AddContentModal';
import { Progress } from './ui/progress';
import { CompactRetentionGraph } from './CompactRetentionGraph';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Checkbox } from './ui/checkbox';



interface InventoryProps {
  onBackToHome: () => void;
}

export function Inventory({ onBackToHome }: InventoryProps) {
  const { topics, calculateTopicRetention } = useTopicData();
  const { contentItems, toggleRetentionPlan: toggleRetention, deleteContentItem } = useContentData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRetention, setFilterRetention] = useState<string>('all');
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set()); // Multiple topic selection
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const itemsPerPage = 9;

  const handleToggleRetentionPlan = (itemId: string) => {
    toggleRetention(itemId);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  const toggleTopicFilter = (topicId: string) => {
    setSelectedTopics(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(topicId)) {
        newSelected.delete(topicId);
      } else {
        newSelected.add(topicId);
      }
      return newSelected;
    });
  };

  const selectAllItems = () => {
    const allCurrentItemIds = currentItems.map(item => item.id);
    setSelectedItems(new Set(allCurrentItemIds));
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const bulkAddToRetentionPlan = () => {
    selectedItems.forEach(itemId => {
      const item = contentItems.find(item => item.id === itemId);
      if (item && !item.inRetentionPlan) {
        toggleRetention(itemId);
      }
    });
    clearSelection();
  };

  const bulkRemoveFromRetentionPlan = () => {
    selectedItems.forEach(itemId => {
      const item = contentItems.find(item => item.id === itemId);
      if (item && item.inRetentionPlan) {
        toggleRetention(itemId);
      }
    });
    clearSelection();
  };

  const removeFromLibrary = (itemId: string) => {
    deleteContentItem(itemId);
    // Also remove from selection if it was selected
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(itemId);
      return newSelected;
    });
  };

  const bulkDeleteItems = () => {
    selectedItems.forEach(itemId => {
      deleteContentItem(itemId);
    });
    clearSelection();
    setShowDeleteConfirmation(false);
  };

  const handleBulkDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCardClick = (item: ContentItem, event: React.MouseEvent) => {
    // Don't open URL if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('input')) {
      return;
    }

    // Open URL in new tab for URL type items
    if (item.type === 'url' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <File className="h-4 w-4" />;
      case 'url':
        return <Link className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'file':
        return { backgroundColor: '#F3E7B9', color: '#2852E9' };
      case 'url':
        return { backgroundColor: '#FAF5D7', color: '#2852E9' };
      case 'text':
        return { backgroundColor: '#FFFBE6', color: '#2852E9' };
      default:
        return { backgroundColor: '#F3E7B9', color: '#2852E9' };
    }
  };

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.preview?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTypeFilter = filterType === 'all' || item.type === filterType;
    const matchesRetentionFilter = filterRetention === 'all' || 
                                 (filterRetention === 'in-plan' && item.inRetentionPlan) ||
                                 (filterRetention === 'not-in-plan' && !item.inRetentionPlan);
    
    // Topic filtering logic - support multiple selection
    let matchesTopicFilter = true;
    if (selectedTopics.size > 0) {
      const topicKeywords = {
        'ml': ['machine learning', 'ml', 'ai', 'neural', 'tensorflow', 'model'],
        'react': ['react', 'hooks', 'component', 'jsx', 'frontend'],
        'data-structures': ['data structures', 'algorithm', 'array', 'tree', 'graph'],
        'system-design': ['system design', 'architecture', 'scalability', 'api'],
        'ui-ux': ['design', 'ui', 'ux', 'user interface', 'user experience'],
        'product-mgmt': ['product', 'strategy', 'management', 'roadmap', 'planning']
      };
      
      matchesTopicFilter = Array.from(selectedTopics).some(topicId => {
        const keywords = topicKeywords[topicId] || [];
        return keywords.some(keyword => 
          item.title.toLowerCase().includes(keyword) ||
          item.preview?.toLowerCase().includes(keyword) ||
          item.tags?.some(tag => tag.toLowerCase().includes(keyword))
        );
      });
    }
    
    return matchesSearch && matchesTypeFilter && matchesRetentionFilter && matchesTopicFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Calculate retention plan stats
  const retentionPlanCount = contentItems.filter(item => item.inRetentionPlan).length;

  // Selection state
  const hasSelectedItems = selectedItems.size > 0;
  const allCurrentItemsSelected = currentItems.length > 0 && currentItems.every(item => selectedItems.has(item.id));
  const selectedItemsData = contentItems.filter(item => selectedItems.has(item.id));
  const selectedInPlan = selectedItemsData.filter(item => item.inRetentionPlan).length;
  const selectedNotInPlan = selectedItemsData.filter(item => !item.inRetentionPlan).length;

  // Reset to first page and clear selection when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedItems(new Set());
  }, [searchTerm, filterType, filterRetention, selectedTopics, sortBy]);

  // Keyboard shortcuts for bulk operations
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when Cmd/Ctrl is pressed and items are selected
      if (!(event.metaKey || event.ctrlKey) || selectedItems.size === 0) return;
      
      switch (event.key.toLowerCase()) {
        case 'a':
          if (event.shiftKey) {
            // Cmd/Ctrl + Shift + A for bulk add to retention plan
            event.preventDefault();
            bulkAddToRetentionPlan();
          }
          break;
        case 'r':
          if (event.shiftKey) {
            // Cmd/Ctrl + Shift + R for bulk remove from retention plan
            event.preventDefault();
            bulkRemoveFromRetentionPlan();
          }
          break;
        case 'd':
          if (event.shiftKey) {
            // Cmd/Ctrl + Shift + D for bulk delete
            event.preventDefault();
            handleBulkDeleteClick();
          }
          break;
        case 'escape':
          // Escape to clear selection
          event.preventDefault();
          clearSelection();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems, selectedInPlan, selectedNotInPlan]);

  // Calculate retention stats (still needed for other parts of the component)
  const totalConcepts = topics.reduce((sum, topic) => sum + topic.totalConcepts, 0);
  const masteredConcepts = topics.reduce((sum, topic) => sum + topic.conceptsMastered, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBackToHome}
          className="flex items-center space-x-2 rounded-xl"
          style={{ color: '#8E8E93' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 xl:gap-8">
        {/* Main Content Area (Left) */}
        <div className="xl:col-span-3 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 style={{ color: '#232323' }}>My Content</h1>
          <p className="mt-3" style={{ color: '#8E8E93' }}>
            {filteredItems.length} items in your collection
            {selectedTopics.size > 0 && (
              <span> • Filtered by {selectedTopics.size} topic{selectedTopics.size !== 1 ? 's' : ''}</span>
            )}
            {totalPages > 1 && (
              <span> • Page {currentPage} of {totalPages}</span>
            )}
          </p>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" style={{ color: '#2852E9' }} />
              <span style={{ color: '#2852E9' }}>{retentionPlanCount} items in retention plan</span>
            </div>
            <div className="text-sm" style={{ color: '#8E8E93' }}>
              Only items in retention plan will be used for quizzes
            </div>
          </div>
        </div>
        
        {/* Add Content Button and Selection/View Controls */}
        <div className="flex items-center space-x-4">
          {/* Add Content Button */}
          <AddContentModal />
          
          {/* Spacer */}
          <div className="w-px h-8 bg-slate-200"></div>
          
          {/* Select All */}
          {currentItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={allCurrentItemsSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    selectAllItems();
                  } else {
                    clearSelection();
                  }
                }}
              />
              <label htmlFor="select-all" className="text-sm cursor-pointer" style={{ color: '#8E8E93' }}>
                Select all
              </label>
            </div>
          )}
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-xl"
              style={viewMode === 'grid' ? { backgroundColor: '#2852E9', color: 'white' } : { backgroundColor: '#FAF5D7', color: '#232323', borderColor: '#FAF5D7' }}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-xl"
              style={viewMode === 'list' ? { backgroundColor: '#2852E9', color: 'white' } : { backgroundColor: '#FAF5D7', color: '#232323', borderColor: '#FAF5D7' }}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {hasSelectedItems && (
        <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFBE6', borderColor: '#F3E7B9', border: '1px solid' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <CheckSquare className="h-5 w-5" style={{ color: '#2852E9' }} />
                <span style={{ color: '#2852E9' }}>
                  {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              {selectedItems.size > 0 && (
                <div className="text-sm" style={{ color: '#8E8E93' }}>
                  {selectedInPlan > 0 && <span>{selectedInPlan} in plan</span>}
                  {selectedInPlan > 0 && selectedNotInPlan > 0 && <span> • </span>}
                  {selectedNotInPlan > 0 && <span>{selectedNotInPlan} not in plan</span>}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedNotInPlan > 0 && (
                <Button 
                  onClick={bulkAddToRetentionPlan}
                  size="sm"
                  className="rounded-xl text-white"
                  style={{ backgroundColor: '#2852E9' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Plan ({selectedNotInPlan})
                </Button>
              )}
              
              {selectedInPlan > 0 && (
                <Button 
                  onClick={bulkRemoveFromRetentionPlan}
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  style={{ backgroundColor: 'white', color: '#232323', borderColor: '#FAF5D7' }}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove from Plan ({selectedInPlan})
                </Button>
              )}
              
              <Button 
                onClick={handleBulkDeleteClick}
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedItems.size})
              </Button>
              
              <Button 
                onClick={clearSelection}
                variant="ghost"
                size="sm"
                className="rounded-xl"
                style={{ color: '#8E8E93' }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#8E8E93' }} />
              <Input
                placeholder="Search your content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl border-0 bg-gray-50"
                style={{ backgroundColor: '#F8F9FA' }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-12 rounded-xl border-0 bg-gray-50">
                <Filter className="h-4 w-4 mr-2" style={{ color: '#2852E9' }} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="file">Files</SelectItem>
                <SelectItem value="url">URLs</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRetention} onValueChange={setFilterRetention}>
              <SelectTrigger className="w-[160px] h-12 rounded-xl border-0 bg-gray-50">
                <Brain className="h-4 w-4 mr-2" style={{ color: '#2852E9' }} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="in-plan">In Retention Plan</SelectItem>
                <SelectItem value="not-in-plan">Not in Plan</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] h-12 rounded-xl border-0 bg-gray-50">
                <Calendar className="h-4 w-4 mr-2" style={{ color: '#2852E9' }} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer relative bg-white rounded-xl border border-slate-200/60 p-8 ${selectedItems.has(item.id) ? 'ring-2' : ''} ${item.type === 'url' ? 'hover:ring-2 hover:ring-blue-200' : ''}`}
              onClick={(e) => handleCardClick(item, e)}
              style={{ 
                backgroundColor: selectedItems.has(item.id) ? '#FFFBE6' : 'white',
                borderColor: selectedItems.has(item.id) ? '#F3E7B9' : undefined,
                ringColor: selectedItems.has(item.id) ? '#F3E7B9' : undefined
              }}
            >
              <div className="mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={() => toggleItemSelection(item.id)}
                      className="mt-1"
                    />
                    <div className="p-3 rounded-xl" style={getTypeColor(item.type)}>
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-lg"
                      style={{ 
                        color: item.inRetentionPlan ? '#2852E9' : '#8E8E93',
                        backgroundColor: 'transparent'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRetentionPlan(item.id);
                      }}
                      title={item.inRetentionPlan ? 'Remove from retention plan' : 'Add to retention plan'}
                    >
                      {item.inRetentionPlan ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromLibrary(item.id);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"
                      title="Remove from library"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="line-clamp-2 transition-colors font-semibold" style={{ color: '#232323' }}>
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-sm" style={{ color: selectedItems.has(item.id) ? '#232323' : '#8E8E93' }}>
                    <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                    {item.fileSize && (
                      <>
                        <span>•</span>
                        <span>{item.fileSize}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <p className="line-clamp-3 leading-relaxed" style={{ color: selectedItems.has(item.id) ? '#232323' : '#8E8E93' }}>
                  {item.preview}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm capitalize px-3 py-1 rounded-full bg-gray-50" style={{ color: '#232323' }}>
                      {item.type}
                    </span>
                    {item.inRetentionPlan && (
                      <span className="text-sm flex items-center px-3 py-1 rounded-full" style={{ backgroundColor: '#F3E7B9', color: '#2852E9' }}>
                        <Brain className="h-3 w-3 mr-1" />
                        In Plan
                      </span>
                    )}
                  </div>
                </div>
                
                {item.topics && item.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.topics.slice(0, 3).map((topic, index) => (
                      <span 
                        key={index} 
                        className="text-sm px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#FAF5D7', color: '#2852E9' }}
                      >
                        {topic}
                      </span>
                    ))}
                    {item.topics.length > 3 && (
                      <span className="text-sm px-3 py-1 rounded-full bg-gray-50" style={{ color: '#8E8E93' }}>
                        +{item.topics.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white rounded-xl border border-slate-200/60 ${selectedItems.has(item.id) ? 'ring-2' : ''} ${item.type === 'url' ? 'hover:ring-2 hover:ring-blue-200' : ''}`}
              onClick={(e) => handleCardClick(item, e)}
              style={{ 
                backgroundColor: selectedItems.has(item.id) ? '#FFFBE6' : 'white',
                borderColor: selectedItems.has(item.id) ? '#F3E7B9' : undefined,
                ringColor: selectedItems.has(item.id) ? '#F3E7B9' : undefined
              }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                  />
                  <div className="p-2 rounded-lg flex-shrink-0" style={getTypeColor(item.type)}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="transition-colors line-clamp-1 font-semibold" style={{ color: '#232323' }}>
                          {item.title}
                        </h3>
                        <p className="line-clamp-2 mt-2 leading-relaxed" style={{ color: '#8E8E93' }}>
                          {item.preview}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2 text-xs" style={{ color: '#8E8E93' }}>
                            <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                            {item.fileSize && (
                              <>
                                <span>•</span>
                                <span>{item.fileSize}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {item.topics && item.topics.length > 0 && (
                              <div className="flex gap-1">
                                {item.topics.slice(0, 3).map((topic, index) => (
                                  <span 
                                    key={index} 
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{ backgroundColor: '#FAF5D7', color: '#2852E9' }}
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {item.topics.length > 3 && (
                                  <span className="text-xs px-2 py-1" style={{ color: '#8E8E93' }}>
                                    +{item.topics.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs capitalize px-2 py-1 rounded-full border" style={{ borderColor: '#FAF5D7', color: '#232323' }}>
                          {item.type}
                        </span>
                        {item.inRetentionPlan && (
                          <span className="text-xs flex items-center px-2 py-1 rounded-full" style={{ backgroundColor: '#F3E7B9', color: '#2852E9' }}>
                            <Brain className="h-3 w-3 mr-1" />
                            In Plan
                          </span>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-lg"
                          style={{ 
                            color: item.inRetentionPlan ? '#2852E9' : '#8E8E93',
                            backgroundColor: item.inRetentionPlan ? '#F3E7B9' : 'transparent'
                          }}
                          onClick={() => handleToggleRetentionPlan(item.id)}
                          title={item.inRetentionPlan ? 'Remove from retention plan' : 'Add to retention plan'}
                        >
                          {item.inRetentionPlan ? (
                            <Minus className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-lg"
                          style={{ color: '#8E8E93' }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromLibrary(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"
                          title="Remove from library"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAF5D7' }}>
            <Search className="w-10 h-10" style={{ color: '#2852E9' }} />
          </div>
          <h3 style={{ color: '#232323' }}>No items found</h3>
          <p style={{ color: '#8E8E93' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

        </div>

        {/* Retention Overview Sidebar (Right) */}
        <div className="xl:col-span-1 xl:pr-4">
          <div className="sticky top-16">
            <CompactRetentionGraph 
              showAllTopics={true}
              onTopicClick={(topic) => {
                // Find the topic ID and add to filter
                const topicData = topics.find(t => t.name === topic);
                if (topicData) {
                  toggleTopicFilter(topicData.id);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={bulkDeleteItems}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}