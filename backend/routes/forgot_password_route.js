const express=require('express');
const app = express();
const bodyparser=require('body-parser');
const router = express.Router();
const { urlencoded } = require('body-parser');
const User = require('../mongoSchema/userdetails');
const mailer = require('./mailer');
const nodemailer=require('nodemailer');
const jwt = require('jsonwebtoken');

var username2;
app.use(bodyparser, urlencoded({ extended: false }));
app.set("view engine","ejs");
app.set("views","views");

router.get("/",(req,res,next)=>{
    console.log("forgot_password_route");
    return res.render("forgetpassword.ejs")

})

router.post("/",async(req,res,next)=>{
    console.log("post req is obtained");
    const val = req.body;
    var username = val.username;
    username2=username;
    module.exports.username=username;
    
    const result = await User.findOne({username:username})
    console.log(result);
    var email = result.email; 
    console.log(username+ "  "+ email);

        if(result!=null)
        {
            var  emailid = email;
              const jwt_secret = 'some super secret...';
              const payload = {email : emailid};
              var token =jwt.sign(payload,jwt_secret,{expiresIn: '10m'});
            //   module.exports.token=token;
              const link = `http://localhost:3000/reset-password/${username}`;
            
              console.log(link);
              
               const transporter= nodemailer.createTransport({
                   service: ' gmail ',
                   auth:{
                       user:'aksn0204@gmail.com',
                       pass:'vxabqjgbyyveigjf'
                   }
               });
               const mailoptions={
                   from:'aksn0204@gmail.com',
                   to: `${emailid}`,
                   subject: `testing`,
                   text:`${link}`,
                   html:`
                   <!DOCTYPE html>
                    <html lang="en">
                    <p>Password reset link has been sent to your email</p>
                    <a href= "http://localhost:3000/reset-password/${username}" >link</a>

                    </html>`,
                 
               };
                transporter.sendMail(mailoptions,function(err,info){
                   if(err)
                   {
                       console.log(err);
                       res.status(400).send({
                        message: 'this is an error!'
                       })
                   }
                   else{
                       console.log(    `email sent`+info.response);
                       res.redirect('log');
                   }
        })
        }
        if(result==null)
        {
            console.log("User does'nt exist");
            res.send("User does'nt exist");
        }




        
        // User.get(q,{$username: username},async(err,res)=>{
        //     if(err || !res){
        //     return res.status(400).send({
        //         message: 'This is an error'
        //     });
        // }
        //     else{
        //        var  emailid = res.email;
        //       const jwt_secret = 'some super secret...';
        //       const payload = {email : emailid};
        //       var token =jwt.sign(payload,jwt_secret,{expiresIn: '10m'});
        //     //   module.exports.token=token;
        //       const link = `http://localhost:3000/reset-password/${username}`;
            
        //       console.log(link);
              
        //        const transporter= nodemailer.createTransport({
        //            service: ' gmail ',
        //            auth:{
        //                user:'aksn0204@gmail.com',
        //                pass:'vxabqjgbyyveigjf'
        //            }
        //        });
        //        const mailoptions={
        //            from:'aksn0204@gmail.com',
        //            to: `${emailid}`,
        //            subject: `testing`,
        //            text:`${link}`,
        //            html:`
        //            <!DOCTYPE html>
        //             <html lang="en">
        //             <p>Password reset link has been sent to your email</p>
        //             <a href= "http://localhost:3000/reset-password/akashnr" >link</a>

        //             </html>`,
                 
        //        };
        //         transporter.sendMail(mailoptions,function(err,info){
        //            if(err)
        //            {
        //                console.log(err);
        //                res.status(400).send({
        //                 message: 'this is an error!'
        //                })
        //            }
        //            else{
        //                console.log(    `email sent`+info.response);
        //                res.redirect('log');
        //            }
        //        })
        //        }
              

        //     })

    // return res.render("log");
    

})

module.exports=router;