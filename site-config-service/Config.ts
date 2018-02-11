import { AbstractController, DynamoDriver } from 'serverless-utils';

export class Config extends AbstractController {

  constructor(){
    super(process.env.DYNAMODB_TABLE,
          new DynamoDriver(process.env.DYNAMODB_TABLE, 'key'));
  }

  public create(obj, callback){

    if(obj != null && obj.key && obj.value){

      var praise = {
        key: obj.key,
        value: obj.value,
      }

      this.dbDriver.create(praise, (error, data) => {
        this.defaultResponse(error, praise, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public update(obj, callback){
    var item = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
          'key': obj.key
      },
      ExpressionAttributeValues: {
          ':value': obj.value,
          ':updated_at': Date.now(),
      },
      UpdateExpression: 'SET uploadStatus = :uploadStatus, updated_at = :updated_at',
      ReturnValues: 'ALL_NEW',
    };

    (<DynamoDriver>this.dbDriver).db.update(item, (error, data) => {
      if(!error) {
        this.defaultResponse(error, data.Attributes, callback);
      }
      else{
        this.defaultResponse(error, data, callback);
      }
    });
  }

  public set(request, callback){

    var obj = JSON.parse(request.body);

    this.findOneInDB(obj.key, (error, data) => {
      if(data.Item){
        this.update(obj, callback)
      }
      else{
        this.create(obj, callback)
      }
    });
  }

  public fetch(request, callback){
    this.dbDriver.all(null, (error, data) => {
      var response = {
        itemsRetourned: data.Items.length,
        data: data.Items
      }
      this.defaultResponse(error, response, callback);
    });
  }

  public get(request, callback){
    if(request.pathParameters && request.pathParameters.key){
      this.findOneInDB(request.pathParameters.key, (error, data) => {
        console.log("\"" + request.pathParameters.key + "\"");
        console.log(JSON.stringify(data));
        console.log(JSON.stringify(error));
        if(data && data.Item){
          this.defaultResponse(error, data.Item, callback);
        }
        else {
          this.defaultResponse(error, {"message": "Item not found."}, callback);
        }
      })
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }
}
