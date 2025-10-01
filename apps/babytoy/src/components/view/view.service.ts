import { Injectable } from '@nestjs/common';
import { ViewModule } from './view.module';
import { Model, ObjectId, Schema } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ref } from 'process';
import { ViewInput } from '../../libs/dto/view/view.input';
import { resourceLimits } from 'worker_threads';
import { InjectModel } from '@nestjs/mongoose';
import { T } from '../../libs/types/common';

@Injectable()
export class ViewService {
  constructor(@InjectModel('View') private readonly viewModel: Model<View>){}

  public async recordView(input: ViewInput): Promise<View | null> {
  const viewExist = await this.checkViewExistence(input)
  if(!viewExist) {
    return await this.viewModel.create(input);
  } else return null;
  }
  
  private async checkViewExistence(input: ViewInput): Promise<View | null> {
    const {memberId, viewRefId} = input;
    const search: T = {memberId: memberId, viewRefId: viewRefId}
    const result =  await this.viewModel.findOne(search).exec();
    if(result) {
      return result
    } else return null
  }
}
