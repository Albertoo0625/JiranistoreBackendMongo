const axios=require('axios');
const localtunnel=require('localtunnel');


const handleMpesaPayment=async(req,res)=>{


    const phone =req.body.phone.substring(1);
    const amount= req.body.amount;
    const token=req.body.token;

    console.log(` phone and amount: ${phone},${amount}`);

    const date=new Date();
    const timestamp=
    date.getFullYear()+
    ("0" + (date.getMonth()+1)).slice(-2)+
    ("0" + date.getDate()).slice(-2)+
    ("0" + date.getHours()).slice(-2)+
    ("0" + date.getMinutes()).slice(-2)+
    ("0" + date.getSeconds()).slice(-2);

    const shortcode=process.env.MPESA_PAYBILL;
    const passkey=process.env.MPESA_PASSKEY;

    console.log(`shortcode: ${shortcode}`);

    console.log(`passkey: ${passkey}`);

    const password= new Buffer.from(shortcode+passkey+timestamp).toString("base64");

try{

  const callbackURL =await (async () => {
  const tunnel = await localtunnel({ port: 3500 });

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
   return tunnel.url;
  })();



  console.log(`Callback URL ${callbackURL}`);
 

await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {    
          "BusinessShortCode":shortcode,    
          "Password": password,    
          "Timestamp": timestamp,    
          "TransactionType": "CustomerPayBillOnline",    //"CusomerBuyGoodsOnline"
          "Amount":amount,    
          "PartyA":`254${phone}`,    
          "PartyB":shortcode,    
          "PhoneNumber":`254${phone}`,    
          "CallBackURL":`${callbackURL}/callback`,    
          "AccountReference":`254${phone}`,   
          "TransactionDesc":"Test"
        },{
          headers:{
            Authorization: `Bearer ${token}`         
          },
        })
        .then((data)=>{
          res.json(data.data);
      }).catch((err)=>{   
      console.log(err);
      res.status(400).json(`errorMessage: ${err}`);
      });

    }catch(err){
      console.log(err.message)
    }

}


module.exports={handleMpesaPayment}