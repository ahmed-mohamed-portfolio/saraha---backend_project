export const verifyEmailTemplate = (code) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 500px;
                margin: auto;
                background: #ffffff;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            }
            .code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                margin: 20px 0;
                color: #4CAF50;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Email Verification</h2>
            <p>Please use the following code to verify your email:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 5 minutes.</p>
            <div class="footer">
                If you didn’t request this, you can ignore this email.
            </div>
        </div>
    </body>
    </html>
    `
}