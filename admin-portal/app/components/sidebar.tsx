import { LayoutDashboard, ClipboardList, Bell, Users, HelpCircle, Settings, ChevronDown, Menu, LogOut  } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { apiUrl } from './commonConstants';

export default function Sidebar() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown)
  }

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}Auth/Logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
      });

      // Redirect to login page after logging out
      localStorage.removeItem("accessToken");
      localStorage.removeItem("adminId");
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <div>
      {/* Hamburger Menu for screens below 768px */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleMenu}>
          <Menu className="h-8 w-8 text-white" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-[#1e2c2b] text-white h-screen fixed z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 mt-12 md:mt-0">
          <a href='/dashboard'>
            <Image
              src="/dashboard/sidebar-logo.svg"
              alt="Marsupium Logo"
              width={500}
              height={500}
            />
          </a>
        </div>
        <nav className="mt-4">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="h-5 w-5 mr-3" />} label="Dashboard" />
          <NavItem href="/daily-task" icon={<ClipboardList className="h-5 w-5 mr-3" />} label="Daily Task" />
          <NavItem href="/notification" icon={<Bell className="h-5 w-5 mr-3" />} label="Notification" />
          <NavItem href="/user-management" icon={<Users className="h-5 w-5 mr-3" />} label="User Management" />
          <NavItem href="/faq" icon={<HelpCircle className="h-5 w-5 mr-3" />} label="FAQ" />
          <button className="flex items-center w-full text-left hover:bg-[#2a3c3b] transition-colors duration-200 py-2 px-3 rounded"
            onClick={toggleSettingsDropdown}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
            <ChevronDown className="h-4 w-4 ml-auto" />
          </button>
          {/* Settings Dropdown */}
          {showSettingsDropdown && (
            <div className="pl-12 mt-2">
              <NavItem href="/general-settings" label="General Settings" />
              <NavItem href="/adminer" label="Access & Permissions" />
            </div>
          )}
        </nav>
        <div className="absolute bottom-4">
          <button 
            className="flex items-center w-full text-left hover:bg-[#2a3c3b] transition-colors duration-200 py-2 px-3 rounded"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" onClick={handleLogout} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon?: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center px-4 py-2 hover:bg-[#2a3c3b] transition-colors duration-200">
      {icon}
      {label}
    </Link>
  )
}
