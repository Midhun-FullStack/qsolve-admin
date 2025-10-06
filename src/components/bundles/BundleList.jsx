import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bundleService } from '../../services/bundleService';
import DataTable from '../common/DataTable';
import BundleForm from './BundleForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import styles from './BundleList.module.css';

const BundleList = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: bundles = [], isLoading } = useQuery({
    queryKey: ['bundles'],
    queryFn: bundleService.getAllBundles,
  });

  const deleteMutation = useMutation({
    mutationFn: bundleService.deleteBundle,
    onSuccess: () => {
      queryClient.invalidateQueries(['bundles']);
    },
  });

  const handleEdit = (bundle) => {
    setSelectedBundle(bundle);
    setShowForm(true);
  };

  const handleDelete = (bundle) => {
    setBundleToDelete(bundle);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (bundleToDelete) {
      deleteMutation.mutate(bundleToDelete._id);
    }
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'departmentID',
      label: 'Department',
      render: (row) => row.departmentID?.department || 'N/A',
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => formatCurrency(row.price),
    },
    {
      key: 'products',
      label: 'Items',
      render: (row) => (
        <span className="badge bg-info">
          {row.products?.length || 0} items
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Edit size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bundleList}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bundles Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedBundle(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Add Bundle
        </button>
      </div>

      <DataTable columns={columns} data={bundles} />

      {showForm && (
        <BundleForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedBundle(null);
          }}
          bundle={selectedBundle}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Bundle"
        message={`Are you sure you want to delete ${bundleToDelete?.title}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default BundleList;