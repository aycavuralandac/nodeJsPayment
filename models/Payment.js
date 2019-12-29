function Payment(returnCode,returnDesc,receiptMsgCustomer,receiptMsgMerchant,paymentInfoList,QRdata){
    this.returnCode = returnCode
    this.returnDesc = returnDesc
    this.receiptMsgCustomer = receiptMsgCustomer
    this.receiptMsgMerchant = receiptMsgMerchant
    this.paymentInfoList = paymentInfoList,
    this.QRdata = QRdata
}
module.exports = Payment;