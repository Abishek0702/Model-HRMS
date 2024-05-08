import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userService } from 'services/user.service';
import { Link, Spinner } from 'components';

const ChangePassword = ({ user_id, user }) => {
    var email=user.email;

    const passwordSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Current Password  is required'),
        newPassword: Yup.string().required('New Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Password Must Match').required('Confirm Password is required'),
    });
    const formOptions = { resolver: yupResolver(passwordSchema) };

    const { register, handleSubmit, reset, formState: { errors } } = useForm(formOptions);

    function handleChangePassword(data) {
        // console.log('data:', data)
        const datav = { ...data, id: user_id, email: email };
        // console.log('data:', mergeId)
        userService.changePassword(user_id, datav)
    }

    return (
        <>
            <div className='row justify-content-center1'>
                <div className='col-lg-12'>
                     

                <div className="card shadow-none">

                    <div className="card-header p-0">
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <span className="navbar-brand text-white"   ><i className="nav-icon fa fa-unlock-alt  fa-fw "></i> Change Password</span>
                            
                        </nav>
                    </div>



                    <div className="card-body ">
                            <form onSubmit={handleSubmit(handleChangePassword)}>
                                <div>
                                    <label className='form-label text-primary'>Current Password<span className='text-danger'>*</span></label>
                                    <input {...register('currentPassword')} type='password' className='form-control' placeholder='Current Password' />
                                </div>
                                <p className='text-danger'>{errors.currentPassword?.message}</p>
                                <div>
                                    <label className='form-label text-primary'>New Password<span className='text-danger'>*</span></label>
                                    <input {...register('newPassword')} type='password' className='form-control' placeholder='New Password' />
                                </div>
                                <p className='text-danger'>{errors.newPassword?.message}</p>

                                <div>
                                    <label className='form-label text-primary'>Confirm Password<span className='text-danger'>*</span></label>
                                    <input {...register('confirmPassword')} type='password' className='form-control' placeholder='Confirm Password' />
                                </div>
                                <p className='text-danger'>{errors.confirmPassword?.message}</p>

                                <button type='submit' className='btn btn-primary mt-3' >Change Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword
