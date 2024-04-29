import { useRef, useState, useEffect } from "react"
import './css/login.css'
import './css/toast.css'
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [validation, setValidation] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const switchForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const isEmailValid = formData.email.trim() !== '';
    const isPasswordValid = formData.password.trim() !== '';
    const isFirstNameValid = formData.firstName.trim() !== '';
    const isLastNameValid = formData.lastName.trim() !== '';

    setValidation({
      firstName: isFirstNameValid,
      lastName: isLastNameValid,
      email: isEmailValid,
      password: isPasswordValid,
    });

    const baseUrl = "http://localhost:8086/api/v1/users";
    if (!isSignIn && isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid) {
      // Proceed with form submission
      // let url = isSignIn ?  : ;
      let url = baseUrl + '/signUp';

      try {
        const response = await axios.post(url, formData);
        console.log(response.data);
        setIsSignIn(true);
      } catch (error) {
        localStorage.setItem("isLoggedIn", false)
        console.error('Error:', error);

        if (error.response && error.response.status === 409) {
          toast.error("User already exist!");
        }
      

      }
    }else if(isSignIn && isEmailValid && isPasswordValid){
      let url = baseUrl + '/signIn';
      try {
        const response = await axios.post(url, formData);
        console.log(response.data);
        toast.success("Signed In!")
        localStorage.setItem("userId", response.data.id)
        window.location.href = '/';
      } catch (error) {
        localStorage.setItem("isLoggedIn", false)
        console.error('Error:', error);

        if (error.response && error.response.status === 404) {
          toast.error('User not found!');
        }
        else if (error.response && error.response.status === 401) {
          toast.error("Credentials incorrect!", {
            position: "top-right",
            className: 'custom-toast'
          });
        }

      }
    }else{
      toast.error("Invalid input!");
    }
  };

  return (
    <div className="container">
      <Navbar/>
      <div className="form-container">
        <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isSignIn && (
            <div className={`input-group ${!validation.firstName ? 'invalid' : ''}`}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
          )}
          {!isSignIn && (
            <div className={`input-group ${!validation.lastName ? 'invalid' : ''}`}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          )}
          <div className={`input-group ${!validation.email ? 'invalid' : ''}`}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={`input-group ${!validation.password ? 'invalid' : ''}`}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submitBtn">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p onClick={switchForm}>
          {isSignIn ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
        </p>
      </div>
      <ToastContainer />
      <footer className="home-footer">
                <p>&copy; 2024 UzbekReads. All rights reserved.</p>
            </footer>
    </div>
  );

}

export default Login;