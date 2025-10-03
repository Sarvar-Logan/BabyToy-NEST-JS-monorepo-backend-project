import { Controller, Get, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_USERS, BATCH_TOP_PRODUCTS } from './lib/config';
import { BabytoyBatchService } from './babytoy-batch.service';

@Controller()
export class BabytoyBatchController {
  private logger: Logger = new Logger('BatchController');
  constructor(private readonly babytoyBatchService: BabytoyBatchService) { }

  @Timeout(1000)
  handleTimeout() {
    this.logger.debug('BATCH SERVER READY');
  }

  @Cron("00 00 01 * * *", { name: BATCH_ROLLBACK })
  public async batchRollback() {
    try {
      this.logger['context'] = BATCH_ROLLBACK
      this.logger.debug("EXECUTED! ");
      await this.babytoyBatchService.batchRollback();

    } catch (err) {
      this.logger.error(err);
    }

  }


  @Cron("20 00 01 * * *", { name: BATCH_TOP_PRODUCTS })
  public async batchTopProperties() {
    try {
      this.logger['context'] = BATCH_TOP_PRODUCTS;
      this.logger.debug("EXECUTED! ");
      await this.babytoyBatchService.batchTopProperties()
    } catch (err) {
      this.logger.error(err);
    }
  }


  @Cron("40 00 01 * * *", { name: BATCH_TOP_USERS })
  public async batchTopAgents() {
    try {
      this.logger['context'] = BATCH_TOP_USERS;
      this.logger.debug("EXECUTED! ");
      await this.babytoyBatchService.batchTopUsers()
    } catch (err) {
      this.logger.error(err);
    }
  }


  /*
   @Interval(1000)
    handleInterval(){
     this.logger.debug('Interval Test')
    }
   */

  @Get()
  getHello(): string {
    return this.babytoyBatchService.getHello();
  }
}
