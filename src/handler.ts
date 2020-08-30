import { APIGatewayProxyHandler } from "aws-lambda";

import userCreate from "./handlers/user/create";
import userGet from "./handlers/user/get";
import userList from "./handlers/user/list";
import userDelete from "./handlers/user/delete";
import userUpdate from "./handlers/user/update";

export const hello: APIGatewayProxyHandler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  };
};

export const createUser = userCreate;
export const getUser = userGet;
export const listUsers = userList;
export const deleteUser = userDelete;
export const updateUser = userUpdate;
