import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../../services/semesterService';
import DataTable from '../common/DataTable';
import SemesterForm from './SemesterForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from './SemesterList.module.css';

const SemesterList = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: semesters = [], isLoading } = useQuery({
    queryKey: ['semesters'],
    queryFn: semesterService.getAllSemesters,
  });

  const deleteMutation = useMutation({
    mutationFn: semesterService.deleteSemester,
    onSuccess: () => {
      queryClient.invalidateQueries(['semesters']);
    },
  });

  const handleEdit = (semester) => {
    setSelectedSemester(semester);
    setShowForm(true);
  };

  const handleDelete = (semester) => {
    setSemesterToDelete(semester);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (semesterToDelete) {
      deleteMutation.mutate(semesterToDelete._id);
    }
  };

  const columns = [
    { key: 'semester', label: 'Semester Name', sortable: true },
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
    <div className={styles.semesterList}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Semesters Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedSemester(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Add Semester
        </button>
      </div>

      <DataTable columns={columns} data={semesters} />

      {showForm && (
        <SemesterForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedSemester(null);
          }}
          semester={selectedSemester}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Semester"
        message={`Are you sure you want to delete ${semesterToDelete?.semester}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default SemesterList;