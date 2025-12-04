'use client';

import { Chatbot } from '@/types/ai/chat';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { ChatbotDialog } from './chatbot-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteChatbot } from '@/app/actions/chatbots';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ChatbotsTableProps {
  initialChatbots: Chatbot[];
}

export default function ChatbotsTable({ initialChatbots }: ChatbotsTableProps) {
  const [chatbots] = useState<Chatbot[]>(initialChatbots);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatbotToDelete, setChatbotToDelete] = useState<Chatbot | null>(null);

  const handleEdit = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setDialogOpen(true);
  };

  const handleDeleteClick = (chatbot: Chatbot) => {
    setChatbotToDelete(chatbot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chatbotToDelete) return;

    try {
      await deleteChatbot(chatbotToDelete.id);
      toast.success('Chatbot deleted successfully');
      setDeleteDialogOpen(false);
      setChatbotToDelete(null);
    } catch (error) {
      toast.error('Failed to delete chatbot');
      console.error(error);
    }
  };

  const handleAdd = () => {
    setSelectedChatbot(null);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <Plus />
          Add Chatbot
        </Button>
      </div>

      <DataTable
        columns={columns({ onEdit: handleEdit, onDelete: handleDeleteClick })}
        data={chatbots}
      />

      <ChatbotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        chatbot={selectedChatbot}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              chatbot &quot;{chatbotToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
