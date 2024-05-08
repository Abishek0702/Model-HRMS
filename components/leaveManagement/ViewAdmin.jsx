import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Link, Spinner } from 'components';
import { leaveService } from 'services/leave.service';
import Pagination from 'next-pagination'
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService } from 'services';

const ViewAdmin = () => {
    // const [search, setSearch] = useState('')
    const [userid, setUserid] = useState(null);
    const [users, setUsers] = useState(null);
    const [search, setSearch] = useState('');
    const [totalcount, setCount] = useState(0);
    const [show, setShow] = useState(false);
    const [updateList, setUpdateList] = useState(null);
    const [statusList, setStatusList] = useState(null);
    const [approveList, setApproveList] = useState(null);
    const [summary, setSummary] = useState(null);
    const router = useRouter();
    const sizelist = [6, 9, 12, 15];
    // const userid = 16;

    var page = router.query.page || 1;
    var size = router.query.size || 6;

    const validationSchema = Yup.object().shape({
        leavestatus_id: Yup.string().required('approve status is required'),
        approveruser_id: Yup.string().required('approve user is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    useEffect(() => {
        console.log('^^^', router.query.page, router.query.size);
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || '';
        var user_id = userid || '';

        // const subscription = leaveService.user.subscribe(x => {
        //     console.log('x:', x)
        //     if (x != null) {
        //         setUserid(x.id)
        //     }
        // })

        handleAdminList(page, size, search, user_id);
        // handleUserList(userID)

        handleStatusDrop()

        handleApproveDrop()
    }, []);


    const handleAdminList = (page, size, search, userid) => {
        leaveService.getAll(page, size, search, userid).then((x) => {
            console.log('x values', x)
            if (typeof x.posts !== 'undefined') { setUsers(x.posts); }
            if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
        });
    }

    const handleStatusDrop = () => {
        leaveService.getAllStatusDrop()
            .then((x) => {
                if (typeof x.posts !== 'undefined') { setStatusList(x.posts); }
            })
        // .catch()
    }

    const handleApproveDrop = () => {
        leaveService.getAllApproveDrop()
            .then((x) => {
                if (typeof x.posts !== 'undefined') { setApproveList(x.posts); }
            })
        // .catch()
    }

    const handleApproved = (user) => {
        setShow(true)
        setUpdateList(user)
        // alert(user.user_id)
        const page = 1
        const size = 1
        leaveService.getByUser(user.user_id, page, size)
            .then((x) => {
                console.log('x values', x)
                // if (typeof x.posts !== 'undefined') { setUsers(x.posts); }
                // if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
                if (typeof x.Summary !== 'undefined') { setSummary(x.Summary); }
            })
    }

    const handleApprovedForm = (data) => {
        const mergeApprover = { ...data, id: updateList.id }
        console.log(mergeApprover);
        setShow(false)
        return leaveService.update(updateList.id, mergeApprover)
            .then((data) => {
               // router.push(`/leaveManagement`)
               alertService.success(data.data)
               location.reload();
                // setTimeout(() => {
                //     alertService.success(data.data)
                // }, 1000 / 2)
            })
            .catch((err) => {
                alertService.error(err.data)
            })
    }

    const handleViewUser = (id) => {
        router.push(`employees/view/${id}?section=leave`)
    }

    function getSearch(search) {
        // console.log(search)
         router.push(`/leavemanagement?&search=${search}`)
      
    }

    return (
        <div className='row p-3'>
            <div className='col-lg-12'>
                <div className="card shadow-none">

                    <div className="card-header p-0 shadow-none">
                        {/* <nav className="navbar shadow-none">
                            <a className="navbar-brand " href="#">Leave History</a>
                        </nav> */}

                        <nav className="navbar  bg-primary22">
                            <a className="navbar-brand " href="#">Leave History </a>
                            <div className="d-flex">
                                <ul className="navbar-nav mr-auto">
                                     
                                </ul>
                                <div class="form-inline">
                                    <div class="input-group" data-widget="sidebar-search">
                                        {/* <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" value={search} onChange={e => { setSearch(e.target.value) }} />
                                        <div class="input-group-append">
                                            <button class="btn btn-success" onClick={() => getSearch()}>
                                                <i class="fas fa-search fa-fw"></i>
                                            </button>
                                        </div> */}
                                        <select className={`form-select form-control input-group`} onChange={(e) => getSearch(e.target.value)}>
                                        <option value=''>Filter Status</option>
                                        {statusList && statusList.map((values) =>
                                            <option value={values.id}>{values.name}</option>
                                        )}
                                    </select>
                                    </div>
                                </div>
                                <a className="navbar-brand text-white mx-3" onClick={() => handleAdminList(page,size,"",userid)} title='refresh'><i class="fas fa-sync"></i></a>
                            </div>
                        </nav>
                    </div>

                    <div className="card-body p-0 overflow-auto">
                        <table className="table table-striped">
                        <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>#</th>
                                    <th style={{ width: 'auto' }}>Employee Code</th>
                                    <th style={{ width: 'auto' }}>Employee Name </th>
                                    <th style={{ width: 'auto' }}>Leave Type</th>
                                    <th style={{ width: 'auto' }}>Start Date</th>
                                    <th style={{ width: 'auto' }}>End Date</th>
                                    <th style={{ width: 'auto' }}>No of Days</th>
                                    {/* <th style={{ width: 'auto' }}>Reason</th> */}
                                    <th style={{ width: 'auto' }}>Status</th>
                                    <th style={{ width: 'auto', textAlign: "center" }}>Action</th>
                                    <th style={{ width: 'auto' }}>Profile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.employeeID}</td>
                                        <td>{user.name}</td>
                                        <td>{user.TypeofLeave}</td>
                                        <td>{moment(user.start_date).format("DD/MM/YYYY")}</td>
                                        <td>{moment(user.end_date).format("DD/MM/YYYY")}</td>
                                        <td>{user.numberOfDays}</td>
                                        {/* <td><span onClick={() => handleReason(user.Reason, user.name, user.employeeID, user.TypeofLeave)}><i className="fas fa-comment-alt" style={{ cursor: "pointer" }}></i></span></td> */}
                                        <td className=''>
                                            {user.leavestatus_id == 3 ?
                                                <span className='text-warning fw-bold'>{user.leavestatus_name}</span> :
                                                (user.leavestatus_id == 2 ?
                                                    <div className='d-flex flex-column'><span className='text-success fw-bold'>{user.leavestatus_name}</span><small  className='text-muted text-success'> <em> - by {user.ausername}</em></small ></div> :
                                                    <span className='text-danger fw-bold'>{user.leavestatus_name}</span>)}
                                        </td>


                                        <td className='text-center'>
                                            {user.leavestatus_id == 3 ?
                                                <button className='btn btn-sm btn-info' onClick={() => handleApproved(user)}>Update</button> :
                                                (user.leavestatus_id == 2 ?
                                                    <i class="fas fa-check-circle text-success"></i> :
                                                    <i class="fas fa-times-circle text-danger"></i>)}
                                        </td>
                                        <td>
                                            <button className='btn btn-sm btn-success' onClick={() => handleViewUser(user.user_id)}>View</button>
                                        </td>
                                    </tr>
                                )}
                                {!users &&
                                    <tr>
                                        <td colSpan="10">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {users && !users.length &&
                                    <tr>
                                        <td colSpan="10" className="text-center">
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
            {updateList && <Modal show={show} onHide={() => setShow(false)} size='md' backdrop="static" className='overflow-hidden'>
                <Modal.Header   className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title >{show.approved ? 'Approve' : `Reason ${updateList.employeeID}`}</Modal.Title>
                    <button className='close-btn bg-transparent' style={{ border: "none", outline: "none" }} onClick={() => setShow(false)}><i className='fas fa-times text-white'></i></button>
                </Modal.Header>
                <Modal.Body>

                    {show ?
                        (
                            <div>
                                <div className='form mb-4'>
                                    <table className='table mb-0'>
                                        <tr className=''>
                                            <th className='text-primary pb-1 p-0' style={{ minWidth: '40%' }}>Name</th>
                                            <td className='text-primary pb-1 p-0' style={{ minWidth: '10%' }}>:</td>
                                            <td className='text-dark pb-1 p-0' style={{ minWidth: '50%' }}>{updateList.name}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-primary pb-1 p-0' style={{ width: '40%' }}>Remaining CL</th>
                                            <td className='text-primary pb-1 p-0' style={{ width: '10%' }}>:</td>
                                            <td className='text-dark pb-1 p-0' style={{ width: '50%' }}>{summary && summary.Remaining_CS}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-primary pb-1 p-0' style={{ width: '40%' }}>Remaining SL</th>
                                            <td className='text-primary pb-1 p-0' style={{ width: '10%' }}>:</td>
                                            <td className='text-dark pb-1 p-0' style={{ width: '50%' }}>{summary && summary.Remaining_SL}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-primary pb-1 p-0' style={{ width: '40%' }}>LOP</th>
                                            <td className='text-primary pb-1 p-0' style={{ width: '10%' }}>:</td>
                                            <td className='text-dark pb-1 p-0' style={{ width: '50%' }}>{summary && summary.Remaining_LOP}</td>
                                        </tr>
                                    </table>
                                    <div>
                                        <label className='form-label text-primary fw-bold'>Employee Reason</label>
                                        <textarea className='form-control' value={updateList.Reason}></textarea>
                                    </div>
                                </div>

                                <form className='form' onSubmit={handleSubmit(handleApprovedForm)}>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label className='form-select-label text-primary fw-bold'>Approver</label>
                                            <select className={`form-select form-control ${errors.approveruser_id ? 'is-invalid' : ''}`} {...register('approveruser_id')}>
                                                <option value=''>Selected</option>
                                                {approveList.map((values) =>
                                                    <option value={values.id}>{values.name}-{values.designationName}</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className='col-6'>
                                            <label className='form-select-label  text-primary fw-bold'>Approve Status</label>
                                            <select className={`form-select  form-control ${errors.leavestatus_id ? 'is-invalid' : ''}`} {...register('leavestatus_id')}>
                                                <option value=''>Selected</option>
                                                {statusList.map((values) =>
                                                    <option value={values.id}>{values.name}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className='form-label text-primary fw-bold'> Approve Reason</label>
                                        <textarea className='form-control' {...register("approverReason")}></textarea>
                                    </div>
                                    <div className='mt-3'>
                                        <button className='btn btn-primary' onClick={handleSubmit}>update</button>
                                    </div>
                                </form>
                            </div>)
                        : ""
                        // (
                        //     <div>
                        //         <h6 className='text-primary fw-bold'>User Details</h6>
                        //         <div className='table'>
                        //             <tr>
                        //                 <td style={{ width: '30%' }}>Name</td>
                        //                 <td style={{ width: '10%' }}>:</td>
                        //                 {/* <td style={{ width: '50%' }}>{reason.name}</td> */}
                        //             </tr>
                        //             <tr>
                        //                 <td style={{ width: '30%' }}>Employee Code</td>
                        //                 <td style={{ width: '10%' }}>:</td>
                        //                 {/* <td style={{ width: '50%' }}>{reason.id}</td> */}
                        //             </tr>
                        //             <tr>
                        //                 <td style={{ width: '30%' }}>Leave Type</td>
                        //                 <td style={{ width: '10%' }}>:</td>
                        //                 {/* <td style={{ width: '50%' }}>{reason.leaveType}</td> */}
                        //             </tr>
                        //         </div>
                        //         <h6 className='text-primary fw-bold'>Reason</h6>
                        //         {/* <p>{reason.reason}</p> */}
                        //     </div>
                        // )
                    }
                </Modal.Body>
            </Modal>}
        </div >
    )
}

export default ViewAdmin


