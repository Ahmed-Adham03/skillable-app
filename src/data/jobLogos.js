import {
  Briefcase, Building2, Factory, Headphones, Keyboard, Megaphone, Monitor,
  ClipboardCheck, PackageCheck, Store, GraduationCap, HeartHandshake,
  Wrench, PhoneCall, FileText, Palette, Calculator, Truck, ShieldCheck, Users
} from 'lucide-react';

export const JOB_LOGOS = [
  { key: 'briefcase-indigo', label: 'Office', Icon: Briefcase, bg: 'bg-indigo-50', text: 'text-indigo-700' },
  { key: 'building-blue', label: 'Company', Icon: Building2, bg: 'bg-blue-50', text: 'text-blue-700' },
  { key: 'factory-amber', label: 'Factory', Icon: Factory, bg: 'bg-amber-50', text: 'text-amber-700' },
  { key: 'support-teal', label: 'Support', Icon: Headphones, bg: 'bg-teal-50', text: 'text-teal-700' },
  { key: 'data-violet', label: 'Data', Icon: Keyboard, bg: 'bg-violet-50', text: 'text-violet-700' },
  { key: 'marketing-rose', label: 'Marketing', Icon: Megaphone, bg: 'bg-rose-50', text: 'text-rose-700' },
  { key: 'it-cyan', label: 'IT', Icon: Monitor, bg: 'bg-cyan-50', text: 'text-cyan-700' },
  { key: 'quality-emerald', label: 'Quality', Icon: ClipboardCheck, bg: 'bg-emerald-50', text: 'text-emerald-700' },
  { key: 'packaging-orange', label: 'Packaging', Icon: PackageCheck, bg: 'bg-orange-50', text: 'text-orange-700' },
  { key: 'retail-pink', label: 'Retail', Icon: Store, bg: 'bg-pink-50', text: 'text-pink-700' },
  { key: 'training-sky', label: 'Training', Icon: GraduationCap, bg: 'bg-sky-50', text: 'text-sky-700' },
  { key: 'ngo-green', label: 'NGO', Icon: HeartHandshake, bg: 'bg-green-50', text: 'text-green-700' },
  { key: 'technical-slate', label: 'Technical', Icon: Wrench, bg: 'bg-slate-100', text: 'text-slate-700' },
  { key: 'call-lime', label: 'Call center', Icon: PhoneCall, bg: 'bg-lime-50', text: 'text-lime-700' },
  { key: 'admin-fuchsia', label: 'Admin', Icon: FileText, bg: 'bg-fuchsia-50', text: 'text-fuchsia-700' },
  { key: 'design-purple', label: 'Design', Icon: Palette, bg: 'bg-purple-50', text: 'text-purple-700' },
  { key: 'accounting-yellow', label: 'Accounting', Icon: Calculator, bg: 'bg-yellow-50', text: 'text-yellow-700' },
  { key: 'logistics-red', label: 'Logistics', Icon: Truck, bg: 'bg-red-50', text: 'text-red-700' },
  { key: 'security-zinc', label: 'Compliance', Icon: ShieldCheck, bg: 'bg-zinc-100', text: 'text-zinc-700' },
  { key: 'community-emerald', label: 'Community', Icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-700' },
];

export function getJobLogo(key) {
  return JOB_LOGOS.find((logo) => logo.key === key) || JOB_LOGOS[0];
}
