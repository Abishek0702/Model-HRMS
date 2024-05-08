import Carousel from 'react-bootstrap/Carousel';
const TodayBirthday = (props) => {

    const Birthday = props?.birthday
    const dash = Birthday && Birthday.todays_birthday
    return (
        <>
            <div>


                <Carousel aria-controls='none'controls={false} interval={2000} indicators={false} >

                    {dash && dash.map(user =>
                        <Carousel.Item>
                            <div className="card mb-0  overflow-auto" style={{ backgroundColor: "lavenderblush" }} >

                                <div className="d-flex justify-content- align-items-center">
                                    {user.gender == "Male" && <img className=' p-2 rounded-circle float-left' src="/man.png" width="90" height="90" alt="User" />}
                                    {user.gender == "Female" && <img className=' p-2 rounded-circle float-left' src="/women.png" width="100" height="100" alt="User" />}

                                    <div className=" p-3">
                                        <h4 className=" font-weight-bold ">{user.name} </h4>
                                        <p className="text-secondary">  Birthday Today</p>
                                        {user.gender == "Female" && <button style={{ backgroundColor: "pink" }} className=" text-white btn ">Wish Her</button>}
                                        {user.gender == "Male" && <button style={{ backgroundColor: "pink" }} className=" text-white btn ">Wish Him</button>}

                                    </div>
                                    <img src="/balloon.png" width="125" height="125" className="float-right" alt="Design" />

                                </div>
                            </div>
                        </Carousel.Item>
                    )}
                </Carousel>


            </div>

        </>

    )
}
export default TodayBirthday;
