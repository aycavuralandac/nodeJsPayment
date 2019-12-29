const post_payment = {
    hostname: 'sandbox-api.payosy.com',
    path: '/api/payment',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ibm-client-id':'d56a0277-2ee3-4ae5-97c8-467abeda984d',
      'x-ibm-client-secret': 'bF1rB2nC1jY2tM4dL2bU1yO8sB1kX7cP3nK3pU0bV3gH1cN3uT'
    }
  }

  module.exports = {
      post_payment: post_payment
  }