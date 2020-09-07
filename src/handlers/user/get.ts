import { APIGatewayProxyWithLambdaAuthorizerHandler } from "aws-lambda";

import dynamodb from "../../dynamodb";

const get: APIGatewayProxyWithLambdaAuthorizerHandler<{
  principalId: string;
}> = async event => {
  const {
    requestContext: {
      authorizer: { principalId }
    }
  } = event;

  if (!principalId) {
    console.error("user id is empty");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" })
    };
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-user`,
    Key: {
      id: principalId
    }
  };

  try {
    const user = await dynamodb.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(user.Item)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: "Couldn't delete the user item." })
    };
  }
};

export default get;
