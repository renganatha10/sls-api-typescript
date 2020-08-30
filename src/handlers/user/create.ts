import * as uuid from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";
import dynamodb from "../../dynamodb";

const create: APIGatewayProxyHandler = async event => {
  const timestamp = new Date().getTime();
  const data = event.body ? JSON.parse(event.body) : null;

  if (!data) {
    console.error("request body is empty");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" })
    };
  }

  const { name, email, profilePhoto } = data;

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-user`,
    Item: {
      id: uuid.v1(),
      name,
      email,
      profilePhoto,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: "Couldn't create the user item." })
    };
  }
};

export default create;
