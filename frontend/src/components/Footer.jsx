import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071B34] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-7 h-7" />
              <h2 className="text-2xl font-extrabold tracking-wide">
                HOPCARE
              </h2>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              HopCare is a smart healthcare platform that helps patients book
              appointments, consult doctors, manage prescriptions, and stay
              connected — all in one secure place.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3 text-white/80 text-sm">
              <li className="hover:text-white cursor-pointer">
                Specialist Consultation
              </li>
              <li className="hover:text-white cursor-pointer">
                General Medical Consultation
              </li>
              <li className="hover:text-white cursor-pointer">
                Pain Management & Recovery
              </li>
              <li className="hover:text-white cursor-pointer">
                Online Appointment Booking
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-white/80 text-sm">
              <li className="hover:text-white cursor-pointer">Find Doctors</li>
              <li className="hover:text-white cursor-pointer">Book Appointment</li>
              <li className="hover:text-white cursor-pointer">Patient Dashboard</li>
              <li className="hover:text-white cursor-pointer">Doctor Login</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4 text-white/80 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                support@hopcare.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                +91 90000 00000
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                India
              </li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-white/20 my-10"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
          <p>© {new Date().getFullYear()} HopCare. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
