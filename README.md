### Simple example of using package `amazon-cognito-identity-js` package for registration users in AWS Cognito User Pool

User Pool creation:
[https://aws.amazon.com/blogs/mobile/accessing-your-user-pools-using-the-amazon-cognito-identity-sdk-for-javascript/](https://aws.amazon.com/blogs/mobile/accessing-your-user-pools-using-the-amazon-cognito-identity-sdk-for-javascript/)
[https://youtu.be/TowcW1aTDqE?t=1429](https://youtu.be/TowcW1aTDqE?t=1429)

Installation step:
`$npm i amazon-cognito-identity-js --save`
`$npm i react-hook-form --save`

.env file contains next env variables:

```nodejs
REACT_APP_Pool_Id=
REACT_APP_App_client_Id=
REACT_APP_Identity_pool_Id=
REACT_APP_Region=us-east-1=
```

Related Links:
https://github.com/awslabs/aws-serverless-auth-reference-app
[https://www.youtube.com/watch?v=VZqG7HjT2AQ](https://www.youtube.com/watch?v=VZqG7HjT2AQ)
[https://www.slideshare.net/AmazonWebServices/aws-reinvent-2016-serverless-authentication-and-authorization-identity-management-for-serverless-architectures-mbl306](https://www.slideshare.net/AmazonWebServices/aws-reinvent-2016-serverless-authentication-and-authorization-identity-management-for-serverless-architectures-mbl306)
[https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js
https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html](https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)

[How to make React app preview on mobile?](https://stackoverflow.com/a/55231285/9783262)
For windows:
Find your public IP using ipconfig in cmd. Find IPv4 address under Wireless LAN adapter Wi-Fi. Make sure your phone and pc are in the same LAN (connect to the same Wifi). Use http://your_ip:3000 to preview your react app.
