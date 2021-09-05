const plaid = require('plaid');
const client = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.development,
    options: { version: '2020-09-14' }
  });
const { jwtVerify } = require('jose/jwt/verify');
const { parseJwk } = require('jose/jwk/parse');


const getAndVerifyPlaidJWTKey = async () => {
    const signedJwt = "eyJhbGciOiJFUzI1NiIsImtpZCI6IjZmZDM2ZDA3LTExOTItNDM1Ni1hZWU4LTZmYTlkNWYyYTIwZCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzA3OTgwNzMsInJlcXVlc3RfYm9keV9zaGEyNTYiOiJiYzY5YjZmNWQxMTViZWY1OWJkMGEwZmQ1NzFjZTM2ZWFhNjg3NzVmMzVjY2JjYzY2OTc2ZDdiOWM4ZWIyNTMxIn0.SZX27uNQgK0EkeZe9o-KUHnJx3dw-SkoME0NUVNqw2tCJ5Pf2cCoXrDca2LTPXuoWj5hKNM4KlguD33K8Umf-Q"
    const kid = "6fd36d07-1192-4356-aee8-6fa9d5f2a20d"
    
    const response = await client.getWebhookVerificationKey(kid).catch((err) => { 
        console.log(err)
    });
    
    const key = response.key;
    const publicKey = await parseJwk(key, 'ES256');
    
    const { payload, protectedHeader } = await jwtVerify(signedJwt, publicKey);
}

getAndVerifyPlaidJWTKey();