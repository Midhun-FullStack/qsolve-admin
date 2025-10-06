import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionBankService } from '../../services/questionBankService';
import DataTable from '../common/DataTable';
import QuestionBankForm from './QuestionBankForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import styles from './QuestionBankList.module.css';

const QuestionBankList = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedQB, setSelectedQB] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [qbToDelete, setQBToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: questionBanks = [], isLoading } = useQuery({
    queryKey: ['questionBanks'],
    queryFn: questionBankService.getAllQuestionBanks,
  });

  const deleteMutation = useMutation({
    mutationFn: questionBankService.deleteQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries(['questionBanks']);
    },
  });

  const handleEdit = (qb) => {
    setSelectedQB(qb);
    setShowForm(true);
  };

  const handleDelete = (qb) => {
    setQBToDelete(qb);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (qbToDelete) {
      deleteMutation.mutate(qbToDelete._id);
    }
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
          {row.description}
        </span>
      ),
    },
    {
      key: 'semesterID',
      label: 'Semester',
      render: (row) => row.semesterID?.semester || 'N/A',
    },
    {
      key: 'subjectID',
      label: 'Subject',
      render: (row) => row.subjectID?.subject || 'N/A',
    },
    {
      key: 'fileUrl',
      label: 'File',
      render: (row) => (
        row.fileUrl ? (
          <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info">
            <ExternalLink size={14} />
          </a>
        ) : 'No file'
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
    <div className={styles.questionBankList}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Question Banks Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedQB(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Add Question Bank
        </button>
      </div>

      <DataTable columns={columns} data={questionBanks} />

      {showForm && (
        <QuestionBankForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedQB(null);
          }}
          questionBank={selectedQB}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Question Bank"
        message={`Are you sure you want to delete ${qbToDelete?.title}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default QuestionBankList;