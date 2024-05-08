import { useRef,useState, useEffect } from 'react';
import { isMobile } from "react-device-detect";


import {Navnew, Alert, NavLink,Link } from '.';
import { userService } from 'services';
import { useDispatch,useSelector, shallowEqual } from 'react-redux'

export { Homecontainer };

function Homecontainer({ props,children }) {
    const [user, setUser] = useState(null);
    const countvalue = useSelector(state => state.countvalue);
    const close = useSelector(state => state.close); 
    const navRef = useRef(null);
    const dispatch = useDispatch()
    const userdata = props?.userdata;
    

    useEffect(() => {
        if(isMobile){
            onToggleClick();
        }
        
        const subscription = userService.user.subscribe(x => setUser(x));
        return () => subscription.unsubscribe();
    }, []);

    function logout() {
        userService.logout();
    }

    const onToggleClick = (e) => {
        // navRef.current.classList.toggle("sidebar-collapse");
       // setClose(!close);
       console.log("onToggleClick");
       dispatch({
        type: 'MASS',
        close: !close,
       });
    }


    // only show nav when logged in
    //if (!user) return null;
    
    return (
        <>
         
       
       <div className={close ? "sidebar-open sidebar-mini" : "sidebar-close sidebar-mini  sidebar-collapse"}   style={{height: "auto"}}  ref={navRef}>
      
        <div className="wrapper">
        
        <Navnew className/>

        


            <div className="content-wrapper">
                 {/* <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">{isMobile ? <h2>Mobile</h2> : <h2>Desktop</h2>}</h1>
                        </div> 
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active">Employee Management</li>
                            </ol>
                        </div> 
                        </div> 
                    </div> 
                    </div> */}



                    {/*   Main content */}
                        <section className="content"  >
                        <div className="container-fluid">

                           <Alert />  { children }
                    
                      </div>
                    </section>


                              {/*   Main content */}


            </div>







            <footer className="main-footer">
                <strong>Copyright &copy; 2023 <a href="https://geonslogix.com">Geonslogix.com</a>.</strong>
                
                <div className="float-right d-none d-sm-inline-block">
                  All rights reserved.
                </div>
            </footer>
        </div>

         

       
         </div>
         </>
    );
}