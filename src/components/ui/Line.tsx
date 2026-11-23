export const Line = ({ children, cls = '' }: { children: React.ReactNode; cls?: string }) => (
  <span className={'line ' + cls}><span className="ln">{children}</span></span>
);
