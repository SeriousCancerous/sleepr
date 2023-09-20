import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'),
  {
    apiVersion:"2023-08-16"
  });

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) 
    private readonly notificationService: ClientProxy
  ){}


  async createCharge({ card, amount, email}: PaymentsCreateChargeDto){
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount*100,
      // confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',
    });

    console.log(`notifying email with value: `, email)
    this.notificationService.emit('notify_email', { email, text: `Successfully paid the amount of $${amount}.` });

    return paymentIntent;
  }
}
