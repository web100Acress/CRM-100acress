import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [credentials, setCredentials] = useState({ username: '', password: '' });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');


    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok && data.token) {
        // Store user session data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
        window.location.reload();
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');

    const user = users[credentials.username.toLowerCase()];
    if (user && user.password === credentials.password) {
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
      window.location.reload();
    } else {
      setError('Invalid username or password');

    }
    setIsLoading(false);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800">100acres.com</CardTitle>
          <p className="text-sm text-gray-600 mt-2">CRM Login Portal</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder   ="Enter email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                required
                className="focus:ring-green-500 focus:border-green-500"
              />

    <>
      <div className="login-container">
        {/* LEFT RED SIDE */}
        <div className="login-left"></div>

        {/* RIGHT LOGIN FORM SIDE */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <img src="https://avatars.githubusercontent.com/u/158815978?v=4" alt="100acres Logo" className="logo" />
              {/* <h2 className="title">100acres.com</h2> */}
              <p className="subtitle">CRM Login Portal</p>

            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>

              
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 transition-colors" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>


              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="submit-btn"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="test-credentials">
              <p><strong>Test Credentials:</strong></p>
              <p><strong>Super Admin:</strong> superadmin / super123</p>
              <p><strong>Head Admin:</strong> headadmin / head123</p>
              <p><strong>Team Leader:</strong> teamleader / tl123</p>
              <p><strong>Employee:</strong> employee / emp123</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CSS at the bottom */}
      <style>{`
        .login-container {
          display: flex;
          min-height: 100vh;
        }

        .login-left {
          flex: 1;
          background-color: #dc2626; /* red-600 */
        }

        .login-right {
          flex: 1;
          background-color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0rem;
          
        }

        .login-card {
          width: 110%;
          height: 100%;
          
          max-height: 100%;
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 0.5rem;
        }

        .title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #065f46; /* green-700 */
        }

        .subtitle {
          font-size: 0.875rem;
          color: #6b7280; /* gray-500 */
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          color: #374151; /* gray-700 */
        }

        .form-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .password-wrapper {
          position: relative;
        }

        .eye-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .submit-btn {
          width: 100%;
          background-color: #16a34a;
          color: white;
          font-weight: bold;
          padding: 0.5rem 0;
          border-radius: 0.375rem;
          transition: 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .submit-btn:hover {
          background-color: #15803d;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .submit-btn:active {
          transform: scale(0.97);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          padding: 0.5rem;
          border-radius: 0.375rem;
          color: #b91c1c;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .test-credentials {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #047857; /* green-700 */
        }

        .test-credentials p {
          margin: 0.2rem 0;
        }
      `}</style>
    </>

  );
};

export default Login;
