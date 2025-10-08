import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../../services/semesterService';
import Modal from '../common/Modal';

const SemesterForm = ({ isOpen, onClose, semester }) => {
  const [semesterName, setSemesterName] = useState('');
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    if (semester) {
      setSemesterName(semester.semester || '');
    }
  }, [semester]);

  const createMutation = useMutation({
    mutationFn: semesterService.createSemester,
    onSuccess: () => {
      queryClient.invalidateQueries(['semesters']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => semesterService.updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['semesters']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (semester) {
      updateMutation.mutate({ id: semester._id, data: { semester: semesterName } });
    } else {
      createMutation.mutate({ semester: semesterName });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={semester ? 'Edit Semester' : 'Add New Semester'}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="semester" className="form-label">
            Semester Name *
          </label>
          <input
            type="text"
            className="form-control bg-white text-dark"
            id="semester"
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
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
              semester ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SemesterForm;