import React, { useState, useEffect } from 'react';
import { Mail, Search, Filter, Star, Trash2, Archive, MoreVertical, Paperclip, ChevronLeft, ChevronRight, User, AlertCircle, RefreshCw, Move, X, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Messaging = () => {
  const defaultEmails = [
    { 
      id: 1, 
      from: 'Admissions Office', 
      subject: 'New Application Received: ADM-2026-042', 
      preview: 'A new application has been submitted by John Doe for Grade 10...', 
      content: 'Dear Registrar,\n\nWe have received a new application (ADM-2026-042) submitted by John Doe for Grade 10. The applicant has submitted all required credentials including transcripts, letters of recommendation, and standard fee receipt.\n\nPlease review and initiate the verification protocol at your earliest convenience.\n\nBest regards,\nAdmissions Office', 
      date: '10:30 AM', 
      read: false, 
      starred: true, 
      folder: 'inbox', 
      label: 'Admission',
      thread: [
        { from: 'Admissions Office', content: 'Dear Registrar,\n\nWe have received a new application (ADM-2026-042) submitted by John Doe for Grade 10. The applicant has submitted all required credentials including transcripts, letters of recommendation, and standard fee receipt.\n\nPlease review and initiate the verification protocol at your earliest convenience.\n\nBest regards,\nAdmissions Office', date: 'May 25, 10:30 AM' }
      ]
    },
    { 
      id: 2, 
      from: 'Accounts Department', 
      subject: 'Pending Fee Reminders - Q1 2026', 
      preview: 'Please generate the list of students with outstanding fees for the first quarter...', 
      content: 'Hi Team,\n\nAs we wrap up the first quarter of the 2026 academic year, please generate the list of students with outstanding fees. We need to send out friendly reminders to the parents before the late fee penalty kicks in next Monday.\n\nLet me know if you need the updated ledger report.\n\nThanks,\nAccounts Department', 
      date: '09:15 AM', 
      read: true, 
      starred: false, 
      folder: 'inbox', 
      label: 'Finance',
      thread: [
        { from: 'My Account (Admin)', content: 'Hi Accounts Team, could you please compile the pending fee list for Q1? We need to review it before circulating reminders.', date: 'May 24, 08:30 AM' },
        { from: 'Accounts Department', content: 'Sure, I am working on the reconciliation now. There are about 45 accounts outstanding. I will share the detailed sheet shortly.', date: 'May 24, 10:15 AM' },
        { from: 'Accounts Department', content: 'Hi Team,\n\nAs we wrap up the first quarter of the 2026 academic year, please generate the list of students with outstanding fees. We need to send out friendly reminders to the parents before the late fee penalty kicks in next Monday.\n\nLet me know if you need the updated ledger report.\n\nThanks,\nAccounts Department', date: 'May 24, 09:15 AM' }
      ]
    },
    { 
      id: 3, 
      from: 'Principal Secretary', 
      subject: 'Staff Meeting Agenda - May 20th', 
      preview: 'The agenda for the upcoming faculty meeting has been finalized. Please review...', 
      content: 'Dear Faculty Members,\n\nThe agenda for the upcoming staff meeting on May 20th has been finalized. Main discussion points include the upcoming science exhibition scheduling, implementation of the digital attendance module, and student performance evaluation metrics.\n\nAttendance is mandatory. Please find the attached pre-read document.\n\nWarm regards,\nSecretary to the Principal', 
      date: 'Yesterday', 
      read: true, 
      starred: true, 
      folder: 'inbox', 
      label: 'Admin',
      thread: [
        { from: 'Principal Secretary', content: 'Hi Admin, could you please confirm if the conference room is booked for the faculty meeting on May 20th?', date: 'May 18, 02:00 PM' },
        { from: 'My Account (Admin)', content: 'Yes, the conference room has been fully reserved and the AV system is ready.', date: 'May 18, 03:15 PM' },
        { from: 'Principal Secretary', content: 'Dear Faculty Members,\n\nThe agenda for the upcoming staff meeting on May 20th has been finalized. Main discussion points include the upcoming science exhibition scheduling, implementation of the digital attendance module, and student performance evaluation metrics.\n\nAttendance is mandatory. Please find the attached pre-read document.\n\nWarm regards,\nSecretary to the Principal', date: 'Yesterday, 09:00 AM' }
      ]
    },
    { 
      id: 4, 
      from: 'Library System', 
      subject: 'Overdue Book Notification', 
      preview: 'The following students have books overdue by more than 7 days...', 
      content: 'System Notification:\n\nThe automated book return scan has identified 15 library books overdue by more than 7 days. Below is the list of students with their corresponding titles. Please suspend library borrow privileges for these accounts until books are returned.\n\nContact the IT support desk for questions.\n\nEduPro Library System', 
      date: 'May 8', 
      read: true, 
      starred: false, 
      folder: 'inbox', 
      label: 'Library',
      thread: [
        { from: 'Library System', content: 'System Notification:\n\nThe automated book return scan has identified 15 library books overdue by more than 7 days. Below is the list of students with their corresponding titles. Please suspend library borrow privileges for these accounts until books are returned.\n\nContact the IT support desk for questions.\n\nEduPro Library System', date: 'May 8, 08:00 AM' }
      ]
    },
    { 
      id: 5, 
      from: 'Registrar Office', 
      subject: 'Academic Calendar 2025 Approval', 
      preview: 'The final draft of the academic calendar for the previous year...', 
      content: 'Dear Faculty,\n\nWe are pleased to inform you that the board has approved the academic calendar draft for the 2024-2025 session. Please prepare syllabus distributions accordingly.\n\nRegards,\nRegistrar', 
      date: 'Jan 15', 
      read: true, 
      starred: false, 
      folder: 'archived', 
      label: 'Admin',
      thread: [
        { from: 'Registrar Office', content: 'Dear Faculty,\n\nWe are pleased to inform you that the board has approved the academic calendar draft for the 2024-2025 session. Please prepare syllabus distributions accordingly.\n\nRegards,\nRegistrar', date: 'Jan 15' }
      ]
    },
    { 
      id: 6, 
      from: 'HR Department', 
      subject: 'Tax Declarations Submission', 
      preview: 'Please submit your tax declarations for the financial year...', 
      content: 'Dear Staff,\n\nThis is a gentle reminder that tax declarations for the financial year must be uploaded on the employee portal by next Friday to avoid excess tax deductions.\n\nWarm regards,\nHR Department', 
      date: 'Feb 10', 
      read: true, 
      starred: false, 
      folder: 'archived', 
      label: 'General',
      thread: [
        { from: 'HR Department', content: 'Dear Staff,\n\nThis is a gentle reminder that tax declarations for the financial year must be uploaded on the employee portal by next Friday to avoid excess tax deductions.\n\nWarm regards,\nHR Department', date: 'Feb 10' }
      ]
    },
    { id: 7, from: 'Newsletter: EdTech Weekly', subject: 'Top 10 Digital Classroom Trends', preview: 'Discover how AI is shaping the future of high school classroom interaction...', content: 'Hi subscriber,\n\nIn this weeks newsletter, we explore how AI-driven personalized classroom modules and VR equipment are changing student engagement in mathematics and history classes.\n\nUnsubscribe at any time.', date: 'May 1', read: true, starred: false, folder: 'trash', label: 'General' },
    { id: 8, from: 'Promotions Portal', subject: 'Discount on Office Ergonomic Chairs', preview: 'Get up to 40% discount on premium ergonomic mesh chairs for schools...', content: 'Dear Purchaser,\n\nUpgrade your faculty rooms with our premium ergonomic mesh chairs and modular tables. Bulk institutional orders enjoy free shipping and installation nationwide.\n\nClick here to unsubscribe.', date: 'Apr 28', read: true, starred: false, folder: 'trash', label: 'General' },
    { id: 9, from: 'Parent Association', subject: 'Volunteer Signups: Annual Charity Gala 2026', preview: 'The Parent-Teacher Association is seeking volunteers for the annual...', content: 'Dear Administrator,\n\nThe Parent-Teacher Association (PTA) is officially opening signups for volunteers for the upcoming Annual Charity Gala 2026.\n\nWe need assistance with coordination, catering services, reception ticketing, and cleanup operations. Please circulate this request among the student groups and faculty advisors.\n\nWarm regards,\nPresident, Parent Association', date: '08:45 AM', read: false, starred: false, folder: 'inbox', label: 'Events' },
    { id: 10, from: 'Maintenance Department', subject: 'Air Conditioning Maintenance Schedule', preview: 'Please note the routine maintenance schedule for the central air conditioning...', content: 'Hi Team,\n\nPlease note the routine maintenance schedule for the central air conditioning units across Blocks A, B, and C.\n\nOperations will begin this Saturday at 08:00 AM and should conclude by 04:00 PM. System downtime is expected, so please coordinate accordingly.\n\nThanks,\nFacilities Supervisor', date: 'Yesterday', read: true, starred: false, folder: 'inbox', label: 'Admin' },
    { 
      id: 11, 
      from: 'Vanguard Security Services', 
      subject: 'Updated Campus Security Protocols - CCTV Upgrades', 
      preview: 'We have finalized the installation of 12 new high-definition IP cameras...', 
      content: 'Dear Registrar,\n\nWe are pleased to report that the phase 2 upgrade of our campus security infrastructure is complete. We have successfully deployed 12 new high-definition IP cameras covering peripheral fences and main lobby entries.\n\nPlease find the updated monitoring layout plan and credentials for authorized staff attached.\n\nSafety first,\nSecurity Coordinator', 
      date: 'May 14', 
      read: false, 
      starred: true, 
      folder: 'inbox', 
      label: 'Admin',
      thread: [
        { from: 'My Account (Admin)', content: 'Hi Vanguard Team, could you please schedule the CCTV upgrade for Block B peripheral fences? We noticed blind spots during the night rounds.', date: 'May 12, 11:00 AM' },
        { from: 'Vanguard Security Services', content: 'Schedule confirmed for May 13-14. Our techs will mount HD IP cameras and link them to the server.', date: 'May 12, 02:30 PM' },
        { from: 'Vanguard Security Services', content: 'Dear Registrar,\n\nWe are pleased to report that the phase 2 upgrade of our campus security infrastructure is complete. We have successfully deployed 12 new high-definition IP cameras covering peripheral fences and main lobby entries.\n\nPlease find the updated monitoring layout plan and credentials for authorized staff attached.\n\nSafety first,\nSecurity Coordinator', date: 'May 14, 04:00 PM' }
      ]
    },
    { 
      id: 12, 
      from: 'Sports Academy', 
      subject: 'Inter-School Football Tournament Fixtures', 
      preview: 'The tournament group-stage schedule has been drafted and ready for verification...', 
      content: 'Dear Coach,\n\nThe group-stage fixtures for the upcoming Inter-School Football Tournament have been drafted. Our varsity team is scheduled to play the opening match against Greenfield High on June 5th.\n\nPlease verify squad lists and physical clearance certificates by this Friday.\n\nSporting regards,\nAthletic Director', 
      date: 'May 12', 
      read: true, 
      starred: false, 
      folder: 'inbox', 
      label: 'Events',
      thread: [
        { from: 'Sports Academy', content: 'Dear Coach,\n\nThe group-stage fixtures for the upcoming Inter-School Football Tournament have been drafted. Our varsity team is scheduled to play the opening match against Greenfield High on June 5th.\n\nPlease verify squad lists and physical clearance certificates by this Friday.\n\nSporting regards,\nAthletic Director', date: 'May 12' }
      ]
    },
    { id: 13, from: 'HR Benefits', subject: 'Health Insurance Renewal 2026', preview: 'The open enrollment period for the group health plan has officially closed...', content: 'Dear Staff,\n\nWe would like to inform you that the open enrollment period for our group health insurance plans has officially concluded. All submitted policies have been forwarded to the carrier for processing.\n\nNew cards will be distributed next month.\n\nWarm regards,\nHR Benefits', date: 'Mar 15', read: true, starred: false, folder: 'archived', label: 'General' },
    { id: 14, from: 'IT Helpdesk', subject: 'Single Sign-On (SSO) Portal Migration', preview: 'The migration to the new Microsoft SSO portal has been completed successfully...', content: 'Hi Team,\n\nWe are pleased to report that the integration of the unified Single Sign-On (SSO) portal is complete. All administrative, faculty, and student portals can now be logged into with your official @school.com email.\n\nPlease report any access issues to IT service desk.\n\nBest,\nIT Infrastructure Team', date: 'Mar 22', read: true, starred: true, folder: 'archived', label: 'Admin' },
    { id: 15, from: 'Procurement Board', subject: 'Smart Classroom Equipment Delivery', preview: 'The shipment of interactive touch panels and speaker systems has arrived...', content: 'Dear Committee,\n\nThe shipment of interactive touch panels and classroom audio systems from vendor SmartBoards Inc. has successfully arrived at the central warehouse.\n\nInstallation schedules for Block B will be drafted this week.\n\nSincerely,\nLogistics Coordinator', date: 'Apr 02', read: true, starred: false, folder: 'archived', label: 'Finance' },
    { id: 16, from: 'Accreditation Committee', subject: 'URGENT: QA Inspection Documentation Review', preview: 'The board inspectors are arriving next Wednesday. All departments must submit...', content: 'Dear Department Heads,\n\nThis is a critical alert. The regional accreditation board inspectors are scheduled to arrive next Wednesday, June 3rd, for the annual school audit.\n\nPlease ensure your curriculum logs, student progress files, and safety reports are updated and ready for review in the main conference room.\n\nUrgent attention required,\nQA Director', date: 'May 16', read: false, starred: true, folder: 'inbox', label: 'Admin', thread: [{ from: 'Accreditation Committee', content: 'Dear Department Heads,\n\nThis is a critical alert. The regional accreditation board inspectors are scheduled to arrive next Wednesday, June 3rd, for the annual school audit.\n\nPlease ensure your curriculum logs, student progress files, and safety reports are updated and ready for review in the main conference room.\n\nUrgent attention required,\nQA Director', date: 'May 16' }] },
    { id: 17, from: 'Board of Directors', subject: 'Starred: Annual Budget Allocation Approval', preview: 'We are pleased to announce the approved budget for the 2026 science wing development...', content: 'Dear Administration,\n\nFollowing the annual general meeting, the Board of Directors has formally approved the capital budget allocation for the Phase 3 Science Wing Expansion.\n\nThe initial grant of ₹3,50,000 will be disbursed next month for laboratory equipment and modern seating.\n\nBest regards,\nChairman, Board of Directors', date: 'May 10', read: true, starred: true, folder: 'inbox', label: 'Finance', thread: [{ from: 'Board of Directors', content: 'Dear Administration,\n\nFollowing the annual general meeting, the Board of Directors has formally approved the capital budget allocation for the Phase 3 Science Wing Expansion.\n\nThe initial grant of ₹3,50,000 will be disbursed next month for laboratory equipment and modern seating.\n\nBest regards,\nChairman, Board of Directors', date: 'May 10' }] },
    { id: 18, from: 'Spam: Luxury Cruise Deals', subject: 'You Won a Free 7-Day Cruise to the Bahamas!', preview: 'Congratulations! Your email address has been selected as the grand...', content: 'DEAR LUCKY WINNER,\n\nYou have been selected to receive a fully paid 7-Day luxury cruise to the Bahamas! To claim your reward, click the link below and complete the credit card verification form.\n\nNote: Offers expire soon.', date: 'Apr 15', read: true, starred: false, folder: 'trash', label: 'General' },
    { id: 19, from: 'Newsletter: Daily Dev Tips', subject: 'Master CSS Flexbox in 5 Minutes', preview: 'Today we look at standard flex properties like flex-grow and...', content: 'Hey Devs,\n\nMastering CSS Flexbox makes building responsive navigation grids extremely simple. In today\'s tip, we look at the difference between justify-content and align-items.\n\nSee you tomorrow!', date: 'Apr 20', read: true, starred: false, folder: 'trash', label: 'Library' },
    { id: 20, from: 'System Daemon', subject: 'Warning: Storage Capacity at 85%', preview: 'The automated backup server logs report storage capacity has crossed...', content: 'Server Alert:\n\nDisk partition /dev/sda1 has crossed the threshold warning level of 85% storage capacity. Please run cleanups on temporary files and delete obsolete build files to free up disk space.\n\nSystem Administrator', date: 'Apr 22', read: true, starred: false, folder: 'trash', label: 'Admin' }
  ];

  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('school_inbox_messages');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-update emails in the saved list with new default threads if they have same ID but no threads or smaller threads
      const updated = parsed.map(savedEmail => {
        const matchingDefault = defaultEmails.find(de => de.id === savedEmail.id);
        if (matchingDefault && (!savedEmail.thread || savedEmail.thread.length < matchingDefault.thread?.length)) {
          return { ...savedEmail, thread: matchingDefault.thread, content: matchingDefault.content, preview: matchingDefault.preview };
        }
        return savedEmail;
      });
      // Append any completely new default emails that are missing from savedIds
      const savedIds = updated.map(e => e.id);
      const missingEmails = defaultEmails.filter(de => !savedIds.includes(de.id));
      if (missingEmails.length > 0) {
        return [...updated, ...missingEmails];
      }
      return updated;
    }
    return defaultEmails;
  });

  const [currentFolder, setCurrentFolder] = useState('Inbox'); // Inbox, Starred, Archived, Trash
  const [selectedEmailIds, setSelectedEmailIds] = useState([]);
  const [activeMail, setActiveMail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', content: '', label: 'General', replyToId: null });
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message, type = 'success', action = null) => {
    setToast({ message, type, action });
  };

  useEffect(() => {
    if (toast) {
      const duration = toast.action ? 6000 : 3000;
      const timer = setTimeout(() => setToast(null), duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('school_inbox_messages', JSON.stringify(emails));
  }, [emails]);

  // Compute live folder counts
  const inboxUnreadCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
  const starredCount = emails.filter(e => e.starred && e.folder !== 'trash').length;
  const archivedCount = emails.filter(e => e.folder === 'archived').length;
  const trashCount = emails.filter(e => e.folder === 'trash').length;

  const folders = [
    { name: 'Inbox', icon: <Mail size={18} />, count: inboxUnreadCount, active: currentFolder === 'Inbox' },
    { name: 'Starred', icon: <Star size={18} />, count: starredCount, active: currentFolder === 'Starred' },
    { name: 'Archived', icon: <Archive size={18} />, count: archivedCount, active: currentFolder === 'Archived' },
    { name: 'Trash', icon: <Trash2 size={18} />, count: trashCount, active: currentFolder === 'Trash' },
  ];

  // Filters emails based on active folder and search query
  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (currentFolder === 'Inbox') return email.folder === 'inbox';
    if (currentFolder === 'Starred') return email.starred && email.folder !== 'trash';
    if (currentFolder === 'Archived') return email.folder === 'archived';
    if (currentFolder === 'Trash') return email.folder === 'trash';
    return true;
  });

  const handleRefresh = () => {
    showToast('Inbox refreshed!', 'success');
  };

  const handleDeleteSelected = () => {
    if (selectedEmailIds.length === 0) {
      showToast('No messages selected', 'error');
      return;
    }
    if (currentFolder === 'Trash') {
      setEmails(emails.filter(e => !selectedEmailIds.includes(e.id)));
      showToast('Messages permanently deleted!', 'success');
    } else {
      const previouslyFolders = selectedEmailIds.reduce((acc, id) => {
        const item = emails.find(e => e.id === id);
        if (item) acc[id] = item.folder;
        return acc;
      }, {});
      setEmails(emails.map(e => selectedEmailIds.includes(e.id) ? { ...e, folder: 'trash' } : e));
      showToast('Messages moved to Trash', 'success', {
        label: 'Undo',
        onClick: () => {
          setEmails(prevEmails => prevEmails.map(e => previouslyFolders[e.id] ? { ...e, folder: previouslyFolders[e.id] } : e));
          showToast('Delete undone', 'success');
        }
      });
    }
    setSelectedEmailIds([]);
    setActiveMail(null);
  };

  const handleRestoreSelected = () => {
    if (selectedEmailIds.length === 0) {
      showToast('No messages selected', 'error');
      return;
    }
    const previouslyTrashIds = [...selectedEmailIds];
    setEmails(emails.map(e => selectedEmailIds.includes(e.id) ? { ...e, folder: 'inbox' } : e));
    showToast('Messages restored to Inbox', 'success', {
      label: 'Undo',
      onClick: () => {
        setEmails(prevEmails => prevEmails.map(e => previouslyTrashIds.includes(e.id) ? { ...e, folder: 'trash' } : e));
        showToast('Restore undone', 'success');
      }
    });
    setSelectedEmailIds([]);
    setActiveMail(null);
  };

  const handleArchiveSelected = () => {
    if (selectedEmailIds.length === 0) {
      showToast('No messages selected', 'error');
      return;
    }
    const previouslyInboxIds = [...selectedEmailIds];
    setEmails(emails.map(e => selectedEmailIds.includes(e.id) ? { ...e, folder: 'archived' } : e));
    showToast('Messages archived successfully', 'success', {
      label: 'Undo',
      onClick: () => {
        setEmails(prevEmails => prevEmails.map(e => previouslyInboxIds.includes(e.id) ? { ...e, folder: 'inbox' } : e));
        showToast('Archive undone', 'success');
      }
    });
    setSelectedEmailIds([]);
    setActiveMail(null);
  };

  const handleUnarchiveSelected = () => {
    if (selectedEmailIds.length === 0) {
      showToast('No messages selected', 'error');
      return;
    }
    const previouslyArchivedIds = [...selectedEmailIds];
    setEmails(emails.map(e => selectedEmailIds.includes(e.id) ? { ...e, folder: 'inbox' } : e));
    showToast('Messages unarchived successfully', 'success', {
      label: 'Undo',
      onClick: () => {
        setEmails(prevEmails => prevEmails.map(e => previouslyArchivedIds.includes(e.id) ? { ...e, folder: 'archived' } : e));
        showToast('Unarchive undone', 'success');
      }
    });
    setSelectedEmailIds([]);
    setActiveMail(null);
  };

  const toggleSelectEmail = (id, e) => {
    e.stopPropagation();
    if (selectedEmailIds.includes(id)) {
      setSelectedEmailIds(selectedEmailIds.filter(item => item !== id));
    } else {
      setSelectedEmailIds([...selectedEmailIds, id]);
    }
  };

  const isAllSelected = filteredEmails.length > 0 && selectedEmailIds.length === filteredEmails.length;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedEmailIds([]);
    } else {
      setSelectedEmailIds(filteredEmails.map(e => e.id));
    }
  };

  const toggleStarEmail = (id, e) => {
    e.stopPropagation();
    setEmails(emails.map(email => email.id === id ? { ...email, starred: !email.starred } : email));
    const target = emails.find(email => email.id === id);
    if (target) {
      const state = !target.starred ? 'starred' : 'unstarred';
      showToast(`Message ${state}`, 'success');
    }
  };

  const handleOpenEmail = (email) => {
    setActiveMail(email);
    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!composeData.to.trim() || !composeData.subject.trim() || !composeData.content.trim()) {
      showToast('Please fill out all fields', 'error');
      return;
    }
    const replyDate = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (composeData.replyToId) {
      // Thread reply! Append to the original email thread
      setEmails(emails.map(email => {
        if (email.id === composeData.replyToId) {
          const currentThread = email.thread || [{ from: email.from, content: email.content, date: email.date }];
          const updatedThread = [
            ...currentThread,
            { from: 'My Account (Admin)', content: composeData.content, date: replyDate }
          ];
          const updatedEmail = { 
            ...email, 
            thread: updatedThread, 
            read: true, 
            date: 'Just Now', 
            preview: 'Replied: ' + composeData.content.slice(0, 50) + '...'
          };
          if (activeMail && activeMail.id === email.id) {
            setActiveMail(updatedEmail);
          }
          return updatedEmail;
        }
        return email;
      }));
      showToast('Reply sent successfully!', 'success');
    } else {
      // Brand new email compose
      const newMail = {
        id: Date.now(),
        from: 'My Account (Admin)',
        to: composeData.to,
        subject: composeData.subject,
        preview: composeData.content.slice(0, 60) + (composeData.content.length > 60 ? '...' : ''),
        content: composeData.content,
        date: replyDate,
        read: true,
        starred: false,
        folder: 'inbox',
        label: composeData.label,
        thread: [{ from: 'My Account (Admin)', content: composeData.content, date: replyDate }]
      };
      setEmails([newMail, ...emails]);
      showToast('Message sent successfully!', 'success');
    }

    setShowCompose(false);
    setComposeData({ to: '', subject: '', content: '', label: 'General', replyToId: null });
  };

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 120px)' }}>
      <div className="card" style={{ height: '100%', padding: '0', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-color)' }}>
         
         {/* Sidebar: Mailboxes */}
         <div style={{ width: '260px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ padding: '24px' }}>
               <button 
                 className="btn btn-primary" 
                 onClick={() => {
                   setComposeData({ to: '', subject: '', content: '', label: 'General' });
                   setShowCompose(true);
                 }}
                 style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
               >
                  <Mail size={18} /> Compose
               </button>
            </div>
            <div style={{ flex: 1, padding: '0 12px' }}>
               {folders.map(item => (
                  <div 
                    key={item.name} 
                    onClick={() => {
                      setCurrentFolder(item.name);
                      setActiveMail(null);
                      setSelectedEmailIds([]);
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', 
                      cursor: 'pointer', backgroundColor: item.active ? 'var(--primary-light)' : 'transparent',
                      color: item.active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: item.active ? 800 : 600,
                      marginBottom: '4px', transition: '0.2s'
                    }}
                  >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {item.icon} {item.name}
                     </div>
                     {item.count > 0 && (
                       <span style={{ 
                         fontSize: '0.7rem', 
                         fontWeight: 800,
                         backgroundColor: item.active ? 'var(--primary)' : 'var(--bg-body)',
                         color: item.active ? 'white' : 'var(--text-main)',
                         padding: '2px 8px',
                         borderRadius: '20px'
                       }}>{item.count}</span>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* Mail Area */}
         {!activeMail ? (
           /* Mail List View */
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)' }}>
              <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', marginRight: '8px' }} 
                    />
                    <button className="icon-btn" onClick={handleRefresh} title="Refresh Inbox" style={{ backgroundColor: 'var(--bg-body)' }}><RefreshCw size={16} /></button>
                     {currentFolder === 'Trash' ? (
                       <button className="icon-btn" onClick={handleRestoreSelected} title="Restore Selected" style={{ backgroundColor: 'var(--bg-body)' }}><Move size={16} /></button>
                     ) : currentFolder === 'Archived' ? (
                       <button className="icon-btn" onClick={handleUnarchiveSelected} title="Unarchive Selected" style={{ backgroundColor: 'var(--bg-body)' }}><Move size={16} /></button>
                     ) : (
                       <button className="icon-btn" onClick={handleArchiveSelected} title="Archive Selected" style={{ backgroundColor: 'var(--bg-body)' }}><Archive size={16} /></button>
                     )}
                     <button className="icon-btn" onClick={handleDeleteSelected} title="Delete Selected" style={{ backgroundColor: 'var(--bg-body)', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative', width: '220px' }}>
                       <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                       <input 
                         type="text" 
                         placeholder="Search inbox..." 
                         value={searchQuery}
                         onChange={e => setSearchQuery(e.target.value)}
                         style={{ width: '100%', padding: '8px 8px 8px 34px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
                       />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                       {filteredEmails.length} message{filteredEmails.length !== 1 && 's'}
                    </span>
                 </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                 {filteredEmails.length === 0 ? (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--text-muted)' }}>
                      <Mail size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                      <p style={{ fontWeight: 700, margin: 0 }}>No messages in {currentFolder}</p>
                   </div>
                 ) : (
                   filteredEmails.map((email) => (
                      <div 
                        key={email.id}
                        onClick={() => handleOpenEmail(email)}
                        style={{ 
                           padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '20px', 
                           borderBottom: '1px solid var(--border-color)', cursor: 'pointer',
                           backgroundColor: email.read ? 'transparent' : 'rgba(99, 102, 241, 0.04)',
                           transition: '0.2s',
                           position: 'relative'
                        }}
                      >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input 
                              type="checkbox" 
                              checked={selectedEmailIds.includes(email.id)}
                              onChange={(e) => toggleSelectEmail(email.id, e)}
                              style={{ width: '16px', height: '16px', cursor: 'pointer' }} 
                              onClick={e => e.stopPropagation()} 
                            />
                            <Star 
                              size={18} 
                              onClick={(e) => toggleStarEmail(email.id, e)}
                              style={{ 
                                color: email.starred ? '#f59e0b' : 'var(--border-color)', 
                                fill: email.starred ? '#f59e0b' : 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.1s ease'
                              }} 
                            />
                         </div>
                         <div style={{ width: '180px', fontWeight: email.read ? 600 : 900, color: 'var(--text-main)', fontSize: '0.95rem' }}>{email.from}</div>
                         <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                            <span style={{ 
                               padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 900, 
                               backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase'
                            }}>{email.label}</span>
                            <p style={{ margin: 0, fontWeight: email.read ? 500 : 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                               {email.subject} - <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{email.preview}</span>
                            </p>
                         </div>
                         <div style={{ width: '80px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{email.date}</div>
                      </div>
                   ))
                 )}
              </div>
           </div>
         ) : (
           /* Mail Detail View */
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)', padding: '32px', overflowY: 'auto' }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
                 <button 
                   className="btn" 
                   onClick={() => setActiveMail(null)}
                   style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}
                 >
                    <ChevronLeft size={18} /> Back to {currentFolder}
                 </button>
                 <div style={{ display: 'flex', gap: '8px' }}>
                     {activeMail.folder === 'trash' ? (
                       <button 
                         className="icon-btn" 
                         title="Restore Message"
                         style={{ backgroundColor: 'var(--bg-card)' }}
                         onClick={() => {
                           const targetId = activeMail.id;
                           setEmails(emails.map(e => e.id === targetId ? { ...e, folder: 'inbox' } : e));
                           setActiveMail(null);
                           showToast('Message restored to Inbox', 'success', {
                             label: 'Undo',
                             onClick: () => {
                               setEmails(prevEmails => prevEmails.map(e => e.id === targetId ? { ...e, folder: 'trash' } : e));
                               showToast('Restore undone', 'success');
                             }
                           });
                         }}
                       >
                         <Move size={16} />
                       </button>
                     ) : activeMail.folder === 'archived' ? (
                       <button 
                         className="icon-btn" 
                         title="Unarchive Message"
                         style={{ backgroundColor: 'var(--bg-card)' }}
                         onClick={() => {
                           const targetId = activeMail.id;
                           setEmails(emails.map(e => e.id === targetId ? { ...e, folder: 'inbox' } : e));
                           setActiveMail(null);
                           showToast('Message unarchived successfully', 'success', {
                             label: 'Undo',
                             onClick: () => {
                               setEmails(prevEmails => prevEmails.map(e => e.id === targetId ? { ...e, folder: 'archived' } : e));
                               showToast('Unarchive undone', 'success');
                             }
                           });
                         }}
                       >
                         <Move size={16} />
                       </button>
                     ) : (
                       <button 
                         className="icon-btn" 
                         title="Archive Message"
                         style={{ backgroundColor: 'var(--bg-card)' }}
                         onClick={() => {
                           const targetId = activeMail.id;
                           setEmails(emails.map(e => e.id === targetId ? { ...e, folder: 'archived' } : e));
                           setActiveMail(null);
                           showToast('Message archived successfully', 'success', {
                             label: 'Undo',
                             onClick: () => {
                               setEmails(prevEmails => prevEmails.map(e => e.id === targetId ? { ...e, folder: 'inbox' } : e));
                               showToast('Archive undone', 'success');
                             }
                           });
                         }}
                       >
                         <Archive size={16} />
                       </button>
                     )}
                     <button 
                       className="icon-btn" 
                       title={activeMail.folder === 'trash' ? 'Delete Permanently' : 'Move to Trash'}
                       style={{ backgroundColor: 'var(--bg-card)', color: 'var(--danger)' }}
                       onClick={() => {
                         const targetId = activeMail.id;
                         if (activeMail.folder === 'trash') {
                           setEmails(emails.filter(e => e.id !== targetId));
                           showToast('Message permanently deleted', 'success');
                         } else {
                           const originalFolder = activeMail.folder;
                           setEmails(emails.map(e => e.id === targetId ? { ...e, folder: 'trash' } : e));
                           showToast('Message moved to Trash', 'success', {
                             label: 'Undo',
                             onClick: () => {
                               setEmails(prevEmails => prevEmails.map(e => e.id === targetId ? { ...e, folder: originalFolder } : e));
                               showToast('Delete undone', 'success');
                             }
                           });
                         }
                         setActiveMail(null);
                       }}
                     >
                       <Trash2 size={16} />
                     </button>
                 </div>
              </div>

              {/* Email Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                       <span style={{ 
                          padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 900, 
                          backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase'
                       }}>{activeMail.label}</span>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{activeMail.date}</span>
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px 0' }}>{activeMail.subject}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>
                       <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                          {activeMail.from.charAt(0)}
                       </div>
                       <div>
                          <div>From: <span style={{ fontWeight: 800 }}>{activeMail.from}</span></div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>To: <span style={{ fontWeight: 600 }}>admin@school.com</span></div>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={(e) => toggleStarEmail(activeMail.id, e)}
                   style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                 >
                    <Star size={22} style={{ color: activeMail.starred ? '#f59e0b' : 'var(--border-color)', fill: activeMail.starred ? '#f59e0b' : 'none' }} />
                 </button>
              </div>

              {/* Conversation Thread */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', marginBottom: '24px', paddingRight: '4px' }}>
                 {(activeMail.thread || [{ from: activeMail.from, content: activeMail.content, date: activeMail.date }]).map((msg, idx) => {
                    const isMe = msg.from === 'My Account (Admin)';
                    return (
                       <div 
                         key={idx} 
                         style={{ 
                           padding: '24px', 
                           backgroundColor: isMe ? 'rgba(99, 102, 241, 0.03)' : 'var(--bg-card)', 
                           borderRadius: '18px', 
                           border: isMe ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid var(--border-color)',
                           alignSelf: isMe ? 'flex-end' : 'flex-start',
                           width: '90%',
                           boxShadow: 'var(--shadow-sm)'
                         }}
                       >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                  width: '32px', height: '32px', borderRadius: '50%', 
                                  backgroundColor: isMe ? 'var(--primary)' : 'var(--primary-light)', 
                                  color: isMe ? 'white' : 'var(--primary)', 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' 
                                }}>
                                   {msg.from.charAt(0)}
                                </div>
                                <div>
                                   <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>{msg.from}</span>
                                   {isMe && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '6px', fontWeight: 700 }}>(You)</span>}
                                </div>
                             </div>
                             <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{msg.date}</span>
                          </div>
                          <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-main)' }}>
                             {msg.content}
                          </div>
                       </div>
                    );
                 })}
              </div>

              {/* Quick Reply Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                 <button 
                   className="btn btn-primary" 
                   onClick={() => {
                     setComposeData({ to: activeMail.from, subject: `Re: ${activeMail.subject}`, content: '', label: activeMail.label, replyToId: activeMail.id });
                     setShowCompose(true);
                   }}
                   style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontWeight: 800 }}
                 >
                    Reply Message
                 </button>
              </div>
           </div>
         )}
      </div>

      {/* Compose Message Drawer Modal */}
      <AnimatePresence>
        {showCompose && (
           <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '36px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)' }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Compose New Message</h3>
                    <button onClick={() => setShowCompose(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                       <X size={20} />
                    </button>
                 </div>

                 <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>To (Recipient)</label>
                       <input 
                         required type="text" placeholder="e.g. Accounts Department, Admissions Office..." 
                         value={composeData.to} onChange={e => setComposeData({ ...composeData, to: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                       <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Subject</label>
                          <input 
                            required type="text" placeholder="Message subject..." 
                            value={composeData.subject} onChange={e => setComposeData({ ...composeData, subject: e.target.value })}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                          />
                       </div>
                       <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Category Label</label>
                          <select 
                            value={composeData.label} onChange={e => setComposeData({ ...composeData, label: e.target.value })}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                          >
                             <option>General</option>
                             <option>Admission</option>
                             <option>Finance</option>
                             <option>Admin</option>
                             <option>Library</option>
                          </select>
                       </div>
                    </div>

                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Message Body</label>
                       <textarea 
                         required placeholder="Write your message here..." rows={6}
                         value={composeData.content} onChange={e => setComposeData({ ...composeData, content: e.target.value })}
                         style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', resize: 'vertical', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 500 }}
                       />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                       <button type="button" onClick={() => setShowCompose(false)} className="btn" style={{ padding: '12px 24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                       <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', cursor: 'pointer' }}>
                          <Send size={18} /> Send Message
                       </button>
                    </div>
                 </form>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              backgroundColor: toast.type === 'success' ? '#10b98120' : '#ef444420', 
              color: toast.type === 'success' ? '#10b981' : '#ef4444', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
            {toast.action && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toast.action.onClick();
                  setToast(null);
                }}
                style={{
                  background: 'rgba(99, 102, 241, 0.25)',
                  border: 'none',
                  color: '#818cf8',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  transition: 'background 0.2s',
                  marginLeft: '8px',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.35)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.25)'}
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messaging;
