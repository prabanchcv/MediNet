import axios from "axios"
import { useEffect, useState } from "react"
import BarChart from "../chart"
import { BiRupee } from "react-icons/bi"
import { FaIdCard } from "react-icons/fa"
import { useSocket } from '../../context/socket/socketProvider'
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom'
import DownloadButton from './../downloadSales';



function DoctorHome() {

  const socket = useSocket();

  const [income, setIncome] = useState('')
  const [patients, setPatients] = useState('')
  const doctorToken = localStorage.getItem('doctorToken')
  const [docAppoint, setDocAppoint] = useState([])
  const [docId, setDocId] = useState(null);
  const history = useNavigate()

  useEffect(() => {
    

    socket.on('user-requested', (user, roomId) => {

      Swal.fire({
        title: 'Chat Request',
        text: `${user.userName} Requested a chat , Do you want to join ?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {

        if (result.isConfirmed) {
          socket.emit('join-chat', roomId)
          console.log(user.userName);
          const handleRoomJoin = () => {
         
            history(`/doctor/chat/${user._id}`)
          }
          socket.on('chat-connected', handleRoomJoin);
        } else {
          socket.emit('doc-rejected', user._id)
        }
      });
    })
  },[socket])

  useEffect(() => {
 
    async function dataCall() {
      await axios.get(import.meta.env.VITE_BASE_URL + 'doctor/dash', {
        headers: {
          Authorization: `Bearer ${doctorToken}`
        }
      }).then(res => {
        console.log(res.data);
        setDocAppoint(res.data)
        const inc = res.data.reduce((acc, occ) => {
          return acc = acc + occ.amount
        }, 0)
        setIncome(inc)
        setPatients(res.data.length)
      })
    }
    dataCall()
  }, [doctorToken])


  
  useEffect(() => {

    if (doctorToken) {

      const getSchedule = async () => {

        try {
          console.log(11);
        
          const response =  await axios.get(import.meta.env.VITE_BASE_URL + 'doctor/schedule-data', {
            headers: {
              Authorization: `Bearer ${doctorToken}`
            }
          })
          if (response.status === 200) {
           
            setDocId(response.data.schedule.doctor);
            socket.emit('set-up', response.data.schedule.doctor)
          }
          
        } catch (error) {
          console.log(error);
        }
      }
      getSchedule()
    }
  }, [doctorToken,socket])

  return (
    <>
      <div className="col-md-9 col-lg-9 m-0">
        <div className='row m-auto' >
          <div className="col-lg-6">
            <div className='dataButton m-4'>

              <h5> <BiRupee /> Total Income</h5>
              <h4> {income && income}</h4>
            </div>
          </div>
          <div className="col-lg-6">
            <div className='dataButton m-4'>
              <h5><FaIdCard /> Total appointments</h5>
              <h4>{patients && patients}</h4>
            </div>
          </div>

        </div>
    
        <BarChart appoints={docAppoint} />
        <div style={{paddingLeft:'40px'}}> Download Sales Report <DownloadButton patients={patients.toString()} income={income.toString()} Appointment={docAppoint} /></div>
      </div>

    </>
  )
}

export default DoctorHome