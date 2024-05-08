import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router'
import { Link, Spinner } from 'components';
import { alertService } from 'services/alert.service';
import Pagination from 'next-pagination'
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { userService } from 'services';
import EmployeeMonthform from './AddEdit';
import { E_Month, Man } from '../index'

const Employeeofmonth = () => {

    const [userid, setUserid] = useState(null);
    const [employeeofmonth, setEmployeeofMonth] = useState(null);
    const [thisMonth, setThisMonth] = useState(null);
    const [search, setSearch] = useState('');
    const [totalcount, setCount] = useState(0);
    const [show, setShow] = useState({ isShow: false, });
    const [viewemployee, setViewEmployee] = useState({});
    const [view, setView] = useState({})
    const [updateUser, setUpdateUser] = useState("")
    const router = useRouter();
    const sizelist = [6, 9, 12, 15];

    var page = router.query.page || 1;
    var size = router.query.size || 6;

    useEffect(() => {
        // console.log('^^^', router.query.page, router.query.size);
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || '';
        var user_id = userid || '';

        const subscription = userService.user.subscribe(x => {

            if (x != null) {
                setUserid(x.id)
            }
        })
        handleAdminList(page, size, search);

    }, []);


    const handleAdminList = (page, size, search) => {
        setShow({ ...show, isShow: false })  // child hide model
        userService.getEmployeemonth(page, size, search)
            .then((x) => {
                console.log('x getEmployeemonth', x)
                if (typeof x.posts !== 'undefined') { setEmployeeofMonth(x.posts); }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
            });
    }

    function getSearch() {
        router.push(`/employeeofmonth?&search=${search}`)
    }

    const handleUpdate = (user) => {
        setShow({ isShow: true })
        setUpdateUser(user)
    }
    function typeRemove(id) {
        if (confirm("Confirm To Delete this " + "" + id)) {
            return userService.deleteEmployeemonth(id)
                .then(data => {
                    alertService.success(data.message)
                    setTimeout(() => {

                        router.push('/employeeofmonth')
                    }, 1000)
                })
                .catch((error) => {
                    alertService.error(error.message)
                })
        }
    }


    return (


        <div className='row mt-2' >
            <div className='col-lg-8'>
                <div className="card shadow-none">
                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <a className="navbar-brand text-white "> Employee Of Month </a>
                            <ul className="navbar-nav mr-auto">
                            </ul>
                            <div class="form-inline   navbar-expand-lg">
                                <div class="input-group" data-widget="sidebar-search">
                                    <input class="form-control" type="search" placeholder="Search" aria-label="Search"
                                        onChange={e => { setSearch(e.target.value) }}
                                        onKeyUp={e => {
                                            if (e.key === 'Enter') {
                                                getSearch()
                                            }
                                        }} />
                                    <div class="input-group-append">
                                        <button class="btn btn-success" onClick={() => getSearch()}>
                                            <i class="fas fa-search fa-fw"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>

                    </div>


                    <div className="card-body p-0 overflow-auto">
                        <table className="table table-striped">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>S.No</th>
                                    <th style={{ width: 'auto' }}>EmployeeID</th>
                                    <th style={{ width: 'auto' }}>UserName</th>
                                    <th style={{ width: 'auto' }}>Month</th>
                                    <th style={{ width: 'auto' }}>PresenterID</th>
                                    <th style={{ width: 'auto' }}>Title</th>
                                    <th style={{ width: 'auto' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeofmonth && employeeofmonth.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.employee_id}</td>
                                        <td>{user.name}</td>
                                        <td>{moment().month(user.display_month - 1).format("MMM").toString()}</td>
                                        <td>{user.presenter_id}</td>
                                        <td>{user.title}</td>

                                        <td >
                                            <div className='d-flex '>
                                                <span style={{ cursor: "pointer" }} onClick={() => { setViewEmployee({ isShow: true, }), setView(user) }} ><i class="fas fa-eye text-success "></i></span>
                                                <span style={{ cursor: "pointer" }} onClick={() => handleUpdate(user)} ><i class="far fa-edit text-warning px-3"></i></span>
                                                <span style={{ cursor: "pointer" }} onClick={() => { typeRemove(user.id) }}><i class="fas fa-trash  text-danger "></i> </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!employeeofmonth &&
                                    <tr>
                                        <td colSpan="10">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {employeeofmonth && !employeeofmonth.length &&
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            <div className="p-2">No Employees to Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {totalcount && <Pagination total={totalcount} sizes={sizelist} />}
                </div>
            </div>


            <div className='col-lg-4'>
                <div className='card shadow-none'>

                    <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                        <a className="navbar-brand text-white ">Add Employee Of Month </a>
                    </nav>
                    <div className='card-body  p-2'>
                        <EmployeeMonthform reloadCallback={handleAdminList} />
                    </div>
                </div>
            </div>




            <Modal show={show.isShow} onHide={() => setShow({ ...show, isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white d-flex align-items-center p-2'>
                    <Modal.Title >Update</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setShow({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>

                    <div className=''>
                        <EmployeeMonthform employeemonth={updateUser} reloadCallback={handleAdminList} />
                    </div>

                </Modal.Body>
            </Modal>


            <Modal show={viewemployee.isShow} onHide={() => setViewEmployee({ isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title>Employee Of Month</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setViewEmployee({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>

                    <div class="table-responsive">
                        <table className="table font-weight-bold">
                            <tr> <td style={{ width: '30%' }} >S.No</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.id}</td></tr>
                            <tr> <td style={{ width: '30%' }} >Employee ID</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.employee_id}</td></tr>
                            <tr> <td style={{ width: '30%' }} >Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.name}</td></tr>
                            <tr> <td style={{ width: '30%' }} >Month</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{moment().month(view.display_month - 1).format("MMM").toString()}</td></tr>
                            <tr> <td style={{ width: '30%' }} >Presenter ID</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.presenter_id}</td></tr>
                            <tr> <td style={{ width: '30%' }} >Title</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.title}</td></tr>
                            <tr> <td style={{ width: '30%' }} >Description</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.description}</td></tr>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>

        </div>





    )
}

export default Employeeofmonth;
