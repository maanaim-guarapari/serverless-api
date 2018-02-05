import { AbstractDriver } from './AbstractDriver';

export abstract class AbstractController {

  protected resourceName: string;
  protected dbDriver: AbstractDriver;

  constructor(resourceName, dbDriver){
    this.dbDriver = dbDriver;
    this.resourceName = resourceName;
  }

  public sendResponse(statusCode, headers, body, callback){
    const response = {
      statusCode: statusCode,
      headers: headers,
      body: JSON.stringify(body),
    };

    callback(null, response);
  }

  public defaultResponse(error, data, callback){
    if (error) {
        console.error(error);
        this.sendResponse(501,
          { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          { statusCode: 501,
            error: 'Couldn\'t conclude operation on ' + this.resourceName + ' table.'
          },
          callback);
        return;
    }

    this.sendResponse(200,
      {'Content-type': 'application/json',
       'Access-Control-Allow-Origin': '*'},
      data,
      callback);
  }

  public defaultInvalidDataResponse(callback){
    this.sendResponse(501,
      { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      { statusCode: 501,
        error: 'Operation blocked: Invalid data received.'
      },
      callback);
  }

  public getRequestParam(request, paramName){
    if(request && request.pathParameters){
      return request.pathParameters[paramName];
    }
    else{
      return null;
    }
  }
}
