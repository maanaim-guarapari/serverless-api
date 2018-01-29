import { AbstractController } from './interfaces/AbstractController';
import { DynamoDriver } from './interfaces/DynamoDriver';

export class Events extends AbstractController {

  constructor(){
    super(process.env.DYNAMODB_TABLE,
          new DynamoDriver(process.env.DYNAMODB_TABLE));
  }

  public create(request, callback){

    var obj = JSON.parse(request.body);

    if(obj != null && obj.title && obj.location && obj.group && obj.time){

      var event = {
        group: obj.group,
        location: obj.location,
        title: obj.title,
        time:  obj.time,
        description: obj.description,
        versicle: obj.versicle,
        aditional: {
          subscriptionLink: obj.aditional.subscriptionLink,
          filesLink: obj.aditional.filesLink
        }
      }

      this.dbDriver.create(event, (error, data) => {
        this.defaultResponse(error, event, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public fetchAll(request, callback){
    this.dbDriver.all(null, (error, data) => {
      // if(!data) data = { "Items": [] };
      var response = {
        itemsRetourned: data.Items.length,
        data: data.Items
      }
      this.defaultResponse(error, response, callback);
    });
  }

  public find(request, callback){
    if(request.pathParameters != null && request.pathParameters.id != null){
      this.dbDriver.find(request.pathParameters.id, null, (error, data) => {
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
