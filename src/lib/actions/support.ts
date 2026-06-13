"use server";

import { sendDeveloperTicket, sendTicketConfirmation } from "@/lib/email";
import { getCurrentUser } from "@/lib/actions/auth";

export async function contactDeveloper(formData: {
  requestType: string;
  subject: string;
  message: string;
}) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Generate a random Ticket ID (e.g., #TK-12345)
    const ticketId = `#TK-${Math.floor(10000 + Math.random() * 90000)}`;

    // Send email to developer
    const developerResult = await sendDeveloperTicket({
      fromName: session.name || "Admin/Teacher",
      fromEmail: session.email,
      requestType: formData.requestType,
      subject: formData.subject,
      message: formData.message,
      ticketId: ticketId,
    });

    if (developerResult.success) {
      // Send professional confirmation to the teacher
      await sendTicketConfirmation({
        toName: session.name || "Teacher",
        toEmail: session.email,
        ticketId: ticketId,
        subject: formData.subject,
        requestType: formData.requestType,
        message: formData.message,
      });
    }

    return developerResult;
  } catch (error) {
    console.error("Contact developer action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
