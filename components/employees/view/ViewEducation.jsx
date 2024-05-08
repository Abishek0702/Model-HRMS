
import { Spinner } from 'components';
import { alertService, userService } from 'services'
export { ViewEducation };

function ViewEducation(props) {

    const users = props?.user;

    function onSubmit(id) {
        if (confirm("Are You Verified All Details")) {
            return userService.educationUpdate(id, { "remarks": "All Data is Verifyed", "acknowledge": 1 })
                .then((x) => {
                    alertService.success(x.data)
                    props?.reloadFun()
                })
        }
    }

    return (
        <>

            <div className="card shadow-none p-0 m-0">
                <div className=" shadow-none text-start card-body p-0 m-0">
                    <div className="table-responsive">
                        <table className="table table-striped  mb-0">
                            <thead className='bg-dark bg-primary2 '>
                                <tr>
                                    <th style={{ width: 'auto' }}> Course </th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Insitution</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>University</th>
                                    <th style={{ width: 'auto' }}> Specialization </th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>%</th>
                                    <th style={{ width: 'auto' }}>Year</th>
                                    <th style={{ width: 'auto' }}>Verifiy data</th>
                                </tr>
                            </thead>
                            <tbody>

                                {users && users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.course}</td>
                                        <td>{user.institutionname}</td>
                                        <td className='hidden-xs hidden-sm'>{user.university}</td>
                                        <td className='hidden-xs hidden-sm'>{user.specialization}</td>
                                        <td>{user.percentage}</td>
                                        <td className='hidden-xs hidden-sm'>{user.yearofcompletion}</td>
                                        <td>
                                            {user?.acknowledge == 0 ? <button className={`btn btn-sm btn-danger`} onClick={() => onSubmit(user.id)}>Acknowledge</button> :
                                                <span className='text-success fw-bolder'>Acknowledged</span>}
                                        </td>
                                    </tr>
                                )}

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

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    );

}