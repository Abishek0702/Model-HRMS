import React from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { inventoryService } from 'services/inventory.service';
import { alertService } from 'services/alert.service';

const StatusForm = (props) => {

    const status = props?.status
    const AddStatus = !status

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Type is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    function handleDataSubmit(data) {
        return (
            AddStatus ?
                inventoryService.addStatus(data)
                    .then(data => {
                        alertService.success(data.message)
                        props?.reloadCallback()
                        reset()
                    })
                    .catch((error) => {
                        alertService.error(error.message)
                    }) :
                inventoryService.statusUpdate(props.status.id, data)
                    .then((x) => {
                        alertService.success(x.Message);
                        props?.reloadCallback()
                    })
                    .catch((error) => {
                        alertService.error(error.message);
                    })
        )
    }
    if (!AddStatus) {
        formOptions.defaultValues = props.status
    }
    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    return (
        <form onSubmit={handleSubmit(handleDataSubmit)} autoComplete='off'>
            <div className="form-group">
                <label className='text-primary' htmlFor="st" >Status <span className='text-danger'>*</span></label>
                <input type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="st" ></input>
            </div>
            <div className="mt-3">
                <button type='submit' disabled={formState.isSubmitting} className="btn btn-primary mr-3">

                    {AddStatus ? <span>Submit</span> : <span>Update</span>}

                </button>
                {AddStatus ? <button type="button" onClick={() => { reset(formOptions.defaultValues) }} disabled={formState.isSubmitting} className="btn btn-secondary mr-3 " >Reset</button> : ""}

            </div>
        </form>
    )
}
export default StatusForm;