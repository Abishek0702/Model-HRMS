import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Spinner } from 'components';
import Pagination from 'next-pagination'
import Modal from 'react-bootstrap/Modal';
import { inventoryService } from 'services/inventory.service';
import { alertService } from 'services/alert.service';
import VendorForm from './AddEdit';

const ViewVendor = () => {
    const [totalcount, setCount] = useState(0);
    const [show, setShow] = useState({ isShow: false, });
    const [ViewVendor, setViewVendor] = useState({});
    const [view, setView] = useState({});
    const [updateUser, setUpdateUser] = useState('');
    const sizelist = [10, 15, 20, 25];
    const [vendor, setVendor] = useState(null)
    const router = useRouter();


    var page = router.query.page || 1;
    var size = router.query.size || 10;
    var search = router.query.search || '';


    useEffect(() => {

        handleAdminList(page, size, search);

    }, []);

    const handleAdminList = (page, size, search) => {
        setShow({ ...show, isShow: false })
        inventoryService.getVendor(page, size, search)
            .then((x) => {
                if (typeof x.posts !== 'undefined') { setVendor(x.posts); }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
            });
    }
    // function getSearch() {
    //     router.push(`/inventory/settings?&search=${search}`)
    // }

    function removeVendor(id) {

        if (confirm("Confirm to delete id :" + id)) {
            return inventoryService.deleteVendor(id)
                .then(data => {
                    alertService.success(data.message)
                    reloadcallback()
                })
                .catch((error) => {
                    alertService.error(error.message)
                })
        }
    }
    const handleUpdate = (user) => {
        setShow({ isShow: true })
        setUpdateUser(user)
    }

    function reloadcallback() {
        handleAdminList(page, size, search)
    }


    return (
        <div className='row mt-2'>
            <div className='col-lg-8'>
                <div className="card shadow-none">

                    <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                        <span className="navbar-brand text-white "><i class="fas fa-store"></i> Vendor</span >
                        <ul className="navbar-nav mr-auto">
                        </ul>
                        {/* <div className="form-inline   navbar-expand-lg">
                            <div className="input-group" data-widget="sidebar-search">
                                <input className="form-control" type="search" placeholder="Search" aria-label="Search"
                                    onChange={e => { setSearch(e.target.value) }}
                                    onKeyUp={e => {
                                        if (e.key === 'Enter') {
                                            getSearch()
                                        }
                                    }} />
                                <div className="input-group-append">
                                    <button className="btn btn-success" onClick={() => getSearch()}>
                                        <i className="fas fa-search fa-fw"></i>
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </nav>


                    <div className="card-body p-0 overflow-auto">
                        <table className="table table-striped ">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>S.NO</th>
                                    <th style={{ width: 'auto' }}>Name </th>
                                    <th style={{ width: 'auto' }}>City</th>
                                    <th style={{ width: 'auto' }}>Contact NO</th>
                                    <th style={{ width: 'auto' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendor && vendor.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.city}</td>
                                        <td>{user.contact_number}</td>
                                        <td className='d-flex'>
                                            <span style={{ cursor: "pointer" }} onClick={() => { setViewVendor({ isShow: true, }), setView(user) }} ><i className="fas fa-eye text-success "></i></span>
                                            <span style={{ cursor: "pointer" }} onClick={() => handleUpdate(user)} ><i className="far fa-edit text-warning px-3"></i></span>
                                            <span style={{ cursor: "pointer" }} onClick={() => { removeVendor(user.id) }}><i className="fas fa-trash  text-danger "></i> </span>
                                        </td>
                                    </tr>
                                )}
                                {!vendor &&
                                    <tr>
                                        <td colSpan="5">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {vendor && !vendor.length &&
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            <div className="p-2">No Vendors to Display</div>
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
                            <a className="navbar-brand text-white ">Add Vendor</a>
                        </nav>
                    </div>
                    <div className='card-body p-2'>
                        <VendorForm reloadcallback={reloadcallback} />
                    </div >
                </div >
            </div >


            <Modal show={show.isShow} onHide={() => setShow({ ...show, isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white d-flex align-items-center p-2'>
                    <Modal.Title >Update</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setShow({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>

                    <div className='card-body'>
                        <VendorForm vendor={updateUser} reloadcallback={reloadcallback} />
                    </div>

                </Modal.Body>
            </Modal>

            <Modal show={ViewVendor.isShow} onHide={() => setViewVendor({ isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title>Vendor</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setViewVendor({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table font-weight-bold">
                            <tr> <td style={{ width: '30%' }}>Vendor Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.name}</td></tr>
                            <tr> <td style={{ width: '30%' }}>ContactNumber</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.contact_number}</td></tr>
                            <tr> <td style={{ width: '30%' }}>EmailID</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.email}</td></tr>
                            <tr> <td style={{ width: '30%' }}>Address</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.address}</td></tr>
                            <tr> <td style={{ width: '30%' }}>City</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.city}</td></tr>
                            <tr> <td style={{ width: '30%' }}>State</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.state}</td></tr>
                            <tr> <td style={{ width: '30%' }}>Country</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.country}</td></tr>
                            <tr> <td style={{ width: '30%' }}>Pincode</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{view.pincode}</td></tr>
                        </table>
                    </div>

                </Modal.Body>
            </Modal>
        </div >
    )
}

export default ViewVendor


