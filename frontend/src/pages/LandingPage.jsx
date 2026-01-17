import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Stethoscope, CalendarCheck, ShieldCheck, Menu, X } from "lucide-react";
import { Activity, Brain, UserCheck, ClipboardPlus } from "lucide-react";
import DropDownMenu from "../components/ui/DropDownMenu";
import ServiceCard from "../components/ui/ServiceCard";
import ReviewCard from "../components/ui/ReviewCard";
import Footer from "../components/Footer.jsx";
import { authStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { isAuthenticated } = authStore();
  const navigate = useNavigate();
  const [isTreatmentsOpen, setIsTreatmentsOpen] = useState(false);

  const handleBookBtn = () => {
    if (isAuthenticated) {
      navigate("/find");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Navbar />
          <div className="h-px bg-white/40"></div>

          {/* Secondary Navigation */}
          <div className="py-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center space-x-4 xl:space-x-8">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                  <span className="text-2xl xl:text-3xl font-extrabold tracking-wide">
                    HOPCARE
                  </span>
                </div>

                <div className="flex gap-6 xl:gap-12 ml-8 xl:ml-20">
                  <div className="relative group">
                    <button className="hover:opacity-90 flex items-center gap-1 text-sm xl:text-base">
                      Treatments
                      <svg
                        className="w-3 h-3 transition-transform group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-3 w-52 bg-white text-[#0B5FA5] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <ul className="py-2 text-sm font-medium">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          Physiotherapy
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          Occupational Therapy
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          Sports Rehabilitation
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          Neurological Rehab
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm xl:text-base">Rehabilitation Program</p>
                  <p className="text-sm xl:text-base">Assistive Devices</p>
                </div>
              </div>

              <button
                className="group relative cursor-pointer"
                onClick={handleBookBtn}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#FF5A5F] text-white px-4 xl:px-5 py-2.5 xl:py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-xs xl:text-sm font-semibold">
                  Book Appointment
                  <CalendarCheck className="w-4 h-4 xl:w-5 xl:h-5" />
                </div>
              </button>
            </div>

            {/* Mobile/Tablet Navigation */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-white" />
                  <span className="text-xl sm:text-2xl font-extrabold tracking-wide">
                    HOPCARE
                  </span>
                </div>

                <button
                  className="group relative cursor-pointer"
                  onClick={handleBookBtn}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-[#FF5A5F] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold">
                    <span className="hidden sm:inline">Book Appointment</span>
                    <span className="sm:hidden">Book Now</span>
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 text-sm">
                <button
                  onClick={() => setIsTreatmentsOpen(!isTreatmentsOpen)}
                  className="hover:opacity-90 flex items-center gap-1"
                >
                  Treatments
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      isTreatmentsOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <span>Rehabilitation Program</span>
                <span>Assistive Devices</span>
              </div>

              {isTreatmentsOpen && (
                <div className="mt-2 bg-white text-[#0B5FA5] rounded-lg shadow-lg p-3">
                  <ul className="space-y-2 text-sm font-medium">
                    <li className="cursor-pointer hover:text-[#FF5A5F]">
                      Physiotherapy
                    </li>
                    <li className="cursor-pointer hover:text-[#FF5A5F]">
                      Occupational Therapy
                    </li>
                    <li className="cursor-pointer hover:text-[#FF5A5F]">
                      Sports Rehabilitation
                    </li>
                    <li className="cursor-pointer hover:text-[#FF5A5F]">
                      Neurological Rehab
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12 py-12 lg:py-16">
            <div>
              <p className="tracking-widest text-xs sm:text-sm uppercase opacity-80 mb-4">
                SMART HEALTHCARE PLATFORM
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                Focused on <br />
                Your Complete Care
              </h1>
              <p className="text-sm sm:text-base opacity-90 mb-8 max-w-lg">
                HopCare makes healthcare simple. Book appointments, view
                prescriptions, receive reminders, and stay connected with your
                doctor — all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  className="group relative cursor-pointer w-full sm:w-auto"
                  onClick={handleBookBtn}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-[#FF5A5F] text-white px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm font-semibold">
                    Book Appointment
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                </button>
                <div className="w-full sm:w-auto">
                  <DropDownMenu />
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-3 sm:p-4 shadow-2xl w-full max-w-md lg:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop"
                  alt="Doctor consulting patient"
                  className="w-full h-56 sm:h-72 lg:h-80 xl:h-96 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS SECTION */}
      <section className="bg-gradient-to-r from-[#0B4FA3] via-[#144E9C] to-[#1E63C3] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                Three Convenient <br className="hidden sm:block" /> Locations in
                the GTA
              </h3>
            </div>

            <div className="relative sm:pl-0 lg:pl-8">
              <div className="hidden lg:block absolute left-0 top-0 h-full w-px bg-white/30"></div>
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                Vaughan
              </h4>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                1520 Steeles Ave West, Unit 105 <br />
                Vaughan, ON L4K 3B9
              </p>
              <p className="mt-3 text-xs sm:text-sm font-medium flex items-center gap-2">
                📞 905-597-1667
              </p>
            </div>

            <div className="relative sm:pl-0 lg:pl-8">
              <div className="hidden lg:block absolute left-0 top-0 h-full w-px bg-white/30"></div>
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                Brampton
              </h4>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                2 County Court Blvd, Suite 230 <br />
                Brampton, ON L6W 3W8
              </p>
              <p className="mt-3 text-xs sm:text-sm font-medium flex items-center gap-2">
                📞 905-457-2111
              </p>
            </div>

            <div className="relative sm:pl-0 lg:pl-8">
              <div className="hidden lg:block absolute left-0 top-0 h-full w-px bg-white/30"></div>
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                Scarborough
              </h4>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                8130 Sheppard Ave East, Unit 106 <br />
                Scarborough, ON M1B 3W3
              </p>
              <p className="mt-3 text-xs sm:text-sm font-medium flex items-center gap-2">
                📞 647-352-0211
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B5FA5] mb-4">
              Services
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Explore our range of healthcare services designed to help you find
              the right doctor, book appointments easily, and receive trusted
              medical care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <ServiceCard
              title="Physiotherapy"
              description="Personalized rehabilitation focused on restoring mobility, strength, and independence after injury or accident."
              icon={<Activity className="w-6 h-6" />}
              variant="red"
            />
            <ServiceCard
              title="Specialist Consultations"
              description="Connect with experienced specialists for focused consultations and expert medical opinions tailored to your health concerns."
              icon={<Brain className="w-6 h-6" />}
            />
            <ServiceCard
              title="General Medical Consultation"
              description="Schedule appointments with trusted doctors for routine checkups, medical advice, and guidance for common health concerns."
              icon={<UserCheck className="w-6 h-6" />}
            />
            <ServiceCard
              title="Pain Management and Recovery"
              description="Targeted pain management solutions that help patients manage chronic or acute pain while supporting long-term recovery and daily comfort."
              icon={<ClipboardPlus className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="bg-gradient-to-b from-[#083F7A] via-[#165FA8] to-[#3288CC] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
                What Patients Are <br className="hidden sm:block" /> Saying
                About HopCare
              </h2>
              <p className="text-white/90 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed text-sm sm:text-base">
                Patients trust HopCare for seamless appointment booking,
                reliable consultations, and continuous care. See how we're
                improving healthcare experiences every day.
              </p>
              <button
                className="group relative cursor-pointer w-full sm:w-auto"
                onClick={handleBookBtn}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#FF5A5F] text-white px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm font-semibold">
                  Book Appointment
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <ReviewCard
                name="Virat Kohli"
                time="2 months ago"
                review="Booking a doctor through HopCare was incredibly smooth. I found a specialist, booked instantly, and received reminders before my appointment."
              />
              <ReviewCard
                name="Sneha Kapoor"
                time="3 months ago"
                review="The consultation experience was seamless. Everything from booking to prescription access was handled in one place."
              />
              <ReviewCard
                name="Rohit Sharma"
                time="4 months ago"
                review="HopCare saved me so much time. I didn't have to wait in long queues and could consult doctors easily."
              />
              <ReviewCard
                name="Ananya Verma"
                time="5 months ago"
                review="Simple interface, reliable doctors, and quick appointment scheduling. Highly recommended for busy professionals."
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B5FA5] mb-6">
                Trusted Healthcare Access <br className="hidden sm:block" />{" "}
                Across India
              </h2>

              <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
                HopCare connects patients with verified doctors and specialists
                through a simple, secure, and reliable digital platform. Whether
                you need a general consultation, specialist advice, or follow-up
                care, HopCare makes quality healthcare accessible — anytime,
                anywhere.
              </p>

              <h3 className="text-lg sm:text-xl font-bold text-[#0B5FA5] mb-6">
                Why Patients Choose HopCare
              </h3>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-[#E8F2FD] flex items-center justify-center text-[#0B5FA5]">
                    <UserCheck className="text-[#0B5FA5]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Verified Doctors & Specialists
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Consult experienced and trusted doctors across multiple
                      specialties with confidence.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-[#E8F2FD] flex items-center justify-center text-[#0B5FA5]">
                    <CalendarCheck className="text-[#0B5FA5]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Easy Appointment Booking
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Book doctor appointments in just a few clicks — no long
                      queues, no waiting calls.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-[#E8F2FD] flex items-center justify-center text-[#0B5FA5]">
                    <ShieldCheck className="text-[#0B5FA5]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Secure Medical Records
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Access prescriptions, consultation history, and medical
                      records securely from one dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center order-1 lg:order-2">
              <div className="rounded-3xl overflow-hidden shadow-xl w-full max-w-md lg:max-w-none">
                <img
                  src="./doc-consultation.jpg"
                  alt="Doctor consulting patient"
                  className="w-full h-56 sm:h-72 lg:h-80 object-cover"
                />
              </div>

              <div className="hidden sm:block absolute -bottom-12 lg:-bottom-16 -left-6 lg:-left-10 rounded-3xl overflow-hidden shadow-2xl bg-white max-w-xs lg:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600"
                  alt="Online doctor consultation"
                  className="w-64 h-40 sm:w-80 sm:h-52 lg:w-96 lg:h-60 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
