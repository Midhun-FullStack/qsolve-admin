import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../../services/subjectService';
import DataTable from '../common/DataTable';
import SubjectForm from './SubjectForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from './SubjectList.module.css';

const SubjectList = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAllSubjects,
  });

  const deleteMutation = useMutation({
    mutationFn: subjectService.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
    },
  });

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setShowForm(true);
  };

  const handleDelete = (subject) => {
    setSubjectToDelete(subject);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      deleteMutation.mutate(subjectToDelete._id);
    }
  };

  const columns = [
    { key: 'subject', label: 'Subject Name', sortable: true },
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
    <div className={styles.subjectList}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Subjects Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedSubject(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Add Subject
        </button>
      </div>

      <DataTable columns={columns} data={subjects} />

      {showForm && (
        <SubjectForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedSubject(null);
          }}
          subject={selectedSubject}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete ${subjectToDelete?.subject}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default SubjectList;