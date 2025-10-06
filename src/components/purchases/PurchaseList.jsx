import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import DataTable from '../common/DataTable';
import { Check, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import styles from './PurchaseList.module.css';

const PurchaseList = () => {
  const queryClient = useQueryClient();

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: purchaseService.getAllPurchases,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => purchaseService.updatePurchaseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchases']);
    },
  });

  const handleToggleStatus = (purchase) => {
    updateStatusMutation.mutate({
      id: purchase._id,
      status: !purchase.paymentDone,
    });
  };

  const columns = [
    {
      key: 'userId',
      label: 'User',
      render: (row) => row.userId?.username || row.userId?.email || 'N/A',
    },
    {
      key: 'bundleId',
      label: 'Bundle',
      render: (row) => row.bundleId?.title || 'N/A',
    },
    {
      key: 'price',
      label: 'Price',
      render: (row) => formatCurrency(row.bundleId?.price),
    },
    {
      key: 'paymentDone',
      label: 'Payment Status',
      sortable: true,
      render: (row) => (
        <span className={`badge bg-${row.paymentDone ? 'success' : 'warning'}`}>
          {row.paymentDone ? 'Completed' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          className={`btn btn-sm ${row.paymentDone ? 'btn-outline-warning' : 'btn-outline-success'}`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(row);
          }}
          disabled={updateStatusMutation.isPending}
        >
          {row.paymentDone ? (
            <>
              <X size={16} className="me-1" />
              Mark Pending
            </>
          ) : (
            <>
              <Check size={16} className="me-1" />
              Mark Completed
            </>
          )}
        </button>
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
    <div className={styles.purchaseList}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Purchases Management</h2>
        <div className="d-flex gap-3">
          <div className="badge bg-success p-2">
            Completed: {purchases.filter(p => p.paymentDone).length}
          </div>
          <div className="badge bg-warning p-2">
            Pending: {purchases.filter(p => !p.paymentDone).length}
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={purchases} />
    </div>
  );
};

export default PurchaseList;