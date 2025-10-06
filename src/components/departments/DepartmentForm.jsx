import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../../services/departmentService';
import Modal from '../common/Modal';

const DepartmentForm = ({ isOpen, onClose, department }) => {
  const [departmentName, setDepartmentName] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (department) {
      setDepartmentName(department.department || '');
    }
  }, [department]);

  const createMutation = useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (department) {
      updateMutation.mutate({ id: department._id, data: { department: departmentName } });
    } else {
      createMutation.mutate({ department: departmentName });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={department ? 'Edit Department' : 'Add New Department'}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            Department Name *
          </label>
          <input
            type="text"
            className="form-control"
            id="department"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
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
              department ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DepartmentForm;