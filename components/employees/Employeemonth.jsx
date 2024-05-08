import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Link, Spinner } from 'components';
import { Layout } from 'components/employees';
import { userService , alertService} from 'services';
import moment from 'moment'

import Pagination from 'next-pagination'

export default Policies;

function Policies(props) {
    
    const reportdata=props?.Reportdata

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
        var size = router.query.size || 6;
        var search = router.query.search || '';
        
        console.log(search)

        handleList(page, size, search);


        return () => {
            setState({}); // This worked for me
        };

    }, []);

    const handleList = (page, size, search) => {
        userService.getAllReports(page, size, search).then((x) => {
            // setUsers(x)			
            console.log(search)
           // if (typeof x !== 'undefined') { setUsers(x); }
            if (typeof x.posts !== 'undefined') { setUsers(x.posts); }
            if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
        });
    }

    const addreport = () => {
        console.log("reportdata",reportdata)
        userService.addReport().then((x) => {
            location.reload();
        });
    }

     

    
    return (
        <>

            <div className="row">
                           <div className="col-lg-4">
            
                                <div className="card">

                                    <div className="card-header p-0">
                                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary2">
                                            <Link className="navbar-brand text-white" href='/employees' >Daily Reports</Link>
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
                                                <thead>
                                                    <tr>
                                                         
                                                        <th style={{ width: 'auto' }}>Date</th>
                                                        <th style={{ width: 'auto' }}>startTime</th>
                                                        <th style={{ width: 'auto' }}>endTime</th>
                                                        {/* <th style={{ width: 'auto' }}>Path</th> */}
                                                        {/* <th style={{ width: 'auto' }}>acknowledge</th> */}
                                                        
                                                         
                                                        

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users && users.map(user =>
                                                        <tr key={user.id}>
                                                           
                                                            <td>{ moment(user.startTime).format('YYYY-MM-DD')}</td>
                                                            <td>{ moment(user.startTime).format('HH:MM')}</td>
                                                            <td> {user.endTime && <span >{ moment(user.endTime).format('HH:MM')}</span> }  {!user.endTime && <span >--</span> }</td>
                                                            {/* <td>{user.path}</td> */}
                                                            {/* <td>{user.acknowledge}</td> */}
                                                            
                                                            {/* <td>{user.acknowledge >0 ? <p>Done</p> : <p>No</p>}</td> */}
                                                           
                                                            
                                                            
                                                        </tr>

                                                    )}
                                                    {!users &&
                                                        <tr>
                                                            <td colSpan="3">
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

                        </div>


                        <div className="col-lg-4">
            
                                <div className="card">

                                    <div className="card-header p-0">
                                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary2">
                                            <Link className="navbar-brand text-white" href='/employees' >Report </Link>
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

                                    <div className="card-body  ">

                                        {/* {JSON.stringify(reportdata)} */}

                                        {reportdata.rstatus ==1  &&  <p><a  className="btn btn-success btn-sm text-white" onClick={() => addreport()} >Start Report</a> </p>}

                                        {reportdata.rstatus ==2  &&  <p><a  className="btn btn-warning btn-sm text-white" onClick={() => addreport()} >End Report</a> </p>}

                                        {reportdata.rstatus ==3  &&  <p><a  className="btn btn-danger btn-sm text-white disabled"  >Completed Today</a> </p>}


                                        
                                    {/* <p>{user.acknowledge >0 ? <p></p> : <p> {type!="admin" &&<a  className="btn btn-success btn-sm text-white" onClick={() => viewDocument(user.path)} >View</a>}</p>}</p>
                                        <p>{user.acknowledge >0 ? <p className='text-success'>Acknowledged</p> : <p> {type=="admin" && <span className='text-danger'>No</span>} {type!="admin" && <a  className="btn btn-danger text-white btn-sm" onClick={() => acknowledge(user.id)} >Acknowledgement</a> }</p>}</p> */}
                                        

                                    </div>

                                 </div>   
                                 
                        </div>
            </div>



        </>
    );
}

