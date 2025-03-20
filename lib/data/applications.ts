export type Application = {
  id: string
  userId: string
  fundingId: string
  fundingName: string
  status: "pending" | "approved" | "rejected"
  appliedAt: string
  updatedAt?: string
  amountRequested: number
  amountApproved?: number
  fullName: string
  email: string
  phone?: string
  address?: string
  projectTitle: string
  projectDescription: string
  timeline?: string
  goals?: string
  additionalInfo?: string
  feedback?: string
}

// Mock data for now - in a real app, this would fetch from your database
const mockApplications: Application[] = [
  {
    id: "app-1",
    userId: "user-1",
    fundingId: "fund-1",
    fundingName: "Small Business Grant",
    status: "approved",
    appliedAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-09-25T14:20:00Z",
    amountRequested: 5000,
    amountApproved: 4500,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    projectTitle: "Eco-Friendly Packaging Initiative",
    projectDescription:
      "Implementing sustainable packaging solutions for my small business to reduce environmental impact and meet growing customer demand for eco-friendly options.",
    timeline: "3 months",
    goals: "- Reduce plastic usage by 75%\n- Implement compostable packaging\n- Educate customers on recycling options",
    feedback: "Strong proposal with clear environmental benefits. Approved with slight budget adjustment.",
  },
  {
    id: "app-2",
    userId: "user-1",
    fundingId: "fund-2",
    fundingName: "Technology Innovation Fund",
    status: "pending",
    appliedAt: "2023-10-05T09:15:00Z",
    amountRequested: 12000,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    projectTitle: "AI-Powered Customer Service Tool",
    projectDescription:
      "Developing an AI tool that can help small businesses provide 24/7 customer service without requiring additional staff.",
    timeline: "6 months",
    goals: "Create a prototype that can handle basic customer inquiries and integrate with existing systems.",
  },
  {
    id: "app-3",
    userId: "user-1",
    fundingId: "fund-3",
    fundingName: "Community Development Grant",
    status: "rejected",
    appliedAt: "2023-08-20T11:45:00Z",
    updatedAt: "2023-09-01T16:30:00Z",
    amountRequested: 8000,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    projectTitle: "Neighborhood Beautification Project",
    projectDescription: "Organizing a community initiative to revitalize public spaces in underserved neighborhoods.",
    feedback:
      "While the project has merit, it falls outside our current funding priorities. We encourage you to apply for our Community Arts grant instead.",
  },
]

export async function getUserApplications(): Promise<Application[]> {
  // In a real app, you would fetch from your database
  // const applications = await db.application.findMany({
  //   where: { userId: "current-user-id" },
  //   orderBy: { appliedAt: "desc" }
  // })

  return mockApplications
}

export async function getApplicationById(id: string): Promise<Application | null> {
  // In a real app, you would fetch from your database
  // const application = await db.application.findUnique({
  //   where: { id }
  // })

  const application = mockApplications.find((app) => app.id === id)
  return application || null
}

