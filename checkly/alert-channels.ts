import { URL } from 'node:url'
import {
  EmailAlertChannel,
} from 'checkly/constructs'

const sendDefaults = {
  sendFailure: true,
  sendRecovery: true,
  sendDegraded: false,
  sslExpiry: true,
  sslExpiryThreshold: 30
}


export const emailChannel = new EmailAlertChannel('email-channel-1', {
  address: 'linus.aarnio+checkly-alerts@gmail.com',
  ...sendDefaults
})
