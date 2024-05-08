import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';

export default Register;

function Register() {
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
		phoneNumber: Yup.string()
            .required('Phone Number is required'),
        username: Yup.string()
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
		console.log('reg',user);
        return userService.register(user)
            .then((res) => {
				   console.log('reg:',res.data,res.status);
				   if(res.status==0){
               		  alertService.error('Registration error:'+res.data);
				   }else{
					 alertService.success('Registration successful', { keepAfterRouteChange: true });
                      router.push('login');
				   }
            })
            .catch(alertService.error);
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Register</h4>
                <div className="card-body">
					<div className="row">

						..{JSON.stringify(register)}..
						<div className="col">
							<form onSubmit={handleSubmit(onSubmit)} className="row g-3">
							<div className="col-12">
									<label>User Name..</label>
									<input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
									<div className="invalid-feedback">{errors.firstName?.message}</div>
								</div>
								 
								<div className="col-12">
									<label>User Email</label>
									<input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
									<div className="invalid-feedback">{errors.username?.message}</div>
								</div>
								
								<div className="col-12">
									<label>User phoneNumber</label>
									<input name="phoneNumber" type="text" {...register('phoneNumber')} className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`} />
									<div className="invalid-feedback">{errors.phoneNumber?.message}</div>
								</div>


								<div className="col-12">
									<label>Password</label>
									<input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
									<div className="invalid-feedback">{errors.password?.message}</div>
								</div>
								<div className="col-12"> 
 <p></p>
								</div>
								<div className="col-12"> 
								<button disabled={formState.isSubmitting} className="btn btn-primary">
									{formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
									Register
								</button>
								<Link href="/account/login" className="btn btn-link">Cancel</Link>
							</div>
							</form>
						 </div>
           			 </div>
                </div>
            </div>
        </Layout>
    );
}