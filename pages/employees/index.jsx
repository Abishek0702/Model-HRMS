import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import moment from 'moment'

import { Link, Spinner } from 'components';
import { Layout } from 'components/employees';
import { userService } from 'services';

import Pagination from 'next-pagination'

export default Index;

function Index(props) {
    const [state, setState] = useState({});

    const [users, setUsers] = useState(null);
    const [totalcount, setCount] = useState(0);
    const [search, setSearch] = useState('')
    const router = useRouter();
    const sizelist = [6, 9, 12, 15];

    useEffect(() => {
        console.log('^^^', router.query.page, router.query.size, router.query.search, props.userdata.designation);
        var page = router.query.page || 1;
        var size = router.query.size || 6;
        var search = router.query.search || ''

        console.log(search)

        handleList(page, size, search);


        return () => {
            setState({}); // This worked for me
        };

    }, []);

    const handleList = (page, size, search) => {
        userService.getAll(page, size, search).then((x) => {
            // setUsers(x)			
            console.log(search)
            if (typeof x.posts !== 'undefined') { setUsers(x.posts); }
            if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
        });
    }

    function handleDelete(e) {
        const result = confirm('Are You Delete This User',);
        let id = e.currentTarget.value;

        if (result) {
            userService.userDelete(id).then(() => {
                alertService.success('User Deleted', { keepAfterRouteChange: true })
            }).catch(alertService.error);
            router.push('/employees')
        }
    }

    function getSearch() {
        console.log(search)
        router.push(`/employees?&search=${search}`)
    }

    return (
        <Layout>
            {props.userdata.designation == "employee" && <div className="card">
                <div className="card-header   shadow-none text-info text-center">
                    Cant Able to Access This page , Only Admin can access this page
                </div>
            </div>}

            {props.userdata.designation != "employee" && <div className="card shadow-none">


                <div className="card-header p-0 shadow-none">

                    {/* <nav className="navbar  navbar-expand-lg shadow-none">
                    <a className="navbar-brand " href="#">Employees</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                        
                        
                        </ul>
                     <Link href="/employees/add" className="btn btn-sm btn-success text-white ">Add Employee </Link> 

                    
                    
                    </div>
                    </nav> */}

                    <nav className="navbar  navbar-expand-lg shadow-none">
                        <a className="navbar-brand text-grey" href="#"> Employees</a>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">


                            </ul>
                            {/* <Link href="/users/add" className="btn btn-sm btn-light mb-2">Add Form..</Link> */}


                            <div className="form-inline">
                                <div className="input-group" data-widget="sidebar-search">
                                    <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" onChange={e => { setSearch(e.target.value) }} onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            getSearch()
                                        }
                                    }} /><div className="input-group-append">
                                        <button className="btn btn-success" onClick={() => getSearch()}>
                                            <i className="fas fa-search fa-fw"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>





                <div className="card-body p-0">

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className='bg-dark bg-primary2'>
                                <tr>
                                    <th style={{ width: 'auto' }}>#</th>
                                    <th style={{ width: 'auto' }}>Emp#</th>
                                    <th style={{ width: 'auto' }}>Emp Name</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Gender</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>DOJ</th>
                                    {/* <th style={{ width: 'auto' }}>DOC</th>*/}
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Department</th>
                                    <th style={{ width: 'auto' }}>Designation</th>
                                    { /*<th style={{ width: 'auto' }}>Official Mail ID</th>
                                <th style={{ width: 'auto' }}>Status</th>*/}
                                    <th style={{ width: 'auto' }}>Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.employeeID}</td>
                                        <td>{user.name}</td>
                                        <td className='hidden-xs hidden-sm'>{user.gender}</td>
                                        <td className='hidden-xs hidden-sm'>{moment(user.date_of_joining).format('YYYY-MM-DD')}</td>
                                        {/* <td>{ moment(user.doc).format('YYYY-MM-DD')}</td>*/}
                                        <td className='hidden-xs hidden-sm'>{user.depname}</td>
                                        <td>{user.designationName}</td>
                                        {/* <td>{user.email}</td>
                                    <td>{user.status == 1 ? <p>Active</p> : <p>In Active</p>}</td>*/}

                                        <td><nav className='d-flex gap-3'>
                                            <Link className="mr-3" href={`/employees/view/${user.id}`}><i className="fa fa-eye fa-fw text-success"></i></Link>
                                            <Link className="mr-3" href={`/employees/edit/${user.id}`}><i className="far fa-edit text-warning"></i></Link>
                                            <a className="mr-3  " value={user.id} onClick={handleDelete}><i className="fas fa-trash  text-danger" value={user.id}></i></a>
                                        </nav></td>
                                    </tr>
                                )}
                                {!users &&
                                    <tr>
                                        <td colSpan="9">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {users && !users.length &&
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <div className="p-2">No EMP To Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {totalcount && <Pagination total={totalcount} sizes={sizelist} search={search} />}
                    </div>
                </div>
            </div>}
        </Layout>
    );
}
