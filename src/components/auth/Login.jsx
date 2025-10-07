import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, UserPlus } from 'lucide-react';
import { authService } from '../../services/authService';
import styles from './Login.module.css';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstname: '',
    lastname: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.firstname || !formData.lastname) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await authService.register(formData);
        setError('Registration successful! Please login.');
        setMode('login');
        // Clear form
        setFormData({
          email: '',
          password: '',
          username: '',
          firstname: '',
          lastname: '',
          role: 'admin'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || `${mode === 'login' ? 'Login' : 'Registration'} failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-5 col-lg-4">
            <div className={`card shadow-lg ${styles.loginCard}`}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className={styles.iconWrapper}>
                    {mode === 'login' ? (
                      <LogIn size={48} className={styles.loginIcon} />
                    ) : (
                      <UserPlus size={48} className={styles.loginIcon} />
                    )}
                  </div>
                  <h2 className="fw-bold mt-3">QSolve Admin</h2>
                  <p className="text-muted">
                    {mode === 'login' ? 'Sign in to your account' : 'Create your admin account'}
                  </p>
                </div>

                <div className="d-flex justify-content-center mb-3">
                  <button
                    type="button"
                    className={`btn me-2 ${mode === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setMode('login')}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setMode('register')}
                  >
                    Register
                  </button>
                </div>

                {error && (
                  <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {mode === 'register' && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="firstname" className="form-label">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="lastname" className="form-label">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {mode === 'login' ? 'Signing in...' : 'Registering...'}
                      </>
                    ) : (
                      mode === 'login' ? 'Sign In' : 'Register'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;