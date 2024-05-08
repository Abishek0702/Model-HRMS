import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from 'components';
import { Layout } from 'components/employees';
import { userService, alertService } from 'services';
import moment from 'moment';



export { ExperienceListing };

function ExperienceListing(props) {
    const [state, setState] = useState({});
    const [users, setUsers] = useState(null);
    const [exp, setExp] = useState(null);
    const router = useRouter();


    useEffect(() => {
        handleList(props.user_id);

        return () => {
            setState({}); // This worked for me
        };

    }, []);

    const handleList = (id) => {
        console.log(id)
        userService.getByExperienceId(id).then(x => {
            if (x.posts[0]?.status == 1) {
                setUsers(x?.posts);
                setExp(x?.summary[0])
            }
        });
    }

    function handleDelete(e) {
        const result = confirm('Are You Delete This User',);
        let id = e.currentTarget.value;

        if (result) {
            userService.experienceDelete(id).then(() => {
                alertService.success('Data Deleted', { keepAfterRouteChange: true })
            }).catch(alertService.error);
            router.push('/employees')
        }
    }

    return (
       
            <div className="card shadow-none">
                <div className='card-header bg-primary1 '>
                    <nav className="navbar ">
                        <a className="navbar-brand text-white " href="#">Experience Details [GL10{props.user_id}]</a>
                        <div className="d-flex">
                            <ul className="navbar-nav mr-auto">
                            </ul>
                            <a className="navbar-brand   mx-3" onClick={() => handleList(props.user_id)} title='refresh'><i class="fas fa-sync"></i></a>
                        </div>
                    </nav>
                </div>

                {exp && <div className='row justify-content-center bg-primary mx-0 p-2'>
                    <span className='col-2 text-success text-start font-weight-bold'>Total Exp : {exp.totalYearsOfExperience} </span>
                    <span className='col-2 text-danger text-center font-weight-bold'>IT Exp : {exp.totalItExperience}</span>
                    <span className='col-3 text-danger text-center font-weight-bold'>Non-IT Exp : {exp.totalNonItExperience}</span>
                    <span className='col-2 text-danger text-center font-weight-bold'>Rel.Exp : {exp.relevantExperience}</span>
                    <span className='col-3 text-danger text-end font-weight-bold'>No Of Company : {exp.noOfCompaniesWorked}</span>
                </div>}
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className='bg-dark bg-primary2'>
                            <tr>
                                <th style={{ width: 'auto' }}>Company Name</th>
                                <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Department</th>
                                <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Designation</th>
                                <th style={{ width: 'auto' }}>Join</th>
                                <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Releave</th>
                                <th style={{ width: 'auto' }}>CTC</th>
                                <th style={{ width: 'auto' }}>Action</th>

                            </tr>
                        </thead>
                        <tbody>

                            {users && users.map(user =>
                                <tr key={user.id}>
                                    <td>{user.companyname}</td>
                                    <td>{user.department}</td>
                                    <td className='hidden-xs hidden-sm'>{user.designation}</td>
                                    <td className='hidden-xs hidden-sm'>{moment(user.fromDate).format('DD-MM-YYYY')}</td>
                                    <td>{moment(user.toDate).format('DD-MM-YYYY')}</td>
                                    <td className='hidden-xs hidden-sm'>{user.ctc}</td>
                                    <td><nav className='d-flex gap-3'>
                                        <button className="mr-2 btn" value={user.id} onClick={handleDelete}><i className="fas fa-trash  text-danger" value={user.id}></i></button>
                                    </nav></td>
                                </tr>
                            )}

                            {!users &&
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        <div className="p-2">No Experience Details To Display</div>
                                    </td>
                                </tr>
                            }

                            {users && !users.length &&
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            }



                        </tbody>
                    </table>
                </div>
            </div>
        
    );
}
