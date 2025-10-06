import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { bundleService } from '../../services/bundleService';
import { questionBankService } from '../../services/questionBankService';
import { purchaseService } from '../../services/purchaseService';
import StatCard from './StatCard';
import { Users, Package, FileText, CreditCard } from 'lucide-react';
import styles from './DashboardHome.module.css';

const DashboardHome = () => {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });

  const { data: bundles = [] } = useQuery({
    queryKey: ['bundles'],
    queryFn: bundleService.getAllBundles,
  });

  const { data: questionBanks = [] } = useQuery({
    queryKey: ['questionBanks'],
    queryFn: questionBankService.getAllQuestionBanks,
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: purchaseService.getAllPurchases,
  });

  // Ensure all data is arrays
  const usersArray = Array.isArray(users) ? users : [];
  const bundlesArray = Array.isArray(bundles) ? bundles : [];
  const questionBanksArray = Array.isArray(questionBanks) ? questionBanks : [];
  const purchasesArray = Array.isArray(purchases) ? purchases : [];

  const completedPurchases = purchasesArray.filter(p => p.paymentDone).length;

  return (
    <div className={styles.dashboard}>
      <h2 className="mb-4">Dashboard Overview</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Total Users"
            value={usersArray.length}
            icon={Users}
            color="primary"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Question Banks"
            value={questionBanksArray.length}
            icon={FileText}
            color="success"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Bundles"
            value={bundlesArray.length}
            icon={Package}
            color="warning"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Completed Purchases"
            value={completedPurchases}
            icon={CreditCard}
            color="info"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Users</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {usersArray.slice(0, 5).map((user) => (
                  <div key={user._id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{user.username}</h6>
                        <small className="text-muted">{user.email}</small>
                      </div>
                      <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Bundles</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {bundlesArray.slice(0, 5).map((bundle) => (
                  <div key={bundle._id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{bundle.title}</h6>
                        <small className="text-muted">
                          {bundle.products?.length || 0} items
                        </small>
                      </div>
                      <span className="badge bg-success">
                        ${bundle.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;