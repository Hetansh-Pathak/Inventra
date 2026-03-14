import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import GlassCard from './GlassCard';

interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
  glowColor?: string;
}

export default function KPICard({ label, value, prefix = '', icon: Icon, iconColor, iconBg, trend, trendUp, glowColor }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (v: number) => {
    if (v >= 100000) return `${prefix}${(v / 100000).toFixed(2)}L`;
    if (v >= 1000) return `${prefix}${v.toLocaleString('en-IN')}`;
    return `${prefix}${v}`;
  };

  return (
    <GlassCard className="p-5 relative overflow-hidden" hover>
      {glowColor && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: glowColor }} />
      )}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="section-label mb-2">{label}</div>
          <div className="text-3xl font-bold text-foreground mb-1">{formatValue(displayValue)}</div>
          {trend && (
            <div className={`text-xs font-medium ${trendUp ? 'text-primary' : 'text-destructive'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </div>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </GlassCard>
  );
}
