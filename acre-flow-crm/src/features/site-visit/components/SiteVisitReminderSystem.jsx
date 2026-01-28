import React, { useState, useEffect } from 'react';
import { Bell, Clock, Calendar, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { REMINDER_TIMELINE, SITE_VISIT_STATUS } from '@/models/siteVisitModel';

const SiteVisitReminderSystem = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    // Check for reminders every 5 minutes
    checkReminders();
    const interval = setInterval(checkReminders, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const checkReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.SITE_VISITS_REMINDERS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check_pending',
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setReminders(data.data);
          processReminders(data.data);
        }
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  const processReminders = (reminderList) => {
    reminderList.forEach(reminder => {
      switch (reminder.type) {
        case REMINDER_TIMELINE.T_24_HOURS:
          send24HourReminder(reminder);
          break;
        case REMINDER_TIMELINE.T_2_HOURS:
          send2HourReminder(reminder);
          break;
        case REMINDER_TIMELINE.T_1_HOUR_AFTER:
          sendFeedbackReminder(reminder);
          break;
        case REMINDER_TIMELINE.FEEDBACK_REMINDER:
          sendFeedbackFollowUp(reminder);
          break;
        default:
          console.log('Unknown reminder type:', reminder.type);
      }
    });
  };

  const send24HourReminder = async (reminder) => {
    // Send WhatsApp/SMS 24 hours before visit
    const message = `📅 Site Visit Reminder\n\nDear ${reminder.leadName},\n\nYour site visit is scheduled for tomorrow:\n📅 Date: ${new Date(reminder.scheduledDate).toLocaleDateString('en-IN')}\n⏰ Time: ${reminder.scheduledTime}\n📍 Location: ${reminder.projectName}\n👤 Agent: ${reminder.agentName}\n\nPlease confirm your attendance. Reply CONFIRM to confirm or CANCEL to reschedule.\n\nThank you\n${reminder.companyName || '100Acress Team'}`;

    await sendWhatsAppMessage(reminder.leadPhone, message);
    await markReminderSent(reminder._id, REMINDER_TIMELINE.T_24_HOURS);
  };

  const send2HourReminder = async (reminder) => {
    // Send WhatsApp/Push notification 2 hours before visit
    const message = `⏰ Site Visit in 2 Hours!\n\nHi ${reminder.leadName},\n\nYour site visit is scheduled for:\n📅 Today: ${new Date(reminder.scheduledDate).toLocaleDateString('en-IN')}\n⏰ Time: ${reminder.scheduledTime}\n📍 Location: ${reminder.projectName}\n👤 Agent: ${reminder.agentName} (${reminder.agentPhone})\n\nAgent will be waiting for you. Please be on time.\n\nNeed directions? Click: ${reminder.googleMapsLink || '#'}\n\nSee you soon! 🏢`;

    await sendWhatsAppMessage(reminder.leadPhone, message);
    await sendNotificationToAgent(reminder);
    await markReminderSent(reminder._id, REMINDER_TIMELINE.T_2_HOURS);
  };

  const sendFeedbackReminder = async (reminder) => {
    // Send feedback reminder 1 hour after visit should have ended
    const message = `📝 Feedback Required\n\nHi ${reminder.agentName},\n\nSite visit feedback pending for:\n👤 Client: ${reminder.leadName}\n📅 Date: ${new Date(reminder.scheduledDate).toLocaleDateString('en-IN')}\n⏰ Time: ${reminder.scheduledTime}\n📍 Project: ${reminder.projectName}\n\nPlease submit feedback within 2 hours to maintain quality standards.\n\nClick here to submit: ${reminder.feedbackLink || '#'}\n\nThank you!`;

    await sendWhatsAppMessage(reminder.agentPhone, message);
    await markReminderSent(reminder._id, REMINDER_TIMELINE.T_1_HOUR_AFTER);
  };

  const sendFeedbackFollowUp = async (reminder) => {
    // Follow up if feedback still not submitted
    const message = `⚠️ URGENT: Feedback Overdue\n\nHi ${reminder.agentName},\n\nSite visit feedback is still pending for:\n👤 Client: ${reminder.leadName}\n📅 Date: ${new Date(reminder.scheduledDate).toLocaleDateString('en-IN')}\n⏰ Time: ${reminder.scheduledTime}\n\nThis is the final reminder. Please submit feedback immediately to avoid compliance issues.\n\nSubmit now: ${reminder.feedbackLink || '#'}\n\nManager: ${reminder.managerName}`;

    await sendWhatsAppMessage(reminder.agentPhone, message);
    await sendWhatsAppMessage(reminder.managerPhone, message);
    await markReminderSent(reminder._id, REMINDER_TIMELINE.FEEDBACK_REMINDER);
  };

  const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(API_ENDPOINTS.WHATSAPP_SEND, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          message,
          type: 'reminder'
        }),
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  };

  const sendNotificationToAgent = async (reminder) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: reminder.agentId,
          title: 'Site Visit Starting Soon',
          message: `Site visit with ${reminder.leadName} starting in 2 hours at ${reminder.projectName}`,
          type: 'site_visit_reminder',
          data: {
            visitId: reminder.visitId,
            leadId: reminder.leadId
          }
        }),
      });
    } catch (error) {
      console.error('Error sending notification to agent:', error);
    }
  };

  const markReminderSent = async (reminderId, reminderType) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(API_ENDPOINTS.SITE_VISITS_REMINDERS, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reminderId,
          reminderType,
          sentAt: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error marking reminder sent:', error);
    }
  };

  const triggerManualReminders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.SITE_VISITS_REMINDERS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'trigger_all',
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Reminders Triggered',
          description: `${data.sent || 0} reminders sent successfully`,
        });
        checkReminders();
      }
    } catch (error) {
      console.error('Error triggering manual reminders:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger reminders',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Visit Reminders</h2>
        <div className="flex items-center gap-4">
          {lastCheck && (
            <span className="text-sm text-gray-500">
              Last checked: {lastCheck.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={triggerManualReminders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Bell className="w-4 h-4" />
            {loading ? 'Sending...' : 'Send All Reminders'}
          </button>
        </div>
      </div>

      {/* Reminder Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">24-Hour Reminders</h3>
              <p className="text-sm text-gray-600">Sent 24 hours before visit</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">2-Hour Reminders</h3>
              <p className="text-sm text-gray-600">Sent 2 hours before visit</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Feedback Reminders</h3>
              <p className="text-sm text-gray-600">Sent 1 hour after visit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reminders */}
      {reminders.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Recent Reminders</h3>
          </div>
          <div className="divide-y">
            {reminders.slice(0, 10).map((reminder) => (
              <div key={reminder._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    reminder.status === 'sent' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{reminder.leadName}</p>
                    <p className="text-sm text-gray-600">
                      {reminder.type} • {new Date(reminder.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${
                    reminder.status === 'sent' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {reminder.status === 'sent' ? 'Sent' : 'Pending'}
                  </span>
                  <p className="text-xs text-gray-500">
                    {new Date(reminder.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending reminders at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default SiteVisitReminderSystem;
