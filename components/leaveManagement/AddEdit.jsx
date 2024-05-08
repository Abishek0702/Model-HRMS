import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { leaveService } from 'services/leave.service';
import { alertService } from 'services';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import DatePicker from 'react-datepicker';

export { AddEdit };

function AddEdit(props) {

    const [halfDay, setHalfDay] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const userid = props?.user_id;
    const leaveTypes = props?.leaveTypes
    const summary = props?.summary

    const router = useRouter();

    // const Admin_Add = { leavetype_id: 1, start_date: "", end_date: "", halfDay: '', Reason: "HR ACCESS" }

    const validationSchema = Yup.object().shape({
        leavetype_id: Yup.string().required('Leave Type is required'),
        start_date: Yup.date().required('Start Date is required'),
        end_date: Yup.date().min(Yup.ref('start_date'), "end date can't be before start date").required('End Date is required'),
        half_day: Yup.boolean().notRequired(),
        Reason: Yup.string().required('Reason Type is required')
    });
    const formOptions = {
        resolver: yupResolver(validationSchema), defaultValues: {
            leavetype_id: "",
            start_date: "",
            end_date: "",
            half_day: 0,
            Reason: ""
        }
    };

    // -------------------HR ADD LEAVE -------------------------------
    // if (true) {
    //     formOptions.defaultValues = Admin_Add;
    // }

    const { register, handleSubmit, setValue, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    function handleData(data) {
        // console.log('data:', data)
        const AllData = { ...data, user_id: userid, half_day: `${data.half_day ? 1 : 0}`, start_date: moment(data.start_date).format("YYYY/MM/DD"), end_date: moment(data.end_date).format("YYYY/MM/DD") };
        // console.log('data:', AllData)
        return leaveService.addRequest(AllData)
            .then(data => {
                alertService.success(data.message)
                // setTimeout(() => {
                //     router.push('/employees/myprofile?page=1&size=12&section=leave')
                // }, 1000)
                location.reload();
            })
            .catch((err) => {
                alertService.error(err.message)
            })
    }

    const handleReset = () => {
        setHalfDay(false);
        reset(formOptions.defaultValues);
        setStartDate(null), setValue("start_date", null);
        setEndDate(null), setValue("end_date", null)
    }
    return (
        <>
             
                <div className='card shadow-none ' style={{marginTop:"0rem"}}>
                    <div className='card-header   bg-primary2 text-white '>
                         Request Leave  
                    </div>
                    <div className='card-body'>
                        <form onSubmit={handleSubmit(handleData)}>
                            <div className="form-row">
                                <div className="col-lg-6">
                                    <label className='text-primary from-label'>Leave type <span className='text-danger'>*</span></label>
                                    <select  {...register('leavetype_id')} className={`form-select form-control ${errors.leavetype_id ? 'is-invalid' : ''}`} >
                                        <option value=''>Select</option>
                                        {leaveTypes.map((leave) => <option key={leave.id} value={leave.id}>{leave.TypeofLeave}</option>)}
                                    </select>
                                    {/* <div className="invalid-feedback">{errors.leavetype_id?.message}</div> */}
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className="col-lg-6">
                                    <label className='text-primary form-label'>Start Date<span className='text-danger'>*</span></label>
                                    {/* <input type="date" {...register('start_date', { value: '' })} className={`form-control ${errors.start_date ? 'is-invalid' : ''}`} /> */}
                                    <DatePicker
                                        className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                                        // minDate={new Date()}
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDate}
                                        onChange={(date) => {
                                            // console.log("event", e)
                                            setStartDate(date)
                                            setValue('start_date', date, { shouldValidate: true });
                                        }}
                                    />
                                    {/* <div className="invalid-feedback">{errors.start_date?.message}</div> */}
                                </div>
                            </div>

                            <div className='form-row d-flex gap-5'>
                                <div className=" col-lg-6">

                                    <label className='form-label text-primary'>End Date <span className='text-danger'>*</span></label>
                                    {/* <input type="date" {...register('end_date', { value: '' })} className={`form-control ${errors.end_date ? 'is-invalid' : ''}`} /> */}
                                    <DatePicker
                                        className={`form-control ${errors.end_date && !halfDay ? 'is-invalid' : ''}`}
                                        minDate={startDate}
                                        dateFormat="dd/MM/yyyy"
                                        selected={halfDay ? setValue('end_date', startDate) : endDate}
                                        onChange={(date) => {
                                            // console.log("event", e)
                                            setEndDate(date)
                                            setValue('end_date', date, { shouldValidate: true });
                                        }}
                                        disabled={halfDay}
                                    />
                                </div>
                                {/* <div className="invalid-feedback">{errors.end_date?.message}</div> */}
                                <div className='col-lg-auto'>
                                    <p className='text-primary'>Half-Day</p>

                                    <div className='d-flex gap-3'>
                                        <div class="form-check">
                                            <input  {...register('half_day')} type="radio" id='fn' value="1" class={`form-check-input `} onChange={() => { setHalfDay(true) }} />
                                            <label class="form-check-label" htmlFor="fn">FN</label>
                                        </div>
                                        <div class="form-check">
                                            <input  {...register('half_day')} type="radio" id="an" value="1" class={`form-check-input `} onChange={() => { setHalfDay(true) }} />
                                            <label class="form-check-label" htmlFor="an">AN</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className=" col-lg-12">
                                    <label className='text-primary'>Reason <span className='text-danger'>*</span></label>
                                    <textarea type="text" {...register('Reason')} className={`form-control ${errors.Reason ? 'is-invalid' : ''}`} />
                                    {/* <div className="invalid-feedback">{errors.Reason?.message}</div> */}
                                </div>
                            </div>

                            <div className='form-row m-0'>
                                <div className="col-12">
                                    <div className='d-flex gap-3'>
                                        <button type="submit" disabled={formState.isSubmitting} onClick={handleSubmit} className="btn btn-primary mt-4 mr-3">Submit</button>
                                        <button onClick={() => handleReset()} type="button" disabled={formState.isSubmitting} className="btn btn-secondary mt-4">Reset</button>
                                    </div>
                                </div>
                            </div>
                        </form >
                    </div>
                </div>
            
        </>
    );
}