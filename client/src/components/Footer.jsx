import { FaInstagram, FaFacebook } from 'react-icons/fa'
function Footer() {

  return (
    <>
      <div className="custom-bg footer text-white text-center" style={{  backgroundColor: '#646BAC'}}>
        <div>
          Follow us on
        </div>
        <FaInstagram />

        <FaFacebook />
      </div>
    </>
  )
}

export default Footer