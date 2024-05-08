import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService, alertService } from 'services';
import { useRouter } from 'next/router';

export { ReferenceDetail };

function ReferenceDetail(props) {
    console.log(props)
    const reference = props?.reference;
    const isAddMode = !reference;
    const user_id = props.user_id;
    const refId = reference?.id
    const router = useRouter();

    console.log(reference)

    const validationSchema = Yup.object().shape({
        reportingpersonname: Yup.string().required('Report person name is required'),
        hrname: Yup.string().required('HR Name is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    if (!isAddMode) {
        formOptions.defaultValues = props?.reference;
    }
    else {
        formOptions.defaultValues = { designation_id: "8", department_id: "3", country: "India", state: "Tamilnadu" };
    }
    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(dataes) {
        let data = { ...dataes, user_id }
        console.log('---------------data:', data)
        return isAddMode
            ? createUser(data)
            : updateUser(refId, data);
    }

    function createUser(data) {
        console.log('emp_reg...', data);
        return userService.createReferenceData(data)
            .then((res) => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return userService.updateReference(id, data)
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
                        <th style={{ width: '35%' }}><label>Reporting Person Name <span className='text-danger '>*</span></label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='reportingpersonname' {...register('reportingpersonname')} className={`form-control ${errors.reportingpersonname ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.reportingpersonname?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Reporting Person Contact Number</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='contactnumber' {...register('contactnumber')} type='number' className={`form-control ${errors.contactnumber ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.contactnumber?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>Reporting Person Email Id</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='emailid' {...register('emailid')} className={`form-control ${errors.emailid ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.emailid?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>HR Name <span className='text-danger '>*</span></label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='hrname'{...register('hrname')} className={`form-control ${errors.hrname ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.hrname?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>HR Contact Number</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='hrcontactnumber' {...register('hrcontactnumber')} className={`form-control ${errors.hrcontactnumber ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.hrcontactnumber?.message}</div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ width: '35%' }}><label>HR Email Id</label></th>
                        <th style={{ width: '5%' }}>:</th>
                        <td style={{ width: '60%' }}>
                            <input name='hremailid' {...register('hremailid')} className={`form-control ${errors.hremailid ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.hremailid?.message}</div>
                        </td>
                    </tr>
                </table>
                <div className="form-group d-flex justify-content-center" style={{ width: "100%" }}>
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                </div>
            </form>
        </>
    );
}
