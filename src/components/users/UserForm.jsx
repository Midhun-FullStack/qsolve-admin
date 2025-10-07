import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import Modal from '../common/Modal';
import { USER_ROLES } from '../../utils/constants';
import { User, Mail, Lock, UserCheck, Shield, AlertCircle } from 'lucide-react';

const UserForm = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    role: USER_ROLES.STUDENT,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        role: user.role || USER_ROLES.STUDENT,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        role: USER_ROLES.STUDENT,
      });
    }
    setErrors({});
    setTouched({});
  }, [user, isOpen]);

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      onClose();
    },
  });

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!user && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (user) {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateMutation.mutate({ id: user._id, data: updateData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <User size={16} />
              </span>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.username && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={14} className="me-1" />
                  {errors.username}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.email && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={14} className="me-1" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="firstname" className="form-label">
              First Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <UserCheck size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="lastname" className="form-label">
              Last Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <UserCheck size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              Password {!user && '*'}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={16} />
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required={!user}
              />
              {errors.password && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={14} className="me-1" />
                  {errors.password}
                </div>
              )}
            </div>
            {user && (
              <small className="text-muted">Leave blank to keep current password</small>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="role" className="form-label">
              Role *
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Shield size={16} />
              </span>
              <select
                className="form-select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value={USER_ROLES.STUDENT}>Student</option>
                <option value={USER_ROLES.STAFF}>Staff</option>
                <option value={USER_ROLES.OTHER}>Other</option>
                <option value={USER_ROLES.ADMIN}>Admin</option>
              </select>
            </div>
          </div>
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
              user ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserForm;