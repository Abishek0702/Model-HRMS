import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link } from 'components';
import { userService, alertService } from 'services';
import { useEffect, useState } from 'react';


export { Address };

function Address(props) {
    const user = props?.user;
    const isAddMode = !user;
    const router = useRouter();

    // useEffect(() => {
    //     handleDropDown();
    //     return;
    // }, []);

    // const handleDropDown = async () => {
    //     await userService.dropDown().then(x => setDesignation(x.designations));
    //     await userService.dropDown().then(x => setDepartment(x.departments));
    // }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Email is Invalid').required('Eamil is required'),
        name: Yup.string().required('Fullname is required'),
        phone_number: Yup.string().required('Phone number is required'),
        password: Yup.string().transform(x => x === '' ? undefined : x).concat(isAddMode ? Yup.string().required('Password is required') : null).min(6, 'Password must be at least 6 characters'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    if (!isAddMode) {
        formOptions.defaultValues = user;
    } else {
        formOptions.defaultValues = { designation_id: "8", department_id: "3", country: "India", state: "Tamilnadu" };
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;


    function onSubmit(data) {
        console.log('data:', data)
        return isAddMode
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        console.log('emp_reg...', data);
        return userService.register(data)
            .then((res) => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        console.log('update', data);
        return userService.update(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='p-3' >
                <table className='table'>

                    <tbody>
                        <tr style={{ width: "100%" }}>
                            <td style={{ width: "47.5%" }}>
                                <div className="form-group">
                                    <label>Address </label>
                                    <textarea name="address" {...register('address')} cols={100} rows={4} className={`form-control  ${errors.address ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.address?.message}</div>
                                </div>
                            </td>
                            <td style={{ width: "5%" }}></td>
                            <td style={{ width: "47.5%" }}>
                                <div className="form-group">
                                    <label>Permanent Address </label>
                                    <textarea name="PermanentAddress" {...register('PermanentAddress')} cols={100} rows={4} className={`form-control  ${errors.PermanentAddress ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.PermanentAddress?.message}</div>
                                </div>
                            </td>

                        </tr>
                    </tbody>
                </table>
                <div className="form-group d-flex justify-content-center" style={{ width: "100%" }}>
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    {/* <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button> */}
                    {/* <Link href="/employees" className="btn btn-link">Cancel</Link> */}
                </div>
            </form >
        </>
    );
}
