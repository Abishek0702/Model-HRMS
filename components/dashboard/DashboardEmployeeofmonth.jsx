import Carousel from 'react-bootstrap/Carousel';


const DashboardEmployeeofmonth = (props) => {

    const dashemployeeofmonth = props?.dashemployeeofmonth
    const dash = dashemployeeofmonth
    //  console.log("list",dashemployeeofmonth);
    //  console.log("g",dash);


    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', {
            month: 'long',

        });
    }

    return (
        <>
            <div>
                <Carousel aria-controls='none' controls={false} interval={5000} indicators={false}>

                    {dash && dash.map(user =>
                        <Carousel.Item>

                            
                            

                                
                                    <div className="">
                                    
                                    <div class="small-box mb-0 bg-info">

                                    {user.gender == "Male" && <img className=' rounded-circle float-left pt-2 pl-1 pr-1' src="/man.png" width="90" height="90" alt="User" />}
                                    {user.gender == "Female" && <img className=' rounded-circle  float-left pt-2 pl-1 pr-1' src="/women.png" width="100" height="100" alt="User" />}

                        <div class="inner">
                        <h5>{user.name}</h5>

                        <p className="text-small1 m-0">{user.designationName}</p>
                                            <p className="font-size-sm">Month-{getMonthName(user.display_month)}</p>
                        </div>
                        <div class="icon text-right imga">
                        <img style={ {width: "50%"}} src="/employee_month.png" alt="Design" className='text-right '  />
                        </div>
                        {/* <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a> */}
                    </div>




                                        {/* {user.gender == "Male" && <img src="/man.png" alt="User" class="rounded-circle " width="125" height='125' />}
                                        {user.gender == "Female" && <img src="/pngtree-women.png" alt="User" class="rounded-circle " width="125" height='125' />}
                                        <div className="p-3">
                                            <h4 className=" font-weight-bold ">{user.name}</h4>
                                            <p className="text-secondary m-0">{user.designationName}</p>
                                            <p className="font-size-sm">Month-{getMonthName(user.display_month)}</p>
                                        </div>
                                        <div className=''  >
                                            <img style={
                                                {
                                                    position: "absolute",
                                                    bottom: "-5px",
                                                    right: "-30px",
                                                    padding: "5px",
                                                    width: "200px",
                                                    height: "115px",

                                                }
                                            } src="/employee_month.png" alt="Design" className='d-sm-none d-lg-block d-md-none'  />
                                        </div> */}
                                    </div>
                                
                        </Carousel.Item>
                    )}
                </Carousel>

            </div>

           
        </>


    )
}
export default DashboardEmployeeofmonth;
