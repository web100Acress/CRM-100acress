
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/layout/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/layout/alert-dialog';

const DeleteUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete <strong>{user.name}</strong>?
            <br />
            <span className="text-sm text-gray-500">{user.email}</span>
            <br /><br />
            This action cannot be undone. All data associated with this user will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <AlertDialogCancel className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete User
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;