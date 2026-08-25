const exceptionHandler = ( error: any ) => {


    if(error.status != 200){
     return error.response.data;        
    }

}

export default exceptionHandler;