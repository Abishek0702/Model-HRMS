import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


import { Link } from 'components';
import { userService, alertService } from 'services';


export { Bank };

function Bank(props) {
    console.log(props)
    const bank = props.bank;
    const isAddMode = !bank;
    const user_id = props.user_id;
    const bankId = bank?.id
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        nameAsPerBankAccount: Yup.string().required('Account holder name is required'),
        bankName: Yup.string().required('Bank name is required'),
        branchName: Yup.string().required('Branch name is required'),
        accountNumber: Yup.string().required('Account number is required'),
        ifscCode: Yup.string().required('IFSC code name is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    if (!isAddMode) {
        formOptions.defaultValues = props.bank;
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(dataes) {
        let data = { ...dataes, user_id }
        console.log('data:', data)
        return isAddMode
            ? createUser(data)
            : updateUser(bankId, data);
    }

    function createUser(data) {
        console.log('emp_reg...', data);
        return userService.createBank(data)
            .then((res) => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return userService.updateBank(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                    <div className="form-group col">
                        <label>Name as per bank account <span className='text-danger'>*</span></label>
                        <input name="nameAsPerBankAccount" type="text" {...register('nameAsPerBankAccount')} className={`form-control ${errors.nameAsPerBankAccount ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.nameAsPerBankAccount?.message}</div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <label>Bank name <span className='text-danger'>*</span></label>
                        <input name="bankName" type="text" {...register('bankName')} className={`form-control ${errors.bankName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.bankName?.message}</div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <label>Branch name <span className='text-danger'>*</span></label>
                        <input name="branchName" type="text" {...register('branchName')} className={`form-control ${errors.branchName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.branchName?.message}</div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <label>Account number <span className='text-danger'>*</span></label>
                        <input name="accountNumber" type="number" {...register('accountNumber')} className={`form-control ${errors.accountNumber ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.accountNumber?.message}</div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <label>IFSC code <span className='text-danger'>*</span></label>
                        <input name="ifscCode" type="text" {...register('ifscCode')} className={`form-control ${errors.ifscCode ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.ifscCode?.message}</div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <label>UAN number</label>
                        <input name="UAN" type="text" {...register('UAN')} className={`form-control ${errors.UAN ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.UAN?.message}</div>
                    </div>
                </div>

                <div className="form-group">
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                    <Link href="/users" className="btn btn-link">Cancel</Link>
                </div>
            </form >
        </>
    );
}


