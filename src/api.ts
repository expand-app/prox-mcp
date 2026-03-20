import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(`GET request failed: ${error.message} - ${JSON.stringify(error.response?.data || {})}`);
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(`POST request failed: ${error.message} - ${JSON.stringify(error.response?.data || {})}`);
    }
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(`PATCH request failed: ${error.message} - ${JSON.stringify(error.response?.data || {})}`);
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`DELETE request failed: ${error.message} - ${JSON.stringify(error.response?.data || {})}`);
    }
  }
}
