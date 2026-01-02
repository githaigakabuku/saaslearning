//this is the simplesr node api t help me understand docker and node

const { timeStamp, error } = require('console');
const http = require('http');
const url = require('url');

//creare a server thisfunction run for everty incoming requesr

const server = http.createServer((request , response) =>{

    //parse the url to get path like '/' '/health '

    const parsedurl = url.parse(request.url , true);
    const pathname = parsedurl.pathname;

    //seet the response header tell the broswer which response are we sending

    response.setHeader('cotent-Type ' , 'application/json');

    //routing : diffrent paths do diffrent things

    if (pathname === '/'){

        //home route page
        response.statusCode = 200 ;
        response.end(JSON.stringify({
            message: "hello from saas API",
            timeStamp: new Date().toISOString()
        }));
    }
    else if (pathname === '/heath'){

        //heath check route  (for docker / render to motior)
        response.statusCode = 200 ;
        response.end(JSON.stringify({
            status: 'healthy',
            service: 'node-api',
            uptime: process.uptime()//how long has the sercive been running
        }));
    }
    else if (pathname === '/api/users'){

        response.statusCode = 200 ;
        response.end(JSON.stringify({
            users: [
                {id: 1 , who: 'SAM'},
                {id:  2 , who: 'me'}
            ]
        }));
    }
    else {
        //404 - not found 

        response.statusCode = 404 ;
        response.end(JSON.stringify({
            error: 'not found' , 
            path: pathname
        }));
    }

});

//get the port w ewould use env but now we seet to local variables

const PORT = process.env.PORT || 3000 ; 

//start the sever listening process for requesr
server.listen(PORT , () => {
    console.log(`server lsiteming on ${PORT}`);
    console.log(` these the port ${PORT} `); 
});

//HANDEL A GRACEFUL SHUTDOWN IMPORTANT FOR DOCKER

process.on('SIGTERM', () => {
    console.log (' recevied sigterm  ,  signal shutting down gracefully');
    server.close(() => {
        console.log(' server closed');
        process.exit(0); 
    });
});