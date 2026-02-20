export interface ClientOptions {
  apiUrl: string;
  secretKey: string;
}

export class ApiClient {
  private apiUrl: string;
  private secretKey: string;

  constructor(options: ClientOptions) {
    this.apiUrl = options.apiUrl.replace(/\/$/, "");
    this.secretKey = options.secretKey;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}/api/v1${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "page-secret-key": this.secretKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (res.status === 204) {
      return null as T;
    }

    const body = await res.json();

    if (!res.ok) {
      const message = body?.error?.message ?? `Request failed with status ${res.status}`;
      console.error(`Error: ${message}`);
      process.exit(1);
    }

    return body as T;
  }

  async listPosts(params: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.limit !== undefined) search.set("limit", String(params.limit));
    if (params.offset !== undefined)
      search.set("offset", String(params.offset));
    const qs = search.toString();
    return this.request(`/posts${qs ? `?${qs}` : ""}`);
  }

  async getPost(id: string) {
    return this.request(`/posts/${id}`);
  }

  async createPost(data: Record<string, unknown>) {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: string, data: Record<string, unknown>) {
    return this.request(`/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string) {
    return this.request(`/posts/${id}`, {
      method: "DELETE",
    });
  }
}
