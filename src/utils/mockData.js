// Mock data for preview mode
export const mockUsers = [
  {
    _id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    firstname: 'John',
    lastname: 'Doe',
    role: 'student',
  },
  {
    _id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    firstname: 'Jane',
    lastname: 'Smith',
    role: 'staff',
  },
  {
    _id: '3',
    username: 'admin',
    email: 'admin@qsolve.com',
    firstname: 'Admin',
    lastname: 'User',
    role: 'admin',
  },
];

export const mockSubjects = [
  { _id: '1', subject: 'Mathematics' },
  { _id: '2', subject: 'Physics' },
  { _id: '3', subject: 'Chemistry' },
  { _id: '4', subject: 'Computer Science' },
];

export const mockSemesters = [
  { _id: '1', semester: 'Semester 1' },
  { _id: '2', semester: 'Semester 2' },
  { _id: '3', semester: 'Semester 3' },
  { _id: '4', semester: 'Semester 4' },
];

export const mockDepartments = [
  { _id: '1', department: 'Engineering' },
  { _id: '2', department: 'Science' },
  { _id: '3', department: 'Arts' },
];

export const mockQuestionBanks = [
  {
    _id: '1',
    title: 'Calculus 2024',
    description: 'Complete calculus question bank for 2024',
    semesterID: { _id: '1', semester: 'Semester 1' },
    subjectID: { _id: '1', subject: 'Mathematics' },
    fileUrl: 'https://example.com/calculus.pdf',
  },
  {
    _id: '2',
    title: 'Physics Mechanics',
    description: 'Mechanics problems and solutions',
    semesterID: { _id: '2', semester: 'Semester 2' },
    subjectID: { _id: '2', subject: 'Physics' },
    fileUrl: 'https://example.com/physics.pdf',
  },
];

export const mockBundles = [
  {
    _id: '1',
    title: 'Engineering Bundle 1',
    departmentID: { _id: '1', department: 'Engineering' },
    price: 29.99,
    products: [mockQuestionBanks[0], mockQuestionBanks[1]],
  },
  {
    _id: '2',
    title: 'Science Complete Pack',
    departmentID: { _id: '2', department: 'Science' },
    price: 49.99,
    products: [mockQuestionBanks[1]],
  },
];

export const mockPurchases = [
  {
    _id: '1',
    userId: mockUsers[0],
    bundleId: mockBundles[0],
    paymentDone: true,
  },
  {
    _id: '2',
    userId: mockUsers[1],
    bundleId: mockBundles[1],
    paymentDone: false,
  },
];