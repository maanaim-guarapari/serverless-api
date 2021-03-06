
import { AbstractController, DynamoDriver } from 'serverless-utils';

import S3 = require('aws-sdk/clients/s3');

export class File extends AbstractController {

  constructor(){
    super(process.env.DYNAMODB_TABLE,
          new DynamoDriver(process.env.DYNAMODB_TABLE));
  }

  private getS3UploadURL(fileName, fileMIME){
    var s3 = new S3();

    var s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key:  fileName,
      ContentType: fileMIME,
      ACL: 'public-read',
      Expires: 3600
    };

    return s3.getSignedUrl('putObject', s3Params);
  }

  public requestURL(request, callback){

    var params = JSON.parse(request.body);

    if(params && params.name){

      var index = {
        name: params.name,
        originalName: params.originalName,
        type: params.type,
        description: params.description,
        aditional: params.aditional,
        uploadStatus: 'TODO',
        metadata: params.metadata
      }

      this.dbDriver.create(index, (error, data) => {
        if(!error) {
          index['url'] = this.getS3UploadURL(index.name, index.type);
          this.defaultResponse(error, index, callback);
        }
        else{
          this.defaultResponse(error, index, callback);
        }
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public finishUpload(request, callback){

    var id = this.getRequestParam(request, 'id');

    if(id){
      this.findOneInDB(id, (error, data) => {
        if(data.Item && data.Item.uploadStatus == 'TODO'){
          var item = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                'id': id
            },
            ExpressionAttributeValues: {
                ':uploadStatus': 'DONE',
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
        else{
          this.sendResponse(400,
            { 'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            { message: 'Item not exists or download status isn\'t \"TODO\"' },
            callback);
        }
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public rollbackUpload(request, callback){

    var id = this.getRequestParam(request, 'id');

    if(id){
      this.findOneInDB(id, (error, data) => {
        if(data.Item && data.Item.uploadStatus == 'TODO'){
          this.dbDriver.delete(id, (error, data) => {
            this.defaultResponse(error, data, callback);
          });
        }
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public get(request, callback){

    var id = this.getRequestParam(request, 'id');

    if(id){
      this.findOneInDB(id, (error, data) => {
        if(data.Item){
          this.defaultResponse(error, data.Item, callback);
        }
        else{
          this.defaultResponse(error, {
            "message": "Item not found."
          }, callback);
        }
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public getMultiple(request, callback){
    var encountered = 0;
    var ids = JSON.parse(request.body);

    var response = {
      itemsRetourned: 0,
      itemsEncountered: 0,
      data: []
    };

    if(ids && ids.length > 0){
      for(let id in ids) {
        this.findOneInDB(ids[id], (error, data) => {
          if(data && data.Item){
            encountered++;
            response.data.push(data.Item);
          }
          else{
            response.data.push({
              "id": id,
              "message": "Item not found."
            });
          }
          /* response scoped into findOneInDB it's different of getMultiple
           * scope
           */
          if(response.data.length === ids.length) {
            response.itemsEncountered = encountered;
            response.itemsRetourned = response.data.length;
            this.defaultResponse(null, response, callback);
          }
        });
      }
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
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
}
