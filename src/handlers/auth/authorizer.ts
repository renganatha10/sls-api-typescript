import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import jwt from "jsonwebtoken";

const authorize: APIGatewayTokenAuthorizerHandler = (event, context, cb) => {
  console.log("Auth function invoked", event);
  if (event.authorizationToken) {
    console.log();
    const token = event.authorizationToken;
    const { JWT_SECRET } = process.env;
    const secret = JWT_SECRET || "";
    jwt.verify(token, secret, err => {
      if (err) {
        console.log("No authorizationToken found in the header.", err);
        return cb("Token is invalid");
      } else {
        const { id } = jwt.decode(token) as { id: string };
        const principalId = id || "Proinci";
        cb(null, {
          principalId,
          policyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: "execute-api:Invoke",
                Effect: "Allow",
                Resource: event.methodArn
              }
            ]
          }
        });
      }
    });
  }
  cb("Token is not provoided");
};

export default authorize;
