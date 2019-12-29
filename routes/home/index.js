const express = require('express');
const router = express.Router();
const fs = require('fs');
const Payment = require('../../models/Payment')
const PaymentInfo = require('../../models/PaymentInfo')
const PaymentAction = require('../../models/PaymentAction')
const https = require('https')
const apiInfo = require('../../config/apiInfo');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var paymentApiOptions = apiInfo.post_payment;


router.all('/*', (req,res,next)=>{
    req.app.locals.layout = 'home';
    next();
})
router.get('/', (req,res)=>{
    req.session.destroy();
    res.render('home/index'); 
});

router.get('/payment', (req,res)=>{
    fs.readFile('././public/upload/qrcode.txt','utf8', function(err, data) {
        if (data){
            var amount, currencyID, vatRate, length, value 
        
            var newData = data;
            var tag = '00'
            index = 0
            while (tag != '88'){
                
                tag = newData.substr(index, 2);
                length = newData.substr(index+2, 2);
                value = newData.substr(index+4, length);

                if ( tag == '53'){
                    currencyID = parseInt(value);
                }
                if (tag == '54'){
                    amount = parseInt(value);
                }
                if (tag == '86'){
                    vatRate = parseInt(value.substr(0,3));
                }
                index += tag.length + length.length + value.length;
            }

            if(!currencyID || !amount || !vatRate){
                req.flash('error_message','Qr file format doesnt seem right, please check');
                res.redirect('/');
            }
            else{
                var paymentActionList = [];
                paymentActionList.push(new PaymentAction(3, amount, currencyID, vatRate));

                var paymentInfo = new PaymentInfo(
                    67,
                    paymentActionList
                )
                var paymentInfoList = [];
                paymentInfoList.push(paymentInfo);

                var payment = new Payment(
                    1000, 'success', 'beko Campaign/n2018','beko Campaign Merchant/n2018', paymentInfoList, data
                )
                
                if (err) throw err;
                req.session.paymentInfo = payment;
                req.flash('success_message','Payment is done');
                res.render('home/payment',{payment: payment});    
            }
        }
        else{
            req.flash('error_message','Qr file not found, please upload one');
            res.redirect('/');
        }
    });
});

router.post('/payment', (req,res)=>{
    if (req.session.paymentInfo) {
        let body = "";
        const data = JSON.stringify(req.session.paymentInfo);
        const _req = https.request(paymentApiOptions, _res => {
            
            _res.setEncoding('utf8');
            _res.on("data", data => {
                body += data;
            });
            _res.on("end", () => {
                body = JSON.parse(body);
                if(body.returnCode && body.returnCode == 1000)
                {
                    req.flash('success_message',`The payment has done with sessionId: ${body.sessionID}`);
                    console.log(body);
                    res.redirect('/');
                }
                else{
                    req.flash('error_message',`Payment service returns an error: ${body.returnCode} ${body.returnDesc}`);
                    console.log(body);
                    res.redirect('/');
                }                
            });
        })

        _req.on('error', error => {
            console.error(error)
        })
          
        _req.write(data)
        _req.end()
    }
})

module.exports = router;