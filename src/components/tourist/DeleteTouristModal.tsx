import React from 'react';
import Button from '../common/Button';

interface DeleteTouristModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  touristName: string;
  isDeleting: boolean;
}

const DeleteTouristModal: React.FC<DeleteTouristModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  touristName,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-600">Confirm Deletion</h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete tourist <span className="font-semibold">{touristName}</span>? 
          This action cannot be undone and will also delete all associated travel records.
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Tourist'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTouristModal;