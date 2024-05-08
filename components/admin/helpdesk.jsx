import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService } from 'services/alert.service';
import { userService } from 'services';
import { Link, Spinner } from 'components';
import Pagination from 'next-pagination'
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
const HelpDeskAdmin = () => {

    const router = useRouter();

    const [userid, setUserid] = useState(null);
    const [select, setSelect] = useState(null);
    const [design, setDesign] = useState(null);
    const [helpdesk, setHelpdesk] = useState([]);
    const [totalcount, setCount] = useState(0);
    const [show, setShow] = useState({ isShow: false, });
    const [updateList, setUpdateList] = useState(null);
    const sizelist = [6, 9, 12, 15];

    var page = router.query.page || 1;
    var size = router.query.size || 6;
    var search = router.query.search || '';

    useEffect(() => {
        // console.log('^^^', router.query.page, router.query.size);
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || '';
        var user_id = userid || '';

        const subscription = userService.user.subscribe(x => {
            // console.log('x:', x)
            if (x != null) {
                setUserid(x.id)
            }
        })

        handleAdminList(page, size, search);
        Form()

    }, []);


    const handleAdminList = (page, size, search) => {
        userService.getDeskAll(page, size, search).then((x) => {
            if (typeof x.posts !== 'undefined') { setHelpdesk(x.posts); }
            if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
        });
    }
    const handleApproved = (user) => {
        setShow(true)
        setUpdateList(user)
        const page = 1
        const size = 1
        userService.getDesk(user.user_id, page, size)
            .then((x) => {
                if (typeof x.Summary !== 'undefined') { setSummary(x.Summary); }
            })
        reset()
    }



    const handleApprovedForm = (data) => {
        const mergeApprover = { ...data, id: updateList.id }
        console.log("22222", mergeApprover);
        setShow(false)

        return userService.updateDesk(updateList.id, mergeApprover)
            .then((data) => {

                alertService.success(data.message)
                handleAdminList(page, size, search, userid)

            })
            .catch((err) => {
                alertService.error(err.message)
            })
    }

    const validationSchema = Yup.object().shape({
        approver_id: Yup.string().required('Approver is required'),
        helpstatus: Yup.string().required('Issue Status is required'),

    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;


    function getSearch(search) {
        router.push(`/helpdesk?search=${search}`)

    }
    const Form = () => {
        // console.log("in", page, size, search, userid);
        userService.form()

            .then((x) => {
                console.log('Helpdesk', x.helpdesk_status)
                if (typeof x.helpdesk_status !== 'undefined') { setSelect(x.helpdesk_status); }
                if (typeof x.designation_id !== 'undefined') { setDesign(x.designation_id); }
            });
    }
    console.log("eee", select);

    return (
        <div className='row  p-3'>
            <div className='col-lg-12'>
                <div className="card shadow-none ">

                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <span className="navbar-brand text-white"  ><i className="fas fa-info-circle"></i> HELPDESK</span>
                            <ul className="navbar-nav mr-auto">

                            </ul>

                            <div className="form-inline mr-2 ">
                                <div className="input-group" data-widget="sidebar-search p-3" >

                                    <select className={`form-select form-control input-group`} onChange={(e) => getSearch(e.target.value)}>
                                        <option value=''>Filter Status</option>
                                        {select && select.map(user =>
                                            <option value={user.value} >{user.label}</option>

                                        )}
                                    </select>
                                </div>
                            </div>
                            {/* <a className="navbar-brand text-success ml-3" onClick={() => getSearch("")} title='refresh'><i className="fas fa-sync"></i></a> */}
                        </nav>
                    </div>


                    <div className="card-body p-0">
                        <table className="table table-striped">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>S.NO</th>
                                    <th style={{ width: 'auto' }}>EmployeeID</th>
                                    <th style={{ width: 'auto' }}>Name</th>
                                    <th style={{ width: 'auto' }}>Type</th>
                                    <th style={{ width: 'auto' }}>Progress</th>
                                    <th style={{ width: 'auto' }}>TicketDate</th>
                                    <th style={{ width: 'auto' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helpdesk && helpdesk.map(user =>
                                    <tr key={user.user_id}>
                                        <td>{user.id}</td>
                                        <td>{user.employeeID}</td>
                                        <td>{user.userName}</td>
                                        {/* <td>{user.type_id.value == 3 && <span><i className="nav-icon fa fa-calendar-alt  fa-fw "></i></span>}
                                            {user.type_id.value == 2 && <span><i className="nav-icon fa fa-users  fa-fw "></i></span>}
                                            {user.type_id.value == 1 && <span><i className="nav-icon fa fa-calendar-alt  fa-fw "></i></span>}
                                            {user.type_id.value > 3 && <i className="fas fa-info-circle" title='Inventory Management'></i>}
                                        </td> */}
                                        <td>{<i className={`${user.iconname} text-${user.iconcolor}`} title={user.typename}></i>}</td>
                                        <td>
                                            {user.helpstatus_id.value == 1 && <div className='d-flex flex-column align-items-start'><span className='text-info font-weight-bold'>{user.statusName}</span></div>}
                                            {user.helpstatus_id.value == 2 && <div className='d-flex flex-column align-items-start'><span className='text-primary font-weight-bold'>{user.statusName}</span></div>}
                                            {user.helpstatus_id.value == 3 && <div className='d-flex flex-column align-items-start'><span className='text-success font-weight-bold'>{user.statusName}</span></div>}
                                        </td>
                                        <td>
                                            <span className='text-muted '>{user.helpstatus_id.value == 3 ? <span className='badge badge-success'>solved</span> : (user.helpstatus_id.value == 2 ? <span className='badge badge-primary'>{moment(user.created).fromNow(true)}</span> : <span className='badge badge-info'>{moment(user.created).fromNow(true)}</span>)}</span >
                                            
<br/>
                                            {moment(user.created).utcOffset("+05:30").format("DD MMM yyyy hh:mm A") }
                                            </td>

                                        <td>
                                            {user.helpstatus_id.value == 3 ? <span className='text-success fw-bold'> <i className="fas fa-check-circle text-success"></i></span> :
                                                <button className='btn btn-sm btn-info' onClick={() => handleApproved(user)} >Update</button>}
                                        </td>

                                    </tr>
                                )}

                                {!helpdesk &&
                                    <tr>
                                        <td colSpan="10">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {helpdesk && !helpdesk.length &&
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            <div className="p-2">No quries to display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {totalcount && <Pagination total={totalcount} sizes={sizelist} />}
                    </div>
                </div>
            </div>
            {updateList && <Modal show={show} onHide={() => setShow(false)} size='md' backdrop="static" className='overflow-hidden' scrollable>
                <Modal.Header className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title >Update Ticket# {updateList.id}</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setShow(false)}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="container">
                            <div className="row">
                                <p className='col-3 font-weight-bold'>Name</p>
                                <p className='col-1 font-weight-bold'>:</p>
                                <p className='col-8'>{updateList.userName}</p>
                            </div>
                            <div className="row">
                                <p className='col-3 font-weight-bold'>Employee#</p>
                                <p className='col-1 font-weight-bold'>:</p>
                                <p className='col-8'>{updateList.employeeID}</p>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <i className={`${updateList.iconname} text-${updateList.iconcolor} pr-2`} title={`${updateList.typename}`}></i>
                                    {updateList.typename}
                                </div>
                                <div className="col-3 text-right">
                                    {updateList.helpstatus_id.value == 1 && <span className='badge badge-info'>{updateList.statusName}</span>}
                                    {updateList.helpstatus_id.value == 2 && <span className='badge badge-primary'>{updateList.statusName}</span>}
                                    {updateList.helpstatus_id.value == 3 && <span className='badge badge-success'>Solved</span>}
                                </div>
                                {updateList.helpstatus_id.value != 3 && <div className="col-3 "><small className='badge badge-secondary'><em>{moment(updateList.created).fromNow()}</em></small></div>}
                            </div>
                            <div className="row">
                                <div className="col-12 p-2">
                                    <p className='m-0 font-weight-bold'>Employee Request</p>
                                    {updateList.employee_description}
                                </div>
                            </div>
                        </div>

                        <form className='form' onSubmit={handleSubmit(handleApprovedForm)} >
                            <div className='row'>
                                <div className='col-6'>
                                    <label className='form-select-label text-primary fw-bold'>Approver<span className='text-danger'>*</span></label>
                                    <select className={` form-select form-control  ${errors.approver_id ? 'is-invalid' : ''}`} {...register('approver_id')}>
                                        <option value=''>Select</option>
                                        {design && design.map(user =>
                                            <option value={user.designation_id} >{user.name}-{user.designationName}</option>
                                        )}
                                    </select>
                                </div>
                                <div className='col-6'>
                                    <label className='form-select-label  text-primary fw-bold'>Help Status<span className='text-danger'>*</span></label>
                                    <select className={` form-select form-control ${errors.helpstatus ? 'is-invalid' : ''}`} {...register('helpstatus')}>
                                        <option value=''>Select</option>
                                        {select && select.map(user =>
                                            <option value={user.value} >{user.label}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className='form-label text-primary fw-bold'> Status Description</label>
                                <textarea {...register("approved_description")} className='form-control'></textarea>
                            </div>
                            <div className='mt-3'>
                                <button className='btn btn-primary' onClick={handleSubmit}>update</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>

            </Modal>}


        </div>
    )
}
export default HelpDeskAdmin;
