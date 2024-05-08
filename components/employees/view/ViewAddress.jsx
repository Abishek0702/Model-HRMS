import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService, userService } from 'services';

export { ViewAddress };

function ViewAddress(props) {
    const user = props?.user;

    // const validationSchema = Yup.object().shape({
    //     acknowledge: Yup.boolean().oneOf([true], "You must accept the acknowledge")
    // });

    // const formOptions = { resolver: yupResolver(validationSchema) };

    // const { register, handleSubmit, formState } = useForm(formOptions);

    // const { errors } = formState;

    // function onSubmit(data) {
    //     console.log(data);

    //     return userService.updateReference(user.id, data)
    //         .then((x) => {
    //             alertService.success(x.data)
    //             props?.reloadFun()
    //         })
    // }

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
                                            <tr>
                                                <td style={{ width: 'auto' }}><i class="fas fa-map-marker-alt px-2"></i>Present Address</td>
                                                <td style={{ width: 'auto' }}>:</td>
                                                <td style={{ width: 'auto' }}>{user?.address}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: 'auto' }}><i class="fas fa-house-user px-2"></i>Permanent Address</td>
                                                <td style={{ width: 'auto' }}>:</td>
                                                <td style={{ width: 'auto' }}>{user?.PermanentAddress}</td>
                                            </tr>

                                            {/* {user.acknowledge == 0 &&
                                                <tr>
                                                    <td style={{ width: '50%' }} colSpan="3">
                                                        <form onSubmit={handleSubmit(onSubmit)}>
                                                            <label className='form-labe'>Verifiy Your Details</label>
                                                            <div class="form-check mb-2">
                                                                <input {...register("acknowledge")} className={`form-check-input ${errors.acknowledge ? 'is-invalid' : ''} `} type="checkbox" id="flexCheckDefault" />
                                                                <label class="form-check-label" for="flexCheckDefault">All Details are cleared you must Acknowledge</label>
                                                            </div>
                                                            <button className='btn btn-sm btn-primary' type='submit'>Acknowledge</button>
                                                        </form>
                                                    </td>
                                                </tr>} */}
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

