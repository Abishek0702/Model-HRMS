import { useRef, useState, useEffect } from 'react';

import { NavLink, Link } from '.';
import { userService } from 'services';
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig();

import { useRouter } from 'next/router';

export { Navnew };

function Navnew() {
    const [user, setUser] = useState(null);
    const creator = useSelector((state) => state.creator)

    const { pathname } = useRouter();


    const [firstName, setFirstname] = useState(publicRuntimeConfig.getUser);
    const [department_id, setdepartmentID] = useState(publicRuntimeConfig.getUser);
    const [designationName, setdesignationName] = useState(publicRuntimeConfig.getUser);
    useEffect(() => {

        const subscription = userService.user.subscribe(x => {
            console.log('x:', x)
            if (x != null) {
                setUser(x),
                    setFirstname(x.username)
                setdepartmentID(x.department_id)
                setdesignationName(x.designationName)


            }

        });


        return () => subscription.unsubscribe();
    }, []);

    function logout() {
        userService.logout();
    }

    const navRef = useRef(null);
    //  const [close, setClose] = useState(true);
    const close = useSelector(state => state.close);

    const onToggleClick3 = (e) => {
        // navRef.current.classList.toggle("sidebar-collapse");
        // setClose(!close);
    };
    const dispatch = useDispatch()

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
    if (!user) return null;

    return (
        <>

            <nav className="main-header navbar navbar-expand navbar-white  ">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" onClick={onToggleClick} role="button"><i className="fas fa-bars"></i></a>      </li>

                    {department_id == 2 && <li className="nav-item d-none d-sm-inline-block">
                        <Link href="/employees/myprofile" className="nav-link">My Profile{close}-- </Link>      </li>}

                    {department_id == 2 && <li className="nav-item d-none d-sm-inline-block">
                        <Link href="/employees/reports" className="nav-link">Attendance</Link>      </li>}

                    {department_id == 2 && <li className="nav-item d-none d-sm-inline-block">
                        <Link href="/employees/leaverequest" className="nav-link">Leave Request</Link>      </li>}

                    {department_id == 2 && <li className="nav-item d-none d-sm-inline-block">
                        <Link href="/employees/changepassword" className="nav-link">Change Password</Link>      </li>}
                </ul>
                <ul className="navbar-nav ml-auto">

                    <li className="nav-item">  <a className="nav-link" data-widget="fullscreen1" onClick={logout} role="button"> <i className="fas fa-sign-out-alt  fa-lg dark-clr"></i>     </a>      </li>
                </ul>
            </nav>



            <aside className="main-sidebar sidebar-dark-primary elevation-1">

                <a className="brand-link" onClick={onToggleClick}>

                    <img src="/hrms-logo-1.png" alt="Geonslogix Logo" className="brand-image img-circle1 elevation-0" />
                    <span className="brand-text font-weight-light"><img src="/hrms-logo-2.png" alt="Geonslogix Logo" style={{ maxHeight: "33px" }} /></span>
                </a>


                <div className="sidebar">

                    <div className="user-panel mt-36 pb-36 mb-36 d-flex">
                        <div className="image mt-2">
                            <img src="/avatar3.png" className="img-circle elevation-0" alt="User Image" />
                        </div>
                        {/* <div className="info">
                        {firstName && <a href="#" className="d-block">{firstName.charAt(0).toUpperCase() + firstName.slice(1).substring(0, 3)}...</a>}
                        </div> */}
                        <div className="info">
                            {firstName && <a href="#" className="d-block">{firstName.charAt(0).toUpperCase() + firstName.slice(1).substring(0, 20)}</a>}
                            {firstName && <a href="#" className="d-block" style={{ fontSize: "0.8rem" }}>{designationName.charAt(0).toUpperCase() + designationName.slice(1).substring(0, 26)}</a>}
                        </div>


                    </div>


                    {/*  <div className="form-inline">
                        <div className="input-group" data-widget="sidebar-search">
                        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                        <div className="input-group-append">
                            <button className="btn btn-sidebar">
                            <i className="fas fa-search fa-fw"></i>
                            </button>
                        </div>
                        </div>
    </div> */}

                    {department_id != 2 && <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">


                            <li className="nav-item">
                                <Link href="/" className={`nav-link ${pathname == '/' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-home  fa-fw "></i>
                                    <p>Dashboard</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/employees/myprofile" className={`nav-link ${pathname == '/employees/myprofile' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-user  fa-fw "></i>
                                    <p>My Profile</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link href="/employees/reports" className={`nav-link ${pathname == '/employees/reports' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-calendar-alt  fa-fw "></i>
                                    <p>Attendance</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link href="/employees/leaverequest" className={`nav-link ${pathname == '/employees/leaverequest' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-calendar-alt  fa-fw "></i>
                                    <p>Leave Request</p>
                                </Link>
                            </li>


                            <li className="nav-item">
                                <Link href="/employees/changepassword" className={`nav-link ${pathname == '/employees/changepassword' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-unlock-alt  fa-fw "></i>
                                    <p>Password</p>
                                </Link>
                            </li>


                            <li className="nav-item">
                                <Link href="/employees/policies" className={`nav-link ${pathname == '/employees/policies' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-file  fa-fw "></i>
                                    <p>Policies</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/employees/holidays" className={`nav-link ${pathname == '/employees/holidays' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-calendar-alt  fa-fw "></i>
                                    <p>Holidays</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link href="/employees/helpdesk" className={`nav-link ${pathname == '/employees/helpdesk' ? 'active' : ''}`}>
                                    <i className="nav-icon fa fa-question-circle  fa-fw "></i>
                                    <p>HelpDesk</p> <img src="/new1.gif" alt="Geonslogix Logo" style={{ maxHeight: "20px" }} className="brand-image img-circle1 elevation-0" />
                                </Link>
                            </li>

                            <li className="nav-item">
                                <a onClick={logout} className="nav-link">
                                    <i className="nav-icon fas fa-sign-out-alt  text-yellow fa-fw "></i>
                                    <p>Logout</p>
                                </a>
                            </li>

                        </ul>
                    </nav>}


                    {department_id == 2 && <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">


                            <li className="nav-item">
                                <Link href="/" className="nav-link">
                                    <i className="nav-icon fa fa-home  fa-fw "></i>
                                    <p>Dashboard</p>
                                </Link>
                            </li>



                            {/*<li className="nav-item">
                            <Link   className="nav-link">
                            <i className="nav-icon   fas fa-plus  fa-fw "></i>
                            <p>New Employee</p>
                            </Link>
                        </li>*/}

                            {/*<li className="nav-header  text-white mt-3">Inventory Management</li>
                        <li className="nav-item">
                            <Link   className="nav-link">
                            <i className="nav-icon fas fa-boxes "></i>
                            <p>Inventories</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link   className="nav-link">
                            <i className="nav-icon fas fa-plus "></i>
                            <p>New Asset</p>
                            </Link>
                        </li>*/}


                            {/* <li className="nav-header">EMPLOYEE MANAGEMENT</li> */}
                            <li className="nav-item">
                                <Link href="/employees" className="nav-link">
                                    <i className="nav-icon fa fa-users"></i>
                                    <p>   Employees </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/leavemanagement" className="nav-link">
                                    <i className="nav-icon fa fa-calendar-alt  fa-fw "></i>
                                    <p>Leave Management</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <a className={`nav-link side-icon-rotate ${pathname.startsWith('/inventory') ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#inventory" aria-expanded="false" aria-controls="inventory">
                                    {/* <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#inventory" aria-expanded="true" aria-controls="inventory">
                                        Accordion Item #1
                                    </button> */}
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <i className="fas fa-user-cog nav-icon"></i>
                                            <p>Inventory Managa..</p>
                                        </div>
                                        <i className="fas fa-angle-left icon"></i>
                                    </div>

                                </a>
                                <ul id="inventory" className={`collapse nav nav-pills nav-sidebar ${pathname.startsWith('/inventory') ? 'show' : ''}`} data-bs-parent="#inventory">
                                    <li className="nav-item">
                                        <Link href="/inventory/assets/1" className={`nav-link px-5 ${pathname == '/inventory/assets/[id]' ? 'sub-menu-active' : ''}`}>
                                            <i className="fas fa-hand-holding-usd nav-icon"></i>
                                            <p>Assets</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/inventory/settings" className={`nav-link px-5 ${pathname == '/inventory/settings' ? 'sub-menu-active' : ''}`}>
                                            <i className="fas fa-cogs nav-icon"></i>
                                            <p>Settings</p>
                                        </Link>
                                    </li>
                                </ul>
                            </li>



                            <li className="nav-item">
                                <Link href="/policymanagement" className="nav-link">
                                    <i className="nav-icon fa fa-file-alt  fa-fw "></i>
                                    <p>Policy Management</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link href="/admin/events" className="nav-link">
                                    <i className="nav-icon fa fa-calendar-day  fa-fw "></i>
                                    <p>Event Management</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link href="/admin/helpdesk" className="nav-link">
                                    <i className="nav-icon fa fa-question-circle  fa-fw "></i>
                                    <p>HelpDesk Requests</p>
                                </Link>
                            </li>



                            <li className="nav-item">
                                <Link href="/attendance" className="nav-link">
                                    <i className="nav-icon fa fa-calendar-check  fa-fw "></i>
                                    <p>Attendance Report</p>
                                </Link>
                            </li>



                            {/* <li className="nav-item">
                            <Link href="/employees/changepassword" className="nav-link">
                            <i className="nav-icon fa fa-unlock-alt  fa-fw "></i>
                            <p>Password</p>
                            </Link>
                        </li> */}

                            <li className="nav-item">
                                <a onClick={logout} className="nav-link">
                                    <i className="nav-icon fas fa-sign-out-alt  text-yellow fa-fw "></i>
                                    <p>Logout</p>
                                </a>
                            </li>




                        </ul>
                    </nav>}

                </div>

            </aside>


        </>
    );
}