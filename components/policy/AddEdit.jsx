import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { policyService } from 'services/policy.service';
import { alertService } from 'services';

const ValidationUpload = Yup.object().shape({
    name: Yup.string().required("File name is required"),
    file: Yup.mixed().test("required", "File is required", value => {
        return value && value.length
    })
});

const ValidationUpdate = Yup.object().shape({
    name: Yup.string().required("File name is required"),
});


const AddEdit = (props) => {

    const updatePolicy = props?.updatePolicy
    const isAddMode = !updatePolicy

    const formOptions = { resolver: yupResolver(!isAddMode ? ValidationUpdate : ValidationUpload) };

    if (!isAddMode) {
        const set = { name: updatePolicy.name, description: updatePolicy.description };
        formOptions.defaultValues = set;
    }

    const { register, handleSubmit, reset, formState, } = useForm(formOptions);

    const { errors } = formState;

     

    const onSubmit = (values) => {
        const data = new FormData();
        data.append('name', values.name)
        data.append('description', values.description)
        data.append('file', values.file[0])
        // console.log(data);
        // console.log(values.file[0]);
        // console.log('**************', props.updatePolicy)

        if (!isAddMode) {
            // console.log("@@@@@@@@", data);
            return policyService.updateFile(props.updatePolicy.id, data)
                .then(data => {
                    // console.log("------------------------", data);
                    alertService.success(data.data.message)   // error
                    callback()
                })
                .catch((err) => {
                    alertService.error(err.message)
                })
        } else {
            return policyService.uplaodFile(data)
                .then(data => {
                    console.log("------------------------", data);
                    alertService.success(data.data.message)   // error
                    callback()
                    reset()    // submit clear values
                })
                .catch((err) => {
                    alertService.error(err.message)
                })
        }
    }

    const callback = () => {
        props.reloadCallback(1, 6, '')
    }

    return (
        <form className='form-row' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <div className='col-lg-12'>
                <label className='form-label text-primary'>File name<span className='text-danger'>*</span></label>
                <input {...register("name")} type='text' className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
            </div>
            {/* {errors.name?.message} */}
            <div className='col-lg-12'>
                <label className='form-label text-primary'>Description</label>
                <textarea {...register("description")} type='text' className={`form-control ${errors.description ? 'is-invalid' : ''}`}></textarea>
            </div>
            {/* {errors.description?.message} */}
            <div className='col-lg-12'>
                <label className='form-label text-primary'>File Upload<span className='text-danger'>*</span></label>
                <input {...register("file")} type='file' className={`form-control ${errors.file ? 'is-invalid' : ''}`}   />
            </div>
            {/* {errors.file?.message} */}

            <div className='mt-3 ms-2'>
                {isAddMode ?
                    <button type='submit' className='btn  btn-primary mr-3'>Submit</button>
                    :
                    <button type='submit' className='btn  btn-primary mr-3'>Update</button>}
               {isAddMode && <button type='reset' className='btn btn-secondary ms-3' onClick={() => reset()}>Reset</button> }
            </div>

        </form>
    )
}

export default AddEdit
