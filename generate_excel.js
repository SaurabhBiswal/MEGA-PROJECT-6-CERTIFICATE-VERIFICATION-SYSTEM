const XLSX = require('xlsx');

const data = [
    {
        studentName: 'Saurabh Biswal',
        internshipDomain: 'Full Stack Web Development',
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        email: 'punpunsaurabh2002@gmail.com'
    },
    {
        studentName: 'Rahul Sharma',
        internshipDomain: 'Data Science',
        startDate: '2025-02-01',
        endDate: '2025-07-31',
        email: 'rahul.sharma@example.com'
    },
    {
        studentName: 'Priya Patel',
        internshipDomain: 'UI/UX Design',
        startDate: '2025-03-01',
        endDate: '2025-08-31',
        email: 'priya.patel@example.com'
    },
    {
        studentName: 'Amit Singh',
        internshipDomain: 'Cyber Security',
        startDate: '2025-01-15',
        endDate: '2025-04-15',
        email: 'amit.singh@example.com'
    },
    {
        studentName: 'Sneha Gupta',
        internshipDomain: 'Cloud Computing',
        startDate: '2025-05-01',
        endDate: '2025-10-31',
        email: 'sneha.gupta@example.com'
    }
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Students");

XLSX.writeFile(wb, "Bulk_Upload_Test_Data.xlsx");
console.log("✅ Bulk_Upload_Test_Data.xlsx updated with correct keys!");
