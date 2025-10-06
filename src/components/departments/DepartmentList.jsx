import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../../services/departmentService';
import DataTable from '../common/DataTable';
import DepartmentForm from './DepartmentForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from './DepartmentList.module.css';

const DepartmentList = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAllDepartments,
  });

  const deleteMutation = useMutation({
    mutationFn: departmentService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
    },
  });

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowForm(true);
  };

  const handleDelete = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteMutation.mutate(departmentToDelete._id);
    }
  };

  const columns = [
    { key: 'department', label: 'Department Name', sortable: true },
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
    <div className={styles.departmentList}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Departments Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedDepartment(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Add Department
        </button>
      </div>

      <DataTable columns={columns} data={departments} />

      {showForm && (
        <DepartmentForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedDepartment(null);
          }}
          department={selectedDepartment}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${departmentToDelete?.department}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default DepartmentList;