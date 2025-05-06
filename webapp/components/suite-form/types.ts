export type FormData = {
  name: string;
  command_timeout: string;
  test_cases: Array<{
    description: string;
    steps: Array<{
      command: string;
      selector: string;
      value: string;
      lengthValue: string;
      containedText: string;
      equalText: string;
    }>;
  }>;
};
