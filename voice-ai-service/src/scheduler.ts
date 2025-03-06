import { ReminderService } from './services';
import logger from './config/logger';

/**
 * Scheduler for running periodic tasks
 */
export class Scheduler {
  private reminderInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  
  /**
   * Start the scheduler
   */
  start(): void {
    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return;
    }
    
    // Process reminders every hour
    this.reminderInterval = setInterval(() => {
      this.processReminders().catch(error => {
        logger.error('Error processing reminders', { error });
      });
    }, 60 * 60 * 1000); // 1 hour
    
    // Run immediately on startup
    this.processReminders().catch(error => {
      logger.error('Error processing reminders on startup', { error });
    });
    
    this.isRunning = true;
    logger.info('Scheduler started');
  }
  
  /**
   * Stop the scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      logger.warn('Scheduler is not running');
      return;
    }
    
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }
    
    this.isRunning = false;
    logger.info('Scheduler stopped');
  }
  
  /**
   * Process appointment reminders
   */
  private async processReminders(): Promise<void> {
    logger.info('Running scheduled reminder check');
    
    try {
      await ReminderService.processReminders();
      logger.info('Reminder check completed');
    } catch (error) {
      logger.error('Error in reminder check', { error });
    }
  }
}

export default new Scheduler(); 