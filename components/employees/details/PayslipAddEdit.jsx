import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import moment from 'moment';
import { Alert,Link } from 'components';
import { alertService, userService } from 'services';
var today = moment().format('YYYY-MM-DD');
export { PayslipAddEdit };

function PayslipAddEdit(props) {
    const classes = props?.classes;
    const isAddMode = !classes;
    const router = useRouter();
    const user_id = props?.user_id;
    const [newdefaultvalue, setNewdefaultvalue] = useState(null);


    // useEffect(() => {
       
    //      reset(newdefaultvalue);

    //  }, [newdefaultvalue]);
    

    // form validation rules 
    const validationSchema = Yup.object().shape({
        CTC: Yup.string()
        .required('MonthlyGross is required'),
        MonthlyGross: Yup.string()
            .required('MonthlyGross is required'),

    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
       var sdate =moment(props.classes.salarymonth).utcOffset("+05:30").format("YYYY-MM-DD");
       var newdata1=  {...props.classes,salarymonth:sdate};
        formOptions.defaultValues = newdata1;

    } else {
        var newdata={user_id:props?.user_id,   MonthlyGross: 0, Basic: 0, HouseRentAllowance: 0, OtherAllowance: 0, EmployersContributiontoPF: 0, EmployersContributiontoESI: 0, EmployeesContributiontoPF: 0, EmployeesContributiontoESI: 0, TotalDeduction: 0, TotalNetSalary: 0, Remarks: "Monthly Salary Payslip", salarymonth:today };
       // setNewdefaultvalue(newdata);
        formOptions.defaultValues =newdata;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit,  formState ,reset} = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        console.log("data:",data);
        // props
         return isAddMode
             ? createUser(data)
             : updateUser(classes.id, data);
    }

    function createUser(data) {
        return userService.createPayslipData(data)
            .then((user) => {
                if (user.status == 1) {
                    alertService.success('Payslip added', { keepAfterRouteChange: true });
                   // router.push('/dashboard/courses?section=classes');
                   parenthandleList();
                   props.setClassAdd({ isShow: false })
                } else {
                    alertService.error('Payslip not added/already exist', { keepAfterRouteChange: true });
                }
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
       
        return userService.Payslipupdate(id, data)
            .then(() => {
                 alertService.success('Payslip updated', { keepAfterRouteChange: true });
                //router.push('/dashboard/courses?section=classes');
                parenthandleList();
                props.setEdit({ isShow: false })
            })
            .catch(alertService.error);
    }

    const parenthandleList = () => {
        userService.getByPayslipId(props.user_id).then(x => {
            console.log(x);
            if (x.status != 0) { props.setUsers(x); }
        });
    }

    const changegross = (e) => {
      console.log("changegross,:", e,e.target.value);
 

        var ctc=e.target.value;
        var gross=(ctc/12).toFixed(0);

         
   

        var newformvalue={ ...formOptions.defaultValues, CTC: e.target.value, MonthlyGross: gross };
        console.log(newformvalue);
        reset(newformvalue); 
    
       
    }

    function calculatePercent(percent, num){
        return Math.round((percent / 100) * num);
    }

    const preparedata = (v) => {
        console.log("preparedata,:", v);
        console.log("formOptions.defaultValues,:", formOptions.defaultValues);
         
        //var CTC=v*12;
        var MonthlyGross=parseInt(v);
        var Basic=parseInt((MonthlyGross*0.75).toFixed(0));
        var HouseRentAllowance=parseInt((Basic*0.25).toFixed(0));
        var OtherAllowance=parseInt((MonthlyGross- (Basic+HouseRentAllowance)).toFixed(0)) ; //=F2-sum(G2:H2)
        
		var EmployersContributiontoPF=1800; //=G2*12%
		if(MonthlyGross<=20999){ EmployersContributiontoPF=calculatePercent(12,Basic); }
       
	    var EmployersContributiontoESI=0; //=IF(F2>20999,0,((F2)*3.25/100))
		if(MonthlyGross<=20999){ EmployersContributiontoESI=parseInt((MonthlyGross*3.25/100).toFixed(0)); }
		
		
        var EmployeesContributiontoPF=parseInt(EmployersContributiontoPF); 
       
	   var EmployeesContributiontoESI=0;  //=IF(F2>20999,0,((F2)*0.75/100))
		if(MonthlyGross<=20999){ EmployeesContributiontoESI=parseInt((MonthlyGross*0.75/100).toFixed(0)); }
		
        var TotalDeduction=parseInt(EmployersContributiontoPF+EmployeesContributiontoESI);
        var TotalNetSalary=parseInt(( (MonthlyGross-(EmployersContributiontoPF+EmployersContributiontoESI)-TotalDeduction)).toFixed(0)) ; //=F2-SUM(J2:K2)-N2
        


   

        var newformvalue={ ...formOptions.defaultValues,  MonthlyGross: MonthlyGross, Basic: Basic, HouseRentAllowance: HouseRentAllowance, OtherAllowance: OtherAllowance, EmployersContributiontoPF: EmployersContributiontoPF, EmployersContributiontoESI: EmployersContributiontoESI, EmployeesContributiontoPF: EmployeesContributiontoPF, EmployeesContributiontoESI: EmployeesContributiontoESI, TotalDeduction: TotalDeduction, TotalNetSalary:TotalNetSalary
        };
        console.log(newformvalue);
        reset(newformvalue);
    
       
    }
   

    return (
        <>
         <Alert />
        <form onSubmit={handleSubmit(onSubmit)}>

          
           
            <div className="form-row">
                <div className="form-group col">
                    <label className='text-primary'>CTC</label>
                    <input name="CTC" type="number" {...register('CTC')} className={`form-control ${errors.CTC ? 'is-invalid' : ''}`}  onBlur={e => { changegross(e); }}/>
                    <div className="invalid-feedback">{errors.CTC?.message}</div>
                </div>
                <div className="form-group col">
                    <label className='text-primary'>MonthlyGross</label>
                    <input name="MonthlyGross" type="number" {...register('MonthlyGross')} className={`form-control ${errors.MonthlyGross ? 'is-invalid' : ''}`}   />
                    <div className="invalid-feedback">{errors.MonthlyGross?.message}</div>
                </div>

            </div>

            {/* <div className="form-row">
                 
             {JSON.stringify(formOptions.defaultValues)}  
            </div> */}
           {isAddMode && <div className="form-row">
                <div className="form-group col">
                    <label className='text-primary'>Month</label>
                    <input name="salarymonth" type="date" min="2020-12-31" {...register('salarymonth')} className={`form-control ${errors.salarymonth ? 'is-invalid' : ''}`}       />
                    <div className="invalid-feedback">{errors.salarymonth?.message}</div>
                </div>
            </div> }
            <div className="form-row">
                <div className="form-group col">
                    <label className='text-primary'>Remarks</label>
                    <input name="Remarks" type="text" {...register('Remarks')} className={`form-control ${errors.Remarks ? 'is-invalid' : ''}`}  />
                    <div className="invalid-feedback">{errors.Remarks?.message}</div>
                </div>
            </div>




            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    {isAddMode && <span>Create</span>}
                    {!isAddMode && <span>Update</span>}
                </button>

            </div>
        </form>
        </>

    );
}