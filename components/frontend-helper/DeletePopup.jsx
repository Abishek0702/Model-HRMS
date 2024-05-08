import React, { useState } from 'react'

const DeletePopup = () => {
    const [show, setHide] = useState(false)
    return (
        <>
            <button onClick={() => setHide(true)}>Show</button>
            {/* <div className='delete-Popup-wrapper w-100 text-center d-flex align-items-center justify-content-center'> */}
                <div className={`card w-25   bg-danger ${show ? '' : ' d-none'}`}>
                    {/* <div className="card-header"><i class="fas fa-times"></i> </div> */}
                    <div className="card-body">
                        <div className='' style={{ textAlign: "end", cursor: "pointer" }}>
                            <i class="fas fa-times" title='close' onClick={() => setHide(false)}></i>
                        </div>
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <div className='border border-muted px-4 py-3 rounded-circle mb-4'>
                                <i className="fas fa-times" style={{ fontSize: "2rem" }}></i>
                            </div>
                            <h5>Are you Sure?</h5>
                            <p className='text-muted '><small>Do you really want to delete these records? This proccess cannot be undone</small></p>
                            <div>
                                <button className='btn btn-sm btn-secondary px-4 mx-1' onClick={() => setHide(false)}>Cancel</button>
                                <button className='btn btn-sm btn-info px-4 mx-1'>Delete</button>
                            </div>
                        </div>
                    </div>
                    {/* <div className="card-footer bg-info">Footer</div> */}
                </div>
            {/* </div> */}


        </>
    )
}

export default DeletePopup
