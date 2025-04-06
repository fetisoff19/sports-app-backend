import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { NotificationService } from './notification.service'
import { EmailNotify } from '@/common/types'
import { NotificationPatterns } from '@/common/constants'


@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern<keyof typeof NotificationPatterns>(NotificationPatterns.sendByEmail)
  sendByEmail(message: EmailNotify){
    this.notificationService.sendByEmail(message)
  }

}
