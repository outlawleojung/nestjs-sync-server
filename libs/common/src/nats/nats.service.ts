import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, StringCodec, Subscription } from 'nats';
import { EventEmitter } from 'events';
import { NATS_EVENTS } from '@lib/common/constants/constants';
import { ENV_NATS_URL } from '@lib/common/constants/env-keys.const';

@Injectable()
export class NatsService extends EventEmitter implements OnModuleInit {
  private natsConnection: NatsConnection;
  private subscriptions: Map<string, Subscription> = new Map();
  private sc = StringCodec();
  private readonly logger = new Logger(NatsService.name);

  async onModuleInit() {
    try {
      this.natsConnection = await connect({
        servers: ['nats://localhost:4222'],
      });
    } catch (error) {
      console.error('Failed to connect to NATS server:', error);
    }
    this.emit(NATS_EVENTS.NATS_CONNECTED);
  }

  public async publish(subject: string, message: string) {
    this.natsConnection.publish(subject, this.sc.encode(message));
  }

  // 주제를 구독하고 메시지 처리 로직을 정의하는 메서드
  public subscribe(
    subject: string,
    callback: (message: string, subject: string) => void,
  ): void {
    this.logger.debug(`[ subscribe subject] : ${subject}`);
    const subscription = this.natsConnection.subscribe(subject);
    this.subscriptions.set(subject, subscription);

    (async () => {
      for await (const msg of subscription) {
        const decodedMessage = this.sc.decode(msg.data);
        callback(decodedMessage, msg.subject);
      }
    })().then();
  }

  public unsubscribe(subject: string): void {
    const subscription = this.subscriptions.get(subject);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subject);
      this.logger.debug(`[ unsubscribe subject] : ${subject}`);
    } else {
      console.error(`No subscription found for subject: ${subject}`);
    }
  }
}
