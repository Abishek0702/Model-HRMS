import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Link, Spinner } from 'components';
import { Layout } from 'components/employees';
import { userService, alertService } from 'services';



export { EducationListing };

function EducationListing(props) {
    const [state, setState] = useState({});
    const [users, setUsers] = useState(null);
    const router = useRouter();


    useEffect(() => {


        handleList(props.user_id);

        return () => {
            setState({}); // This worked for me
        };

    }, []);

    const handleList = (id) => {
        userService.getByEducationId(id).then(x => {
            if (x.status != 0) {
                setUsers(x)
            }
        });
    }

    function handleDelete(e) {
        const result = confirm('Are You Delete This User',);
        let id = e.currentTarget.value;

        if (result) {
            userService.educationDelete(id).then(() => {
                alertService.success('User Deleted', { keepAfterRouteChange: true })
            }).catch(alertService.error);
            router.push('/employees')
        }
    }

    return (
         
            <div className="card">
                <div className="card-body p-0 mb-0  shadow-none text-start">
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead className='bg-dark bg-primary2'>
                                <tr>
                                    <th style={{ width: 'auto' }}>Course</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Insitution</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>University</th>
                                    <th style={{ width: 'auto' }}>Specialization</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>%</th>
                                    <th style={{ width: 'auto' }}>Year</th>
                                    <th style={{ width: 'auto' }}>Action</th>

                                </tr>
                            </thead>
                            <tbody>

                                {users && !users.length &&
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }

                                {!users &&
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <div className="p-2">No Education Details To Display</div>
                                        </td>
                                    </tr>
                                }
                                {users && users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.course}</td>
                                        <td>{user.institutionname}</td>
                                        <td className='hidden-xs hidden-sm'>{user.university}</td>
                                        <td className='hidden-xs hidden-sm'>{user.specialization}</td>
                                        <td>{user.percentage}</td>
                                        <td className='hidden-xs hidden-sm'>{user.yearofcompletion}</td>
                                        <td><nav className='d-flex gap-3'>
                                            <a className="mr-2  " value={user.id} onClick={handleDelete}><i className="fas fa-trash  text-danger" value={user.id}></i></a>
                                        </nav></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        
    );
}
