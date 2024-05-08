import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Spinner } from 'components';
import { inventoryService } from 'services/inventory.service';
import Pagination from 'next-pagination'
import Modal from 'react-bootstrap/Modal';
import AddEdit from './AddEdit';
import { alertService } from 'services';

const ViewAssets = () => {
    const [assets, setAssets] = useState(null);
    const [assetsUpdate, setAssetsUpdate] = useState(null);
    // const [search, setSearch] = useState('');
    const [totalcount, setCount] = useState(0);

    const [vendorDropdown, setVendorDropdown] = useState(null);


    const [show, setShow] = useState(false); // modal toggle
    const [view, setView] = useState(false); // modal toggle
    const router = useRouter();
    const sizelist = [10, 15, 20, 25];

    var it_id = router.query.id;
    var page = router.query.page || 1;
    var size = router.query.size || 10;
    var search = router.query.search || '';

    useEffect(() => {

        handleAssetsList(it_id, page, size, search);
        handleVendorListDropdown();

    }, []);

    const handleAssetsList = (it_id, page, size, search) => {
        setShow(false)
        inventoryService.getAllAssets(it_id, page, size, search).then((x) => {
            if (typeof x.posts !== 'undefined') { setAssets(x.posts); }
            if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
        });
    }

    const handleVendorListDropdown = () => {
        inventoryService.dropdownList()
            .then((x) => {
                if (typeof x.inventoryVendor !== 'undefined') { setVendorDropdown(x.inventoryVendor); }
            })
    }

    const handleUpdate = (data) => {
        setShow(true)
        setAssetsUpdate(data)
    }

    const handleView = (data) => {
        setShow(true)
        setView(true)
        setAssetsUpdate(data)
    }

    const handleDelete = (id) => {
        if (confirm("Confirm to delete " + id)) {
            return inventoryService.assetsDelete(id)
                .then((data) => {
                    alertService.success(data.message)
                    callback()
                })
                .catch((err) => {
                    alertService.error(err.message)
                })
        }
    }

    const callback = () => {
        handleAssetsList(it_id, page, size, search)
    }

    return (
        <div className='row mt-2'>
            <div className='col-lg-8'>
                <div className="card shadow-none">
                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <span className="navbar-brand text-white "><i className="fa fa-file  fa-fw text-dark"></i> Assets </span>
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
                    </div>

                    <div className="card-body p-0">
                        <table className="table table-striped">
                            <thead className='bg-primary2 '>
                                <tr>
                                    <th style={{ width: 'auto' }} className='text-white'>S.NO</th>
                                    <th style={{ width: 'auto' }} className='text-white'>Asset ID</th>
                                    <th style={{ width: 'auto' }} className='text-white'>Asset Name</th>
                                    <th style={{ width: 'auto' }} className='text-white'>Vendor Name</th>
                                    <th style={{ width: 'auto' }} className='text-white'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets && assets.map(data =>
                                    <tr key={data.id}>
                                        <td>{data.id}</td>
                                        <td>{data.assert_id}</td>
                                        <td>{data.name}</td>
                                        <td>{data.vendor_name}</td>
                                        <td>
                                            <span style={{ cursor: "pointer" }} onClick={() => handleView(data)}><i className="fas fa-eye text-success"></i></span>
                                            <span style={{ cursor: "pointer" }} onClick={() => handleUpdate(data)}><i className="far fa-edit px-3 text-warning"></i></span>
                                            <span style={{ cursor: "pointer" }} onClick={() => handleDelete(data.id)}><i className="fas fa-trash text-danger"></i></span>
                                        </td>
                                    </tr>
                                )}
                                {!assets &&
                                    <tr>
                                        <td colSpan="10">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {assets && !assets.length &&
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            <div className="p-2">No Assets to Display</div>
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
                            <span className="navbar-brand text-white ">Add Assets</span>
                        </nav>
                    </div>

                    <div className='card-body p-2'>
                        {vendorDropdown && <AddEdit callback={callback} vendorDropdown={vendorDropdown} />}
                    </div>
                </div>
            </div>



            <Modal show={show} onHide={() => { setShow(false), setView(false) }} size='md' backdrop="static">
                <Modal.Header className='bg-primary p-2 px-3 d-flex align-items-center'>
                    <Modal.Title className='text-white'>{!view ? "Update Details" : "View Details"}</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => { setShow(false), setView(false) }}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>
                    {!view ? <AddEdit assetsUpdate={assetsUpdate} vendorDropdown={vendorDropdown} callback={callback} />
                        :
                        <table className="table table-striped">
                            <tr> <td style={{ width: '30%' }}>Asset Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{assetsUpdate.name}</td></tr>
                            <tr> <td style={{ width: '30%' }}>Asset ID</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{assetsUpdate.assert_id}</td></tr>
                            <tr> <td style={{ width: '30%' }}>Vendor Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{assetsUpdate.vendor_name}</td></tr>
                            <tr> <td style={{ width: '30%' }}>Asset Type</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{assetsUpdate.type_name}</td></tr>
                            <tr> <td style={{ width: '30%' }}>Specification</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>
                                <textarea className='form-control ' disabled>{assetsUpdate.description}</textarea></td></tr>
                        </table>
                    }
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default ViewAssets

