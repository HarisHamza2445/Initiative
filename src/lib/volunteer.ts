/** Shared by the volunteer form (client) and /api/volunteer (server) so both validate identically. */
export type VolunteerFields = { name: string; email: string; phone: string; city: string; interests: string[]; skills: string; availability: string[]; why: string; extra: string };
export type VolunteerErrors = Partial<Record<keyof VolunteerFields, string>>;

export const EMPTY_VOLUNTEER: VolunteerFields = { name: '', email: '', phone: '', city: '', interests: [], skills: '', availability: [], why: '', extra: '' };

export function validateVolunteer(f: VolunteerFields): VolunteerErrors {
  const e: VolunteerErrors = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (!/^[+]?[0-9\s-]{8,15}$/.test(f.phone.trim())) e.phone = 'Please enter a valid phone number.';
  if (!f.city.trim()) e.city = 'Please enter your city or location.';
  if (!f.interests.length) e.interests = 'Choose at least one area of interest.';
  if (f.skills.trim().length < 3) e.skills = 'Tell us a little about your skills or experience.';
  if (!f.availability.length) e.availability = 'Choose your availability.';
  if (f.why.trim().length < 10) e.why = 'Please share why you’d like to volunteer (a sentence or two).';
  return e;
}
