import type { Metadata } from 'next';
import { VolunteerForm } from '@/components/volunteer/VolunteerForm';
import { PageClient } from '@/components/layout/PageClient';

export const metadata: Metadata = { title: 'Volunteer' };

export default function VolunteerPage() {
  return <><VolunteerForm /><PageClient /></>;
}
