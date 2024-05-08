import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

import { Link } from 'components'
import { userService, alertService } from 'services';
import { FamilyListing ,ViewFamily} from 'components/employees'

export { FamilyDetails };

function FamilyDetails(props) {
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
        return userService.createFamilyData(data)
            .then(() => {
                alertService.success('User added', { keepAfterRouteChange: true });
                Router.push(`/employees/edit/${user_id}?section=familyInfo`)

            })
            .catch(alertService.error);
    }

    // function updateUser(id, data) {
    //     return userService.updateEducationData(id, data)
    //         .then(() => {
    //             alertService.success('User updated', { keepAfterRouteChange: true });
    //             router.push('/employees');
    //         })
    //         .catch(alertService.error);
    // }


    return (
        <div className='row'>
            <div className='col-8'>
                <ViewFamily user_id={user_id} type='admin' />
            </div>
            <div className='col-4'>
            <div className='  shadow-none card' > 
                <div className='card-header bg-primary2 '>
                        <nav className=" navbar">
                            <a className="navbar-brand1 text-white" href="#">Family Details</a>
                        </nav>
                    </div>
                    <section className='card-body'>
                
                <form onSubmit={handleSubmit(onSubmit)} className='     '>
                    
                        <div className="form-row">
                            <div className="form-group col">
                                <input name='user_id' type='hidden' {...register("user_id")} defaultValue={user_id} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Relation Type<span className='text-danger'>*</span></label>
                                <select name="relationtype" {...register('relationtype')} className={`form-control ${errors.relationtype ? 'is-invalid' : ''}`}>
                                    <option value=''>Select..</option>
                                    <option value='Father'>Father</option>
                                    <option value='Mother'>Mother</option>
                                    <option value='Spouse'>Spouse</option>
                                    <option value='Brother'>Brother</option>
                                    <option value='Sister'>Sister</option>
                                    <option value='Children'>Children</option>
                                </select>
                                <div className="invalid-feedback">{errors.relationtype?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Name<span className='text-danger'>*</span></label>
                                <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.name?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-4">
                                <label>Age<span className='text-danger'>*</span></label>
                                <input name="age" type="text" {...register('age')} className={`form-control ${errors.age ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.age?.message}</div>
                            </div>
                            <div className="form-group col-8">
                                <label>DOB<span className='text-danger'>*</span></label>
                                <input name="dob" type="date" {...register('dob')} className={`form-control ${errors.dob ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.dob?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Occupation<span className='text-danger'>*</span></label>
                                <input name="occupation" type="text" {...register('occupation')} className={`form-control ${errors.occupation ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.occupation?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Working Status<span className='text-danger'>*</span></label>
                                <input name="currentworkstatus" type="text" {...register('currentworkstatus')} className={`form-control ${errors.currentworkstatus ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.currentworkstatus?.message}</div>
                            </div>
                            <div className="form-group col">
                                <label>Marital Status<span className='text-danger'>*</span></label>
                                <select name='maritalstatus' {...register('maritalstatus')} className={`form-control ${errors.maritalstatus ? 'is-invalid' : ''}`} >
                                    <option value=''>Select..</option>
                                    <option value='Single'>Single</option>
                                    <option value='Married'>Married</option>
                                    <option value='Other'>Other</option>
                                </select>
                                <div className="invalid-feedback">{errors.maritalstatus?.message}</div>
                            </div>

                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Qualification<span className='text-danger'>*</span></label>
                                <input name="educationalqualification" type="text" {...register('educationalqualification')} className={`form-control ${errors.educationalqualification ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.educationalqualification?.message}</div>
                            </div>
                            <div className="form-group col">
                                <label>Residing In<span className='text-danger'>*</span></label>
                                <input name="residingin" type="text" {...register('residingin')} className={`form-control ${errors.residingin ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.residingin?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Emergency Contact Person<span className='text-danger'>*</span></label>
                                <div className='d-flex justify-content-around'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="emergencycontactperson" {...register('emergencycontactperson')} id="flexRadioDefault1" value={1} />
                                        <label className="form-check-label" for="flexRadioDefault1">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="emergencycontactperson" {...register('emergencycontactperson')} id="flexRadioDefault2" value={0} checked />
                                        <label className="form-check-label" for="flexRadioDefault2">
                                            No
                                        </label>
                                    </div>
                                </div>



                                <div className="invalid-feedback">{errors.emergencycontactperson?.message}</div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Contact Number<span className='text-danger'>*</span></label>
                                <input name="contactnumber" type="text" {...register('contactnumber')} className={`form-control ${errors.contactnumber ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.contactnumber?.message}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                            <Link href="/employees" className="btn btn-link">Cancel</Link>
                        </div>
                    
                  
                        </form >
                </section>
                </div>
            </div>
        </div>
    );
}