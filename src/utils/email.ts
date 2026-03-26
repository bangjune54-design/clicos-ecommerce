/**
 * Simulated email utility for sending notifications to the admin.
 * In a real application, this would use a backend API or a service like EmailJS.
 */
export const sendAdminNotification = (subject: string, details: any) => {
  const emailText = `
=========================================
📧 EMAIL SENT

To: info@clicos.co.kr
Subject: ${subject}

Details:
${JSON.stringify(details, null, 2)}
=========================================
`;
  
  // Log full contents to console
  console.log("%c" + emailText, "color: #0ea5e9; font-weight: bold; font-family: monospace;");

  // Create a beautiful UI toast for the prototype demonstration
  const toast = document.createElement("div");
  toast.className = "fixed bottom-6 right-6 bg-gray-900 text-white p-5 rounded-2xl shadow-2xl z-[9999] flex flex-col gap-3 max-w-sm border border-gray-700 transition-all duration-300 transform translate-y-0 opacity-100";
  toast.innerHTML = `
    <div class="flex items-center justify-between gap-4 border-b border-gray-700 pb-3">
      <div class="flex items-center gap-2 font-bold font-serif text-primary-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        Admin Notification
      </div>
      <span class="text-[10px] text-gray-400 font-mono tracking-wider">info@clicos.co.kr</span>
    </div>
    <div class="text-sm font-semibold leading-snug">${subject}</div>
    <div class="text-xs text-gray-400 mt-1">Details logged to console.</div>
  `;

  document.body.appendChild(toast);

  // Remove toast after 5 seconds with a fade out effect
  setTimeout(() => {
    toast.classList.replace("translate-y-0", "translate-y-4");
    toast.classList.replace("opacity-100", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 5000);
};
