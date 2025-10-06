import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../common/DataTable';
import UserForm from './UserForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatRole } from '../../utils/formatters';
import styles from './UserList.module.css';

const UserList = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showToast('User deleted successfully', 'success');
    },
    onError: () => {
      showToast('Failed to delete user', 'error');
    },
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete._id);
    }
  };

  const columns = [
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'firstname',
      label: 'First Name',
      render: (row) => row.firstname || 'N/A',
    },
    {
      key: 'lastname',
      label: 'Last Name',
      render: (row) => row.lastname || 'N/A',
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => (
        <span className={`badge bg-${row.role === 'admin' ? 'danger' : 'primary'}`}>
          {formatRole(row.role)}
        </span>
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
    <div className={styles.userList}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Add User
        </button>
      </div>

      <DataTable columns={columns} data={users} />

      {showForm && (
        <UserForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.username}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default UserList;