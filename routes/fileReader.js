
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { isEmpty, uploadDir } = require('../helpers/upload-helpers');

router.get('/qrFileReader', (req,res)=>{
    res.render('home/qrFileReader'); 
})

router.post('/qrFileReader', (req,res)=>{
    if(!isEmpty(req.files)){
        if(req.files.file.mimetype == "text/plain"){
            //remove other qr file
            fs.unlink(uploadDir + 'qrcode.txt', (err)=>{
                let file = req.files.file;
                filename = 'qrcode.txt';

                file.mv('./public/upload/' + filename, (err)=>{
                    if(err) {
                        throw err;
                    }
                    req.flash('success_message','File is saved successfully');
                    res.redirect('/fileReader/qrFileReader');
                });
                
            })
        }
        else{
            //text dosya yukleyin hatasi
            req.flash('error_message','Please select .txt file');
            res.redirect('/fileReader/qrFileReader');
        }
    }
    else{
        //dosya yok hatasi
        req.flash('error_message','No files selected');
        res.redirect('/fileReader/qrFileReader');
    }
})

module.exports = router;