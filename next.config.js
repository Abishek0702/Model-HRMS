module.exports = {
	images: {
	//   unoptimized: true
	loader: 'imgix',
		path: '/',  
	
		},
		distDir: 'dist',
    server: {
		port: 3005, // default: 3000
		host: '0.0.0.0', // default: localhost
	 allowedHost: 'hrms.geonslogix.com'
		  
	   },head: {
		title: 'Geonslogix- HRMS',
		meta: [
		  { charset: 'utf-8' },
		  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
		  { hid: 'description', name: 'description', content: 'Geonslogix - HRMS' }
		],
		link: [
		  { rel: 'icon', type: 'image/x-icon', href: '/favicon2.ico' },
		  { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.15.1/css/all.css' },
		  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins' },
		  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css' },
		  { rel: 'stylesheet', href: '/design/bootstrap.min.css' },
		  { rel: 'stylesheet', href: '/design/css/adminlte.min.css' }
		  
		],
		script: [
          { src: 'https://colorlib.com/etc/bootstrap-sidebar/sidebar-07/js/jquery.min.js' },
		  { src: 'https://colorlib.com/etc/bootstrap-sidebar/sidebar-07/js/popper.js' } ,
		  { src: 'https://colorlib.com/etc/bootstrap-sidebar/sidebar-07/js/bootstrap.min.js' }
		],
    },
reactStrictMode: true,
    serverRuntimeConfig: {
        secret: process.env.secret
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3005/api' // development api
            : 'http://hrms.geonslogix.com/api' // production api
    }
}
