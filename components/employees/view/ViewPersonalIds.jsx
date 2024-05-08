import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService, userService } from 'services';

export { ViewPersonalIds };

function ViewPersonalIds(props) {
    const user = props?.user;

    const validationSchema = Yup.object().shape({
        acknowledge: Yup.boolean().oneOf([true], "You must accept the acknowledge")
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(data) {
        if (confirm("Are You Verified All Details")) {
            return userService.updatePersonalIds(user.id, data)
                .then((x) => {
                    alertService.success(x.data)
                    props?.reloadFun()
                })
        }
    }


    return (


        <div className="container-fluid">
            <div className="main-body ">
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
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-id-card text-primary2 px-2" ></i>Aadhar Card Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.aadharCardNumber}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-id-card text-primary2 px-2"></i>PAN Card Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.panCardNumber}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-id-card text-primary2 px-2"></i>Driving License Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.drivingLicenseNumber}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-calendar-alt px-2"></i>Licence Validity</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{(user?.licenseValidity)}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas    fa-regular fa-motorcycle px-2"></i>Vehicle Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }} className="text-small"><span style={{ width: '80%' }}>{user?.vehicleNumber}</span></td></tr>
                                        <tr> <td style={{ width: '30%' }}> <i className="fas fa-passport px-2"></i>Passport Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.passportNumber}</td></tr>
                                        <tr> <td style={{ width: '30%' }}> <i className="fas fa-calendar-alt px-2"></i>Passport Issue Date</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{(user?.passportIssueDate)}</td></tr>
                                        <tr> <td style={{ width: '30%' }}> <i className="fas fa-calendar-alt px-2"></i>Passport Expiry Date</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{(user?.passportExpiryDate)}</td></tr>

                                        <tr> <td style={{ width: '30%' }}><i className="fab  fa-linkedin px-2"></i>Linkedin Id</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.employeeLinkdinId}</td></tr>
                                        <tr> <td style={{ width: '30%' }}><i className="fas fa-solid fa-globe px-2"></i>Social Media handles</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.employeeSocialMediaHandles}</td></tr>

                                        {user.acknowledge == 0 &&
                                            <tr>
                                                <td style={{ width: '50%' }} colSpan="3">
                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                        <label className='form-labe'>Verifiy Your Details</label>
                                                        <div className="form-check mb-2">
                                                            <input {...register("acknowledge")} className={`form-check-input ${errors.acknowledge ? 'is-invalid' : ''} `} type="checkbox" id="flexCheckDefault" />
                                                            <label className="form-check-label" for="flexCheckDefault">All Details are cleared you must Acknowledge</label>
                                                        </div>
                                                        <button className='btn btn-sm btn-primary' type='submit'>Acknowledge</button>
                                                    </form>
                                                </td>
                                            </tr>}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

