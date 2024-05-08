import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService, userService } from 'services';

export { ViewReference };

function ViewReference(props) {
    const user = props?.user;

    const validationSchema = Yup.object().shape({
        acknowledge: Yup.boolean().oneOf([true], "You must accept the acknowledge")
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(data) {
        if (confirm("Are You Verified All Details")) {
            return userService.updateReference(user.id, data)
                .then((x) => {
                    alertService.success(x.data)
                    props?.reloadFun()
                })
        }
    }

    return (

        <div className="container-fluid">
            <div className="main-body overflow-hidden">
                <div className="row ">
                    <div className="col-12 overflow-hidden">
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

                                            <tr> <td style={{ width: '40%' }}><i className="fas fa-user px-2"></i>Reporting Person Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.reportingpersonname}</td></tr>
                                            <tr> <td style={{ width: '40%' }}><i className="fas fa-solid fa-landmark  px-2"></i>Reporting Person Contact Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.contactnumber}</td></tr>
                                            <tr> <td style={{ width: '40%' }}><i className="fas fa-code-branch px-2"></i>Reporting Person Email Id</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.emailid}</td></tr>
                                            <tr> <td style={{ width: '30%' }}><i className="fas fa-file-invoice-dollar px-2"></i>HR Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.hrname}</td></tr>
                                            <tr> <td style={{ width: '30%' }}><i className="fas fa-at px-2"></i>HR Contact Number</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }} className="text-small"><span style={{ width: '80%' }}>{user?.hrcontactnumber}</span></td></tr>
                                            <tr> <td style={{ width: '30%' }}> <i className="fas fa-file-invoice px-2"></i>HR Email Id</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user?.hremailid}</td></tr>

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
        </div>

    );
}

