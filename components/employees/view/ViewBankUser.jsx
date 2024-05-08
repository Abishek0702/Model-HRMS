import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService, userService } from 'services';

export { ViewBankUser };

function ViewBankUser(props) {
    const user = props?.user;

    const validationSchema = Yup.object().shape({
        acknowledge: Yup.boolean().oneOf([true], "You must accept the acknowledge")
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(data) {
        if (confirm("Are You Verified All Details")) {
            return userService.updateBank(user.id, data)
                .then((x) => {
                    // alertService.success(x.data)
                    props?.reloadFun()
                })
        }
    }

    return (
        <div className="container-fluid">
            <div className="main-body">
                <div className="overflow-hidden">
                    <div className="ack-wrapper">
                        <div className={`ack-badge-wrapper ${user.acknowledge == 0 ? "not-acknowledged " : "acknowledged"}`}>
                            <span className="badge">{user.acknowledge == 0 ? "Not Yet Acknowledged" : "Acknowledged"}</span>
                        </div>
                    </div>
                    <div className="card pl-4">
                        <div className="card-body list-group">
                            <div className="row " >
                                <div className="table-responsive">
                                    <table className="table table-striped">

                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-user px-2"></i>Name as per Bank Account</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.nameAsPerBankAccount}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-solid fa-landmark  px-2"></i>Name of the Bank</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.bankName}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-code-branch px-2"></i>Branch Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.branchName}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-file-invoice-dollar px-2"></i>Account Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.accountNumber}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-at px-2"></i>IFSC Code</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }} className="text-small"><span style={{ width: '80%' }}>{user?.ifscCode}</span></td></tr>
                                        <tr> <td style={{ width: '30%' }}> <i className="fas fa-file-invoice px-2"></i>UAN</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.UAN}</td></tr>
                                        <tr>
                                            {/* <td style={{ width: '30%' }}>
                                                        <i className="fas fa-info-circle mr-1"></i><span>Acknowledge</span>
                                                    </td> */}
                                            {/* <td style={{ width: '10%' }}>:
                                                    </td> */}
                                            {user.acknowledge == 0 &&
                                                <td style={{ width: '50%' }} colSpan="3">

                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                        <div className='d-none'>
                                                            <label htmlFor="" className='form-labe fw-light' style={{ fontWeight: "100" }}>Remarks</label>
                                                            {/* <textarea {...register("remarks")} name="remarks" id="" className={`form-control mb-2  `} value={remarks} onChange={(e)=>setRemarks(e.target.value)}></textarea> */}
                                                            <textarea {...register("remarks")} name="remarks" id="" className={`form-control mb-2  `} value={"All data is verified"}></textarea>
                                                        </div>
                                                        <div className="form-check mb-2">
                                                            <input {...register("acknowledge")} className={`form-check-input ${errors.acknowledge ? 'is-invalid' : ''} `} type="checkbox" id="flexCheckDefault" />
                                                            <label className="form-check-label" for="flexCheckDefault">All Details  are  cleared you must Acknowledge</label>

                                                            {/* <span className="invalid-feedback p-0 m-0">{errors.acknowledge?.message}</span> */}
                                                        </div>
                                                        <button className='btn btn-sm btn-primary' type='submit'>Acknowledge</button>
                                                        {/* <button className='btn btn-sm btn-primary' type='submit'>Submit</button> */}
                                                    </form>

                                                </td>}

                                        </tr>

                                    </table>
                                    {/* <button className='btn btn-sm btn-primary'><i className="fas fa-check px-2"></i>Acknowledge</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

