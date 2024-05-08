import { userService } from 'services';

const Welcome = () => {
    return (

        <div class="jumbotron bg-white card shadow-none">
            <div className='d-flex  flex-lg-row flex-column'>
                <div className=' ' >
                    <div className=''>
                        <h1>Welcome {userService.userValue?.username}</h1>
                    </div>
                    <div className=''>
                        <div className='d-flex gap-3 align-items-center fontsize-5 fw-bold ' >
                            <div style={{fontSize:"40px"}}>WE</div>
                            <div className='d-flex flex-column'>
                            <div>Envision</div>
                            <div>Enrich</div>
                            <div>Empower</div>
                            </div>
                            
                        </div>
                        <p>Unlock the full potential of your business with our top-notch AI and software development solutions. </p>
                    </div>
                </div>
                <div className='col-lg-6  '>
                    <img src="/pngtree.png" width="400" alt="Design" class="img-fluid" />
                </div>
            </div>

        </div>

    )
}
export default Welcome