import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSocket } from '../../context/socket/socketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSlot } from '../../redux/consult';
import { useCallback} from 'react'
import { setData } from '../../redux/prescriptionData';
import { format } from 'date-fns';

function Consult() {
    const [consult, setConsult] = useState([]);
    const docToken = localStorage.getItem('doctorToken');
    const socket = useSocket();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const email = useSelector(state => state.doctor.data.email);

    useEffect(() => {
        async function datacall() {
            try {
                const appointData = await axios.get(import.meta.env.VITE_BASE_URL + `doctor/consult`, {
                    headers: {
                        Authorization: `Bearer ${docToken}`
                    }
                });

                // Filter and update the consult data to include the "expired" status
                const updatedConsult = appointData.data.map(el => {
                    const date = new Date();
                    const formattedDate = format(date, 'dd-MM-yyyy');
                    console.log(formattedDate)
                // Format the time
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const period = hours >= 12 ? 'PM' : 'AM';

                    // Convert hours to 12-hour format
                    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

                    // Pad minutes with leading zeros
                    const formattedMinutes = minutes.toString().padStart(2, '0');

                    const currentTime = `${formattedHours}.${formattedMinutes} ${period}`;
                    // Compare the indices to check if the appointment has already passed
                    console.log(el.date);
                    console.log(formattedDate);
                    const isExpired =  (formattedDate >=el.date || el.time < currentTime);
                   
                  
                    console.log('Current Time:', currentTime);
                    console.log('app Time:',el.time);
                  
                    // Return the updated element with the "isExpired" status
                    return {
                      ...el,
                      isExpired: isExpired
                    };
                  });
                  
                  setConsult(updatedConsult);
                  
            } catch (error) {
                console.log(error);
            }
        }
        datacall();
    }, [docToken]);

    const handlePrescribe = useCallback((el) => {
        console.log(el);
        dispatch(setData(el))
        navigate('/doctor/createPrscription')
    }, [dispatch, navigate])

    const handleJoin = useCallback((id, room) => {
        dispatch(setSlot(id))
        console.log(room);
        socket.emit("room:join", { email, room })
    }, [dispatch, socket, email])

    const handleJoinRoom = useCallback((data) => {
        const { room } = data
        navigate(`/doctor/call/${room}`)
    }, [navigate])

    useEffect(() => {
        socket.on('room:join', handleJoinRoom)
        return () => {
            socket.off('room:join', handleJoinRoom)
        }
    }, [socket, handleJoinRoom])
    return (
        <div>
            <h1>Consult</h1>
            <div className="bg-white p-3">
                {consult.length !== 0 ? (
                    consult.map((el) => (
                        <div className="card mt-3 p-3" key={el._id}>
                            <div className="row text-center">
                                <div className="col-sm-6">
                                    <b>
                                        <h3>{el.userData[0].userName}</h3>
                                    </b>
                                </div>
                                <div className="col-sm-3">
                                    <p>{el.date}</p>
                                    <p>{el.time}</p>
                                </div>
                                <div className="col-sm-3">
                                    <>
                                        {el.isExpired
                                            ? 'Expired'
                                            : el.isAttended
                                            ? 'Attended'
                                            : !el.isCancelled
                                            ? (
                                                <>
                                                    <button
                                                        style={{ fontSize: "15px" }}
                                                        className='btn ps-2 pe-2 btn-outline-success'
                                                        onClick={() => handleJoin(el._id, el._id + el.user)}
                                                    >
                                                        Join
                                                    </button>
                                                </>
                                            )
                                            : 'Cancelled'} <br />
                                        {!el.medicines
                                            ? (
                                                <button
                                                    className='btn btn-success p-2 mt-1'
                                                    style={{ fontSize: '14px' }}
                                                    onClick={() => handlePrescribe(el)}
                                                >
                                                    Prescribe
                                                </button>
                                            )
                                            : "Prescription added"}
                                    </>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
}

export default Consult;
