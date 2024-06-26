import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../AuthSlice';

  const baseUrl = process.env.REACT_APP_BASE_URL;
  // const token = localStorage.getItem('token');

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.user && data.token) {
        console.log('Login successful:', data.user);
        setErrorMessage('');

        // Dispatch login action to update Redux state
        dispatch(login({
          username: data.user.username,
          fullname: data.user.fullname,
          sessionKey: data.user.id,
          role: data.user.role,
          email: data.user.email,
        }));

        // Store token in Redux state
        localStorage.setItem('token', data.token);

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message); // Set error message from response
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login');
    }
  };
  

  return (
    <div className="container-fluid" style={{ height: '90vh' }}>
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary col-12 mt-4" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default Login;
