// Curated, standardized lists of colleges and departments to prevent fake/abbreviated registrations

export const DEPARTMENTS = [
  'Department of Information Technology',
  'Department of Computer Science and Engineering',
  'Department of Artificial Intelligence & Data Science',
  'Department of Electronics & Telecommunication Engineering',
  'Department of Electrical Engineering',
  'Department of Mechanical Engineering',
  'Department of Civil Engineering',
  'Department of Chemical Engineering',
  'Department of Instrumentation & Control Engineering',
  'Department of Mechatronics & Automation',
  'Department of Master of Computer Applications (MCA)',
  'Department of Master of Business Administration (MBA)',
  'Department of Basic Sciences & Humanities',
  'Other Department',
] as const;

export const POPULAR_COLLEGES = [
  'Rajarambapu Institute of Technology, Sangli, Maharashtra, India',
  'Chennai Institute of Technology, Chennai',
  'VSB Engineering College, Karur',
  'College of Engineering, Pune (COEP)',
  'Veermata Jijabai Technological Institute (VJTI), Mumbai',
  'Walchand College of Engineering, Sangli',
  'Vishwakarma Institute of Technology (VIT), Pune',
  'Pune Institute of Computer Technology (PICT), Pune',
  'P.E.S. Modern College of Engineering, Pune',
  'Cummins College of Engineering for Women, Pune',
  'D.Y. Patil College of Engineering, Akurdi, Pune',
  'Pimpri Chinchwad College of Engineering (PCCOE), Pune',
  "JSPM's Rajarshi Shahu College of Engineering, Pune",
  'Government College of Engineering, Karad',
  'Government College of Engineering, Aurangabad',
  'Sardar Patel Institute of Technology (SPIT), Mumbai',
  'K.J. Somaiya College of Engineering, Mumbai',
  'Thadomal Shahani Engineering College (TSEC), Mumbai',
  'Fr. Conceicao Rodrigues College of Engineering (CRCE), Mumbai',
  'Dwarkadas J. Sanghvi College of Engineering, Mumbai',
  'SRM Institute of Science and Technology, Chennai',
  'PSG College of Technology, Coimbatore',
  'Coimbatore Institute of Technology (CIT), Coimbatore',
  'Vellore Institute of Technology (VIT), Vellore',
  'Panimalar Engineering College, Chennai',
  'SSN College of Engineering, Chennai',
  'Sri Sivasubramaniya Nadar College of Engineering, Chennai',
  'Bannari Amman Institute of Technology, Sathyamangalam',
  'Thiagarajar College of Engineering, Madurai',
  'Kumaraguru College of Technology, Coimbatore',
  'GL Bajaj Institute of Technology and Management, Greater Noida',
  'Galgotias University, Greater Noida',
  'Noida Institute of Engineering and Technology (NIET), Greater Noida',
  'JSS Academy of Technical Education, Noida',
  'Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad',
  'KIET Group of Institutions, Ghaziabad',
  'Technocrats Institute of Technology, Bhopal',
  'Oriental Institute of Science and Technology, Bhopal',
  'Lakshmi Narain College of Technology (LNCT), Bhopal',
  'CMR College of Engineering and Technology, Hyderabad',
  'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
  'Vasavi College of Engineering, Hyderabad',
  'VNR Vignana Jyothi Institute of Engineering and Technology, Hyderabad',
  'Gokaraju Rangaraju Institute of Engineering and Technology, Hyderabad',
  'B.M.S. College of Engineering, Bengaluru',
  'M.S. Ramaiah Institute of Technology, Bengaluru',
  'R.V. College of Engineering (RVCE), Bengaluru',
  'PES University, Bengaluru',
  'Dayananda Sagar College of Engineering, Bengaluru',
  'Indian Institute of Technology Bombay (IIT Bombay)',
  'Indian Institute of Technology Delhi (IIT Delhi)',
  'Indian Institute of Technology Madras (IIT Madras)',
  'Indian Institute of Technology Kharagpur (IIT Kharagpur)',
  'Indian Institute of Technology Roorkee (IIT Roorkee)',
  'National Institute of Technology Karnataka, Surathkal (NITK)',
  'National Institute of Technology Tiruchirappalli (NITT)',
  'National Institute of Technology Warangal (NITW)',
  'Visvesvaraya National Institute of Technology, Nagpur (VNIT)',
  'Sardar Vallabhbhai National Institute of Technology, Surat (SVNIT)',
  'Birla Institute of Technology and Science, Pilani (BITS Pilani)',
  'Manipal Institute of Technology, Manipal',
  'Symbiosis Institute of Technology (SIT), Pune',
  'MIT World Peace University (MIT-WPU), Pune',
  'Bharati Vidyapeeth Deemed University College of Engineering, Pune',
  'Amity University',
  'Chandigarh University',
  'Lovely Professional University (LPU)',
  'Thapar Institute of Engineering and Technology, Patiala',
  'Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar',
  'Siksha \'O\' Anusandhan (SOA), Bhubaneswar',
  'Xavier Institute of Management (XIM University), Bhubaneswar',
] as const;

// Helper to validate custom college input against spam/abbreviations
export const isValidCollegeName = (name: string | null | undefined): { valid: boolean; reason?: string } => {
  if (!name || typeof name !== 'string') {
    return { valid: false, reason: 'College name is required.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 5) {
    return { valid: false, reason: 'College name must be at least 5 characters long.' };
  }
  const lower = trimmed.toLowerCase();
  const bannedKeywords = [
    'abc', 'xyz', 'test', 'demo', 'fake', 'none', 'na', 'n/a', 'asdf', 'qwerty', 
    '...', '---', 'other', 'unknown', 'invalid', 'dummy', 'null', 'nil', 'college',
    'cit', 'tki', 'aps', 'vsb', 'iitk', 'ycce', 'gla', 'iem', 'uem', 'siom', 'sfax'
  ];
  if (bannedKeywords.includes(lower) || /^[.\-_/\s]+$/.test(trimmed)) {
    return { valid: false, reason: 'Please select a valid, full college name from the official dropdown list.' };
  }
  return { valid: true };
};

// Helper to validate custom department input against spam/abbreviations
export const isValidDepartmentName = (name: string | null | undefined): { valid: boolean; reason?: string } => {
  if (!name || typeof name !== 'string') {
    return { valid: false, reason: 'Department name is required.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 3) {
    return { valid: false, reason: 'Department name must be at least 3 characters long.' };
  }
  const lower = trimmed.toLowerCase();
  const bannedKeywords = [
    'abc', 'xyz', 'test', 'demo', 'fake', 'none', 'na', 'n/a', 'asdf', 'qwerty',
    '...', '---', 'unknown', 'invalid', 'dummy', 'null', 'nil'
  ];
  if (bannedKeywords.includes(lower) || /^[.\-_/\s]+$/.test(trimmed)) {
    return { valid: false, reason: 'Please enter a valid department or branch name.' };
  }
  return { valid: true };
};
