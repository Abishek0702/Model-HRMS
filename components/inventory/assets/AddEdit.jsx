import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { inventoryService } from 'services/inventory.service';
import { useRouter } from 'next/router';
import { alertService } from 'services';

const AddEdit = (props) => {

    const assetUpdate = props?.assetsUpdate;
    const vendorDropdown = props?.vendorDropdown;
    const isAddMode = !assetUpdate;
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("asset name is required"),
        inventory_vendor_id: Yup.string().required('vendor Type is required'),
        description: Yup.string().required("specification is required"),
        prefix: Yup.string().required('prefix is required'),
    });


    const validationSchemaUpdate = Yup.object().shape({
        user_id: Yup.string().required("user id is required"),
    });


    const formOptions = { resolver: yupResolver(!assetUpdate ? validationSchema : validationSchemaUpdate) };

    if (!isAddMode) {
        formOptions.defaultValues = { "user_id": assetUpdate.user_id };
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    const onSubmit = (values) => {
        const mergeApprover = { ...values, inventory_type_id: router.query.id }
        return (
            isAddMode ?
                inventoryService.insertDate(mergeApprover)
                    .then(data => {
                        alertService.success(data.message, { keepAfterRouteChange: true })
                        props?.callback()
                        reset()
                    })
                    .catch((err) => {
                        alertService.error(err.data)
                    }) :
                inventoryService.updateData(assetUpdate.id, values)
                    .then(x => {
                        alertService.success(x.message)
                        props?.callback()
                    })
                    .catch((error) => {
                        alertService.error(error.message);
                    })
        )
    }

    return (
        <>
            {isAddMode ?
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                    <div>
                        <label className='form-label text-primary'>Asset Name<span className='text-danger'>*</span></label>
                        <input {...register("name")} type='text' className={`form-control ${errors.name ? "is-invalid" : ''}`} />
                    </div>
                    <div>
                        <label className='text-primary'>VendorName<span className='text-danger'>*</span></label>
                        <select  {...register('inventory_vendor_id')} className={`form-control form-select ${errors.inventory_vendor_id ? 'is-invalid' : ''}`} >

                            <option value="">Select</option>
                            {vendorDropdown && vendorDropdown.map((data) => {
                                return (
                                    <option value={data.id} selected={!isAddMode ? (data.id == props?.assetsUpdate.inventory_vendor_id ? data.id : '') : ''}>{data.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <label className='text-primary' htmlFor="pre" >Prefix <span className='text-danger'>*</span></label>
                        <input {...register("prefix")} type='text' className={`form-control ${errors.prefix ? "is-invalid" : ''}`} />
                    </div>
                    <div>
                        <label className='form-label text-primary'>Specification<span className='text-danger'>*</span></label>
                        <textarea {...register("description")} className={`form-control ${errors.description ? "is-invalid" : ''}`}></textarea>
                    </div>
                    <div className='d-flex gap-3 mr-3'>
                        <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mt-4 mr-3">Submit</button>
                        <button type="reset" disabled={formState.isSubmitting} onClick={() => reset(formOptions.defaultValues)} className="btn btn-secondary mt-4">Reset</button>
                    </div>
                </form > :
                <div>
                    <table className='table mb-0'>
                        <tr>
                            <th className='text-primary pb-1 p-0' style={{ minWidth: '40%' }}>Asset Name</th>
                            <td className='text-primary pb-1 p-0' style={{ minWidth: '10%' }}>:</td>
                            <td className='text-dark pb-1 p-0' style={{ minWidth: '50%' }}>{assetUpdate.name}</td>
                        </tr>
                        <tr>
                            <th className='text-primary pb-1 p-0' style={{ width: '40%' }}>Vendor Name</th>
                            <td className='text-primary pb-1 p-0' style={{ width: '10%' }}>:</td>
                            <td className='text-dark pb-1 p-0' style={{ width: '50%' }}>{assetUpdate.vendor_name}</td>
                        </tr>
                        <tr>
                            <th className='text-primary pb-1 p-0' style={{ width: '40%' }}>Asset ID</th>
                            <td className='text-primary pb-1 p-0' style={{ width: '10%' }}>:</td>
                            <td className='text-dark pb-1 p-0' style={{ width: '50%' }}>{assetUpdate.assert_id}</td>
                        </tr>
                        <tr>
                            <th className='text-primary pb-1 p-0' style={{ width: '40%' }}>Specification</th>
                            <td className='text-primary pb-1 p-0' style={{ width: '10%' }}>:</td>
                            <td className='text-dark pb-1 p-0' style={{ width: '50%' }}>
                                <textarea className='form-control border border-0 bg-transparent' disabled>{assetUpdate.description}</textarea>
                            </td>
                        </tr>
                    </table>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div >
                            <label className='form-label text-primary'>Employee ID<span className='text-danger'>*</span></label>
                            <input {...register("user_id")} type='text' className={`form-control ${errors.user_id ? "is-invalid" : ''}`} />
                        </div>

                        <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mt-4">Update</button>
                    </form>
                </div>
            }
        </>
    )
}

export default AddEdit