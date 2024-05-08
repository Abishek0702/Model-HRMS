import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import   HelpDeskUser   from 'components/employees/HelpDeskUser';
 



export default Helpdesk;

function Helpdesk(){
     
    const router = useRouter();
    const [state, setState] = useState({});
    
    useEffect(() => {
        
 
        return () => {
            setState({}); // This worked for me
        };

    }, []);

    
 
    return (
        <>
 

           <HelpDeskUser/>
        </>

    );
}

 








