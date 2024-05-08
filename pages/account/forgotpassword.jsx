

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, Alert } from 'components';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';
import { useState } from 'react';

function Forgotpassword() {


    const router = useRouter();
    const [forgotdata, setForgotData] = useState({ status: 1 })
    const [forgotdataotp, setForgotDataOtp] = useState({ status: 2 })


   

    let validationSchema;

    {forgotdata.status==1 ? 
        validationSchema = Yup.object().shape({
            email: Yup.string().required('Email is required').email("Email is invalid"),
        }):
        validationSchema = Yup.object().shape({
           
            otp: Yup.string().required('OTP is required')
        })
    }
    
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;



    function onSubmit(data) {
       
        return userService.Forgotpassword(data)
            .then((res) => {
                if (typeof res !== 'undefined') { setForgotData(res); }

               

                if (res.status == 1) {
                    alertService.error(res.message);
                   
                } else {
                    alertService.success(res.message, { keepAfterRouteChange: true });
                    
                }
            })
            .catch(alertService.error);
    }
    function handleDataSubmit(data) {
       
        return userService.Forgotpasswordotp(data)
            .then((res) => {
                if (typeof res !== 'undefined') { setForgotDataOtp(res); setForgotData({ status: 3 }) }

              

                if (res.status == 2) {
                    alertService.error(res.message);
                } else {
                    alertService.success(res.message, { keepAfterRouteChange: true });
                   
                }
            })
            .catch(alertService.error);
    }


    return (
        <>

            {forgotdata.status == 1 &&   <section className="h-100 gradient-form" style={{backgroundColor: "#eee"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">
             
                <div className="text-center">
                  <img src="/hrmslogo.png"
                   style={{width: "40%"}} alt="logo" />
                  {/* <h4 className="mt-1 mb-5 pb-1">GEONS HRMS</h4> */}
                  <h4 className="mt-5 mb-5 pb-0">Login to your account</h4>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}  style={{width: "23rem" }} className="row1  ">
                 
                   
                        <div class="form-outline mb-4">
                            <label class="form-label" for="form2Example11">Email</label>
                            <input type="text" {...register('email')} className={`form-control  form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email address" />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div style={{ margin: "auto1" }} class="  text-center pt-1 mb-5 pb-1 row pl-3  ">

                            <button className="btn btn-primary btn-block    mb-3" disabled={formState.isSubmitting}  >
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Submit
                            </button>

                        </div>

                    </form>


                <Alert />

              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
              <div className="text-white  ">
                {/* <h4 className="mb-4">Geonslogix HRMS </h4>
                <p className="small mb-0">Welcome to Human Resourse Management System Application for Geonslogix. </p> */}
                <img src="/forgot.png" style={{width: "100%"}}   alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section> }
            {forgotdata.status == 2 && <section className="h-100 gradient-form" style={{backgroundColor: "#eee"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">
             
                <div className="text-center">
                  <img src="/hrmslogo.png"
                   style={{width: "40%"}} alt="logo" />
                  {/* <h4 className="mt-1 mb-5 pb-1">GEONS HRMS</h4> */}
                  <h4 className="mt-5 mb-5 pb-0">Login to your account</h4>
                </div>

                <form onSubmit={handleSubmit(handleDataSubmit)} style={{width: "23rem" }} className="row1  ">
                 
                    <div class="form-outline mb-4">
                        <label class="form-label" for="form2Example11">Enter 6 digit Verification code</label>
                        <input  type="text" {...register('otp')} className={`form-control  form-control ${errors.otp ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.otp?.message}</div>
                    </div>
                    <div style={{ margin: "auto1" }} class="  text-center pt-1 mb-5 pb-1 row pl-3  ">

                        <button className="btn btn-primary btn-block    mb-3" disabled={formState.isSubmitting}  >
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Verify
                        </button>

                    </div>

                </form>


                <Alert />

              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
              <div className="text-white  ">
                {/* <h4 className="mb-4">Geonslogix HRMS </h4>
                <p className="small mb-0">Welcome to Human Resourse Management System Application for Geonslogix. </p> */}
                <img src="/forgot.png" style={{width: "100%"}}   alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>}
            {forgotdataotp.status == 3 && 


<section className="h-100 gradient-form" style={{backgroundColor: "#eee"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">
             
                <div className="text-center">
                  <img src="/hrmslogo.png"
                   style={{width: "40%"}} alt="logo" />
                  {/* <h4 className="mt-1 mb-5 pb-1">GEONS HRMS</h4> */}
                  {/* <h4 className="mt-5 mb-5 pb-0">Login to your account</h4> */}
                </div>

                <div class="form-outline mb-4 mt-5">

                    <h4 className='text-center mb-4'>Success !</h4>
                    <h6 className='text-center text-success'>Your Password has been Successfully Changed & New Password Sent to you Email.</h6>
                    <p className='text-center text-bold mt-2'>Click below to Login</p>
                    <p className='text-center'>  <a href="/account/login" className='btn btn-primary mb-3 text-white'>Login</a></p>
                </div>
                

                <Alert />

              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
              <div className="text-white  ">
                {/* <h4 className="mb-4">Geonslogix HRMS </h4>
                <p className="small mb-0">Welcome to Human Resourse Management System Application for Geonslogix. </p> */}
                <img src="/forgot.png" style={{width: "100%"}}   alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>}




        </>
    );
}
export default Forgotpassword;