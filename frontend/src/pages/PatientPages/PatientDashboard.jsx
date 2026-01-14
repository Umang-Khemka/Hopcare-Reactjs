import React, { useEffect,useState } from "react";
import { patientStore } from "../../store/patient.store.js";
import AppointmentCard from "../../components/ui/AppointmentCard.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import {
  Calendar,
  User,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  Search,
  Filter,
} from "lucide-react";

export default function PatientDashboard() {
  const { patient, appointments, loading, error, patientHistory } =
    patientStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    patientHistory();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      appt.doctorId?.userId?.name?.toLowerCase().includes(searchLower) ||
      appt.date?.toLowerCase().includes(searchLower) ||
      appt.status?.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || appt.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const bookedAppointments = filteredAppointments.filter(
    (a) => a.status === "booked"
  );
  const completedAppointments = filteredAppointments.filter(
    (a) => a.status === "completed"
  );
  const cancelledAppointments = filteredAppointments.filter(
    (a) => a.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
          <div className="max-w-7xl mx-auto">
            <Navbar />
          </div>
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0B5FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
          <div className="max-w-7xl mx-auto">
            <Navbar />
          </div>
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-[#0B5FA5]">
                My Appointments
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your healthcare appointments
              </p>
            </div>
          </div>

          {patient && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 inline-flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <User className="w-6 h-6 text-[#0B5FA5]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {patient.name}
                </p>
                <p className="text-gray-600 text-sm">
                  {patient.age} years • {patient.gender}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, date, or status..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B5FA5] focus:outline-none transition-colors font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B5FA5] focus:outline-none transition-colors font-medium appearance-none cursor-pointer bg-white"
              >
                <option value="all">All Status</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || statusFilter !== "all") && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">
                Active filters:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold capitalize">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="ml-auto text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        {(searchQuery || statusFilter !== "all") && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found{" "}
              <span className="font-bold text-[#0B5FA5]">
                {filteredAppointments.length}
              </span>{" "}
              appointment{filteredAppointments.length !== 1 ? "s" : ""} matching
              your criteria
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-blue-500">
                  {bookedAppointments.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Upcoming</h3>
              <p className="text-sm text-gray-500 mt-1">Active appointments</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-green-500">
                  {completedAppointments.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
              <p className="text-sm text-gray-500 mt-1">Past consultations</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-purple-500">
                  {appointments.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Total</h3>
              <p className="text-sm text-gray-500 mt-1">All appointments</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && appointments.length > 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">
              No appointments match your search
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-4 px-6 py-2 bg-[#0B5FA5] text-white rounded-xl font-semibold hover:bg-[#1F7CCB] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Empty State - No appointments at all */}
        {appointments.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">
              No appointments found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Book your first appointment to get started
            </p>
          </div>
        )}

        {/* Appointments Grid */}
        {filteredAppointments.length > 0 && (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            {bookedAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Upcoming Appointments
                    <span className="text-blue-600 ml-2">
                      ({bookedAppointments.length})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bookedAppointments.map((appt) => (
                    <AppointmentCard key={appt._id} appointment={appt} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Appointments */}
            {completedAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Completed Appointments
                    <span className="text-green-600 ml-2">
                      ({completedAppointments.length})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedAppointments.map((appt) => (
                    <AppointmentCard key={appt._id} appointment={appt} />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Appointments */}
            {cancelledAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cancelled Appointments
                    <span className="text-red-600 ml-2">
                      ({cancelledAppointments.length})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cancelledAppointments.map((appt) => (
                    <AppointmentCard key={appt._id} appointment={appt} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
