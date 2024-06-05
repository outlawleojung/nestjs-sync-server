import { NestFactory } from '@nestjs/core';
import { ENV_SOCKET_SERVER_PORT } from '@lib/common';
import { UnificationModule } from './unification/unification.module';
import { AppClusterService } from './cluster/app-cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(UnificationModule);

  await app.startAllMicroservices();
  const port: number = parseInt(process.env[ENV_SOCKET_SERVER_PORT], 10);
  await app.listen(port | 3790);
}
// bootstrap();
AppClusterService.clusterize(bootstrap);
