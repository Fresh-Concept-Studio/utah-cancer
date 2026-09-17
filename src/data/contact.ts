// Shared by the contact page and provider appointment buttons.
export const mainPhone = {
  display: '801.262.9494',
  href: 'tel:8012629494',
};

// Clinic-owned shared mailbox. FormSubmit will send its activation message to
// this address after the first submission. This address is public in the form.
export const contactForm = {
  endpointId: 'referrals@utahcancerspecialists.com',
  copyRecipients: [] as string[],
  serviceUrl: 'https://formsubmit.co',
};
