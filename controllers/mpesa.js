
const axios = require('axios').default;
require('dotenv').config();

class MpesaController {

    async getOAuthToken(req,res,next){
        let consumer_key = process.env.consumer_key;
        let consumer_secret = process.env.consumer_secret;

        let url = process.env.oauth_token_url;

        //form a buffer of the consumer key and secret
        let buffer = new Buffer.from(consumer_key+":"+consumer_secret);

        let auth = `Basic ${buffer.toString('base64')}`;

        try{

            let {data} = await axios.get(url,{
                "headers":{
                    "Authorization":auth
                }
            });

            req.token = data['access_token'];

            return next();

        }catch(err){

            return res.send({
                success:false,
                message:err['response']['statusText']
            });

        }
        
        

        
        
    };

    async lipaNaMpesaOnline(req,res){
        let token = req.token;
        let auth = `Bearer ${token}`;
        

        //getting the timestamp
        let timestamp = require('../middleware/timestamp').timestamp;

        let url = process.env.lipa_na_mpesa_url;




        try {

            let {data} = await axios.post(url,{
                "BusinessShortCode":"174379",    
                "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",    
              "Timestamp":"20160216165627",    
              "TransactionType": "CustomerPayBillOnline",    
                "Amount":"1",    
               "PartyA":"254706347307",    
                "PartyB":"174379",    
              "PhoneNumber":"254706347307",    
              "CallBackURL":"https://ade5-41-90-68-200.ngrok.io/mpesa/lipa-na-mpesa-callback",    
              "AccountReference":"Test",    
              "TransactionDesc":"Test"
            },{
                "headers":{
                    "Authorization":auth
                }
            }).catch(console.log);

            return res.send({
                success:true,
                message:data
            });

        }catch(err){

            return res.send({
                success:false,
                message:err['response']
            });

        };
    };

    lipaNaMpesaOnlineCallback(req,res){

        //Get the transaction description
        let message = req.body.Body.stkCallback;

        console.log(message)

        return res.send({
            success:true,
            message
        });

        
    };

};

module.exports = new MpesaController();