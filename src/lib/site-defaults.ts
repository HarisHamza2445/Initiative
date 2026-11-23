/* =====================================================================
   SITE DEFAULTS — the built-in content. Everything here is editable
   from the admin portal (/admin); saved edits are stored in Supabase
   (table `site_content`) and merged over these defaults.
   ===================================================================== */

export type GalleryItem = { src: string; category: string; caption: string; description: string; tall?: boolean };
export type BreakdownRow = { item: string; amount: string };
export type Update = {
  id: string;
  title: string;
  date: string;
  category: string;
  location: string;
  summary: string;
  amount: string;
  breakdown: BreakdownRow[];
  photos: string[];
};

export type Site = {
  name: string;
  logo: string;
  announcement: string;
  intro: string;
  vision: string;
  mission: string;
  role: string;
  founder: {
    name: string;
    title: string;
    photo: string;
    intro: string;
    points: string[];
    quote: string;
    promise: string;
    signoff: string;
  };
  story: { heading: string; named: string; extra: string; values: [string, string][]; closing: string };
  updates: Update[];
  impact: { value: number; suffix: string; label: string };
  gallery: GalleryItem[];
  donation: {
    intro: string;
    amounts: number[];
    currency: string;
    purposes: string[];
    qrImage: string;
    upiId: string;
    payee: string;
    confirmVia: string;
    instructions: string[];
  };
  volunteer: { interests: string[]; availability: string[]; terms: string[]; consent: string };
  contact: { email: string; phone: string; location: string; instagram: { handle: string; url: string } };
};

export const DEFAULT_LOGO = '/img/logo.jpg';

export const SITE: Site = {
  name: 'The Shubmaan Initiative',
  logo: DEFAULT_LOGO, // the official logo, used everywhere (change it in the admin portal)
  announcement: 'Now recruiting — on-ground volunteers in Pune and remote volunteers from anywhere.', // '' to hide

  intro: 'The Shubmaan Initiative is a youth-led initiative founded by Saina Harjwani to empower underprivileged children through education, mentorship, emotional wellness and kindness. Some children are not lacking in potential — they are lacking in opportunities, support and someone who believes in them. We want to be that someone.',
  vision: 'A world where every child, regardless of their background, gets the chance to learn, grow, dream and thrive.',
  mission: 'To reach underprivileged children with consistent learning support, nourishment, emotional care and mentorship — and give each one a clear, practical pathway towards their dreams.',
  role: 'We are the bridge between children who need support and the people who want to give it — bringing students, professionals and creatives together as volunteers and donors, and turning their time and generosity into real, on-ground change.',

  founder: {
    name: 'Saina Harjwani',
    title: 'Founder, The Shubmaan Initiative',
    photo: '', // upload from the admin portal
    intro: 'I met children who were intelligent, curious and full of potential, but life had limited their opportunities — not because they lacked ability, but because they lacked access, guidance and encouragement.',
    points: [
      'I saw dreams being silenced too early, simply because no one told them they could. Every child deserves to dream, believe and be given a chance.',
      'I wanted to be that someone who shows up, listens, teaches, supports and believes in them — even when the world doesn’t.',
      'This initiative is my small way of creating a world where every child feels seen, valued and empowered to build the future they deserve.'
    ],
    quote: 'If we can help even one child believe their future matters, then this journey is worth everything.',
    promise: 'I may not have all the answers, but I promise to always show up, for as many children as I can.',
    signoff: 'With hope. With purpose. With love.'
  },

  story: {
    heading: 'Why it’s called The Shubmaan Initiative',
    named: 'The initiative is named after Shubman Gill — a role model who inspires our founder every day, not just for his talent, but for the person he is.',
    extra: 'The extra “aa” in Shubmaan is not just an extra letter. It stands for शुभ + मन (Shubh + Mann), which means a clean heart — because a clean heart is where real change begins.',
    values: [
      ['Kindness', 'Leading with humility and treating everyone with respect.'],
      ['Discipline', 'Hard work and consistency — because growth takes dedication.'],
      ['Focus & determination', 'Staying calm under pressure and never giving up on belief.'],
      ['Inspiring others', 'Using every platform we have to uplift and be a positive influence.']
    ],
    closing: 'Everything we do comes from a place of sincerity, empathy and purpose. Inspired by him. Driven by purpose. For every child. For every dream. For every future.'
  },

  // Work & donation updates — shown on the Updates page. Add amounts only when verified.
  updates: [
    { id: 'u1', title: 'Books & supplies drive', date: '', category: 'Education', location: 'Pune', summary: 'We sat with children on the ground, shared activity books and stationery kits, and spent the afternoon learning and laughing together.', amount: '', breakdown: [], photos: ['/img/session.jpg', '/img/books.jpg', '/img/stationery.jpg', '/img/supplies.jpg'] },
    { id: 'u2', title: 'Meal drive', date: '', category: 'Food', location: 'Pune', summary: 'Warm meal boxes were packed and handed out to children and families, making sure no child went hungry that day.', amount: '', breakdown: [], photos: ['/img/meal.jpg', '/img/meal-2.jpg'] },
    { id: 'u3', title: 'Raksha Bandhan celebration', date: '', category: 'Festivals', location: 'Pune', summary: 'Rakhis, sweets and festival hampers were prepared so the children could celebrate Raksha Bandhan with us.', amount: '', breakdown: [], photos: ['/img/rakhi.jpg', '/img/rakhi-hampers.jpg', '/img/festival-kits.jpg'] }
  ],

  impact: { value: 200, suffix: '+', label: 'Lives impacted' }, // verified numbers only

  gallery: [ // src: a file in /public/img/ (or any image URL). Empty src = placeholder.
    { src: '/img/session.jpg', category: 'Education', caption: 'Learning together', description: 'Sitting with children on the ground — sharing books, stories and time.', tall: true },
    { src: '/img/meal.jpg', category: 'Food drives', caption: 'A warm meal', description: 'Meal boxes handed out during one of our food drives.', tall: true },
    { src: '/img/supplies.jpg', category: 'Community', caption: 'Unpacking supplies', description: 'A volunteer opening a bag of essentials with a young girl.', tall: true },
    { src: '/img/books.jpg', category: 'Education', caption: 'Books in little hands', description: 'Children excitedly opening the activity books and supplies we brought.' },
    { src: '/img/stationery.jpg', category: 'Education', caption: 'Learning kits', description: 'Stationery sets — pencils, geometry boxes and notebooks — for every child.' },
    { src: '/img/gifts.jpg', category: 'Community', caption: 'Little surprises', description: 'Children opening gifts and supplies with our volunteers.', tall: true },
    { src: '/img/meal-2.jpg', category: 'Food drives', caption: 'Smiles at mealtime', description: 'Every drive starts with making sure no child goes hungry.', tall: true },
    { src: '/img/rakhi.jpg', category: 'Festivals', caption: 'Raksha Bandhan', description: 'Rakhis and sweets prepared to celebrate the festival with the children.', tall: true },
    { src: '/img/rakhi-hampers.jpg', category: 'Festivals', caption: 'Festival hampers', description: 'Hampers packed with chocolates and rakhis for the celebration.', tall: true },
    { src: '/img/festival-kits.jpg', category: 'Festivals', caption: 'Made with love', description: 'Festival kits ready to be shared — every child has a dream.', tall: true }
  ],

  donation: {
    intro: 'Every contribution — big or small — goes towards what changes a child’s day and future: a meal, a notebook, a learning session, a mentor’s time.',
    amounts: [500, 1000, 2500, 5000, 10000],
    currency: '₹',
    purposes: ['Education', 'Community Support', 'Healthcare', 'General Initiative Support', 'Other'],
    qrImage: '', // donation QR image URL (upload in the admin portal)
    upiId: '',   // e.g. 'name@bank'
    payee: 'The Shubmaan Initiative',
    confirmVia: 'Instagram @shubmaan_initiative',
    instructions: [
      'Open any UPI app — Google Pay, PhonePe, Paytm or your bank app.',
      'Tap “Scan QR” and scan the code shown here.',
      'Enter the amount you chose and add your purpose in the note.',
      'Complete the payment and keep the transaction reference (UTR).',
      'Send us the reference so our team can confirm your donation.'
    ]
  },

  volunteer: {
    interests: ['Programs & Education', 'Food drives', 'Social media', 'Outreach & partnerships', 'Design & content', 'Website / tech', 'Research', 'Fundraising', 'Operations & logistics (Pune)'],
    availability: ['Weekday mornings', 'Weekday evenings', 'Weekends', 'Remote, flexible hours', '2 missions a week'],
    terms: [
      'Volunteering with the initiative is an unpaid role.',
      'I will treat every child, family and fellow volunteer with respect, kindness and dignity.',
      'I will follow child-safety guidelines and never be alone with a child, share their photos, or contact them privately without the initiative’s approval.',
      'I will keep personal information about children and families confidential.',
      'I will complete the tasks I am assigned to the best of my ability, and tell the team if I cannot.',
      'The initiative may end my volunteer role if these terms are not followed.'
    ],
    consent: 'I confirm the information I have provided is accurate. I agree to the volunteer terms above, and I consent to The Shubmaan Initiative storing and using my details to contact me about volunteering.'
  },

  contact: {
    email: 'sainaharjwani@gmail.com',
    phone: '+91 89757 66680',
    location: 'Pune, India',
    instagram: { handle: '@shubmaan_initiative', url: 'https://www.instagram.com/shubmaan_initiative/' }
  }
};
