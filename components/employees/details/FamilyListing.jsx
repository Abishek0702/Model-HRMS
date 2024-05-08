import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { Link, Spinner } from 'components';
import { Layout } from 'components/employees';
import { userService, alertService } from 'services';



export { FamilyListing };

function FamilyListing(props) {
    const [state, setState] = useState({});
    const [users, setUsers] = useState(null);
    const router = useRouter();

    useEffect(() => {
        handleList(props.user_id);
        return () => {
            setState({}); // This worked for me
        };
    }, []);



    function handleDelete(e) {
        const result = confirm('Are You Delete This User',);
        let id = e.currentTarget.value;

        if (result) {
            userService.familyDelete(id).then(() => {
                alertService.success('User Deleted', { keepAfterRouteChange: true })
            }).catch(alertService.error);
            router.push('/employees')
        }
    }

    const handleList = (id) => {
        userService.getByFamilyId(id).then(x => {
            console.log(x)
            if (x.status != 0) { setUsers(x); }
        });
    }

    return (
        
            <div className="card">
                <div className="card-body p-0 shadow-none text-start">
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead className='bg-dark bg-primary2'>
                                <tr>
                                    <th style={{ width: 'auto' }}>Relation</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Name</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Age</th>
                                    <th style={{ width: 'auto' }}>DOB</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Occupation</th>
                                    <th style={{ width: 'auto' }}>Working</th>
                                    <th style={{ width: 'auto' }}>Marital</th>
                                    <th style={{ width: 'auto' }}>Qualification</th>
                                    <th style={{ width: 'auto' }}>ResidingIn</th>
                                    <th style={{ width: 'auto' }}>Emergency</th>
                                    <th style={{ width: 'auto' }}>Contact</th>
                                    <th style={{ width: 'auto' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {users && users.map(user =>
                                    <tr key={user.id} >
                                        <td>{user.relationtype}</td>
                                        <td>{user.name}</td>
                                        <td className='hidden-xs hidden-sm'>{user.age}</td>
                                        <td className='hidden-xs hidden-sm'>{moment(user.dob).format('DD-MM-YYYY')}</td>
                                        <td className='hidden-xs hidden-sm'>{user.occupation}</td>
                                        <td>{user.currentworkstatus}</td>
                                        <td className='hidden-xs hidden-sm'>{user.maritalstatus}</td>
                                        <td className='hidden-xs hidden-sm'>{user.educationalqualification}</td>
                                        <td className='hidden-xs hidden-sm'>{user.residingin}</td>
                                        <td className='hidden-xs hidden-sm'>{user.emergencycontactperson == 1 ? 'Yes' : 'No'}</td>
                                        <td className='hidden-xs hidden-sm'>{user.contactnumber}</td>
                                        <td><nav className='d-flex gap-3'>
                                            <button className="mr-2 btn" value={user.id} onClick={handleDelete}><i className="fas fa-trash  text-danger" value={user.id}></i></button>

                                        </nav></td>
                                    </tr>)
                                }

                                {users && !users.length &&
                                    <tr>
                                        <td colSpan="12" className="text-center">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }

                                {!users &&
                                    <tr>
                                        <td colSpan="12" className="text-center">
                                            <div className="p-2">No Family Details To Display</div>
                                        </td>
                                    </tr>
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
       
    );
}
