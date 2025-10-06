import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../../services/subjectService';
import Modal from '../common/Modal';

const SubjectForm = ({ isOpen, onClose, subject }) => {
  const [subjectName, setSubjectName] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (subject) {
      setSubjectName(subject.subject || '');
    }
  }, [subject]);

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
    
    if (subject) {
      updateMutation.mutate({ id: subject._id, data: { subject: subjectName } });
    } else {
      createMutation.mutate({ subject: subjectName });
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
          <input
            type="text"
            className="form-control"
            id="subject"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
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