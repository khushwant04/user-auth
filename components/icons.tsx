import type { LightbulbIcon as LucideProps } from "lucide-react"
import {
  Loader2,
  GitlabIcon as GitHub,
  Mail,
  UserIcon,
  LogOut,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  X,
  Building,
  CreditCard,
  FileText,
  BarChart,
  Plus,
  Trash,
  Edit,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react"

export const Icons = {
  logo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  spinner: Loader2,
  gitHub: GitHub,
  google: ({ ...props }: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
      <path
        fill="currentColor"
        d="M12 22q-2.05 0-3.875-.788t-3.188-2.15-2.137-3.175T2 12q0-2.075.788-3.887t2.15-3.175 3.175-2.138T12 2q2.075 0 3.887.788t3.175 2.15 2.138 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188-3.175 2.137T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m-1-3h2v-2h-2zm0-4h2V7h-2z"
      />
    </svg>
  ),
  mail: Mail,
  user: UserIcon,
  logOut: LogOut,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsUpDown: ChevronsUpDown,
  close: X,
  building: Building,
  creditCard: CreditCard,
  fileText: FileText,
  barChart: BarChart,
  plus: Plus,
  trash: Trash,
  edit: Edit,
  users: Users,
  calendar: Calendar,
  dollarSign: DollarSign,
}

