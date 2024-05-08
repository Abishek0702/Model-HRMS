import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService } from 'services/alert.service';
import { userService } from 'services';
import { Spinner } from 'components';
import Pagination from 'next-pagination'
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';

export default HelpDeskUser;

function HelpDeskUser(props) {
 
    const router = useRouter();
    const [userid, setUserid] = useState(null);
    const [helpdesk, setHelpdesk] = useState([]);
    const [select, setSelect] = useState(null);
    const [totalcount, setCount] = useState(0);
    const [viewDesk, setViewDesk] = useState({});
    const [viewhelpDesk, setViewHelpDesk] = useState({});
    const sizelist = [6, 9, 12, 15];

    useEffect(() => {
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || '';
        var user_id = userid || '';

        const subscription = userService.user.subscribe(x => {
            if (x != null) {
                handleAdminList(page, size, search, x.id);
                setUserid(x.id);
                dropdownForm()
            }
           
        })

    }, []);

    const handleAdminList = (page, size, search, userid) => {
        userService.getDesk(page, size, search, userid)

            .then((x) => {
                if (typeof x.posts !== 'undefined') { setHelpdesk(x.posts); }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
            });
    }
    const validationSchema = Yup.object().shape({
        type_id: Yup.string().required('Type is required'),
        employee_description: Yup.string().required('Description is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    function handleDataSubmit(data) {
        const mergeApprover = { ...data, user_id: userid }
        return userService.getAddDesk(mergeApprover)
            .then((data) => {
                alertService.success(data.messege);
                handleAdminList(1, 6, '', userid)
                reset()
            })
            .catch((err) => {
                alertService.error(err.message)
            })
    }

    const dropdownForm = () => {
        userService.form()
            .then((x) => {
                if (typeof x.helpdesk_types !== 'undefined') { setSelect(x.helpdesk_types); }
            });
    }
    return (
        <div className='row  '>
            <div className='col-lg-8'>
                <div className="card shadow-none">
                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <a className="navbar-brand text-white"  ><i className="fas fa-info-circle"></i> HELPDESK</a>
                        </nav>
                    </div>

                    <div className="card-body p-0">
                        {/* {JSON.stringify(helpdesk)} */}
                        <table className="table table-striped">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>Ticket#</th>
                                    <th style={{ width: 'auto' }}>Type</th>
                                    <th style={{ width: 'auto' }}>Progress</th>
                                    <th style={{ width: 'auto' }}>Status</th>
                                    <th style={{ width: 'auto' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* (user.type_id.value) */}
                                {helpdesk && helpdesk.map(user =>
                                    <tr key={user.user_id}>
                                        <td>{user.id}</td>
                                        <td>{<i className={`${user.iconname} text-${user.iconcolor}`} title={user.typename}></i>}</td>
                                        <td>
                                            {user.helpstatus_id.value == 1 && <div className='d-flex flex-column align-items-start'><span className='text-info font-weight-bold'>{user.statusName}</span></div>}
                                            {user.helpstatus_id.value == 2 && <div className='d-flex flex-column align-items-start'><span className='text-primary font-weight-bold'>{user.statusName}</span></div>}
                                            {user.helpstatus_id.value == 3 && <div className='d-flex flex-column align-items-start'><span className='text-success font-weight-bold'>{user.statusName}</span></div>}
                                        </td>
                                        <td><span className='text-muted '>{user.helpstatus_id.value == 3 ? <span className='badge badge-success'>solved</span> : (user.helpstatus_id.value == 2 ? <span className='badge badge-primary'>{moment(user.created).fromNow(true)}</span> : <span className='badge badge-info'>{moment(user.created).fromNow(true)}</span>)}</span ></td>
                                        <td><span style={{ cursor: "pointer" }} onClick={() => { setViewDesk({ isShow: true }), setViewHelpDesk(user) }}><i className="fas fa-eye text-success"></i></span></td>
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
                                            <div className="p-2">Add Your Quries</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {totalcount && <Pagination total={totalcount} sizes={sizelist} />}
                    </div>
                </div>
            </div>
            <div className='col-lg-4'>
                <div className='card shadow-none'>
                    <div className='card-header'>
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <a className="navbar-brand text-white" >Add Queries</a>
                        </nav>
                    </div>
                    <div className='card-body'>
                        <form onSubmit={handleSubmit(handleDataSubmit)}>
                            <div className="form-group">
                                <label className='text-primary' htmlFor="st" >Type <span className='text-danger'>*</span></label>
                                <select className={` form-select form-control ${errors.type_id ? 'is-invalid' : ''}`} {...register('type_id')}>
                                    <option value="">Select</option>
                                    {select && select.map(user => <option value={user.value} key={user.value}>{user.label}</option>

                                    )}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className='text-primary' htmlFor="st" >Description <span className='text-danger'>*</span></label>
                                <textarea type="text" className={` form-control ${errors.employee_description ? 'is-invalid' : ''}`} {...register('employee_description')} id="st" ></textarea>
                            </div>
                            <div className="d-flex gap-3">

                                <button type='submit' className="btn btn-primary mr-3 ">Submit</button>
                                <button type="button" onClick={() => { reset(formOptions.defaultValues) }} disabled={formState.isSubmitting} className="btn btn-secondary" >Clear</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            {viewDesk.isShow && <Modal show={viewDesk.isShow} onHide={() => setViewDesk({ isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white p-2 px-2 d-flex align-items-center'>
                    <Modal.Title>Ticket# {viewhelpDesk.id} </Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setViewDesk({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <i className={`${viewhelpDesk.iconname} text-${viewhelpDesk.iconcolor} pr-2`} title={`${viewhelpDesk.typename}`}></i>
                                    {viewhelpDesk.typename}
                                </div>
                                <div className="col-3 text-right">
                                    {viewhelpDesk.helpstatus_id.value == 1 && <span className='badge badge-info'>{viewhelpDesk.statusName}</span>}
                                    {viewhelpDesk.helpstatus_id.value == 2 && <span className='badge badge-primary'>{viewhelpDesk.statusName}</span>}
                                    {viewhelpDesk.helpstatus_id.value == 3 && <span className='badge badge-success'>Solved</span>}
                                </div>
                                {viewhelpDesk.helpstatus_id.value != 3 && <div className="col-3"><small className='badge badge-secondary'><em>{moment(viewhelpDesk.created).fromNow(true)}</em></small></div>}
                            </div>
                            <div className="row">
                                <div className="col p-2">
                                    <p className='m-0 font-weight-bold'>Your Feedback</p>
                                    {viewhelpDesk.employee_description}
                                </div>
                            </div>
                            {viewhelpDesk.approved_description != '-' &&
                                <div className="row">
                                    <div className="col p-2">
                                        <p className='font-weight-bolder'>Approver Feedback</p>
                                        {viewhelpDesk.approved_description}
                                    </div>
                                </div>}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>}
        </div>
    )
}
 