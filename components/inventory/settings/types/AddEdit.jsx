import React from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { inventoryService } from 'services/inventory.service';
import { alertService } from 'services/alert.service';

const TypeForm = (props) => {

    const type = props?.type
    const AddType = !type

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Type is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    function handleDataSubmit(data) {
        return (
            AddType ?
                inventoryService.register(data)
                    .then(data => {
                        alertService.success(data.message)
                        props?.callback()
                        reset()

                    })
                    .catch((error) => {
                        alertService.error(error.message)
                    }) :
                inventoryService.update(type.id, data)
                    .then(x => {
                        alertService.success(x.message);
                        props?.callback()
                        reset()
                    })
                    .catch((error) => {
                        alertService.error(error.message);
                    })
        )

    }
    if (!AddType) {
        formOptions.defaultValues = props.type
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    return (
        <form onSubmit={handleSubmit(handleDataSubmit)} autoComplete='off'>
            <div className="form-group">
                <label className='text-primary' htmlFor="ty" >Type <span className='text-danger'>*</span></label>
                <input type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="ty" ></input>
            </div>
            <div className="mt-3">
                <button type='submit' disabled={formState.isSubmitting} className="btn btn-primary mr-3">

                    {AddType ? <span>Submit</span> : <span>Update</span>}

                </button>
                {AddType ? <button type="button" onClick={() => { reset(formOptions.defaultValues) }} disabled={formState.isSubmitting} className="btn btn-secondary mr-3 " >Reset</button> : ""}

            </div>
        </form>
    )
}
export default TypeForm;