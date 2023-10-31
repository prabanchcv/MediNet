import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'
import './Signup.css'
import { validateEmail, validateMobileNumber, validatePassword } from './validator';
import axios from 'axios'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config"
Signup.propTypes = {
    value: PropTypes.string
}
function Signup({ value }) {
    const provider = new GoogleAuthProvider()
    const history = useNavigate()
    const [Name, setUserName] = useState('');
    const [Email, setEmail] = useState('');
    const [Age, setAge] = useState(1);
    const [Mobile, setMobile] = useState('');
    const [Password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('')
    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
        const images = e.target.files;
        setSelectedImages((prevImages) => {
            const newImages = [...prevImages, ...Array.from(images)];
            console.log('Selected Images:', newImages);
            return newImages;
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Name || !Email || !Mobile || !Age || !Password) {
            setErrorMsg('Please fill all the blanks...!')
            return
        } else {

            if (!validateEmail(Email)) {
                setErrorMsg('Invalid Email id,Please enter valid email id...!')
                return;
            }

            if (!validateMobileNumber(Mobile)) {
                setErrorMsg("Mobile number can only have 10 digits,Please enter valid mobile number...!")
                return;
            }

            if (!validatePassword(Password)) {
                setErrorMsg('Password should have a capital letter,symbol,number and atleast have 6 charectors...!')
                return
            }

            if (Password != cPassword) {
                setErrorMsg("Passwords are not matching,Please try again...!")
                return;
            }

            if (Age <= 1 || Age > 120) {
                setErrorMsg('Please enter valid age...!')
                return
            }

               // Create a new FormData object
               const formData = new FormData();

               if (selectedImages.length > 0) {
                   // Append each selected image to the formData
                 for (let i = 0; i < selectedImages.length; i++) {
                formData.append('images', selectedImages[i]);
            }
               }
   
               // Add other form fields to the formData
               formData.append('Name', Name);
               formData.append('Email', Email);
               formData.append('Age', Age);
               formData.append('Mobile', Mobile);
               formData.append('Password', Password);
   

            value == 'doctor' ?
                await axios.post(import.meta.env.VITE_BASE_URL + 'doctor/signup',formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data', // Important to set this header for file uploads
                    },
                }
                ).then(res => {
                    if (res.data.message === 'Check mail') history(`/doctor/verify/${res.data.email}`)
                    else setErrorMsg(res.data)
                })
                :
                await axios.post(import.meta.env.VITE_BASE_URL + 'signup', {
                    Name,
                    Email,
                    Age,
                    Mobile,
                    Password
                }).then(res => {
                    if (res.data.message === 'Check mail') history(`/verify/${res.data.email}`)
                    else setErrorMsg(res.data)
                })
        }
    }

    const submitSignUpWithGoogle = async (displayName, email) => {
        try {
          const value = { displayName, email };
        const response =  await axios.post(import.meta.env.VITE_BASE_URL + 'google/signup', value);
          if (response.status === 201) {
            // Registration successful, navigate to the login route
            history('/login');
          }
          
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error;
            if (axiosError.response) {
              setErrorMsg(axiosError.response.data.error);
            } else {
              setErrorMsg('Network Error occurred.');
            }
          }
        }
      };
      


    const signUpWithGoogle = () => {
       
        signInWithPopup(auth, provider)
          .then((result) => {
            const { displayName, email } = result.user;
      
            if (displayName && email) {
              submitSignUpWithGoogle(displayName, email);
            }
          })
          .catch((error) => {
            setErrorMsg(error.message);
          });
      };
      



    return (
        <section className="logForm m-5 ">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 text-center  col-lg-6 col-xl-5">
                        <h1>SIGNUP</h1>
                        <img src="/derek-finch-bD1bK7IUvd8-unsplash.jpg"
                            className="img-fluid logimg mb-3" alt="Sample image" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                 {  value!=='admin' && value!=='doctor' &&  <div className="text-center"> {/* Add "text-center" class to center-align its children */}
                    <button className="form-outline mb-4" onClick={signUpWithGoogle}>
                        <img src="/googlelogo.png" alt="" style={{ width: '20px' }} /> Signup with Google
                    </button>
                    <div className="form-outline mb-4">OR </div>
                    </div>}

                        
                            
                        <form>
                            {errorMsg ?
                                <div className="alert alert-danger" role="alert">
                                    {errorMsg}
                                </div> : ''
                            }
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form3Example3">Name</label>
                                <input type="text" id="form3Example3" value={Name} onChange={(e) => setUserName(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Name..." required />
                            </div>
                            
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form3Example3">Email address</label>
                                <input type="email" id="form3Example3" value={Email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Email address..." required />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form3Example3">Age</label>
                                <input type="number" id="form3Example3" max={120} min={1} value={Age} onChange={(e) => setAge(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Age..." required />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form3Example3">Mobile</label>
                                <input type="tel" id="form3Example3" value={Mobile} onChange={(e) => setMobile(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Mobile..." required />
                            </div>

                            <div className="form-outline mb-3">
                                <label className="form-label" htmlFor="form3Example4">Password</label>
                                <input type="password" id="form3Example4" value={Password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Enter password..." required />
                            </div>
                            <div className="form-outline mb-3">
                                <label className="form-label" htmlFor="form3Example4">Confirm Password</label>
                                <input type="password" id="form3Example4" value={cPassword} onChange={(e) => setCPassword(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Confirm" required />
                            </div>
                           { value=='doctor' && <div className="form-outline mb-3">
                            <input type="file" name="images"  multiple onChange={handleImageChange} />
                            <br />
                            <div className='d-flex flex-wrap horizontal-scroll-container'>


                                <div className='horizontal-scroll-content flex-raw d-flex'>
                                    {selectedImages ? selectedImages.map((doc, index) => (

                                        <div key={0 - index} className='d-flex flex-column'>
                                            <img key={index}
                                                className='me-2 mt-2'
                                                width={'100px'}
                                                height={'80px'}
                                                src={URL.createObjectURL(doc)} 
                                                alt=''
                                            />
                                           

                                        </div>
                                    ))
                                        : "Ooopsie..!No data found."
                                    }

                                </div>
                            </div>
                            </div>}
                           

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button type="button" className="btn btn-success btn-lg"
                                    style={{ "paddingLeft": " 2.5rem", "paddingRight": "2.5rem" }} onClick={handleSubmit}>Signup</button>
                                <p className="small fw-bold mt-2 pt-1 mb-0"> Already have an account? <span className='text-primary'> <Link to={'/login'}>Login</Link> </span> </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Signup