export const business = {
  name: 'Super Tutors',
  phone: '+91 9993337582',
  whatsappNumber: '919993337582',
  whatsappUrl: 'https://wa.me/919993337582',
  rating: '[Confirm with client]',
  sinceYear: '[Confirm with client]',
  address: '[Address to be confirmed]',
  googleReviewsUrl: '[Google reviews URL to be added]',
  mapUrl: '[Map URL to be added]',
} as const;

export const siteConfig = {
  // Turn this on after deploying the Apps Script web app endpoint.
  assignmentsApiEnabled: false,
  assignmentsApiUrl: '',
  parentFormUrl: '',
  tutorFormUrl: '',
  tutorInterestFormUrl: '',
  tutorInterestAssignmentParam: 'assignmentId',
  socialLinks: {
    instagram: '',
    facebook: '',
  },
} as const;

export type PublicAssignment = {
  id: string;
  className: string;
  board: string;
  subject: string;
  area: string;
  mode: string;
  timing: string;
  days: string;
  duration: string;
  fee: string;
  status: 'Open';
  createdDate?: string;
};

export const demoAssignments: PublicAssignment[] = [
  {
    id: 'ST-DEMO-104',
    className: '7',
    board: 'ICSE',
    subject: 'All Subjects',
    area: 'Arera Colony',
    mode: 'Home',
    timing: 'After 4 PM',
    days: '6 Days / Week',
    duration: '1.5 Hours',
    fee: '₹4,000/month',
    status: 'Open',
    createdDate: '2026-01-03',
  },
  {
    id: 'ST-DEMO-103',
    className: '3',
    board: 'CBSE',
    subject: 'All Subjects',
    area: 'Arera Colony',
    mode: 'Home',
    timing: 'After 4 PM',
    days: '6 Days / Week',
    duration: '1.5 Hours',
    fee: '₹3,000/month',
    status: 'Open',
    createdDate: '2026-01-02',
  },
  {
    id: 'ST-DEMO-102',
    className: '9',
    board: 'CBSE',
    subject: 'All Subjects',
    area: 'Old City',
    mode: 'Home',
    timing: 'After 5 PM',
    days: '5 Days / Week',
    duration: '1.5 Hours',
    fee: '₹4,000/month',
    status: 'Open',
    createdDate: '2026-01-01',
  },
  {
    id: 'ST-DEMO-101',
    className: '12',
    board: 'CBSE',
    subject: 'Physics + Maths',
    area: 'Kolar Road',
    mode: 'Home or online',
    timing: 'Evening',
    days: '4 Days / Week',
    duration: '1.5 Hours',
    fee: '[Confirm with client]',
    status: 'Open',
    createdDate: '2025-12-28',
  },
];

export function getTelHref() {
  return `tel:${business.phone.replace(/\s/g, '')}`;
}

export function getWhatsAppUrl(message?: string) {
  if (!message) return business.whatsappUrl;
  return `${business.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function getTutorInterestUrl(assignmentId: string) {
  if (!siteConfig.tutorInterestFormUrl) {
    return getWhatsAppUrl(
      `Hello ${business.name}, I am interested in Assignment ${assignmentId}.`,
    );
  }

  try {
    const url = new URL(siteConfig.tutorInterestFormUrl);
    url.searchParams.set(siteConfig.tutorInterestAssignmentParam, assignmentId);
    return url.toString();
  } catch {
    return getWhatsAppUrl(
      `Hello ${business.name}, I am interested in Assignment ${assignmentId}.`,
    );
  }
}