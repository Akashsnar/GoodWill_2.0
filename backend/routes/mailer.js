const nodemailer=require('nodemailer');
async function mail(mailer)
{
const transporter=nodemailer.createTransport({
    service: ' gmail ',
    auth:{
        user:'aksn0204@gmail.com',
        pass:'vxabqjgbyyveigjf'
    }
});
const mailoptions={
    from:'aksn0204@gmail.com',
    to: `${mailer}`,
    subject: `testing`,
    text:`catch it`
};
  transporter.sendMail(mailoptions,function(err,info){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log(    `email sent`+info.response);
    }
})
};
module.exports = mail;