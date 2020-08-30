import { APIGatewayProxyHandler } from "aws-lambda";
import dynamodb from "../../dynamodb";

const deleteItem: APIGatewayProxyHandler = async event => {
  const { pathParameters } = event;

  if (!pathParameters || !pathParameters.id) {
    console.error("user id is empty");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" })
    };
  }

  const { id } = pathParameters;

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-user`,
    Key: {
      id
    }
  };

  try {
    const user = await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(user.$response)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: "Couldn't delete the user item." })
    };
  }
};

export default deleteItem;
