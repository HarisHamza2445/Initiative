export const money = (v: unknown) => {
  const n = Number(String(v ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 0;
};
export const telHref = (phone: string) => 'tel:' + phone.replace(/\s/g, '');
