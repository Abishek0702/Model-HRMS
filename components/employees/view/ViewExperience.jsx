import { useState, useEffect } from "react";
import { Layout } from '..';
import { Spinner } from 'components'
import { alertService, userService } from 'services';
import moment from "moment";

export { ViewExperience };

function ViewExperience(props) {
    const users = props?.user
    const exp = props?.exp

    function onSubmit(id) {
        if (confirm("Are You Verified All Details")) {
            return userService.experinceUpdate(id, { "remarks": "All Data is Verifyed", "acknowledge": 1 })
                .then((x) => {
                    alertService.success(x.data)
                    props?.reloadFun()
                })
        }
    }

    return (
        <>
            <div className="card p-0 m-0">
                <div className="  text-start card-body  p-0 m-0">
                    {exp && <div className='row justify-content-end p-2'>
                        <span className='col-2 text-primary text-start font-weight-bold'>Total Exp : {exp.totalYearsOfExperience}</span>
                        <span className='col-2 text-primary text-start font-weight-bold'>IT Exp : {exp.totalItExperience}</span>
                        <span className='col-3 text-primary text-start font-weight-bold'>Non-IT Exp : {exp.totalNonItExperience}</span>
                        <span className='col-2 text-primary text-start font-weight-bold'>Rel.Exp : {exp.relevantExperience}</span>
                        <span className='col-3 text-primary text-start font-weight-bold'>No of Companys : {exp.noOfCompaniesWorked}</span>
                    </div>}
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead className='bg-dark bg-primary2 '>
                                <tr>
                                    <th style={{ width: 'auto' }}> Company Name </th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Department</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Designation</th>
                                    <th style={{ width: 'auto' }}> Join </th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Releave</th>
                                    <th style={{ width: 'auto' }}>CTC</th>
                                    <th style={{ width: 'auto' }}>Verifiy data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.companyname}</td>
                                        <td>{user.department}</td>
                                        <td className='hidden-xs hidden-sm'>{user.designation}</td>
                                        <td className='hidden-xs hidden-sm'>{moment(user.fromDate).format("DD-MM-YYYY")}</td>
                                        <td>{moment(user.toDate).format("DD-MM-YYYY")}</td>
                                        <td className='hidden-xs hidden-sm'>{user.ctc}</td>
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
                                            <div className="p-2">No Experience Details To Display</div>
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

