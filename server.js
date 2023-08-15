var express = require("express");

var mysql = require("mysql");

var fileupload = require("express-fileupload");

var nodemailer = require("nodemailer");

var app = express();


app.listen(2005, function(){
    console.log("Server Started");
})

var dbConfiguration={
    host:"localhost",
    user:"root",
    password:"",
    database:"project_aug_nodejs2022"
}

////////////          REFERNCE TO DATA BASE             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var refDataBase = mysql.createConnection(dbConfiguration);

refDataBase.connect(function(error)
{
    if(error)
        console.log(error);
    else
        console.log("Server Connected");
})

////////////          to get info of folder           //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/info", function(req,resp){
    resp.contentType("text/html");
    resp.write("Directory name:"+__dirname+"<br>");
    resp.write("File name:"+__filename+"<br>");
    resp.end();
})

//to open index of the project
app.get("/",function(req, resp){
    var path = __dirname+"/public/index.html";
    resp.sendFile(path);
})

////////////          to add pic/css/js files to the project, rather acceptable by server          ////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.static("public"));

app.use(express.urlencoded({extended:true}));

////////////          AJAX for signup model       input type button          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/signupForm", function(req, resp){
    console.log(req.query);

    var {email, password, usertype} = req.query;
    // resp.send("Welcome"+email);

    //create array of all the values in tables
    var aryUser = [email, password, usertype];
    refDataBase.query("insert into users values(?,?,?, current_date() )", aryUser, function(error){
        if(error)
            resp.send(error.toString());
        else
             resp.send("Signed In Successfully");
    }); 

    var mailOptions = {
        from: 'flamboyant712@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'Suucessfully signed in'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
});
 
////////////          AJAX for login modal          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/loginForm", function(req, resp){
    console.log(req.query);

    var {email, password} = req.query;
    // resp.send("Welcome"+email);

    var aryLogin = [email, password];
    refDataBase.query("select * from users where email=? and password=?", aryLogin, function(error, JSONrecords){
        if(error)
            resp.send(error.toString());
        else
            resp.send(JSONrecords);
            console.log(JSONrecords);
    })
})

////////////          SETTINGS                      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/CheckDataInTable", function(req,resp){
    console.log(req.query);

    var {email, password} = req.query;

    var aryLogin = [email, password];
    refDataBase.query("select * from users where email=? and password=?", aryLogin, function(error, JSONrecords){
        if(error)
            resp.send(error.toString());
        else
            resp.send(JSONrecords);
            console.log(JSONrecords);
    })
})

app.get("/updatePassword",function(req,resp){
    console.log(req.query);

    var {email, newpassword, oldpassword} = req.query;

    var aryUpdate = [newpassword, email, oldpassword];

    refDataBase.query("update users set password=? where email=? and password=?", aryUpdate, function(error, JSONrecords){
        if(error)
            resp.send(error.toString());
        else
        // resp.send("got it");
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

////////////          NODEMAILER                     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'flamboyant712@gmail.com',
      pass: 'diqhgoqeqgwrzsef'
    }
  });

//   var mailOptions = {
//     from: 'flamboyant712@gmail.com',
//     to: ,
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

app.use(express.urlencoded({extended:true}));
app.use(fileupload());

////////////          LABOUR PROFIL PAGE ////  input type submit          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/labour-profile", function(req, resp){
    console.log(req.body);

    var {email, name, category, contact, gender, address, city, exp, otherinfo} = req.body;
    var fileName = email+"_"+req.files.upload_file.name;
    var proofName = email+"_"+req.files.upload_proof.name;

    var filePath = process.cwd() + "/public/uploads/"+fileName;
    req.files.upload_file.mv(filePath);

    var proofPath = process.cwd() + "/public/uploads/"+proofName;
    req.files.upload_proof.mv(proofPath);

    var aryLabour = [email, name, fileName, category, contact, gender, address, city, exp, proofName, otherinfo];
    refDataBase.query("insert into labourdetails values(?,?,?,?,?,?,?,?,?,?,?,current_date())", aryLabour, function(error){
        if(error)
            resp.send(error.toString());
        else
        resp.send("got it");
            // resp.send("email = "+email+"&name = "+name+"&category = "+category+"&contact = "+contact+"&fileName = "+fileName+"&gender = "+gender+"&proofName = "+proofName+"&address = "+address+"&city = "+city+"&exp = "+exp+"&otherinfo = "+otherinfo);      
    });
});

app.post("/labour-update", function(req, resp){
    console.log(req.body);

var {email, name, category, contact, gender, address, city, exp, otherinfo} = req.body;
    var fileName = email+"_"+req.files.upload_file.name;
    var proofName = email+"_"+req.files.upload_proof.name;

    var filePath = process.cwd() + "/public/uploads/"+fileName;
    req.files.upload_file.mv(filePath);

    var proofPath = process.cwd() + "/public/uploads/"+proofName;
    req.files.upload_proof.mv(proofPath);
    
    var aryLabour = [name, fileName, category, contact, gender, address, city, exp, proofName, otherinfo, email];
    refDataBase.query("update labourdetails set name=?,profileimg=?,category=?,contact=?,gender=?,address=?,city=?,experience=?,proof=?,otherinfo=? where email=?", aryLabour, function(error){
        if(error)
            resp.send(error.toString());
        else
        resp.send("got it");
            //resp.send("email = "+email+"&name = "+name+"&category = "+category+"&contact = "+contact+"&fileName = "+contact+"&gender = "+gender+"&proofName = "+proofName+"&address = "+address+"&city = "+city+"&exp = "+exp+"&special = "+special+"&other = "+other);      
    });
});

app.get("/JSONDeleteLabour",function(req,resp){
    var {email} = req.query;

    var aryDelCitizen = [email];

    refDataBase.query("delete from labourdetails where email=?",aryDelCitizen,function(error){
        if(error)
        resp.send(error.toString());
        else
        resp.send("Deleted");
    })
})

app.get("/JSONFetch", function(req,resp){
    console.log(req.query);

    var {email} = req.query;

    var aryFetch = [email];

    refDataBase.query("select * from labourdetails where email=?", aryFetch, function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        // resp.send("okay");
        console.log(JSONrecords);
    })
})

////////////          CITIZEN PROFILE PAGE             /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/citizen-profile", function(req,resp){
    console.log(req.body);

    var {email, name, contact, address, city, hirefor} = req.body;
    var fileName = email+"_"+req.files.upload_file.name;
    var filePath = process.cwd() + "/public/uploads/"+fileName;
    req.files.upload_file.mv(filePath);

    var aryCitizen = [email, name, contact, fileName, address, city, hirefor];

    refDataBase.query("insert into citizendetails values(?,?,?,?,?,?,?,current_date())", aryCitizen, function(error){
        if(error)
            resp.send(error.toString());
        else
        resp.send("got it");
    })
})

app.post("/citizen-update", function(req, resp){
    console.log(req.body);

    var {email, name, contact, address, city, hirefor} = req.body;
    var fileName = email+"_"+req.files.upload_file.name;

    var filePath = process.cwd() + "/public/uploads/"+fileName;
    req.files.upload_file.mv(filePath);
    
    var aryCitizen = [name,  contact, fileName, address, city, hirefor, email];
    refDataBase.query("update citizendetails set name=?,contact=?,profileimg=?,address=?,city=?,hirefor=? where email=?", aryCitizen, function(error){
        if(error)
            resp.send(error.toString());
        else
        resp.send("got it");
            //resp.send("email = "+email+"&name = "+name+"&category = "+category+"&contact = "+contact+"&fileName = "+contact+"&gender = "+gender+"&proofName = "+proofName+"&address = "+address+"&city = "+city+"&exp = "+exp+"&special = "+special+"&other = "+other);      
    });
});

app.get("/JSONFetchcitizens", function(req,resp){
    console.log(req.query);

    var {email} = req.query;

    var aryFetch = [email];

    refDataBase.query("select * from citizendetails where email=?", aryFetch, function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        // resp.send("okay");
        console.log(JSONrecords);
    })
})

app.get("/JSONDeleteCitizen",function(req,resp){
    var {email} = req.query;

    var aryDelCitizen = [email];

    refDataBase.query("delete from citizendetails where email=?",aryDelCitizen,function(error){
        if(error)
        resp.send(error.toString());
        else
        resp.send("Deleted");
    })
})

////////////          CITIZENS POSTING WORK             //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/upload-work",function(req,resp){
    console.log(req.body);

    var {email, category, problem, material, address, city, tostarton, tobedonebefore} = req.body;

    var aryPostWork = [email, category, problem, material, address, city, tostarton, tobedonebefore];

    refDataBase.query("insert into post_work_find_labour values(?,?,?,?,?,?,?,?,current_date())",aryPostWork, function(error){
        if(error)
            resp.send(error.toString());
        else
        resp.send("got it");
    });
});

app.get("/JSONDeleteWork",function(req,resp){
    var {email, work} = req.query;

    var aryDelCitizen = [email, work];

    refDataBase.query("delete from post_work_find_labour where email=? and startworkon=?",aryDelCitizen,function(error){
        if(error)
        resp.send(error.toString());
        else
        resp.send("Deleted");
    })
})

app.get("/JSONFetchWork", function(req,resp){
    console.log(req.query);

    var {email, work} = req.query;

    var aryFetch = [email, work];

    refDataBase.query("select * from post_work_find_labour where email=? and startworkon=?", aryFetch, function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        // resp.send("okay");
        console.log(JSONrecords);
    })
})

////////////          ADMIN                             /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin1",function(req,resp){
    var path = process.cwd()+"/public/admin.html";
    resp.sendFile(path);
})

////////////          FETCH DATA OF LABOUR PROFILR       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/GetLabourDetails",function(req,resp){
    refDataBase.query("select * from labourdetails",function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/deleteLabour-record", function(req,resp){
    var {email} = req.query;

    var aryDelLabour = [email];

    refDataBase.query("delete from labourdetails where email=?",aryDelLabour,function(error){
        if(error)
        resp.send(error.toString());
        else
        resp.send("Deleted");
    })
})

////////////          FETCH DATA OF CITIZEN PROFILE       //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/GetCitizenDetails",function(req,resp){
    refDataBase.query("select * from citizendetails",function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/deleteCitizen-record", function(req,resp){
    var {email} = req.query;

    var aryDelCitizen = [email];

    refDataBase.query("delete from citizendetails where email=?",aryDelCitizen,function(error){
        if(error)
        resp.send(error.toString());
        else
        resp.send("Deleted");
    })
})

////////////          FIND WORKER BY CITIZEN                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/fetch-cities-bycitizen",function(req,resp){
    refDataBase.query("select distinct city from labourdetails",function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/fetch-category-bycitizen",function(req,resp){
    console.log(req.query);

    var {city} = req.query;

    var aryEmail = [city];

    refDataBase.query("select distinct category from labourdetails where city=?",aryEmail,function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/fetchWorkers",function(req,resp){

    console.log(req.query);

    var {category, cities} = req.query;

    var aryFetch = [category, cities];

    refDataBase.query("select * from labourdetails where category=? and city=?",aryFetch,function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/fetchUsingEmail",function(req,resp){
    console.log(req.query);

    var {email} = req.query;

    var aryEmail = [email];

    refDataBase.query("select * from labourdetails where email=?",aryEmail,function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

////////////          FIND WORK BY LABOUR                   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/fetch-cities-bylabour",function(req,resp){
    refDataBase.query("select distinct city from post_work_find_labour",function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/fetch-category-bylabour",function(req,resp){
    console.log(req.query);

    var {city} = req.query;

    var aryEmail = [city];

    refDataBase.query("select distinct category from post_work_find_labour where city=?",aryEmail,function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/fetchWork",function(req,resp){

    console.log(req.query);

    var {category, cities} = req.query;

    var aryFetch = [category, cities];

    refDataBase.query("select post_work_find_labour.email, post_work_find_labour.category, post_work_find_labour.explainwork, post_work_find_labour.material, post_work_find_labour.worklocation, post_work_find_labour.city, post_work_find_labour.startworkon, post_work_find_labour.finishworkbefore, citizendetails.contact, citizendetails.profileimg from post_work_find_labour, citizendetails where citizendetails.email=post_work_find_labour.email and post_work_find_labour.category=? and post_work_find_labour.city=?",aryFetch,function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})

app.get("/fetchDetailsEmail",function(req,resp){
    console.log(req.query);

    var {email} = req.query;

    var aryEmail = [email];

    refDataBase.query("select post_work_find_labour.email, post_work_find_labour.category, post_work_find_labour.explainwork, post_work_find_labour.material, post_work_find_labour.worklocation, post_work_find_labour.city, post_work_find_labour.startworkon, post_work_find_labour.finishworkbefore, citizendetails.contact, citizendetails.profileimg from post_work_find_labour, citizendetails where citizendetails.email=post_work_find_labour.email and post_work_find_labour.email=?",aryEmail,function(error, JSONrecords){
        if(error)
        resp.send(error.toString());
        else
        resp.send(JSONrecords);
        console.log(JSONrecords);
    })
})