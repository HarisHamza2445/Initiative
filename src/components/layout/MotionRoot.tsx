'use client';
import { MotionConfig } from 'framer-motion';
export const MotionRoot = ({ children }: { children: React.ReactNode }) => <MotionConfig reducedMotion="user">{children}</MotionConfig>;
