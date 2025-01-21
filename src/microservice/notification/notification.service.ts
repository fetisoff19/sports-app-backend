import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { EmailNotify } from '@/common/types'


@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailerService) {}

  sendByEmail({ text, to, subject }: EmailNotify){
    try {
      this.mailService.sendMail({
        to,
        subject,
        text,
      })
      return
    }
    catch (e: unknown) {
      console.log(e)
    }

  }

}
