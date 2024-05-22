import { Injectable, OnModuleInit, INestApplication, OnApplicationShutdown, Scope } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    // Note: this is optional
    await this.$connect()
  }

  


  async onApplicationShutdown() {
    await this.$disconnect()
  }
}