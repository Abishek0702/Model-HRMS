import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import moment from 'moment'
import { Link, Spinner } from 'components';
import { Layout } from 'components/employees';
import { userService , alertService} from 'services';

import Pagination from 'next-pagination'

export default Holidays;

function Holidays(props) {
    //const user = props?.user;
    const user_id=props?.user_id
    const type=props?.type

    const [state, setState] = useState({});

    const [users, setUsers] = useState(null);
    const [totalcount, setCount] = useState(12);
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
        userService.getAllHolidays(user_id,page, size).then((x) => {
            		
            console.log(search)
           // if (typeof x !== 'undefined') { setUsers(x); }
           if (typeof x.posts !== 'undefined') { setUsers(x.posts); }
            if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
        });
    }

    
     

    

    return (
        <>
 
            <div className="card shadow-none">

                <div className="card-header p-0">
                    <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                        <span className="navbar-brand text-white"  ><i className="nav-icon fa fa-calendar-alt  fa-fw "></i> HOLIDAY CALENDAR 2023</span>
                        
                    </nav>
                </div>



                <div className="card-body p-0">

                    <div className="table-responsive">
                        <table className="table table-striped">
                        <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>#</th>
                                    <th style={{ width: 'auto' }}>Date    </th> 
                                    <th style={{ width: 'auto' }}>Day</th>
                                    
                                    <th style={{ width: 'auto' }}>National/Festival Holiday</th>
                                   
                                    
                                    
                                    {/* <th style={{ width: 'auto' }}>Holiday</th> */}
                                    

                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{  moment(user.date).format('DD MMM, YYYY')}  </td>
                                        <td>{user.day}</td>  
                                       
                                        <td>{user.name}</td>
                                       
                                        
                                        {/* <td>{user.session}</td>   */}
                                        
                                       
                                        
                                        
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
                                            <div className="p-2">No Holidays To Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {/* {totalcount && <Pagination total={totalcount} sizes={sizelist} search={search} />} */}

                    </div>
                </div>
            </div>
        </>
    );
}

