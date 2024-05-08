import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { userService, alertService } from 'services';
// import { EducationListing } from 'components/employees';
import { useRouter } from 'next/router';
import { ExperienceListing } from '..';

export { ExperienceDetails };

function ExperienceDetails(props) {
    const [state, setState] = useState({});
    const user_id = props?.user_id;
    const Router = useRouter();

    const validationSchema = Yup.object().shape({
        companyname: Yup.string().required('Company name is required'),
        department: Yup.string().required('Department is required'),
        department: Yup.string().required('Designation is required'),
        ctc: Yup.string().required('CTC is required'),

    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState, control } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(data) {
        console.log('data:', data)
        return createUser(data)
    }

    function createUser(data) {
        console.log('emp_reg...', data);
        return userService.createExperienceData(data)
            .then(() => {
                alertService.success('Data added', { keepAfterRouteChange: true });
                Router.push(`/employees/edit/${user_id}?section=experienceInfo`);
            })
            .catch(alertService.error);


    }

    return (
        <div className='row'>
        <div className='col-8'>
                    <ExperienceListing user_id={user_id} />
                </div>
                <div className='col-4'>
                <div className='  shadow-none card' > 
                <div className='card-header bg-primary2 '>
                        <nav className=" navbar">
                            <a className="navbar-brand1 text-white" href="#">Experience Details</a>
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
                                    <label>Company Name<span className='text-danger'>*</span></label>
                                    <input name="companyname" type="text" {...register('companyname')} className={`form-control ${errors.companyname ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.companyname?.message}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label>Department<span className='text-danger'>*</span></label>
                                    <input name="department" type="text" {...register('department')} className={`form-control ${errors.department ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.department?.message}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label>Designation<span className='text-danger'>*</span></label>
                                    <input name="designation" type="text" {...register('designation')} className={`form-control ${errors.designation ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.designation?.message}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label>From Date</label>
                                    {/* <input name="fromDate" type="text" {...register('fromDate')} className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`} /> */}
                                    <Controller
                                        control={control}
                                        name="fromDate"
                                        render={({ field }) => (
                                            <ReactDatePicker
                                                className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
                                                placeholderText="Select date"
                                                onChange={(e) => field.onChange(e)}
                                                selected={field.value}
                                                dateFormat={"dd-MM-yyyy"}
                                            />
                                        )}
                                    />
                                    <div className="invalid-feedback">{errors.fromDate?.message}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label>To Date</label>
                                    <Controller
                                        control={control}
                                        name="toDate"
                                        render={({ field }) => (
                                            <ReactDatePicker
                                                className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
                                                placeholderText="Select date"
                                                onChange={(e) => field.onChange(e)}
                                                selected={field.value}
                                                dateFormat={"dd-MM-yyyy"}
                                            />
                                        )}
                                    />
                                    <div className="invalid-feedback">{errors.toDate?.message}</div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col">
                                    <label>Relevant Type</label>
                                    <div className='d-flex justify-content-around'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="relevanttype" {...register('relevanttype')} id="flexRadioDefault1" value={'IT'} checked />
                                            <label className="form-check-label" for="flexRadioDefault1">
                                                IT
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="relevanttype" {...register('relevanttype')} id="flexRadioDefault2" value={"Non-IT"} />
                                            <label className="form-check-label" for="flexRadioDefault2">
                                                Non-IT
                                            </label>
                                        </div>
                                    </div>
                                    <div className="invalid-feedback">{errors.relevanttype?.message}</div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col">
                                    <label>Years</label>
                                    <input name="type_experience" type="text" {...register('type_experience')} className={`form-control ${errors.type_experience ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.type_experience?.message}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label>Relevant Experience</label>
                                    <input name="relevantExperience" type="text" {...register('relevantExperience')} className={`form-control ${errors.relevantExperience ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.relevantExperience?.message}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label>CTC<span className='text-danger'>*</span></label>
                                    <input name="ctc" type="text" {...register('ctc')} className={`form-control ${errors.ctc ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.ctc?.message}</div>
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

