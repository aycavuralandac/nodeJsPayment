function PaymentAction(paymentType,amount,currencyID,vatRate){
    this.paymentType = paymentType
    this.amount = amount
    this.currencyID = currencyID
    this.vatRate = vatRate
}
module.exports = PaymentAction;