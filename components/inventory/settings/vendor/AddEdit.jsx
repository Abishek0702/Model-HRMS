import React from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { inventoryService } from 'services/inventory.service';
import { alertService } from 'services/alert.service';


const VendorForm = (props) => {

    const vendor = props?.vendor
    const AddVendor = !vendor

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('VendorName is required'),
        contact_number: Yup.number().integer().positive().min(10, "Please Enter Min 10 Numbers").required(),
        email: Yup.string().email('Invalid Emailid').notRequired('Email is required'),
        address: Yup.string().notRequired('Address is required'),
        city: Yup.string().notRequired('City is required'),
        state: Yup.string().notRequired('State is required'),
        country: Yup.string().notRequired('Country is required'),
        pincode: Yup.string().notRequired('Pincode is required'),

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    function handleDataSubmit(data) {

        return (
            AddVendor ?
                inventoryService.addVendor(data)
                    .then(data => {
                        alertService.success(data.message)
                        props?.reloadcallback()
                        reset()
                    })
                    .catch((error) => {

                    })
                :
                inventoryService.vendorUpdate(props.vendor.id, data)
                    .then((x) => {
                        alertService.success(x.message);
                        props?.reloadcallback()
                    })
                    .catch((error) => {
                        alertService.error(error.message);
                    })

        )
    }
    if (!AddVendor) {
        formOptions.defaultValues = props.vendor
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    return (

        <form onSubmit={handleSubmit(handleDataSubmit)} autoComplete='off'>
            <div className='form-row'>
                <div className="col-lg-12">
                    <label className='text-primary' htmlFor="example" >Vendor Name <span className='text-danger'>*</span></label>
                    <input {...register('name')} type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} id="example" ></input>
                </div>
            </div>
            <div className='form-row d-flex '>
                <div className="col-lg-6">
                    <label className='text-primary' htmlFor="con" >Contact No </label>
                    <input {...register('contact_number')} type="text" className={`form-control ${errors.contact_number ? "is-invalid" : ""}`} id="con"  ></input>
                </div>


                <div className="col-lg-6">
                    <label className='text-primary' htmlFor="em" >Email iD </label>
                    <input {...register('email')} type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="em" ></input>
                </div>
            </div>
            <div className='form-row'>
                <div className="col-lg-12">
                    <label className='text-primary' htmlFor="add" >Address </label>
                    <textarea {...register('address')} type="text" className={`form-control ${errors.address ? "is-invalid" : ""}`} id="add" ></textarea>
                </div>
            </div>

            <div className='form-row d-flex '>
                <div className="col-lg-6    ">
                    <label className='text-primary' htmlFor="cit" >City </label>
                    <input {...register('city')} className={`form-control ${errors.city ? "is-invalid" : ""}`} id="cit" ></input>

                </div>

                <div className="col-lg-6">
                    <label className='text-primary' htmlFor="sta" >State </label>
                    <input {...register('state')} type="text" className={`form-control ${errors.state ? "is-invalid" : ""}`} id="sta" ></input>
                </div>
            </div>

            <div className='form-row d-flex '>
                <div className="form-group col-lg-6">
                    <label className='text-primary' htmlFor="coun" >Country </label>
                    <input {...register('country')} type="text" className={`form-control ${errors.country ? "is-invalid" : ""}`} id="coun" ></input>

                </div>

                <div className="col-lg-6">
                    <label className='text-primary' htmlFor="pin" >Pincode </label>
                    <input {...register('pincode')} type="number" className={`form-control ${errors.pincode ? "is-invalid" : ""}`} id="pin" ></input>
                </div>
            </div>
            <div className="mt-3">
                <button type='submit' disabled={formState.isSubmitting} className="btn btn-primary mr-3">

                    {AddVendor ? <span>Submit</span> : <span>Update</span>}

                </button>
                {AddVendor ? <button type="button" onClick={() => { reset(formOptions.defaultValues) }} disabled={formState.isSubmitting} className="btn btn-secondary mr-3 " >Reset</button> : ""}

            </div>
        </form>
    )
}

export default VendorForm