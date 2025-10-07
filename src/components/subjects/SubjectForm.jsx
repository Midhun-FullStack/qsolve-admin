import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../../services/subjectService';
import Modal from '../common/Modal';
import { BookOpen, AlertCircle } from 'lucide-react';

const SubjectForm = ({ isOpen, onClose, subject }) => {
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (subject) {
      setSubjectName(subject.subject || '');
    } else {
      setSubjectName('');
    }
    setError('');
  }, [subject, isOpen]);

  const createMutation = useMutation({
    mutationFn: subjectService.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => subjectService.updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      setError('Subject name is required');
      return;
    }

    if (subjectName.trim().length < 2) {
      setError('Subject name must be at least 2 characters');
      return;
    }

    setError('');

    if (subject) {
      updateMutation.mutate({ id: subject._id, data: { subject: subjectName.trim() } });
    } else {
      createMutation.mutate({ subject: subjectName.trim() });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subject ? 'Edit Subject' : 'Add New Subject'}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject Name *
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <BookOpen size={16} />
            </span>
            <input
              type="text"
              className={`form-control ${error ? 'is-invalid' : ''}`}
              id="subject"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                if (error) setError('');
              }}
              onBlur={() => {
                if (!subjectName.trim()) {
                  setError('Subject name is required');
                } else if (subjectName.trim().length < 2) {
                  setError('Subject name must be at least 2 characters');
                }
              }}
              required
            />
            {error && (
              <div className="invalid-feedback d-flex align-items-center">
                <AlertCircle size={14} className="me-1" />
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              subject ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubjectForm;