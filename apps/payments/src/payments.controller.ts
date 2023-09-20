import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @MessagePattern('create_charge')
  async createCharge(@Payload() paymentsCreateChargeDto: PaymentsCreateChargeDto){
    return this.paymentsService.createCharge(paymentsCreateChargeDto);
  }
}
