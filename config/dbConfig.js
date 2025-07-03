module.exports={
    HOST:"localhost",
    USER:"root",
    PASSWORD:"",
    DB:"nodejs",
    dialect:"mysql",
    pool:{
         max:5,
         min:0,
         acquire: 30000,  // maximum time in milliseconds to get a connection
        idle: 10000      // maximum time in milliseconds a connection can be idle
    }
}