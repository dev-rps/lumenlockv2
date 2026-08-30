import * as React from "react";

declare module "lucide-react" {
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const ShieldCheck: LucideIcon;
  export const Compass: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Lock: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Clock: LucideIcon;
  export const Scale: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Layers: LucideIcon;
  export const Coins: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Zap: LucideIcon;
  export const Search: LucideIcon;
  export const Grid: LucideIcon;
  export const List: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Info: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Check: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
  export const Copy: LucideIcon;
  export const LogOut: LucideIcon;
  export const Droplets: LucideIcon;
  export const Loader2: LucideIcon;
  export const Trash2: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Server: LucideIcon;
  export const Key: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Activity: LucideIcon;
  export const Settings: LucideIcon;
  export const Wallet: LucideIcon;
  export const Star: LucideIcon;
  export const Users: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Plus: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Github: LucideIcon;
  export const BookOpen: LucideIcon;
}

