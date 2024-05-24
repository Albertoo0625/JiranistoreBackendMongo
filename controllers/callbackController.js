// const Mpesa=require('../modal/MpesaSchema')

// const handleCallback=async(req,res)=>{
// const callbackData=req.body;

// console.log(callbackData.Body);
// if(!callbackData.Body.stkCallback.CallbackMetadata){
//     console.log(callbackData.Body);
//     return res.json('ok')
// }

// if(callbackData.Body.stkCallback.ResultCode == 0)
// {

//     const metadata = callbackData.Body.stkCallback.CallbackMetadata.Item;

//     const phone = metadata[4].Value;
//     const trnxid = metadata[1].Value;
//     const amount = metadata[0].Value;
    
//     console.log({phone,trnxid,amount});
    
//     const result=await Mpesa.create(
//         {
//             mpesa_number:phone,
//             mpesa_trnxid:trnxid,
//             mpesa_amount:amount,
    
//         }
//     ).then(()=>{
//       res.status(200).json('mpesa details saved to database');
//     });
    
//     console.log(result);
// }
// }
// module.exports={handleCallback}


const Mpesa = require('../modal/MpesaSchema');

const handleCallback = async (req, res) => {
    const callbackData = req.body;

    console.log(callbackData.Body);
    if (!callbackData.Body.stkCallback.CallbackMetadata) {
        console.log(callbackData.Body);
        return res.json('ok');
    }

    if (callbackData.Body.stkCallback.ResultCode == 0) {
        try {
            const metadata = callbackData.Body.stkCallback.CallbackMetadata.Item;
            const phone = metadata[4].Value;
            const trnxid = metadata[1].Value;
            const amount = metadata[0].Value;

            console.log({ phone, trnxid, amount });

            const result = await Mpesa.create({
                mpesa_number: phone,
                mpesa_trnxid: trnxid,
                mpesa_amount: amount,
            });

            console.log(result);
            return res.status(200).json('Mpesa details saved to database');
        } catch (error) {
            console.error('Error saving Mpesa details to database:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = { handleCallback };
