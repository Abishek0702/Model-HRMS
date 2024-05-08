import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Link, Spinner } from 'components';
import { Layout } from 'components/employees';
import { userService , alertService} from 'services';

import Pagination from 'next-pagination'

export default Policies;

function Policies(props) {
    //const user = props?.user;
    const user_id=props?.user_id
    const type=props?.type

    const [state, setState] = useState({});

    const [users, setUsers] = useState(null);
    const [totalcount, setCount] = useState(0);
    const [search, setSearch] = useState('')
    const router = useRouter();
    // const {id} =router.query;
    const sizelist = [6, 9, 12, 15];
 

    useEffect(() => {
       // console.log('^^^', router.query.page, router.query.size, router.query.search);
        var page = router.query.page || 1;
        var size = router.query.size || 15;
        var search = router.query.search || '';
        
        console.log(search)

        handleList(page, size, search);


        return () => {
            setState({}); // This worked for me
        };

    }, []);

    const handleList = (page, size, search) => {
        userService.getAllPolicies(user_id,page, size, search).then((x) => {
            // setUsers(x)			
            console.log(search)
           // if (typeof x !== 'undefined') { setUsers(x); }
            if (typeof x.posts !== 'undefined') { setUsers(x.posts); }
            if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
        });
    }

    function getSearch() {
        console.log(search)
        router.push(`/employees?&search=${search}`)
    }

    function acknowledge(policy_id) {
        console.log('policy:', policy_id,user_id);
        if(confirm("Are you sure want to ack policy#"+policy_id)){
        return userService.acknowledge(policy_id,user_id)
            .then((policy) => {
                // console.log('reg:', res.data);
                if (policy.status == 0) {
                    alertService.error('Acknowledgement error:' + policy.status);
                } else {
                    alertService.success('Acknowledgement successful', { keepAfterRouteChange: true });
                   
                    //router.push('/employees/view/'+user_id)
                    //router.push('/employees/myprofile');
                    location.reload();
                }
            })
            .catch(alertService.error);
        }
    }

    function viewDocument(userPath) {
        window.open(userPath, '_blank');
      }

    return (
        <>

            <div className="card shadow-none">

                <div className="card-header p-0">
                    <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                        <Link className="navbar-brand text-white" href='/employees' > <i className="nav-icon fa fa-file  fa-fw "></i> Policies</Link>
                        {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <input type='text' className='form-control' onChange={e => { setSearch(e.target.value) }} />
                                <input type='button' className='btn btn-dark' value='Search' onClick={getSearch} />
                            </ul>
                            <p className='btn'>
                                <Link href="/employees/add" className="btn btn-sm btn-light mb-2" style={{ height: 50, width: 50 }}>
                                    <Image src={addPerson} alt='addIcon'></Image>
                                </Link>
                            </p>

                        </div> */}
                    </nav>
                </div>



                <div className="card-body p-0">

                    <div className="table-responsive">
                        <table className="table table-striped">
                        <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>#</th>
                                    <th style={{ width: 'auto' }}>Policy</th>
                                    {/* <th style={{ width: 'auto' }}>Path</th> */}
                                    {/* <th style={{ width: 'auto' }}>acknowledge</th> */}
                                    
                                    <th style={{ width: 'auto' }}>Actions</th>
                                    

                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        {/* <td>{user.path}</td> */}
                                        {/* <td>{user.acknowledge}</td> */}
                                        
                                        {/* <td>{user.acknowledge >0 ? <p>Done</p> : <p>No</p>}</td> */}
                                        <nav className='d-flex gap-3'>
                                        <td><a  className="btn btn-success btn-sm text-white" onClick={() => viewDocument(user.path)} >View</a> 
                                            {/* {user.acknowledge >0 ? <p></p> : <p> {type!="admin" &&<a  className="btn btn-success btn-sm text-white" onClick={() => viewDocument(user.path)} >View</a>}</p>} */}
                                            </td>
                                        {/* <td>{user.acknowledge >0 ? <p className='text-success'>Acknowledged</p> : <p> {type=="admin" && <span className='text-danger'>No</span>} {type!="admin" && <a  className="btn btn-danger text-white btn-sm" onClick={() => acknowledge(user.id)} >Acknowledgement</a> }</p>}</td> */}
                                        </nav>
                                        
                                        
                                    </tr>

                                )}
                                {!users &&
                                    <tr>
                                        <td colSpan="4">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {users && !users.length &&
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <div className="p-2">No Users To Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {totalcount && <Pagination total={totalcount} sizes={sizelist} search={search} />}

                    </div>
                </div>
            </div>
        </>
    );
}

