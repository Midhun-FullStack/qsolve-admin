import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Building2,
  FileText,
  Package,
  CreditCard,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/subjects', icon: BookOpen, label: 'Subjects' },
    { path: '/semesters', icon: Calendar, label: 'Semesters' },
    { path: '/departments', icon: Building2, label: 'Departments' },
    { path: '/question-banks', icon: FileText, label: 'Question Banks' },
    { path: '/bundles', icon: Package, label: 'Bundles' },
    { path: '/purchases', icon: CreditCard, label: 'Purchases' },
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarContent}>
        <nav className="nav flex-column">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <Icon size={20} className="me-3" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;