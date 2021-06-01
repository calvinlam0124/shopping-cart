const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD
  }
})

function sendMail (email, subject, html) {
  const mailOptions = {
    from: process.env.USER_MAIL,
    to: email,
    subject,
    html
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

function mailContent (order, status, msg) {
  return `
    <html>
      <head>
        <style>
        td { padding: 5px; }
        .title { background-color: #dcffff; }
        </style>
      </head>
      <body>
        <div>
          <p>親愛的顧客，您好:</p>
          <p>您在卡羅購物下了一筆訂單，以下為您的訂單資訊 :</p>
          <table border="3">
            <tbody>
            <tr>
              <td class="title">訂單號碼</td>
              <td>${order.id}</td>
            </tr>
            <tr>
              <td class="title">訂單金額</td>
              <td>${order.amount}</td>
            </tr>
            <tr>
              <td class="title">姓名</td>
              <td>${order.name}</td>
            </tr>
            <tr>
              <td class="title">寄送地址</td>
              <td>${order.address}</td>
            </tr>
            <tr>
              <td class="title">電話</td>
              <td>${order.phone}</td>
            </tr>
            <tr>
              <td class="title">訂單狀態</td>
              <td>${status}</td>
            </tr>
            <tr>
              <td class="title">付款連結</td>
              <td> 
                <a href="${process.env.URL}/orders/${order.id}/payment">${process.env.URL}/orders/${order.id}/payment</a>
              </td>
            </tr>
            <tr>
              <td class="title">測試用信用卡號</td>
              <td>4000-2211-1111</td>
            </tr>
          </tbody>
          </table>
          <p>${msg}</p>
        </div>
      </body>
    </html>
  `
}

function registerMail (captcha) {
  return `
    <h3>請於卡羅購物註冊頁輸入您的驗證碼</h3>
    <h1>${captcha}</h1>
  `
}

module.exports = { sendMail, mailContent, registerMail }
