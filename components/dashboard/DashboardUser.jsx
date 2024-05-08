import React, { useEffect, useState } from 'react'
import DashboardEmployeeofmonth from './DashboardEmployeeofmonth';
import Holidays from './Holidays';
import Birthdays from './Birthdays';
import RecentNews from './RecentNews';
import TodayBirthday from './todayBirthday';
import { DashboardService } from 'services/dashboard.service';
import ConfirmEmployees from './ConfirmEmployees';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';




const DashboardAdmin = () => {

    const [state, setState] = useState({})
    const [dashboardemp, setDashboardemp] = useState(null);
    const [dashholiday, setDashholiday] = useState(null);
    const [dashbirthday, setDashbirthday] = useState(null);
    const [events, setEvents] = useState(null);
    const [upcomingemp, setUpcomingemp] = useState(null);
    const [dashpie, setDashpie] = useState(null);
    const [dashbar, setDashbar] = useState(null);

    useEffect(() => {
       

        handleList();

        return () => {
            setState({});
        };

    }, [""]);


    const handleList = () => {
        DashboardService.getAllAdmin()
            .then((x) => {
                // console.log('x getEmployeemonth', x)
                if (typeof x.empofmonth !== 'undefined') { setDashboardemp(x.empofmonth); }
                if (typeof x.holiday !== 'undefined') { setDashholiday(x.holiday); }
                if (typeof x.birthday !== 'undefined') { setDashbirthday(x.birthday); }
                if (typeof x.events !== 'undefined') { setEvents(x.events); }
                if (typeof x.emps !== 'undefined') { setUpcomingemp(x.emps); }
            });
        DashboardService.getAllPie()
            .then((x) => {
                if (typeof x !== 'undefined') { setDashpie(x); }
            });
        DashboardService.getAllBar()
            .then((x) => {
                if (typeof x !== 'undefined') { setDashbar(x); }
                // console.log("eee",x[0])
            });

    }
    return (

        <section class="content">
            <div class="container-fluid">


                <div class="row">
                    <div class="col-lg-3 col-6">

                        <div class="small-box bg-info">

                            <div class="inner d-flex  justify-content-center">
                            <img src='/leave.png' width={"40px"} />
                            </div>

                            <div class="inner d-flex  justify-content-center"><h5>Attendance</h5></div>

                            <div class="icon">
                                <i class="ion ion-bag"></i>
                            </div>
                            <a href="/employees/reports" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>

                    <div class="col-lg-3 col-6">

                        <div class="small-box bg-success">

                            <div class="inner d-flex  justify-content-center">
                                <img src='/holidays.png' width={"60px"} />
                            </div>
                            <div class="inner d-flex  justify-content-center"><h5>Holidays</h5></div>
                            <div class="icon">
                                <i class="ion ion-stats-bars"></i>
                            </div>
                            <a href="/employees/holidays" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>

                    <div class="col-lg-3 col-6">

                        <div class="small-box bg-warning">
                            <div class="inner d-flex  justify-content-center">
                                <img src='/leave.png' width={"40px"} />
                            </div>
                            <div class="inner d-flex  justify-content-center"><h5>Leave</h5></div>
                            <div class="icon">
                                <i class="ion ion-person-add"></i>
                            </div>
                            <a href="/employees/leaverequest" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>

                    <div class="col-lg-3 col-6">

                        <div class="small-box bg-danger">
                            <div class="inner d-flex  justify-content-center">
                                <img src='/my-profile.png' width={"40px"} />
                            </div>
                            <div class="inner d-flex  justify-content-center"><h5>My Profile</h5></div>

                            <div class="icon">
                                <i class="ion ion-pie-graph"></i>
                            </div>
                            <a href="/employees/myprofile" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>

                </div>



                <div class="row">

                    <section class="col-lg-7 connectedSortable">

                   


                         

                    <div class="card">
                            <div class="card-header  bg-gradient-maroon">
                                <h3 class="card-title">
                                    <i class="fas fa-chart-pie mr-1"></i> Upcoming Holidays
                                </h3>
                                <div class="card-tools">

                                </div>
                            </div>
                            <div class="card-body p-0 m-0">
                                <Holidays holidays={dashholiday} />
                            </div>

                            <div class="card-footer clearfix">
                                <a  class="  float-right" href='/employees/holidays'><i class="fas fa-arrow-right"></i>See All</a>
                            </div>

                             
                        </div>

                        <div class="card">
                            <div class="card-header border-0  bg-gradient-warning">

                                <h3 class="card-title">
                                    <i class="far fa-calendar-alt mr-1"></i>  Upcoming Birthdays
                                </h3>

                                <div class="card-tools">
                                </div>

                            </div>

                            <div class="card-body mb-0">

                                <Birthdays birthday={dashbirthday} />
                            </div>

                        </div>



                    </section>


                    <section class="col-lg-5 connectedSortable">



                    <div class="card">
                            <div class="card-header border-0  bg-gradient-success">

                                <h3 class="card-title">
                                    <i class="far fa-calendar-alt  mr-1"></i> Calendar
                                </h3>

                                <div class="card-tools">


                                </div>

                            </div>

                            <div class="card-body  p-0">

                                <Calendar className="w-100 h-100" />


                            </div>

                        </div>

                        <div class="card bg-gradient-info">
                            <div class="card-header border-0  ">

                                <h3 class="card-title">
                                    <i class="far fa-star mr-1"></i> Employee of month
                                </h3>

                                <div class="card-tools">
                                </div>

                            </div>

                            <div class="card-body p-0 mb-0">

                                <DashboardEmployeeofmonth dashemployeeofmonth={dashboardemp} />
                            </div>

                        </div>

                        
                        <div class="card">


                            <div class="card-body  p-0 mb-0">

                                <TodayBirthday birthday={dashbirthday} />
                            </div>

                        </div>

                        
                       


                        <div class="card">
                            <div class="card-header border-0  bg-gradient-indigo">

                                <h3 class="card-title">
                                    <i class="far fa-calendar-alt mr-1"></i> RecentNews
                                </h3>

                                <div class="card-tools">
                                </div>

                            </div>

                            <div class="card-body  p-1">

                                <RecentNews event={events} />
                            </div>

                        </div>










                    </section>

                </div>


            </div>
        </section>


    )



}
export default DashboardAdmin;