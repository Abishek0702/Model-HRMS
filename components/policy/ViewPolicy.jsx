import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Link, Spinner } from 'components';
import Pagination from 'next-pagination'
import AddEdit from 'components/policy/AddEdit';
import Modal from 'react-bootstrap/Modal';
import { alertService } from 'services';
import { policyService } from 'services/policy.service';
import { ModalBody, ModalHeader } from 'react-bootstrap';


function ViewPolicy(props) {
    // const [search, setSearch] = useState('') ------search--------
    const [policyAllList, setPolicyAllList] = useState(null);
    const [totalcount, setCount] = useState(0);

    const [show, setshow] = useState({ view: false, path: '', update: false, updateData: null });

    const router = useRouter();
    const sizelist = [6, 9, 12, 15];


    var page = router.query.page || 1;
    var size = router.query.size || 6;
    var search = router.query.search || '';

    useEffect(() => {

        console.log('^^^', router.query.page, router.query.size);
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || '';
        // var user_id = userid || ''; // default set

        // const subscription = userService.user.subscribe(x => {
        //     console.log('view user leave ID:', x)
        //     if (x != null) {
        //         setUserid(x.login_id)
        //         user_id = x.login_id;
        //     }
        // })

        handlePolicyList(page, size, search)
    }, []);

    const handlePolicyList = (page, size, search) => {
        setshow({ ...show, view: false })
        return policyService.policyList(page, size, search)
            .then((data) => {
                console.log("policy data", data);
                if (typeof data.posts !== 'undefined') { setPolicyAllList(data.posts) }
                if (typeof data.numRows !== 'undefined') { setCount(data.numRows) }
            })
    }

    const handleDelete = (id) => {
        if (confirm("Are you sure want to delete this policy #"+id)) {
            return policyService.policyRemove(id)
                .then(data => {
                    alertService.success(data.message)
                    handlePolicyList(page, size, search)
                })
                .catch((err) => {
                    alertService.error(err.message)
                })
        }
    }

    return (
        <div>
            <div className='row p-3'>
                <div className='col-lg-8'>
                    <div className="card  shadow-none">

                    <div className='card-header   text-white p-1'>
                            <a className="navbar-brand text-white"  >Policy List</a>
                        </div>
                        
                        <div className="card-body p-0 overflow-auto">
                            <table className="table table-striped">
                                <thead className='bg-primary2 '>
                                    <tr>
                                        <th style={{ width: 'auto' }} className='text-white'>#</th>
                                        <th style={{ width: 'auto' }} className='text-white'>File Name</th>
                                        <th style={{ width: 'auto' }} className='text-white'>Description</th>
                                        {/* <th style={{ width: 'auto' }} className='text-white'>File Path</th> */}
                                        <th style={{ width: 'auto' }} className='text-white'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {policyAllList && policyAllList.map(data =>
                                        <tr key={data.id} className='h-100'>
                                            <td>{data.id}</td>
                                            <td>{data.name}</td>
                                            <td>{data.description}</td>
                                            {/* <td>{data.path}</td> */}
                                            <td>
                                                <div className='d-flex alig-items-center'>
                                                    <span style={{ cursor: "pointer", display: "block" }} onClick={() => setshow({ view: true, path: data.path, update: false })}><i class="fas fa-eye text-success"></i></span>
                                                    <span style={{ cursor: "pointer", display: "block" }} onClick={() => setshow({ view: true, path: data.path, update: true, updateData: data })}><i class="far fa-edit px-3 text-warning"></i></span>
                                                    <span style={{ cursor: "pointer", display: "block" }} onClick={() => handleDelete(data.id)}><i class="fas fa-trash text-danger"></i></span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {!policyAllList &&
                                        <tr>
                                            <td colSpan="4">
                                                <Spinner />
                                            </td>
                                        </tr>
                                    }
                                    {policyAllList && !policyAllList.length &&
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                <div className="p-2">No Policies to Display</div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        {totalcount && <Pagination total={totalcount} sizes={sizelist} />}
                    </div>
                </div>


                <div className='col-lg-4' >
                    <div className='card  shadow-none'>
                        <div className='card-header   text-white p-1'>
                            <a className="navbar-brand text-white"  >Add Policy</a>
                        </div>
                        <div className='card-body'>
                            <AddEdit reloadCallback={handlePolicyList} />
                        </div>
                    </div>

                </div>
            </div>


            <Modal show={show.view} onHide={() => { setshow({ ...show, view: false }) }} size='md' backdrop="static">
                <ModalHeader className='bg-primary2   align-items-center'>
                    <Modal.Title className='text-white'>{show.update ? 'Update' : 'View'}</Modal.Title>
                    <button className='close-btn bg-transparent' style={{ border: "none", outline: "none" }} onClick={() => { setshow({ ...show, view: false }) }}><i className='fas fa-times text-white'></i></button>
                </ModalHeader>
                <ModalBody className={!show.update && "p-0"}>
                    {/* {show.update && JSON.stringify(show.updateData)} */}
                    {
                        show.update ? <AddEdit updatePolicy={show.updateData} reloadCallback={handlePolicyList} /> :
                            <iframe src={show.path} width={"100%"} height={"500px"}></iframe>
                    }
                </ModalBody>
            </Modal>
        </div>


    )

}

export default ViewPolicy
