import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import DashboardHome from './components/dashboard/DashboardHome';
import UserList from './components/users/UserList';
import SubjectList from './components/subjects/SubjectList';
import SemesterList from './components/semesters/SemesterList';
import DepartmentList from './components/departments/DepartmentList';
import QuestionBankList from './components/questionbanks/QuestionBankList';
import BundleList from './components/bundles/BundleList';
import PurchaseList from './components/purchases/PurchaseList';
import styles from './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
});

const PreviewLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.appContainer}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className={styles.mainContainer}>
        <Sidebar isOpen={sidebarOpen} />
        <main className={`${styles.content} ${sidebarOpen ? styles.contentShifted : ''}`}>
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/semesters" element={<SemesterList />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/question-banks" element={<QuestionBankList />} />
            <Route path="/bundles" element={<BundleList />} />
            <Route path="/purchases" element={<PurchaseList />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function AppPreview() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<ProtectedRoute><PreviewLayout /></ProtectedRoute>} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default AppPreview;