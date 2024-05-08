import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { Link, Spinner } from 'components';
 

import { PayslipAddEdit } from 'components/employees'

import { Layout } from 'components/employees';
import { userService, alertService } from 'services';
import Modal from 'react-bootstrap/Modal';


export { PayslipListing };

function PayslipListing(props) {
    const [state, setState] = useState({});
    const [users, setUsers] = useState(null);
    const [classadd, setClassAdd] = useState({ isShow: false });
    const [edit, setEdit] = useState({ isShow: false, editClass: '' });
    const [viewemployee, setViewEmployee] = useState({});
    const [view, setView] = useState({})
    const router = useRouter();

    useEffect(() => {
        handleList(props.user_id);
        return () => {
            setState({}); // This worked for me
        };
    }, []);



    function handleDelete(id) {
        const result = confirm('Are You Delete This Payslip#'+id);
        

        if (result) {
            userService.PayslipDelete(id).then(() => {
                alertService.success('Payslip Deleted', { keepAfterRouteChange: true });
                handleList(props.user_id);
            }).catch(alertService.error);
           
        }
    }

    const handleList = (id) => {
        userService.getByPayslipId(id).then(x => {
            console.log(x)
            if (x.status != 0) { setUsers(x); }
        });
    }

    return (

        <>
         
        
        <div className="card shadow-none">


        <div className="card-header p-0 shadow-none">

                <nav className="navbar  navbar-expand-lg shadow-none">
                    <a className="navbar-brand text-grey" > Employees Monthly Payslip</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">


                        </ul>
                    

                        <button onClick={() => setClassAdd({ isShow: true })}
                                                className="btn btn-sm btn-success text-white "><i class="fas fa-plus"></i> New Payslip</button>


                        
                    </div>
                </nav>
</div>






                <div className="card-body p-0 shadow-none text-start">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <thead className='bg-dark bg-primary2'>
                                <tr>
                                <th style={{ width: 'auto' }}>#</th>
                                <th style={{ width: 'auto' }}>Month</th>
                                <th style={{ width: 'auto' }}>EMPCODE</th>
                                <th style={{ width: 'auto' }}>EMPNAME</th>
                                <th style={{ width: 'auto' }}>CTC</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>	MonthlyGross</th>
                                   {/*  <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Basic</th>
                                    <th style={{ width: 'auto' }}>House Rent Allowance</th>
                                    <th style={{ width: 'auto' }} className='hidden-xs hidden-sm'>Other Allowance	</th>
                                    <th style={{ width: 'auto' }}>Total Deduction</th>
                                    <th style={{ width: 'auto' }}>Total Net Salary</th>
                                    <th style={{ width: 'auto' }}>Salarymonth</th> */}
                                    <th style={{ width: 'auto' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {users && users.map(Payee =>
                                    <tr key={Payee.pid} >
                                         <td>{Payee.pid}</td>
                                         <td> { moment(Payee.salarymonth).utcOffset("+05:30").format("MMM")}</td>
                                         <td>{Payee.EmployeeCode}</td>
                                         <td>{Payee.Name}</td>
                                         <td>{Payee.CTC}</td>
                                        <td>{Payee.MonthlyGross}</td>
                                         {/* <td className='hidden-xs hidden-sm'>{Payee.Basic}</td>
                                       <td className='hidden-xs hidden-sm'>{Payee.HouseRentAllowance}</td>
                                        <td className='hidden-xs hidden-sm'>{Payee.OtherAllowance}</td>
                                       
                                        <td className='hidden-xs hidden-sm'>{Payee.TotalDeduction}</td>
                                        <td className='hidden-xs hidden-sm'>{Payee.TotalNetSalary}</td>
                                        <td className='hidden-xs hidden-sm'>{moment(Payee.salarymonth).format('MMM')} </td> */}
                                        <td>

                                        <a className="mr-3"  style={{ cursor: "pointer" }} onClick={() => { setViewEmployee({ isShow: true, }), setView(Payee) }} ><i class="fas fa-eye text-success "></i></a>
                                            
                                        <a className="mr-3" onClick={() => setEdit({ isShow: true, editClass: Payee })}><i class="far fa-edit text-warning"></i></a>   

                                          <a className="mr-3" onClick={() => handleDelete(Payee.pid)}><i class="fas fa-trash  text-danger" ></i></a> 
                                            
                                           </td>
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
                                            <div className="p-2">No Payslip Details To Display</div>
                                        </td>
                                    </tr>
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




<Modal show={classadd.isShow} onHide={() => setClassAdd({ isShow: false })} size='md'>
                <Modal.Header>
                    <Modal.Title className='text-primary'>Create Class</Modal.Title>

                    <button className='close-btn bg-transparent' style={{border:"none",outline:"none"}} onClick={() => setClassAdd({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>


                    <PayslipAddEdit  user_id={props.user_id}  setUsers={setUsers} setClassAdd={setClassAdd}/>
                </Modal.Body>

            </Modal>
            <Modal show={edit.isShow} onHide={() => setEdit({ isShow: false })} size='md'>
                <Modal.Header>
                    <Modal.Title className='text-primary'>Edit Payslip</Modal.Title>

                    <button className='close-btn bg-transparent' style={{border:"none",outline:"none"}} onClick={() => setEdit({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>
                    {/* {JSON.stringify(edit.editClass)} */}
                    <PayslipAddEdit  user_id={props.user_id} classes={edit.editClass} setUsers={setUsers} setEdit={setEdit} />

                </Modal.Body>

            </Modal>




            <Modal show={viewemployee.isShow} onHide={() => setViewEmployee({ isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title>{view.EmployeeCode} - { moment(view.salarymonth).utcOffset("+05:30").format("MMM")} Month Payslip</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setViewEmployee({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>

                    <div class="table-responsive">
                    <table className="table font-weight-bold">
                            <tr> <td style={{ width: '60%' }} >P.No</td><td style={{ width: '10%' }}>:</td><td style={{ width: '40%' }}>{view.id}</td></tr>
                            <tr> <td style={{ width: '60%' }} >Emp Code</td>
                              <td style={{ width: '10%' }}>:</td><td style={{ width: '40%' }}>{view.EmployeeCode}</td></tr>
                            <tr>
                              <td style={{ width: '60%' }} >Emp Name</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.Name}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >DOJ</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}> { moment(view.DOJ).utcOffset("+05:30").format("MMM")}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >CTC</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.CTC}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Monthly Gross</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.MonthlyGross}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Basic&nbsp;</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.Basic}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >House Rent Allowance</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.HouseRentAllowance}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Other Allowance </td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.OtherAllowance}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Employer's Contribution to PF</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.EmployersContributiontoPF}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Employer's Contribution to ESI</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.EmployersContributiontoESI}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Employee's Contribution to PF</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.EmployeesContributiontoPF}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Employee's Contribution to ESI</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.EmployeesContributiontoESI}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Total Deduction </td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.TotalDeduction}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Total Net Salary</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.TotalNetSalary}</td>
                            </tr>
                            <tr>
                              <td style={{ width: '60%' }} >Remarks</td>
                             <td style={{ width: '10%' }}>:</td>
                              <td style={{ width: '40%' }}>{view.Remarks}</td>
                            </tr>
                        </table>

                    </div>
                </Modal.Body>
            </Modal>

            </>
       
    );
}
