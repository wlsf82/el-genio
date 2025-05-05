export interface TestSuite {
  id: string;
  name: string;
  projectId: string;
  testCases: any[]; // TODO: Define proper test case type
  beforeEachSteps: any[]; // TODO: Define proper step type
  commandTimeout: number | null;
  createdAt: string;
  updatedAt: string;
}
