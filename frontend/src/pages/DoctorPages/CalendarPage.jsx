import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { doctorStore } from "../../store/doctor.store.js";
import DocNavbar from "../../components/DocNavbar.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import ErrorPage from "../../components/ui/errorPage.jsx";
import toast from "react-hot-toast";

export default function CalendarPage() {
  const {
    appointments,
    getAllAppointments,
    rescheduleAppointments,
    loading,
    error,
  } = doctorStore();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentCache, setAppointmentCache] = useState({});

  useEffect(() => {
    getAllAppointments();
  }, [getAllAppointments]);

  // Cache appointment data to preserve patient info after rescheduling
  useEffect(() => {
    const cache = {};
    appointments.forEach((appt) => {
      cache[appt._id] = {
        patientName: appt.patientId?.userId?.name || "Unknown Patient",
        age: appt.patientId?.age || "N/A",
        symptoms: appt.symptoms || "N/A",
        status: appt.status,
      };
    });
    setAppointmentCache((prev) => ({ ...prev, ...cache }));
  }, [appointments]);

  const stats = appointments.reduce(
    (acc, appt) => {
      if (appt.status === "booked") acc.booked += 1;
      else if (appt.status === "completed") acc.completed += 1;
      else if (appt.status === "cancelled") acc.cancelled += 1;
      return acc;
    },
    { booked: 0, completed: 0, cancelled: 0 }
  );

  const events = appointments.map((appt) => {
    const start = new Date(`${appt.date}T${appt.time}`);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const statusColors = {
      booked: "#2563eb",
      completed: "#16a34a",
      cancelled: "#dc2626",
    };

    const patientName = appt.patientId?.userId?.name || "Unknown Patient";
    const age = appt.patientId?.age || "N/A";

    return {
      id: appt._id,
      title: patientName,
      start,
      end,
      backgroundColor: statusColors[appt.status],
      borderColor: statusColors[appt.status],
      editable: appt.status === "booked",
      extendedProps: {
        status: appt.status,
        patientName,
        age,
        symptoms: appt.symptoms || "N/A",
        time: appt.time,
      },
    };
  });

  const handleEventDrop = async (info) => {
    const { status } = info.event.extendedProps;
    if (status !== "booked") {
      info.revert();
      return;
    }

    const appointmentId = info.event.id;
    const start = info.event.start;

    const date = start.toISOString().split("T")[0];
    const time = start.toTimeString().slice(0, 5);

    const success = await rescheduleAppointments(appointmentId, date, time);
    if (!success) {
      toast.error("Error in rescheduling");
      info.revert();
    } else {
      toast.success("Appointment rescheduled successfully");
      await getAllAppointments();
    }
  };

  const getEventHoverTitle = (event) => {
    const appointmentId = event.id;
    const cachedData = appointmentCache[appointmentId];

    if (cachedData) {
      const { patientName, age, symptoms, status, time } = cachedData;
      return `Patient: ${patientName}\nAge: ${age}\nSymptoms: ${symptoms}\nStatus: ${status}\nTime: ${time}`;
    }

    const { patientName, age, symptoms, status, time } = event.extendedProps;
    return `Patient: ${patientName}\nAge: ${age}\nSymptoms: ${symptoms}\nStatus: ${status}\nTime: ${time}`;
  };

  const handleEventMouseEnter = (info) => {
    info.el.setAttribute("title", getEventHoverTitle(info.event));
  };

  const handleEventClick = (info) => {
    const appointmentId = info.event.id;
    const cachedData = appointmentCache[appointmentId];

    let patientName, age, symptoms, status, time;

    if (cachedData) {
      ({ patientName, age, symptoms, status } = cachedData);
      time = info.event.extendedProps.time;
    } else {
      ({ patientName, age, symptoms, status, time } = info.event.extendedProps);
    }

    setSelectedAppointment({
      id: appointmentId,
      title: patientName,
      patientName,
      age,
      symptoms,
      status,
      date: info.event.start.toDateString(),
      time,
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorPage error={error} />;

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* NAVBAR */}
      <section className="bg-gradient-to-b from-[#0B5FA5] via-[#1F7CCB] to-[#4AA3E0] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <DocNavbar />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B5FA5]">
                Appointment Calendar
              </h1>
              <p className="text-gray-600 text-sm">
                Manage and schedule your patient appointments
              </p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-blue-500">
                  {stats.booked}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Booked</h3>
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
                  {stats.completed}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
              <p className="text-sm text-gray-500 mt-1">
                Finished consultations
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-red-500">
                  {stats.cancelled}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Cancelled</h3>
              <p className="text-sm text-gray-500 mt-1">Cancelled bookings</p>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <style>{`
              .fc {
                font-family: inherit;
              }
              
              .fc .fc-toolbar-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #0B5FA5;
              }
              
              .fc .fc-button {
                background: linear-gradient(135deg, #0B5FA5 0%, #4AA3E0 100%);
                border: none;
                padding: 0.5rem 1rem;
                font-weight: 600;
                text-transform: capitalize;
                border-radius: 0.5rem;
                box-shadow: 0 2px 4px rgba(11, 95, 165, 0.2);
                transition: all 0.2s;
                outline: none;
              }
              
              .fc .fc-button:hover {
                background: linear-gradient(135deg, #094a8a 0%, #3a91cc 100%);
                box-shadow: 0 4px 8px rgba(11, 95, 165, 0.3);
                transform: translateY(-1px);
              }
              
              .fc .fc-button:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(11, 95, 165, 0.3);
              }
              
              .fc .fc-button:disabled {
                background: #cbd5e1;
                box-shadow: none;
                opacity: 0.6;
              }
              
              .fc .fc-button-active {
                background: linear-gradient(135deg, #094a8a 0%, #3a91cc 100%);
                box-shadow: 0 2px 8px rgba(11, 95, 165, 0.4);
              }
              
              .fc .fc-button-active:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(11, 95, 165, 0.3);
              }
              
              .fc .fc-col-header-cell {
                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                padding: 1rem 0.5rem;
                font-weight: 600;
                color: #0B5FA5;
                text-transform: uppercase;
                font-size: 0.75rem;
                letter-spacing: 0.05em;
                border: none;
              }
              
              .fc .fc-daygrid-day {
                transition: background-color 0.2s;
              }
              
              .fc .fc-daygrid-day:hover {
                background-color: #f8fafc;
              }
              
              .fc .fc-daygrid-day-number {
                color: #334155;
                font-weight: 600;
                padding: 0.5rem;
              }
              
              .fc .fc-day-today {
                background-color: #eff6ff !important;
              }
              
              .fc .fc-day-today .fc-daygrid-day-number {
                background: linear-gradient(135deg, #0B5FA5 0%, #4AA3E0 100%);
                color: white;
                border-radius: 0.5rem;
                padding: 0.25rem 0.5rem;
                font-weight: 700;
              }
              
              .fc .fc-timegrid-slot {
                height: 3rem;
                border-color: #e2e8f0;
              }
              
              .fc .fc-timegrid-slot-label {
                color: #64748b;
                font-weight: 500;
                font-size: 0.875rem;
              }
              
              .fc .fc-event {
                border-radius: 0.5rem;
                padding: 0.25rem 0.5rem;
                font-weight: 600;
                font-size: 0.875rem;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: all 0.2s;
              }
              
              .fc .fc-event:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                transform: translateY(-1px);
              }
              
              .fc .fc-event:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(11, 95, 165, 0.2);
              }
              
              .fc .fc-event-main {
                padding: 0.125rem 0.25rem;
              }
              
              .fc-theme-standard td,
              .fc-theme-standard th {
                border-color: #e2e8f0;
              }
              
              .fc-theme-standard .fc-scrollgrid {
                border-color: #e2e8f0;
              }
              
              .fc .fc-now-indicator {
                border-color: #FF5A5F;
                border-width: 2px;
              }
            `}</style>

            <FullCalendar
              key={appointments.length}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              slotMinTime="09:00:00"
              slotMaxTime="17:00:00"
              slotDuration="00:30:00"
              snapDuration="00:30:00"
              timeZone="local"
              allDaySlot={false}
              nowIndicator
              events={events}
              editable
              eventDrop={handleEventDrop}
              eventResize={handleEventDrop}
              eventMouseEnter={handleEventMouseEnter}
              eventClick={handleEventClick}
              height="auto"
            />
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedAppointment && (
        <Modal onClose={() => setSelectedAppointment(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B5FA5] to-[#4AA3E0] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0B5FA5]">
                  Appointment Details
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedAppointment.patientName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Patient Name
                </p>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.patientName}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Age
                </p>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.age}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Date
                </p>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.date}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Time
                </p>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.time}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Status
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${
                  selectedAppointment.status === "booked"
                    ? "bg-blue-100 text-blue-700"
                    : selectedAppointment.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedAppointment.status.charAt(0).toUpperCase() +
                  selectedAppointment.status.slice(1)}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Symptoms
              </p>
              <p className="text-gray-900 leading-relaxed">
                {selectedAppointment.symptoms}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
