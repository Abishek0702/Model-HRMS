import React from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { userService } from 'services';
import { alertService } from 'services/alert.service';
import moment from 'moment';

const EmployeeMonthform = (props) => {
    const router = useRouter();

    const employeemonth = props?.employeemonth
    const Add = !employeemonth

    const validationSchema = Yup.object().shape({
        employee_id: Yup.string().required('EmployeeID is required'),
        month: Yup.date().required('Month is required'),
        presenter_id: Yup.string().required('Presenter ID is required'),
        title: Yup.string().required('Title is required'),
        description: Yup.string().notRequired('Description is required')

    });

    var page = router.query.page || 1;
    var size = router.query.size || 6;
    var search = router.query.search || '';


    const formOptions = { resolver: yupResolver(validationSchema) };
    var today = moment(new Date()).utc().format("YYYY-MM-DD")

    function handleDataSubmit(data) {
        const change = { ...data, month: moment(data.month).utcOffset("+05:30").format("YYYY-MM-DD") }

        // console.log("q", change);
        return (
            Add ?
                userService.EmployeeofMonthReg(change)
                    .then(data => {
                        if (data.status != 0) {
                            alertService.success(data.message)
                            callback()
                            reset()
                        } else {
                            alertService.error(data.message)
                        }

                    })
                    .catch((error) => {
                        alertService.error(error.message);
                    })

                :
                userService.EmployeeofMonthupdate(props.employeemonth.id, data)

                    .then((x) => {
                        alertService.success(x.message);
                        callback()
                    })
                    .catch((error) => {
                        alertService.error(error.message);
                    })
        )
    }
    if (!Add) {
        formOptions.defaultValues = props.employeemonth
    } else {
        formOptions.defaultValues = { month: today }
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    const callback = () => {
        props.reloadCallback(page, size, search)
    }

    return (
        <form onSubmit={handleSubmit(handleDataSubmit)}>

            <div class="form-row">
                <div className='col-lg-12'>
                    <label className='text-primary' for="ty" >Employee ID <span className='text-danger'>*</span></label>

                    <input type="text" {...register('employee_id')} class={`form-control ${errors.employee_id ? 'is-invalid' : ''}`} id="ty" ></input>
                </div>
            </div>
            <div class="form-row d-flex">
                <div className='col-lg-6'>
                    <label className='text-primary' for="mon" >Month<span className='text-danger'>*</span></label>
                    <input type="date" {...register('month')} class={`form-control ${errors.month ? 'is-invalid' : ''}`} id="mon" ></input>
                </div>
                <div className='col-lg-6'>
                    <label className='text-primary' for="pre" >Presenter ID <span className='text-danger'>*</span></label>
                    <select  {...register('presenter_id')} id='pre' className={`form-control form-select ${errors.presenter_id ? 'is-invalid' : ''}`} >
                        <option value='' >Select</option>
                        <option value='1' >1</option>
                        <option value='2' >2</option>
                        <option value='3' >3</option>
                        <option value='4' >4</option>
                    </select>
                </div> </div>
            <div class="form-row">
                <div className='col-lg-12'>
                    <label className='text-primary' for="ti" >Title <span className='text-danger'>*</span></label>
                    <input type="text" {...register('title')} class={`form-control ${errors.title ? 'is-invalid' : ''}`} id="ti" ></input>
                </div>
            </div>
            <div class="form-row">
                <div className='col-lg-12'>
                    <label className='text-primary' for="des" >Description </label>
                    <textarea type="text" {...register('description')} class={`form-control ${errors.description ? 'is-invalid' : ''}`} id="des" ></textarea>
                </div>
            </div>
            <div className="mt-3">
                <button type='submit' disabled={formState.isSubmitting} class="btn btn-primary mr-3">

                    {Add ? <span>Submit</span> : <span>Update</span>}

                </button>
                {Add ? <button type="button" onClick={() => { reset(formOptions.defaultValues) }} disabled={formState.isSubmitting} class="btn btn-secondary mr-3 " >Clear</button> : ""}

            </div>
        </form>
    )
}
export default EmployeeMonthform