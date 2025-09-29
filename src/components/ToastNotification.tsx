import React, { useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { FileText, Link, File, CheckCircle2 } from 'lucide-react';

interface ToastNotificationProps {
  show: boolean;
  type: 'file' | 'url' | 'text';
  title: string;
  count?: number;
}

export function useExtensionNotifications() {
  // Simulate browser extension sending content
  useEffect(() => {
    const simulateExtensionContent = () => {
      const contentTypes = ['file', 'url', 'text'] as const;
      const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      const notifications = {
        file: {
          title: 'PDF imported from browser',
          description: '"React Performance Guide" added to inventory',
          icon: <File className="h-4 w-4" />
        },
        url: {
          title: 'Article saved from browser',
          description: '"10 UX Design Principles" added to inventory',
          icon: <Link className="h-4 w-4" />
        },
        text: {
          title: 'Text copied from browser',
          description: 'Selected text saved to inventory',
          icon: <FileText className="h-4 w-4" />
        }
      };

      const notification = notifications[randomType];
      
      toast.success(notification.title, {
        description: notification.description,
        icon: notification.icon,
        action: {
          label: 'View',
          onClick: () => console.log('Navigate to inventory')
        },
        duration: 5000,
        className: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-100'
      });
    };

    // Simulate extension content every 30 seconds for demo
    const interval = setInterval(simulateExtensionContent, 30000);
    
    // Show initial notification after 5 seconds
    const timeout = setTimeout(simulateExtensionContent, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const showBulkImportNotification = (count: number) => {
    toast.success(`${count} items imported`, {
      description: `Browser extension added ${count} new items to your inventory`,
      icon: <CheckCircle2 className="h-4 w-4" />,
      action: {
        label: 'View All',
        onClick: () => console.log('Navigate to inventory')
      },
      duration: 8000,
      className: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100'
    });
  };

  return { showBulkImportNotification };
}