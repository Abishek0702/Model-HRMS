import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Link, Spinner } from 'components';
import { userService } from 'services';
import Pagination from 'next-pagination'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
const Attendance = () => {
    const [userid, setUserid] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [empployeecount, setEmployeecount] = useState(null)
    const [totalcount, setCount] = useState(0);
    const [show, setShow] = useState({ isShow: false, });
    const [view, setView] = useState({});
    const [viewReport, setViewReport] = useState({});
   

    const router = useRouter();
    const sizelist = [6, 9, 12, 15];
   


    var page = router.query.page || 1;
    var size = router.query.size || 6;


    useEffect(() => {
        console.log('^^^', router.query.page, router.query.size);
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var date = router.query.date || moment(new Date()).format("yyyy-MM-DD");
        var user_id = userid || '';

       

        const subscription = userService.user.subscribe(x => {
           
            if (x != null) {
                setUserid(x.id)
            }
        })
        handleAdminList(page, size, date);

    }, []);


    const handleAdminList = (page, size, date) => {
        userService.getAttendance(page, size, date)
            .then((x) => {
              
                if (typeof x.posts !== 'undefined') { setAttendance(x.posts); }
                if (typeof x.posts !== 'undefined') { setEmployeecount(x.totalcount); }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
            });

    }

    return (

        <div className='row mt-2' >
            <div className='col-lg-12'>
                <div className="card shadow-none">

                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <a className="navbar-brand text-white"><i className="nav-icon fa fa-calendar-alt  fa-fw "></i>Attendance Log</a>
                            <ul className="navbar-nav mr-auto">

                            </ul>
                        </nav>
                    </div>


                    <div className="card-body p-0 overflow-auto">
                        <table className="table table-striped">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>Report#</th>
                                    <th style={{ width: 'auto' }}>EmployeeID</th>
                                    <th style={{ width: 'auto' }}>Name</th>
                                    <th style={{ width: 'auto' }}>Date</th>
                                    <th style={{ width: 'auto' }}>StartTime</th>
                                    <th style={{ width: 'auto' }}>EndTime</th>
                                    <th style={{ width: 'auto' }}>IP</th>
                                    <th style={{ width: 'auto' }}>Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {attendance && attendance.map(user =>

                                    <tr key={user.rID}>
                                        <td>{user.rID}</td>
                                        <td>{user.EmployeeCode}</td>
                                        <td>{user.Name}</td>
                                        <td>{moment(user.date).format("DD MMM yyyy")}</td>
                                        <td>{user.InTime} </td>
                                        <td>{user.OutTime}</td>
                                        <td>
                                        {user.start_ip}<br/>{user.end_ip}
                                            {/* <span style={{ cursor: "pointer" }} onClick={() => { setView({ isShow: true }), setViewReport(user) }}><i class="fas fa-eye  "></i></span> */}
                                        </td>
  <td>
                                        {user.status == "Present" && <p className='text-success fw-bold'>{user.status}</p>}
                                        {user.status == "Absent" && <p className='text-danger fw-bold'>{user.status}</p>}
                                        {user.status == "Halfday" && <p className='text-warning fw-bold'>{user.status}</p>}
                                        {user.status == "Partial" && <p className='text-warning fw-bold'>{user.status}</p>}

                                        

                                        </td>

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
            <Modal show={view.isShow} onHide={() => setView({ isShow: false })} size='md' backdrop="static">
                <Modal.Header closeButton className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title>Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="">
                        <form>
                            <div class="form-group">
                                <textarea type="text" className='form-control' value={viewReport.description}></textarea>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}
export default Attendance;
