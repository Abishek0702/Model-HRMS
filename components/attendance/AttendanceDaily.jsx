import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Link, Spinner } from 'components';
import { alertService, userService } from 'services';
import Pagination from 'next-pagination'
import moment from 'moment';
import axios from 'axios';

const AttendanceDaily = () => {
    const [attendance, setAttendance] = useState(null);
    const [totalcount, setCount] = useState(0);


    const router = useRouter();
    const sizelist = [10,20,40,50,60];

    
    var page = router.query.page || 1;
    var size = router.query.size || 10;
    var sortDate = router.query.date || moment(new Date()).format("yyyy-MM-DD")

    useEffect(() => {
        console.log('^^^', router.query.page, router.query.size);
        var page = router.query.page || 1;
        var size = router.query.size || 10;
        var date = router.query.date || moment(new Date()).format("yyyy-MM-DD");
        
        handleAdminList(page, size, date);

    }, []);


    const handleAdminList = (page, size, date) => {
        userService.getAttendanceDaily(page, size, date)
            .then((x) => {
            
                if (typeof x.posts !== 'undefined') { setAttendance(x.posts); }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
            });

    }


    const handleChange = (e) => {
        
        router.push(`attendance?page=${page}&section=DailyReport&size=${size}&date=${e.target.value}`)
        const date = moment(e.target.value).format("yyyy-MM-DD");
        handleAdminList(page, size, date);
    }




    const onSubmit = async (sortDate) => {
        const user = userService.userValue;
        try {
            axios({
                url: `/api/admin/reports/downloadreport?date=${sortDate}`, //your url
                method: 'GET',
                responseType: 'blob', // important
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }).then((response) => {

                const href = URL.createObjectURL(response.data);


                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `report_${sortDate}.csv`);
                document.body.appendChild(link);
                link.click();


                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });


        } catch (er) {
            
        }
    }



    return (

        <div className='row mt-2' >
            <div className='col-lg-12'>
                <div className="card shadow-none">

                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <a className="navbar-brand text-white"  ><i className="nav-icon fa fa-calendar-alt  fa-fw "></i>Daily Report</a>
                            <ul className="navbar-nav mr-auto">

                            </ul>
                            <div className='d-flex '>

                            
                                <div className='mr-5'>
                                    <input type='date' className='form-control' onChange={(e) => handleChange(e)} value={sortDate} />
                                </div>

                                <button onClick={() => onSubmit(sortDate)} className='btn bg-primary2 text-white'><span className='mr-3'><i class="fas fa-file-download"></i></span>Download</button>




                            </div>

                        </nav>
                    </div>




                    <div className="card-body p-0 overflow-auto">
                        <table className="table table-striped">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>S.No</th>
                                    <th style={{ width: 'auto' }}>EmployeeID</th>
                                    <th style={{ width: 'auto' }}>Name</th>
                                    <th style={{ width: 'auto' }}>StartTime</th>
                                    <th style={{ width: 'auto' }}>EndTime</th>
                                    <th style={{ width: 'auto' }}>Duration</th>
                                    <th style={{ width: 'auto' }}>Status</th>
                                    <th style={{ width: 'auto' }}>Date</th>

                                </tr>
                            </thead>
                            <tbody>
                                {attendance && attendance.map(user =>

                                    <tr key={user.uid}>
                                        <td>{user.uid}</td>
                                        <td>{user.EmployeeCode}</td>
                                        <td>{user.Name}</td>
                                        <td>{user.InTime}</td>
                                        <td>{user.OutTime}</td>
                                        <td>{user.TotalDuration}</td>
                                        <td>
                                        {user.status == "Present" && <p className='text-success fw-bold'>{user.status}</p>}
                                        {user.status == "Absent" && <p className='text-danger fw-bold'>{user.status}</p>}
                                        {user.status == "Halfday" && <p className='text-warning fw-bold'>{user.status}</p>}

                                        

                                        </td>
                                        <td>{moment(user.date).format("DD MMM yyyy")}</td>
                                    </tr>
                                )}

                                {!attendance &&
                                    <tr>
                                        <td colSpan="10">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {attendance && !attendance.length &&
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            <div className="p-2">No Attendace to Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {totalcount && <Pagination total={totalcount} sizes={sizelist} />}
                    </div>
                </div>
            </div >
          
        </div >
    )
}
export default AttendanceDaily;
