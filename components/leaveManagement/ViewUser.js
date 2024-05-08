import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import { Link, Spinner } from 'components';
import { leaveService } from 'services/leave.service';

import Pagination from 'next-pagination'
import moment from 'moment';

import Modal from 'react-bootstrap/Modal';
import { AddEdit } from 'components/leaveManagement/AddEdit'
import { userService } from 'services';

export default ViewLeave;

function ViewLeave(props) {
    // const [search, setSearch] = useState('') ------search--------

    const [users, setUsers] = useState(null);
    const [totalcount, setCount] = useState(0);
    const [summary, setSummary] = useState('');
    const [reason, setReason] = useState(null);
    const [show, setShow] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState(null);
    const router = useRouter();
    const sizelist = [6, 9, 12, 15];

    const user_id = props?.user_id;

    var page = router.query.page || 1;
    var size = router.query.size || 6;

    const [sortToggle, setSortToggle] = useState(false);



    useEffect(() => {

        console.log('^^^', router.query.page, router.query.size);
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || '';

        var sortbyfield = 'id';
        var sortOrder = 'DESC';
        handleList(user_id, page, size, sortbyfield, sortOrder);
        handleLeaveTypes();

    }, []);

    const handleList = (user_id, page, size, sortbyfield="id", sortOrder="desc") => {
        // console.log("check user id", user_id);

        leaveService.getByUser(user_id, page, size, sortbyfield, sortOrder)
            .then((x) => {
                console.log('x values', x)
                if (typeof x.posts !== 'undefined') {
                    setUsers(x.posts);
                    setSortToggle(!sortToggle)

                }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
                if (typeof x.Summary !== 'undefined') { setSummary(x.Summary); }
            })
            .catch((err) => {
                console.log("user leave list", err);
            })
    }

    const handleLeaveTypes = () => {
        leaveService.getAllLeaveTypes()
            .then((x) => {
                console.log("setLeaveTypes", x.posts); // leave TYpes show api
                if (typeof x.posts !== 'undefined') { setLeaveTypes(x.posts); }
            })
        // .catch((err) => {
        //     console.log("leave types list", err);
        // })
    }
    // function getSearch() {
    //     console.log(search)
    //     router.push(`/leaveManagement?&search=${search}`)
    // }
    // console.log("leaveTypes", leaveTypes);

    return (
        <>
            <div className='row'>
                <div className='col-lg-8'>
                    
                    <div className="card shadow-none">

                        <div className='card-header p-0 bg-primary1 '>
                            <nav className="navbar ">
                            <span className="navbar-brand text-white"   ><i className="nav-icon fa fa-calendar-alt  fa-fw "></i>Leave History [GL10{user_id}]</span>
                                <div className="d-flex">
                                    <ul className="navbar-nav mr-auto">
                                    </ul>
                                     

                                    <a className="navbar-brand   mx-3" onClick={() => handleList(user_id, page, size)} title='refresh'><i class="fas fa-sync"></i></a>
                                </div>
                            </nav>
                        </div>

                        <div className="card-body p-0  ">
                            <div className='row   p-2 bg-primary22'>
                                <span className='col-lg-4 text-success text-start font-weight-bold'>Casual Leave : {summary.Remaining_CS} ({summary.Casual_Leave}) </span>
                                <span className='col-lg-4 text-danger text-start font-weight-bold'>Sick Leave : {summary.Remaining_SL} ({summary.Sick_Leave})</span>
                                <span className='col-lg-4 text-danger text-start font-weight-bold'>LOP : {summary.Remaining_LOP}</span>
                            </div>
                        </div>

                        <div className="card-body p-0 overflow-auto">

                        {/* <div className='row   p-2 bg-primary'>
                        <span className='col-lg-4 text-success text-start font-weight-bold'>Casual Leave : {summary.Remaining_CS} ({summary.Casual_Leave}) </span>
                        <span className='col-lg-4 text-danger text-start font-weight-bold'>Sick Leave : {summary.Remaining_SL} ({summary.Sick_Leave})</span>
                        <span className='col-lg-4 text-danger text-start font-weight-bold'>LOP : {summary.Remaining_LOP}</span>
                        </div> */}

                            <table className="table table-striped">
                                <thead className='bg-primary2 text-white'>
                                    <tr>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            <span onClick={() => handleList(user_id, page, size, 'id', sortToggle ? "ASC" : "DESC")} style={{ cursor: "pointer" }}>#<span><i className="fas fa-sort fa-sm ms-1"></i></span>
                                            </span>
                                        </th>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            <span onClick={() => handleList(user_id, page, size, 'leavetype_id', !sortToggle ? "ASC" : "DESC")} style={{ cursor: "pointer" }}> Type
                                                <span><i className="fas fa-sort fa-sm ms-1"></i></span>
                                            </span>
                                        </th>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            <span  >   Day  </span>
                                        </th>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            <span  >Start   </span>
                                        </th>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            <span >End   </span>
                                        </th>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            <span  > Days </span>
                                        </th>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            Reason
                                        </th>
                                        <th style={{ width: 'auto' }} className='py-3 text-center px-2'>
                                            <span onClick={() => handleList(user_id, page, size, 'leavestatus_id', !sortToggle ? "ASC" : "DESC")} style={{ cursor: "pointer" }}>Status<span><i className="fas fa-sort fa-sm ms-1"></i></span>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.map(user =>
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.TypeofLeave}</td>
                                            <td>{user.half_day == 1 ? <span className='text-warning fw-bold'>Half Day</span> : <span className='text-primary fw-bold'>Full Day</span>}</td>
                                            <td>{moment(user.start_date).format("DD/MM/YYYY")}</td>
                                            <td>{moment(user.end_date).format("DD/MM/YYYY")}</td>
                                            <td>{user.numberOfDays}</td>
                                            <td><span onClick={() => { setShow(true), setReason(user) }} style={{ cursor: "pointer" }}><i class="fas fa-eye"></i></span></td>
                                            <td>{user.leavestatus_id == 3 ? <span className='text-warning fw-bold'>{user.name}</span> : (user.leavestatus_id == 2 ? <span className='text-success fw-bold'>{user.name}</span> : <span className='text-danger fw-bold'>{user.name}</span>)}</td>
                                        </tr>
                                    )}
                                    {!users &&
                                        <tr>
                                            <td colSpan="8">
                                                <Spinner />
                                            </td>
                                        </tr>
                                    }
                                    {users && !users.length &&
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                <div className="p-2">No leaves to Display</div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                            {totalcount && <Pagination total={totalcount} sizes={sizelist} />}
                        </div>
                    </div>
                </div>
                <div className='col-lg-4 p-0 mt-0'>
                    {leaveTypes && <AddEdit leaveTypes={leaveTypes} user_id={user_id} summary={summary} />}
                </div>
            </div>

            <Modal show={show} onHide={() => setShow(false)} size='md' backdrop="static">
                <Modal.Header   className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title>Reason</Modal.Title>
                    <button className='close-btn bg-transparent' style={{ border: "none", outline: "none" }} onClick={() => setShow(false)}><i className='fas fa-times text-white'></i></button>
                </Modal.Header>
                <Modal.Body>
                    {/* {JSON.stringify(reason)} */}
                    {reason && <p>{reason.Reason}</p>}
                </Modal.Body>
            </Modal>
        </>
    );
}
