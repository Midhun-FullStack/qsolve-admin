import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  return (
    <div className={`card ${styles.statCard}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{title}</p>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`${styles.iconWrapper} bg-${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;