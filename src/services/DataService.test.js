import DataService from './DataService';
import axios from 'axios';

jest.mock('axios');

describe('DataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches LinkedIn data successfully', async () => {
    const mockData = { name: 'Asifur Rahman', skills: [] };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await DataService.getLinkedInData();
    expect(result).toEqual(mockData);
  });

  it('handles errors when fetching data', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(DataService.getLinkedInData()).rejects.toThrow('Network error');
  });
}); 