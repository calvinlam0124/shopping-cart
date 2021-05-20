const CryptoJS = require('crypto-js')

const MerchantID = process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const URL = 'http://5398463a6a33.ngrok.io'
const PayGateWay = 'https://ccore.newebpay.com/MPG/mpg_gateway'
const ReturnURL = URL + '/orders/newebpay/callback?from=ReturnURL'
const NotifyURL = URL + '/orders/newebpay/callback?from=NotifyURL'
const ClientBackURL = URL + '/orders'

function getData (amount, productDesc, email) {
  const data = {
    MerchantID: MerchantID,
    RespondType: 'JSON',
    TimeStamp: Date.now(),
    Version: 1.6,
    MerchantOrderNo: Date.now(), // unique
    Amt: amount, // order amount
    ItemDesc: productDesc, // product description
    TradeLimit: 600, // trade limit seconds
    ReturnURL: ReturnURL, // pay success and back to url
    NotifyURL: NotifyURL, // pay notify url
    ClientBackURL: ClientBackURL, // pay fail and back to url
    Email: email, // pay person email
    LoginType: 0, // don't need to login Newsboy
    OrderComment: 'OrderComment' // store comment
  }
  return {
    MerchantID: MerchantID,
    TradeInfo: TradeInfoAES(data),
    TradeSha: tradeInfoSHA(data),
    Version: 1.6,
    PayGateWay: PayGateWay, // send api position
    MerchantOrderNo: data.MerchantOrderNo // product code: store in db
  }
}

function genDataChain (data) {
  const dataArr = []
  for (const obj of Object.entries(data)) {
    dataArr.push(`${obj[0]}=${obj[1]}`)
  }
  return dataArr.join('&')
}

function TradeInfoAES (data) {
  const dataChain = genDataChain(data)
  // AES
  const key = CryptoJS.enc.Utf8.parse(HashKey)
  const iv = CryptoJS.enc.Utf8.parse(HashIV)
  const tradeInfoAES = CryptoJS.AES.encrypt(dataChain, key, { iv })
  return tradeInfoAES.ciphertext.toString()
}

function tradeInfoSHA (data) {
  const tradeInfoAES = TradeInfoAES(data)
  // SHA
  const tradeInfoSHA = CryptoJS.SHA256(`HashKey=${HashKey}&${tradeInfoAES}&HashIV=${HashIV}`).toString().toUpperCase()
  return tradeInfoSHA
}

function decryptData (data) {
  const key = CryptoJS.enc.Utf8.parse(HashKey)
  const iv = CryptoJS.enc.Utf8.parse(HashIV)
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const encryptedData = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decryptData = CryptoJS.AES.decrypt(encryptedData, key, { iv })
  return decryptData.toString(CryptoJS.enc.Utf8)
}

module.exports = {
  getData,
  decryptData
}
