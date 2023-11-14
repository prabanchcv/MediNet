import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import './otp.css';

Otp.propTypes = {
  value: PropTypes.string,
};

function Otp({ value }) {
  const { email } = useParams();
  const history = useNavigate();
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60); // Set the initial countdown time in seconds

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(otp) < 1000 || parseInt(otp) > 9999 || !parseInt(otp)) {
      setErrorMsg('Invalid OTP');
      return;
    }

    const response = await axios.post(
      value === 'doctor'
        ? import.meta.env.VITE_BASE_URL + `doctor/verify/${email}`
        : import.meta.env.VITE_BASE_URL + `verify/${email}`,
      { otp: parseInt(otp) }
    );

    if (response.data === 'verified') {
      if (value === 'doctor') {
        history('/doctor/login');
      } else {
        history('/login');
      }
    } else {
      setErrorMsg('Invalid OTP');
    }
  };

const handleResendOtp = async (e) => {
  try {
    e.preventDefault();
    // Make an API call to resend the OTP
    const response = await axios.patch(import.meta.env.VITE_BASE_URL + `resendOtp/${email}`);
    console.log(response);
    if (response.data.message === 'OTP resent successfully') {
      // OTP was successfully resent, update your client UI or show a success message

      
      // After resending, set the countdown timer
      setCountdown(60); // Set the timer back to the initial countdown time
      setResendDisabled(true); // Disable the Resend button temporarily

      // Start the countdown timer
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setResendDisabled(false); // Enable the Resend button
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } else {
      // Handle the case where OTP resend was not successful (e.g., display an error message)
      console.error('OTP resend failed:', response.data.message);
    }
  } catch (error) {
    console.error('Error resending OTP:', error);
    // Handle any errors here
  }
};


  useEffect(() => {
    if (countdown === 0) {
      setResendDisabled(false); // Enable the Resend button when the timer reaches 0
    }
  }, [countdown]);

  return (
    <div className="otp mt-5">
      <p>An OTP has been sent to your mail. Please check the mail.</p>
      <form action="" className="form" style={{ width: '100px' }}>
        <label htmlFor="otp">Enter OTP</label>
        {errorMsg ? (
          <div className="mt-1 alert alert-danger text-10" role="alert">
            {errorMsg}
          </div>
        ) : (
          ''
        )}
        <input
          type="number"
          value={otp}
          max={9999}
          min={1000}
          onChange={(e) => setOtp(e.target.value)}
          className="form-control"
        />
          <br />
        
         <button
          className="btn btn-secondary"
          onClick={handleResendOtp}
          disabled={resendDisabled}
        >
          Resend OTP {resendDisabled ? `(${countdown})` : ''}
        </button>
        <br />
        <br />
        <button className="btn btn-success" onClick={handleSubmit}>
          Verify
        </button>
      
        
       
      </form>
    </div>
  );
}

export default Otp;
