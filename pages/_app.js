import Head from 'next/head';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Provider, useDispatch } from 'react-redux'
import { useStore } from '../store'

//import 'styles/MintNFT.css';
import 'styles/globals.css';
import 'styles/card.css';
import 'next-pagination/dist/index.css'
//import 'styles/sidebar.css';

import { userService } from 'services';
import { Nav, Alert, Navnew, Homecontainer } from 'components';


//import 'admin-lte/dist/css/AdminLTE.min.css' 
//import 'admin-lte/plugins/jquery/jquery.min.js' 
//import 'admin-lte/dist/js/demo.js' 



//export default App;





export default function App({ Component, pageProps }) {
    const store = useStore(pageProps.initialReduxState)

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);



    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // userListCreate()

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        setUser(userService.userValue);
        const publicPaths = ['/account/login', '/account/forgotpassword'];
        const path = url.split('?')[0];
        if (!userService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/account/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            console.log("star******", path);
            setAuthorized(true);
            if ((path == '/account/login' || path == '/account/forgotpassword') && userService.userValue) {
                router.push({ pathname: '/' });
            }

        }
    }


    // const userListCreate = () => {
    //     userService.userList().then(x => useDispatch())
    // }


    const navRef = useRef(null);
    const [close, setClose] = useState(true);

    const onToggleClick = (e) => {
        // navRef.current.classList.toggle("sidebar-collapse");
        setClose(!close);
    };
    // const countvalue = useSelector(state => state.countvalue);

    return (
        <>
            <Head>
                <title>GeonsLogix - Home Page</title>

                {/* eslint-disable-next-line @next/next/no-css-tags */}
                {/* <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet"  crossOrigin="anonymous"/>
                  <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet"   crossOriginorigin="anonymous"/> */}

                {/* <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p"  crossOrigin="anonymous" async ></script> */}
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossOrigin="anonymous" async ></script>

                {/* <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet"  crossOrigin="anonymous"/>
                  <link href="/design/css/adminlte.min.css" rel="stylesheet"   crossOrigin="anonymous"/>
                  <link href="/design/css/adminlte.min.css" rel="stylesheet"   crossOrigin="anonymous"/> */}


                {/* <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js" integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ" crossOrigin="anonymous" async ></script>
<script defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js" integrity="sha384–6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY" crossOrigin="anonymous"></script>
                  
                  <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'  crossOrigin="anonymous"></link> */}

                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet" crossOrigin="anonymous" />
                <link href="/design/css/adminlte.min.css" rel="stylesheet" crossOrigin="anonymous" />
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet' crossOrigin="anonymous"></link>

            </Head>


            {/*  <div className={`skin-blue layout-top-nav`}>
                   <Provider store={store}>
				           <Nav />  
                   
                   <Alert />
                   {authorized && <Component {...pageProps} /> }
				        </Provider>
            
    </div> */ }

            {/* credits className="hold-transition sidebar-mini layout-fixed" */}

            {!user &&
                <Provider store={store}>
                    {authorized && <Component {...pageProps} />}
                </Provider>}

            {user &&
                <Provider store={store}>
                    {/* JSON.stringify(user) */}
                    <Homecontainer close="true" userdata={user}>
                        {authorized && <Component {...pageProps} userdata={user} />}
                    </Homecontainer>
                </Provider>}

        </>
    );
}
