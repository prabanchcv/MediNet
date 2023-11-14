import { PDFDownloadLink } from '@react-pdf/renderer';
import MyPdf from './salesReportPdf';
import { FiDownload } from 'react-icons/fi'
import PropTypes from 'prop-types'

DownloadButton.propTypes = {
    el: PropTypes.string,
    user: PropTypes.string
}

function DownloadButton({ patients, income }) {

    return (
        <>
            <PDFDownloadLink document={<MyPdf patients={patients} income={income} />} fileName="Prescription.pdf">
                {({ loading }) =>
                    loading ? 'Loading document...' : <button className='btn btn-success' ><FiDownload /></button>
                }
            </PDFDownloadLink>
        </>
    )
}

export default DownloadButton