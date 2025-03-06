import { Router } from 'express';
import { 
  LeadController, 
  CallController, 
  AppointmentController,
  TwilioController,
  SmsController
} from './controllers';

const router = Router();

// Lead routes
router.post('/leads', LeadController.create);
router.get('/leads/:id', LeadController.getById);
router.get('/leads', LeadController.list);

// Call routes
router.post('/calls/initiate', CallController.initiateCall);
router.get('/calls/:id', CallController.getCallStatus);
router.get('/calls', CallController.listCalls);
router.get('/calls/lead/:leadId', CallController.getCallsByLead);

// Appointment routes
router.post('/appointments', AppointmentController.create);
router.get('/appointments/:id', AppointmentController.getById);
router.put('/appointments/:id', AppointmentController.update);
router.get('/appointments', AppointmentController.list);
router.get('/appointments/upcoming', AppointmentController.getUpcoming);

// Twilio webhook routes
router.post('/calls/twiml/:callId', TwilioController.generateTwiML);
router.post('/calls/respond/:callId', TwilioController.handleResponse);
router.post('/calls/no-input/:callId', TwilioController.handleNoInput);
router.post('/calls/status/:callId', TwilioController.handleStatusCallback);

// Enhanced conversation capability routes
router.post('/calls/partial/:callId', TwilioController.handlePartialResult);
router.post('/calls/barge-in/:callId', TwilioController.handleBargeIn);

// SMS routes
router.post('/sms/webhook', SmsController.handleIncomingSms);
router.post('/sms/send', SmsController.sendSms);
router.post('/sms/test-reminder', SmsController.sendTestReminder);

export default router; 