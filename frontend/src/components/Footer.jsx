// ============================================
// RESPONSIVE FOOTER COMPONENT
// ============================================

import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071B34] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7" />
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide">
                HOPCARE
              </h2>
            </div>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-sm">
              HopCare is a smart healthcare platform that helps patients book
              appointments, consult doctors, manage prescriptions, and stay
              connected — all in one secure place.
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Services
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-white/80 text-xs sm:text-sm">
              <li className="hover:text-white cursor-pointer transition">
                Specialist Consultation
              </li>
              <li className="hover:text-white cursor-pointer transition">
                General Medical Consultation
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Pain Management & Recovery
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Online Appointment Booking
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-white/80 text-xs sm:text-sm">
              <li className="hover:text-white cursor-pointer transition">
                Find Doctors
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Book Appointment
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Patient Dashboard
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Doctor Login
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-white/80 text-xs sm:text-sm">
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">support@hopcare.com</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 90000 00000</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20 my-8 sm:my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-white/70">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} HopCare. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="hover:text-white cursor-pointer transition">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
