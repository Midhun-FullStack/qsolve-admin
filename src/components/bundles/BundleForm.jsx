import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bundleService } from '../../services/bundleService';
import { departmentService } from '../../services/departmentService';
import { questionBankService } from '../../services/questionBankService';
import Modal from '../common/Modal';

const BundleForm = ({ isOpen, onClose, bundle }) => {
  const [formData, setFormData] = useState({
    title: '',
    departmentID: '',
    price: '',
    products: [],
  });
  // ... no file helpers; bundles reference question bank IDs only
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAllDepartments,
  });

  const { data: questionBanks = [] } = useQuery({
    queryKey: ['questionBanks'],
    queryFn: questionBankService.getAllQuestionBanks,
  });

  useEffect(() => {
    if (bundle) {
      setFormData({
        title: bundle.title || '',
        departmentID: bundle.departmentID?._id || bundle.departmentID || '',
        price: bundle.price || '',
        products: bundle.products?.map(p => p._id || p) || [],
      });
    }
  }, [bundle]);

  const createMutation = useMutation({
    mutationFn: bundleService.createBundle,
    onSuccess: () => {
      queryClient.invalidateQueries(['bundles']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => bundleService.updateBundle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['bundles']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Bundles only reference existing QuestionBanks (products). Send JSON payload.
    const submitData = {
      title: formData.title,
      departmentID: formData.departmentID,
      price: Number(formData.price),
      products: formData.products,
    };

    if (bundle) {
      updateMutation.mutate({ id: bundle._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter(id => id !== productId)
        : [...prev.products, productId],
    }));
  };

  // Removed file handling functions as bundles should only reference existing QuestionBanks

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bundle ? 'Edit Bundle' : 'Add New Bundle'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              className="form-control bg-white text-dark"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="departmentID" className="form-label">
              Department *
            </label>
            <select
              className="form-select bg-white text-dark"
              id="departmentID"
              name="departmentID"
              value={formData.departmentID}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.department}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="price" className="form-label">
              Price *
            </label>
            <input
              type="number"
              className="form-control bg-white text-dark"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Select Question Banks *</label>
            <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {questionBanks.length === 0 ? (
                <p className="text-muted mb-0">No question banks available</p>
              ) : (
                questionBanks.map((qb) => (
                  <div key={qb._id} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`qb-${qb._id}`}
                      checked={formData.products.includes(qb._id)}
                      onChange={() => handleProductToggle(qb._id)}
                    />
                    <label className="form-check-label" htmlFor={`qb-${qb._id}`}>
                      {qb.title} - {qb.subjectID?.subject || 'N/A'}
                    </label>
                  </div>
                ))
              )}
            </div>
            <small className="text-muted">
              Selected: {formData.products.length} item(s)
            </small>
          </div>

          {/* Files are uploaded as QuestionBanks in the QuestionBank section.
              Bundles should only reference those QuestionBanks (products).
              The file-upload UI was intentionally removed to avoid confusion. */}
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
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
              bundle ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BundleForm;