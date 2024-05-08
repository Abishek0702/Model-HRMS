import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';

import { userService, alertService } from 'services';
import { EducationListing } from 'components/employees';
import { useRouter } from 'next/router';

export { EducationDetails };

function EducationDetails(props) {
    const [state, setState] = useState({});
    const user_id = props?.user_id;
    const Router = useRouter();

    const validationSchema = Yup.object().shape({
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(data) {
        console.log('data:', data)
        return createUser(data)
    }

    function createUser(data) {
        console.log('emp_reg...', data);
        return userService.createEducationData(data)
            .then(() => {
                alertService.success('User added', { keepAfterRouteChange: true });
                Router.push(`/employees/edit/${user_id}?section=educationInfo`);
            })
            .catch(alertService.error);


    }

    return (
        <div className='row'>
            <div className='col-8'>
                <EducationListing user_id={user_id} type='employee' />
            </div>
            <div className='col-4'>
                <div className='  shadow-none card' > 
                <div className='card-header bg-primary2 '>
                        <nav className=" navbar">
                            <a className="navbar-brand1 text-white" href="#">Education Details</a>
                        </nav>
                    </div>
                    <section className='card-body'>
                <form onSubmit={handleSubmit(onSubmit)} className=' '>
                     
                        <div className="form-row">
                            <div className="form-group col">
                                <input name='user_id' type='hidden' {...register("user_id")} defaultValue={user_id} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Course<span className='text-danger'>*</span></label>
                                <select name="course" {...register('course')} className={`form-control ${errors.course ? 'is-invalid' : ''}`}>
                                    <option value=''>Select..</option>
                                    <option value='SSLC'>SSLC</option>
                                    <option value='HSC'>HSC</option>
                                    <option value='Diplamo'>Diplamo</option>
                                    <option value='UG'>UG</option>
                                    <option value='PG'>PG</option>
                                </select>
                                <div className="invalid-feedback">{errors.course?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Institution<span className='text-danger'>*</span></label>
                                <input name="institutionname" type="text" {...register('institutionname')} className={`form-control ${errors.institutionname ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.institutionname?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>University<span className='text-danger'>*</span></label>
                                <input name="university" type="text" {...register('university')} className={`form-control ${errors.university ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.university?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Specialisation<span className='text-danger'>*</span></label>
                                <input name="specialization" type="text" {...register('specialization')} className={`form-control ${errors.specialization ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.specialization?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Percentage<span className='text-danger'>*</span></label>
                                <input name="percentage" type="text" {...register('percentage')} className={`form-control ${errors.percentage ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.percentage?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Year of completion<span className='text-danger'>*</span></label>
                                <input name="yearofcompletion" type="text" {...register('yearofcompletion')} className={`form-control ${errors.yearofcompletion ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.yearofcompletion?.message}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                            {/* <Link href="/employees" className="btn btn-link">Cancel</Link> */}
                        </div>
                   
                </form >
                </section>
                </div>
            </div>
        </div>
    );
}
