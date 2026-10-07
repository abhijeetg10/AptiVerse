export interface College {
  id: string;
  name: string;
  aliases: string[];
  city: string;
  state: string;
}

// This is a sample dataset. For production, you can replace this array 
// with a full JSON download of all 40,000+ Indian colleges.
export const collegeData: College[] = [
  {
    id: "cit_001",
    name: "Chennai Institute of Technology",
    aliases: ["CIT", "CIT Chennai", "CIT, Chennai", "Chennai Institute of Tech"],
    city: "Chennai",
    state: "Tamil Nadu"
  },
  {
    id: "iitm_001",
    name: "Indian Institute of Technology Madras",
    aliases: ["IITM", "IIT Madras", "IIT, Madras", "IIT-M"],
    city: "Chennai",
    state: "Tamil Nadu"
  },
  {
    id: "iitd_001",
    name: "Indian Institute of Technology Delhi",
    aliases: ["IITD", "IIT Delhi", "IIT, Delhi", "IIT-D"],
    city: "New Delhi",
    state: "Delhi"
  },
  {
    id: "iitb_001",
    name: "Indian Institute of Technology Bombay",
    aliases: ["IITB", "IIT Bombay", "IIT, Bombay", "IIT-B"],
    city: "Mumbai",
    state: "Maharashtra"
  },
  {
    id: "nit_t_001",
    name: "National Institute of Technology Tiruchirappalli",
    aliases: ["NITT", "NIT Trichy", "NIT, Trichy", "NIT-T"],
    city: "Tiruchirappalli",
    state: "Tamil Nadu"
  },
  {
    id: "bits_001",
    name: "Birla Institute of Technology and Science, Pilani",
    aliases: ["BITS", "BITS Pilani", "BITS, Pilani", "Birla Institute of Tech"],
    city: "Pilani",
    state: "Rajasthan"
  },
  {
    id: "vit_001",
    name: "Vellore Institute of Technology",
    aliases: ["VIT", "VIT Vellore", "VIT, Vellore"],
    city: "Vellore",
    state: "Tamil Nadu"
  },
  {
    id: "srm_001",
    name: "SRM Institute of Science and Technology",
    aliases: ["SRM", "SRM University", "SRM Chennai"],
    city: "Chennai",
    state: "Tamil Nadu"
  },
  {
    id: "anna_001",
    name: "Anna University",
    aliases: ["CEG", "College of Engineering Guindy", "AU", "Anna Univ"],
    city: "Chennai",
    state: "Tamil Nadu"
  },
  {
    id: "psg_001",
    name: "PSG College of Technology",
    aliases: ["PSG", "PSG Tech", "PSG Coimbatore"],
    city: "Coimbatore",
    state: "Tamil Nadu"
  }
];
