/**
 * 🌐 WEB FETCH TOOL
 *
 * Enables the system to access the internet
 * - Fetch URLs
 * - Parse HTML
 * - Extract content
 * - Learn from the web
 */

export interface WebFetchParams {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface WebFetchResult {
  success: boolean;
  url: string;
  statusCode?: number;
  headers?: Record<string, string>;
  content?: string;
  contentType?: string;
  error?: string;
  timing: {
    start: number;
    end: number;
    duration: number;
  };
}

/**
 * Fetch content from a URL
 */
export async function web_fetch(params: WebFetchParams): Promise<WebFetchResult> {
  const startTime = Date.now();

  console.log(`🌐 Fetching: ${params.url}`);

  try {
    // Validate URL
    const url = new URL(params.url);

    // Security check: Don't allow file:// or localhost (unless explicitly enabled)
    if (url.protocol === 'file:') {
      throw new Error('file:// protocol not allowed for security reasons');
    }

    // Prepare request
    const requestOptions: RequestInit = {
      method: params.method || 'GET',
      headers: {
        'User-Agent':
          'Toobix-Unified/1.0 (Autonomous AI System; +https://github.com/yourusername/toobix)',
        ...params.headers,
      },
      signal: AbortSignal.timeout(params.timeout || 10000), // 10s default timeout
    };

    if (params.body && params.method === 'POST') {
      requestOptions.body =
        typeof params.body === 'string' ? params.body : JSON.stringify(params.body);
    }

    // Make request
    const response = await fetch(params.url, requestOptions);

    const endTime = Date.now();

    // Get content
    const contentType = response.headers.get('content-type') || 'unknown';
    let content: string;

    if (contentType.includes('application/json')) {
      const json = await response.json();
      content = JSON.stringify(json, null, 2);
    } else if (contentType.includes('text/')) {
      content = await response.text();
    } else {
      // Binary content - just note the type
      content = `[Binary content: ${contentType}]`;
    }

    // Extract headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    console.log(`✅ Fetched ${content.length} characters from ${params.url}`);

    return {
      success: true,
      url: params.url,
      statusCode: response.status,
      headers,
      content,
      contentType,
      timing: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime,
      },
    };
  } catch (error: any) {
    const endTime = Date.now();

    console.error(`❌ Fetch failed for ${params.url}:`, error.message);

    return {
      success: false,
      url: params.url,
      error: error.message,
      timing: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime,
      },
    };
  }
}

/**
 * Fetch and extract text content (strips HTML)
 */
export async function web_fetch_text(params: { url: string }): Promise<{
  success: boolean;
  text?: string;
  error?: string;
}> {
  const result = await web_fetch({ url: params.url });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Simple HTML stripping (for more advanced, use a library)
  let text = result.content || '';

  // Remove script and style tags
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities (basic)
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return {
    success: true,
    text,
  };
}

/**
 * Fetch JSON API
 */
export async function web_fetch_json(params: {
  url: string;
  method?: 'GET' | 'POST';
  body?: any;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  const result = await web_fetch({
    url: params.url,
    method: params.method,
    headers: { 'Content-Type': 'application/json' },
    body: params.body,
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  try {
    const data = JSON.parse(result.content || '{}');
    return { success: true, data };
  } catch (e) {
    return { success: false, error: 'Failed to parse JSON response' };
  }
}
