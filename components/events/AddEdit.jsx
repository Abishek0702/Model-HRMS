import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService, userService } from 'services';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment';


const Eventform = (props) => {
    const router = useRouter();
    const [file, setFile] = useState(null)
    const [select, setSelect] = useState(null);
    const events = props?.events;
    const Add = !events;

    useEffect(() => {
        Form()
    }, []);
    const validationSchema = Yup.object().shape({
        file: Yup.mixed().test("required", "File is required", value => { return value && value.length }),
        event_date: Yup.date().required('Month is required'),
        title: Yup.string().required('Month is required'),
        event_type_id: Yup.string().required('Month is required'),

    });

    const validationSchema1 = Yup.object().shape({
        event_date: Yup.date().required('Month is required'),
        title: Yup.string().required('Month is required'),
        event_type_id: Yup.string().required('Month is required'),

    });

    var page = router.query.page || 1;
    var size = router.query.size || 6;
    var search = router.query.search || '';

    const formOptions = { resolver: yupResolver(Add ? validationSchema : validationSchema1) };

    const callback = () => {
        props.reloadCallback(page, size, search)
    }
    var today = moment(new Date()).utc().format("YYYY-MM-DD")
    const Form = () => {
        userService.formevent()

            .then((x) => {
                if (typeof x.event !== 'undefined') { setSelect(x.event); }
            });
    }


    function handleDataSubmit(data) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", data.description)
        formData.append("event_type_id", data.event_type_id)
        formData.append("title", data.title)
        formData.append("link", data.link)
        formData.append("event_date", moment(data.event_date).format("YYYY-MM-DD"))

        console.log(formData)

        return (
            Add ?
                userService.createEventData(formData)
                    .then((x) => {
                        // console.log("----------kk", x.data.message)
                        if (x.status != 0) {
                            alertService.success(x.data.message)
                            callback()
                            reset()
                        } else {
                            alertService.error(x.data.message)
                        }
                    })
                    // .catch((error) => {
                    //     alertService.error(x.data.message)
                    // })
                :
                userService.updateEvent(props.events.id, data)
                    .then((x) => {
                        // console.log("----------kk", x)
                        alertService.success(x.message);
                        callback()
                    })
                    .catch((error) => {
                        alertService.error(error.message);
                    })
        )
    }
    if (!Add) {
        formOptions.defaultValues = props.events
    } else {
        formOptions.defaultValues = { event_date: today }
    }

    function handleChange(event) {
        console.log(event.target.files[0])
        if (event.target.files) { setFile(event.target.files[0]) }
    }
    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    return (
        <form onSubmit={handleSubmit(handleDataSubmit)}>

            <div class="form-row">
                <div className='col-12'>
                    <label className='text-primary'>Upload Image<span className=' text-danger'>*</span></label>
                    <input type='file'  {...register('file')} onChange={handleChange} className={`form-control ${errors.file ? 'is-invalid' : ''}`} />
                </div>
            </div>
            <div class="form-row">
                <div className='col-12'>
                    <label className='text-primary' >Event Date<span className='text-danger'>*</span></label>
                    <input type="date" name='event_date' {...register('event_date')} className={`form-control ${errors.event_date ? 'is-invalid' : ''}`} id="mon" />
                </div>
            </div>
            {/* <div class="form-row d-flex">
                <div className='col-lg-6'>
                    <label className='text-primary' >Event Date<span className='text-danger'>*</span></label>
                    <input type="date" name='event_date' {...register('event_date')} className={`form-control ${errors.event_date ? 'is-invalid' : ''}`} id="mon" />
                </div>
                <div className='col-lg-6'>
                    <label className='text-primary' >Event Type<span className='text-danger'>*</span></label>
                    <select name='event_type_id' {...register('event_type_id')} className={`form-control form-select ${errors.event_type_id ? 'is-invalid' : ''}`} >
                        <option value=''>Select</option>
                        {select && select.map(user =>
                            <option value={user.id} selected={user.id == events?.event_type_id}>{user.type_of_event}</option>

                        )}

                    </select>
                </div>
            </div > */}
            <div class="form-row">
                <div className='col-lg-12'>
                    <label className='text-primary' >Event Type<span className='text-danger'>*</span></label>
                    <select name='event_type_id' {...register('event_type_id')} className={`form-control form-select ${errors.event_type_id ? 'is-invalid' : ''}`} >
                        <option value=''>Select</option>
                        {select && select.map(user =>
                            <option value={user.id} selected={user.id == events?.event_type_id}>{user.type_of_event}</option>
                        )}

                    </select>
                </div>
            </div>
            <div class="form-row">
                <div className='col-lg-12'>
                    <label className='text-primary' >Title <span className='text-danger'>*</span></label>
                    <input type="text"  {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} id="ti" ></input>
                </div>
            </div>
            <div class="form-row">
                <div className='col-lg-12'>
                    <label className='text-primary' >Link</label>
                    <input type="text" name='link' {...register('link')} className={`form-control ${errors.link ? 'is-invalid' : ''}`} id="ti" ></input>
                </div>
            </div>
            <div class="form-row">
                <div className='col-lg-12'>
                    <label className='text-primary' >Description </label>
                    <textarea type="text" name='description' {...register("description")} class="form-control" id="des" ></textarea>
                </div>
            </div>
            <div className="mt-3">
                <button type='submit' disabled={formState.isSubmitting} class="btn btn-primary mr-3">

                    {Add ? <span>Submit</span> : <span>Update</span>}

                </button>
                {Add ? <button type="button" onClick={() => { reset(formOptions.defaultValues) }} disabled={formState.isSubmitting} class="btn btn-secondary mr-3 " >Reset</button> : ""}

            </div>
        </form >
    )
}

export default Eventform