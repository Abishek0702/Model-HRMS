import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { PersonalId };

function PersonalId(props) {
    console.log(props)
    const personalids = props.p_id;
    const isAddMode = !personalids;
    const user_id = props.user_id;
    const p_id = personalids?.id
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        aadharCardNumber: Yup.string().required('Aadhar card number is required'),
        panCardNumber: Yup.string().required('Pancard number is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    if (!isAddMode) {
        formOptions.defaultValues = props.p_id;
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(dataes) {
        let data = { ...dataes, user_id }
        console.log('data:', data)
        return isAddMode
            ? createUser(data)
            : updateUser(p_id, data);
    }

    function createUser(data) {


        console.log('emp_reg...', data);
        return userService.createPersonalIds(data)
            .then((res) => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return userService.updatePersonalIds(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <table className='table table-striped'>
                    <tr>
                        <th style={{ width: '35%' }}><label>Aadhar card number <span className='text-danger '>*</span></label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='aadharCardNumber' {...register('aadharCardNumber')} className={`form-control ${errors.aadharCardNumber ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.aadharCardNumber?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Pan card number <span className='text-danger '>*</span></label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='panCardNumber' {...register('panCardNumber')} className={`form-control ${errors.panCardNumber ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.panCardNumber?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Driving license number</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='drivingLicenseNumber' {...register('drivingLicenseNumber')} className={`form-control ${errors.drivingLicenseNumber ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.drivingLicenseNumber?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>License validity</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='licenseValidity' type='date' {...register('licenseValidity')} className={`form-control ${errors.licenseValidity ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.licenseValidity?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Vehicle number</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='vehicleNumber' {...register('vehicleNumber')} className={`form-control ${errors.vehicleNumber ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.vehicleNumber?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Passport number</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='passportNumber' {...register('passportNumber')} className={`form-control ${errors.passportNumber ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.passportNumber?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Passport issue date</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='passportIssueDate' type='date' {...register('passportIssueDate')} className={`form-control ${errors.passportIssueDate ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.passportIssueDate?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Passport expiry date</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='passportExpiryDate' type='date' {...register('passportExpiryDate')} className={`form-control ${errors.passportExpiryDate ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.passportExpiryDate?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Employee LinkedIn ID</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='employeeLinkdinId' {...register('employeeLinkdinId')} className={`form-control ${errors.employeeLinkdinId ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.employeeLinkdinId?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Social media handles</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='employeeSocialMediaHandles' {...register('employeeSocialMediaHandles')} className={`form-control ${errors.employeeSocialMediaHandles ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.employeeSocialMediaHandles?.message}</div>
                        </td>
                    </tr>
                </table>
                <div className="form-group d-flex justify-content-center" style={{ width: "100%" }}>
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                    <Link href="/users" className="btn btn-link">Cancel</Link>
                </div>
            </form>
        </>
    )

}