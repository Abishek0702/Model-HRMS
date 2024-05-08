import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Link, Spinner } from 'components';
import Pagination from 'next-pagination'
import moment from 'moment';
import { userService } from 'services';
import Modal from 'react-bootstrap/Modal';
import { alertService } from 'services/alert.service';

import Eventform from './AddEdit';

const EventListing = () => {
    const [events, setEvents] = useState(null);
    const [search, setSearch] = useState('');
    const [totalcount, setCount] = useState(0);
    const [show, setShow] = useState({ isShow: false, });
    const [viewemployee, setViewEmployee] = useState({});
    const [view, setView] = useState({})
    const [updateUser, setUpdateUser] = useState("")
    const router = useRouter();
    const sizelist = [6, 9, 12, 15];

    useEffect(() => {
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || '';

        handleAdminList(page, size, search);
    }, []);


    const handleAdminList = (page, size, search) => {
        setShow({ ...show, isShow: false })  // child hide model
        userService.getAllEvents(page, size, search)
            .then((x) => {
                console.log('x getEmployeemonth', x)
                if (typeof x.posts !== 'undefined') { setEvents(x.posts); }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
            });
    }

    function getSearch() {
        router.push(`/events?&search=${search}`)
    }

    const handleUpdate = (user) => {
        setShow({ isShow: true })
        setUpdateUser(user)
    }
    function eventRemove(id) {

        if (confirm("Confirm to delete event: " + "" + id)) {
            return userService.eventDelete(id)
                .then(data => {
                    alertService.success(data.message)

                })
                .catch((error) => {
                    alertService.error(error.message)
                })
        }
    }


    return (


        <div className='row  p-3' >
            <div className='col-lg-8'>
                <div className="card shadow-none">
                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <span className="navbar-brand text-white "> Event List </span>
                            <ul className="navbar-nav mr-auto">
                            </ul>
                            {/* <div class="form-inline   navbar-expand-lg">
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
                            </div> */}
                        </nav>

                    </div>


                    <div className="card-body p-0 overflow-auto">
                        <table className="table table-striped">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>S.No</th>
                                    <th style={{ width: 'auto' }}>Type</th>
                                    <th style={{ width: 'auto' }}>Date</th>
                                    {/* <th style={{ width: 'auto' }}>Title</th> */}
                                    {/* <th style={{ width: 'auto' }}>Description</th> */}
                                    {/* <th style={{ width: 'auto' }}>Image</th> */}
                                    <th style={{ width: 'auto' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events && events.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.type_of_event}</td>
                                        <td>{user.event_date}</td>
                                        {/* <td>{user.title}</td> */}
                                        {/* <td>{user.description}</td> */}
                                        {/* <td>{user.path}</td> */}

                                        <td >
                                            <div className='d-flex '>
                                                <span style={{ cursor: "pointer" }} onClick={() => { setViewEmployee({ isShow: true, }), setView(user) }} ><i class="fas fa-eye text-success "></i></span>
                                                <span style={{ cursor: "pointer" }} onClick={() => handleUpdate(user)} ><i class="far fa-edit text-warning px-3"></i></span>
                                                <span style={{ cursor: "pointer" }} onClick={() => { eventRemove(user.id) }}><i class="fas fa-trash  text-danger "></i> </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!events &&
                                    <tr>
                                        <td colSpan="10">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {events && !events.length &&
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            <div className="p-2">No Events to Display</div>
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

                    <div className='card-header'>
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <a className="navbar-brand text-white ">Add Event List </a>
                        </nav>
                    </div>
                    <div className='card-body'>
                        <Eventform reloadCallback={handleAdminList} />
                    </div>
                </div>
            </div>




            <Modal show={show.isShow} onHide={() => setShow({ ...show, isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white d-flex align-items-center p-2'>
                    <Modal.Title >Update Event</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setShow({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>

                    <div className=''>
                        <Eventform events={updateUser} reloadCallback={handleAdminList} />
                    </div>

                </Modal.Body>
            </Modal>


            <Modal show={viewemployee.isShow} onHide={() => setViewEmployee({ isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title>Event Details</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setViewEmployee({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>

                    <div class="table-responsive">
                        <table className="table font-weight-bold">
                            <tr>
                                <td style={{ width: '30%' }} >S.No</td>
                                <td style={{ width: '10%' }}>:</td>
                                <td style={{ width: '50%' }}>{view.id}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '30%' }} >Event Type</td>
                                <td style={{ width: '10%' }}>:</td>
                                <td style={{ width: '50%' }}>{view.event_type_id}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '30%' }} >Date</td>
                                <td style={{ width: '10%' }}>:</td>
                                <td style={{ width: '50%' }}>{view.event_date}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '30%' }} >Title</td>
                                <td style={{ width: '10%' }}>:</td>
                                <td style={{ width: '50%' }}>{view.title}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '30%' }} >Description</td>
                                <td style={{ width: '10%' }}>:</td>
                                <td style={{ width: '50%' }}>
                                    <textarea className='form-control border border-0 bg-transparent' value={view.description} disabled></textarea>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </div>)
}

export default EventListing