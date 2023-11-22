import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import DoctorCard from '../doctorCard';
import { BsSearch } from 'react-icons/bs';

function PageStructure() {
  const [docData, setDocData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [department, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_BASE_URL + `findDoctors?page=${currentPage}`);
        setDocData(res.data.docs);
        setDepartments(res.data.deps);
        setTotalPages(Math.ceil(res.data.docs.length / 4)); // Assuming 4 doctors per page
      } catch (error) {
        console.error(error);
      }
    };

    fetchDoctors();
  }, [currentPage]);

   const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!search) {
            await axios.get(import.meta.env.VITE_BASE_URL + `searchDoc/all`, {
            }).then(res => {
                console.log(res.data);
                setFilteredData(res.data)
            })
        } else {
            await axios.get(import.meta.env.VITE_BASE_URL + `searchDoc/${search}`, {
            }).then(res => {
                setFilteredData(res.data)
            })
        }
        setIsSearch(true);
    }, [search])

    const handleCategory = (e) => {
        const filtered = docData.filter(
            (doc) => doc.doctorData[0].name === e.target.value);
        setFilteredData(filtered);
        setIsSearch(true);
    };

    const handleClear = () => {
        setSearch('');
        setFilteredData([]);
        setIsSearch(false);
    };

  const handleClickPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleClickNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
        <div className="row">
                <div className="col-4 col-md-3 bg-light p-1 text-center">
                    <div className="outline-success mt-5">
                        <h3>Departments</h3>
                        <h7 onClick={handleClear} style={{ cursor: 'pointer' }}>clear</h7>
                        <div className="text-start m-auto " style={{ maxWidth: '300px' }}>
                            <ul className="list-group ms-auto ">
                                {department ? (
                                    department.map((dep) => (
                                        <li className="list-group-item ps-1  pt-2 pb-2 p-0" key={dep._id}>
                                            <input
                                                className="form-check-input me-1"
                                                type="radio"
                                                name="listGroupRadio"
                                                key={dep.name}
                                                value={dep.name}
                                                onClick={(e) => handleCategory(e)}
                                                id={dep.name}
                                            />
                                            <label className="form-check-label" htmlFor={dep.name}>
                                                {dep.name}
                                            </label>
                                        </li>
                                    ))
                                ) : (
                                    <div>No departments available</div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
        <div className="col-8 col-md-9">
          <div className="d-flex p-4 pb-0">
            <input
              type="text"
              className="my-auto bg-light form-control"
              style={{ maxWidth: '60%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors..."
            />
            <button className='btn pt-0 ms-2 btn-success' onClick={handleSearch}><BsSearch /></button>
          </div>
          {isSearch ? (
            <DoctorCard docData={filteredData} />
          ) : (
            <DoctorCard docData={docData} />
          )}
          <div className="d-flex justify-content-center" style={{padding:'20px'}}>
            <button
              className="border shadow-lg btn btn-outline-primary me-2"
              onClick={handleClickPrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              className="border shadow-lg  btn btn-outline-primary ms-2"
              onClick={handleClickNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageStructure;
