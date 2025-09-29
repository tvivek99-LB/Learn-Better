import React from 'react';
import { 
  Library, 
  Sprout, 
  Vault, 
  Plus, 
  BookOpen, 
  Brain,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';


interface QuickActionCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count?: number;
  action: string;
  color: string;
  image?: string;
}

const quickActions: QuickActionCard[] = [
  {
    id: 'library',
    title: 'My Library',
    description: 'Browse and manage all your uploaded articles and resources',
    icon: <Library className="h-6 w-6" />,
    count: 47,
    action: 'Browse Library',
    color: 'bg-blue-500/10 text-blue-600',
    image: 'https://images.unsplash.com/photo-1708591835196-1123f3689e85?w=400'
  },
  {
    id: 'garden',
    title: 'Learning Garden',
    description: 'Cultivate your knowledge and track your learning journey',
    icon: <Sprout className="h-6 w-6" />,
    count: 12,
    action: 'Visit Garden',
    color: 'bg-green-500/10 text-green-600',
    image: 'https://images.unsplash.com/photo-1601144683155-8b6047a83755?w=400'
  },
  {
    id: 'vault',
    title: 'Concept Vault',
    description: 'Access your stored concepts, notes, and key insights',
    icon: <Vault className="h-6 w-6" />,
    count: 134,
    action: 'Open Vault',
    color: 'bg-purple-500/10 text-purple-600',
    image: 'https://images.unsplash.com/photo-1741795821804-451ccc87aec8?w=400'
  }
];

interface QuickActionsProps {
  onNavigateToLibrary: () => void;
  onNavigateToGarden?: () => void;
}

export function QuickActions({ onNavigateToLibrary, onNavigateToGarden }: QuickActionsProps) {
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'library':
        onNavigateToLibrary();
        break;
      case 'garden':
        onNavigateToGarden?.();
        break;
      case 'vault':
        // TODO: Navigate to concept vault
        console.log('Navigate to concept vault');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Quick Actions</h2>
        <p className="text-muted-foreground mt-1">
          Jump into your learning activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {quickActions.map((action) => (
          <Card key={action.id} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200/60 hover:border-primary/20 rounded-2xl bg-white/80 backdrop-blur-sm" onClick={() => handleActionClick(action.id)}>
            {action.image && (
              <div className="aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={action.image}
                  alt={action.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${action.color}`}>
                  {action.icon}
                </div>
                {action.count && (
                  <Badge className="text-xs bg-primary/10 text-primary border-primary/20 rounded-lg">
                    {action.count} items
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="mb-6 text-base">
                {action.description}
              </CardDescription>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors rounded-xl border-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(action.id);
                }}
              >
                <span>{action.action}</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span>Recent Learning Activity</span>
          </CardTitle>
          <CardDescription className="text-base">
            Your latest interactions and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: 'article',
                title: 'Added "Design Systems at Scale" to your library',
                time: '2 hours ago',
                icon: <FileText className="h-5 w-5" />
              },
              {
                type: 'concept',
                title: 'Saved 3 new concepts from "Leadership Principles"',
                time: '1 day ago',
                icon: <Brain className="h-5 w-5" />
              },
              {
                type: 'garden',
                title: 'Completed learning path: "Product Strategy Fundamentals"',
                time: '3 days ago',
                icon: <Sprout className="h-5 w-5" />
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50/80 transition-colors">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}