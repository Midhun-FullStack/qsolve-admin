import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionBankService } from '../../services/questionBankService';
import { subjectService } from '../../services/subjectService';
import { semesterService } from '../../services/semesterService';
import Modal from '../common/Modal';

const QuestionBankForm = ({ isOpen, onClose, questionBank }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    semesterID: '',
    subjectID: '',
    fileUrl: '',
  });
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAllSubjects,
  });

  const { data: semesters = [] } = useQuery({
    queryKey: ['semesters'],
    queryFn: semesterService.getAllSemesters,
  });

  useEffect(() => {
    if (questionBank) {
      setFormData({
        title: questionBank.title || '',
        description: questionBank.description || '',
        semesterID: questionBank.semesterID?._id || questionBank.semesterID || '',
        subjectID: questionBank.subjectID?._id || questionBank.subjectID || '',
        fileUrl: questionBank.fileUrl || '',
      });
    }
  }, [questionBank]);

  const createMutation = useMutation({
    mutationFn: questionBankService.createQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries(['questionBanks']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => questionBankService.updateQuestionBank(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['questionBanks']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('semesterID', formData.semesterID);
    submitData.append('subjectID', formData.subjectID);
    
    if (file) {
      submitData.append('file', file);
    } else if (!questionBank) {
      submitData.append('fileUrl', formData.fileUrl);
    }

    if (questionBank) {
      updateMutation.mutate({ id: questionBank._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={questionBank ? 'Edit Question Bank' : 'Add New Question Bank'}
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
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="col-md-6">
            <label htmlFor="semesterID" className="form-label">
              Semester *
            </label>
            <select
              className="form-select"
              id="semesterID"
              name="semesterID"
              value={formData.semesterID}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester._id} value={semester._id}>
                  {semester.semester}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="subjectID" className="form-label">
              Subject *
            </label>
            <select
              className="form-select"
              id="subjectID"
              name="subjectID"
              value={formData.subjectID}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="file" className="form-label">
              Upload File {!questionBank && '*'}
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
            />
            {questionBank && (
              <small className="text-muted">Leave blank to keep current file</small>
            )}
          </div>

          {!questionBank && !file && (
            <div className="col-12">
              <label htmlFor="fileUrl" className="form-label">
                Or Enter File URL
              </label>
              <input
                type="url"
                className="form-control"
                id="fileUrl"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                placeholder="https://example.com/file.pdf"
              />
            </div>
          )}
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
              questionBank ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuestionBankForm;