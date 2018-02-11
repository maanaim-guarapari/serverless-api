import { AbstractController, DynamoDriver } from 'serverless-utils';

export class Praises extends AbstractController {

  constructor(){
    super(process.env.DYNAMODB_TABLE,
          new DynamoDriver(process.env.DYNAMODB_TABLE));
  }

  public create(request, callback){

    var obj = JSON.parse(request.body);

    if(obj != null && obj.type && obj.name && obj.number && obj.song){

      var praise = {
        type: obj.type,
        name: obj.name,
        number: obj.number,
        song: obj.song,
      }

      if(obj.type) praise['category'] = obj.category
      if(obj.lyrics) praise['lyrics'] = obj.lyrics
      if(obj.aditionalFiles) praise['aditionalFiles'] = obj.aditionalFiles

      this.dbDriver.create(praise, (error, data) => {
        this.defaultResponse(error, praise, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public fetch(request, callback){
    this.dbDriver.all(null, (error, data) => {
      // if(!data) data = { "Items": [] };
      var response = {
        itemsRetourned: data.Items.length,
        data: data.Items
      }
      this.defaultResponse(error, response, callback);
    });
  }

  public get(request, callback){
    if(request.pathParameters != null && request.pathParameters.id != null){
      this.findOneInDB(request.pathParameters.id, (error, data) => {
        if(!data) data = { "Item": [] };
        this.defaultResponse(error, data.Item, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public delete(request, callback){
    if(request.pathParameters != null && request.pathParameters.id != null){
      this.dbDriver.delete(request.pathParameters.id, (error, data) => {
        this.defaultResponse(error, data, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }
}
