import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/Home';
import AboutSchool from '../pages/AboutSchool';
import Gallery from '../pages/Gallery';
import Pricing from '../pages/Pricing';
import Admission from '../pages/Admission';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import DataSecurity from '../pages/DataSecurity';
import InstitutionalTerms from '../pages/InstitutionalTerms';
import SystemStatus from '../pages/SystemStatus';
import HostelList from '../pages/HostelList';
import HostelRooms from '../pages/HostelRooms';
import RoomCategories from '../pages/RoomCategories';
import HostelAllotment from '../pages/HostelAllotment';
import MessOverview from '../pages/MessOverview';
import MessSchedule from '../pages/MessSchedule';
import MessAttendance from '../pages/MessAttendance';
import SubscriptionManagement from '../pages/SubscriptionManagement';
import MessSubscriptions from '../pages/MessSubscriptions';
import BillingHistory from '../pages/BillingHistory';
import PremiumUpgrades from '../pages/PremiumUpgrades';
import EduProAI from '../pages/EduProAI';
import AcademicSetup from '../pages/AcademicSetup';
import InstitutionalSettings from '../pages/InstitutionalSettings';
import Dashboard from '../pages/Dashboard';
import StudentDashboard from '../pages/StudentDashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
import ParentDashboard from '../pages/ParentDashboard';
import LMSDashboard from '../pages/LMSDashboard';
import Users from '../pages/Users';
import AssignRole from '../pages/AssignRole';
import GuardianList from '../pages/GuardianList';
import GuardianDetails from '../pages/GuardianDetails';
import AddGuardian from '../pages/AddGuardian';
import EditGuardian from '../pages/EditGuardian';
import Students from '../pages/Students';
import AddStudent from '../pages/AddStudent';
import EditStudent from '../pages/EditStudent';
import StudentDetails from '../pages/StudentDetails';
import SuspendedStudents from '../pages/SuspendedStudents';
import StudentCategories from '../pages/StudentCategories';
import Teachers from '../pages/Teachers';
import TeacherInfo from '../pages/TeacherInfo';
import AddTeacher from '../pages/AddTeacher';
import EditTeacher from '../pages/EditTeacher';
import TeacherDetails from '../pages/TeacherDetails';
import TeacherTimetable from '../pages/TeacherTimetable';
import Classes from '../pages/Classes';
import Sections from '../pages/Sections';
import Subjects from '../pages/Subjects';
import Classrooms from '../pages/Classrooms';
import StudentAttendance from '../pages/StudentAttendance';
import TeacherAttendance from '../pages/TeacherAttendance';
import EmployeeAttendance from '../pages/EmployeeAttendance';
import LeaveTypes from '../pages/LeaveTypes';
import LeaveRequest from '../pages/LeaveRequest';
import LeaveApproved from '../pages/LeaveApproved';
import Courses from '../pages/Courses';
import Assignments from '../pages/Assignments';
import QuizCenter from '../pages/QuizCenter';
import ELibrary from '../pages/ELibrary';
import LearningCenter from '../pages/LearningCenter';
import Timetable from '../pages/Timetable';
import Exams from '../pages/Exams';
import ExamSchedule from '../pages/ExamSchedule';
import ExamResult from '../pages/ExamResult';
import FeesDashboard from '../pages/Fees';
import FeesCollection from '../pages/FeesCollection';
import FeesRecord from '../pages/FeesRecord';
import SchoolExpenses from '../pages/SchoolExpenses';
import Library from '../pages/Library';
import LibraryMembers from '../pages/LibraryMembers';
import LibraryMemberDetails from '../pages/LibraryMemberDetails';
import IssueReturn from '../pages/IssueReturn';
import Certificates from '../pages/Certificates';
import PerformancePrediction from '../pages/PerformancePrediction';
import FacultyPerformanceAI from '../pages/FacultyPerformanceAI';
import InstitutionalEfficiencyAI from '../pages/InstitutionalEfficiencyAI';
import FinancialPerformanceAI from '../pages/FinancialPerformanceAI';
import AIPerformanceHub from '../pages/AIPerformanceHub';
import AdmissionsAI from '../pages/AdmissionsAI';
import CurriculumAI from '../pages/CurriculumAI';
import AssetAI from '../pages/AssetAI';
import SecurityAI from '../pages/SecurityAI';
import Transport from '../pages/Transport';
import TransportRoutes from '../pages/TransportRoutes';
import RouteList from '../pages/RouteList';
import VehicleRegistry from '../pages/VehicleRegistry';
import TransportDrivers from '../pages/TransportDrivers';
import Transportation from '../pages/Transportation';
import Hostel from '../pages/Hostel';
import IDCards from '../pages/IDCards';
import Messaging from '../pages/Messaging';
import BulkSMS from '../pages/BulkSMS';
import InstantChat from '../pages/InstantChat';
import Events from '../pages/Events';
import EventCalendar from '../pages/EventCalendar';
import AddEvent from '../pages/AddEvent';
import IncomeHead from '../pages/IncomeHead';
import IncomeList from '../pages/IncomeList';
import ExpenseHead from '../pages/ExpenseHead';
import ExpenseList from '../pages/ExpenseList';
import Transactions from '../pages/Transactions';
import AdvancedReports from '../pages/AdvancedReports';
import AcademicReports from '../pages/AcademicReports';
import FinancialReports from '../pages/FinancialReports';
import AttendanceReports from '../pages/AttendanceReports';
import InventoryReports from '../pages/InventoryReports';
import TransportReports from '../pages/TransportReports';
import HostelReports from '../pages/HostelReports';
import Employees from '../pages/Employees';
import EmployeeDetails from '../pages/EmployeeDetails';
import AddEmployee from '../pages/AddEmployee';
import Payroll from '../pages/Payroll';
import GeneratePayroll from '../pages/GeneratePayroll';
import Designation from '../pages/Designation';
import Department from '../pages/Department';
import StaffDocuments from '../pages/StaffDocuments';
import Notices from '../pages/Notices';
import AddNotice from '../pages/AddNotice';
import Settings from '../pages/Settings';
import AdminProfile from '../pages/AdminProfile';
import InstitutionalSecurity from '../pages/InstitutionalSecurity';
import Maintenance from '../pages/Maintenance';
import AdminTiers from '../pages/AdminTiers';
import FacultyAccess from '../pages/FacultyAccess';
import StaffPermissions from '../pages/StaffPermissions';
import StudentRoles from '../pages/StudentRoles';
import PermissionsLogic from '../pages/PermissionsLogic';
import StudentAnalytics from '../pages/StudentAnalytics';
import SimplePerformance from '../pages/SimplePerformance';
import StaffRegistration from '../pages/StaffRegistration';
import PaymentSettings from '../pages/PaymentSettings';
import RegionalSettings from '../pages/RegionalSettings';
import MessagingSettings from '../pages/MessagingSettings';
import LoginPortal from '../pages/LoginPortal';

// Helper to check authentication
const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  const [isMaintenance, setIsMaintenance] = React.useState(localStorage.getItem('maintenanceMode') === 'true');

  React.useEffect(() => {
    const handleStorage = () => {
      setIsMaintenance(localStorage.getItem('maintenanceMode') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (isMaintenance) {
    return (
      <Routes>
        <Route path="*" element={<Maintenance />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutSchool />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/admission" element={<Admission />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/security" element={<DataSecurity />} />
      <Route path="/terms" element={<InstitutionalTerms />} />
      <Route path="/status" element={<SystemStatus />} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/login-portal" element={<LoginPortal />} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="student" element={<StudentDashboard />} />
        <Route path="teacher" element={<TeacherDashboard />} />
        <Route path="parent" element={<ParentDashboard />} />
        <Route path="lms" element={<LMSDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="assign-role" element={<AssignRole />} />
        <Route path="guardians" element={<GuardianList />} />
        <Route path="guardian-details/:id" element={<GuardianDetails />} />
        <Route path="add-guardian" element={<AddGuardian />} />
        <Route path="edit-guardian/:id" element={<EditGuardian />} />
        <Route path="students" element={<Students />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="edit-student/:id" element={<EditStudent />} />
        <Route path="student-details/:id" element={<StudentDetails />} />
        <Route path="suspended-students" element={<SuspendedStudents />} />
        <Route path="student-categories" element={<StudentCategories />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="teacher-info" element={<TeacherInfo />} />
        <Route path="add-teacher" element={<AddTeacher />} />
        <Route path="edit-teacher/:id" element={<EditTeacher />} />
        <Route path="teacher-details/:id" element={<TeacherDetails />} />
        <Route path="teacher-timetable/:id" element={<TeacherTimetable />} />
        <Route path="classes" element={<Classes />} />
        <Route path="sections" element={<Sections />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="classrooms" element={<Classrooms />} />
        <Route path="student-attendance" element={<StudentAttendance />} />
        <Route path="teacher-attendance" element={<TeacherAttendance />} />
        <Route path="employee-attendance" element={<EmployeeAttendance />} />
        <Route path="leave-types" element={<LeaveTypes />} />
        <Route path="leave-request" element={<LeaveRequest />} />
        <Route path="leave-approved" element={<LeaveApproved />} />
        <Route path="learning" element={<LMSDashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="quiz-center" element={<QuizCenter />} />
        <Route path="e-library" element={<ELibrary />} />
        <Route path="learning-center" element={<LearningCenter />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="exams" element={<Exams />} />
        <Route path="exam-schedule" element={<ExamSchedule />} />
        <Route path="exam-result" element={<ExamResult />} />
        <Route path="fees" element={<FeesDashboard />} />
        <Route path="fees-collection" element={<FeesCollection />} />
        <Route path="fees-record" element={<FeesRecord />} />
        <Route path="expenses" element={<SchoolExpenses />} />
        <Route path="income-head" element={<IncomeHead />} />
        <Route path="income-list" element={<IncomeList />} />
        <Route path="expense-head" element={<ExpenseHead />} />
        <Route path="expense-list" element={<ExpenseList />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reports" element={<AdvancedReports />} />
        <Route path="reports/academic" element={<AcademicReports />} />
        <Route path="reports/financial" element={<FinancialReports />} />
        <Route path="reports/attendance" element={<AttendanceReports />} />
        <Route path="reports/inventory" element={<InventoryReports />} />
        <Route path="reports/transport" element={<TransportReports />} />
        <Route path="reports/hostel" element={<HostelReports />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employee-details/:id" element={<EmployeeDetails />} />
        <Route path="add-employee" element={<AddEmployee />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="payroll-generate" element={<GeneratePayroll />} />
        <Route path="designations" element={<Designation />} />
        <Route path="departments" element={<Department />} />
        <Route path="staff-documents" element={<StaffDocuments />} />
        <Route path="library" element={<Library />} />
        <Route path="library-members" element={<LibraryMembers />} />
        <Route path="library-member-details/:id" element={<LibraryMemberDetails />} />
        <Route path="issue-return" element={<IssueReturn />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="performance" element={<PerformancePrediction />} />
        <Route path="faculty-ai" element={<FacultyPerformanceAI />} />
        <Route path="efficiency-ai" element={<InstitutionalEfficiencyAI />} />
        <Route path="financial-ai" element={<FinancialPerformanceAI />} />
        <Route path="ai-hub" element={<AIPerformanceHub />} />
        <Route path="admissions-ai" element={<AdmissionsAI />} />
        <Route path="curriculum-ai" element={<CurriculumAI />} />
        <Route path="asset-ai" element={<AssetAI />} />
        <Route path="security-ai" element={<SecurityAI />} />
        <Route path="transport" element={<Transport />} />
        <Route path="transport-routes" element={<TransportRoutes />} />
        <Route path="route-list" element={<RouteList />} />
        <Route path="transport-vehicles" element={<VehicleRegistry />} />
        <Route path="transport-drivers" element={<TransportDrivers />} />
        <Route path="transportation" element={<Transportation />} />
        <Route path="hostel" element={<HostelList />} />
        <Route path="hostel-rooms" element={<HostelRooms />} />
        <Route path="hostel-room-types" element={<RoomCategories />} />
        <Route path="hostel-allotment" element={<HostelAllotment />} />
        <Route path="mess-overview" element={<MessOverview />} />
        <Route path="mess-menu" element={<MessSchedule />} />
        <Route path="mess-attendance" element={<MessAttendance />} />
        <Route path="mess-subscriptions" element={<MessSubscriptions />} />
        <Route path="pricing" element={<SubscriptionManagement />} />
        <Route path="billing" element={<BillingHistory />} />
        <Route path="upgrade" element={<PremiumUpgrades />} />
        <Route path="ai" element={<EduProAI />} />
        <Route path="academic-setup" element={<AcademicSetup />} />
        <Route path="institutional-settings" element={<InstitutionalSettings />} />
        <Route path="pricing-plan" element={<Pricing />} />
        <Route path="id-cards" element={<IDCards />} />
        <Route path="notices" element={<Notices />} />
        <Route path="add-notice" element={<AddNotice />} />
        <Route path="messaging" element={<Messaging />} />
        <Route path="bulk-sms" element={<BulkSMS />} />
        <Route path="chat" element={<InstantChat />} />
        <Route path="events" element={<Events />} />
        <Route path="event-calendar" element={<EventCalendar />} />
        <Route path="add-event" element={<AddEvent />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin-profile" element={<AdminProfile />} />
        <Route path="institutional-security" element={<InstitutionalSecurity />} />
        <Route path="security-logs" element={<InstitutionalSecurity />} />
        <Route path="permissions" element={<PermissionsLogic />} />
        <Route path="assign-role-admin" element={<AdminTiers />} />
        <Route path="assign-role-teacher" element={<FacultyAccess />} />
        <Route path="assign-role-staff" element={<StaffPermissions />} />
        <Route path="assign-role-student" element={<StudentRoles />} />
        <Route path="student-analytics" element={<StudentAnalytics />} />
        <Route path="simple-performance" element={<SimplePerformance />} />
        <Route path="staff-registration" element={<StaffRegistration />} />
        <Route path="admin-tiers" element={<AdminTiers />} />
        <Route path="academic-settings" element={<AcademicSetup />} />
        <Route path="payment-settings" element={<PaymentSettings />} />
        <Route path="sms-settings" element={<MessagingSettings />} />
        <Route path="localization" element={<RegionalSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
