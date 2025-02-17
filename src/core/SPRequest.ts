import * as util from 'util';
import * as spauth from 'node-sp-auth';
import * as crypto from 'crypto';
//import * as https from 'https';
import request, { KyResponse } from 'ky';

import { Cache } from './utils/Cache';
import { ISPRequest, ISPRequestOptions, SPRequestMethod } from './types';

export const requestDigestCache: Cache = new Cache();

// const isUrlHttps: any = (url: string): boolean => {
//   return url.split('://')[0].toLowerCase() === 'https';
// };

export function create(credentials?: spauth.IAuthOptions): ISPRequest {
  // const agent: https.Agent = new https.Agent({
  //   rejectUnauthorized: false,
  //   keepAlive: true,
  //   keepAliveMsecs: 10000
  // });

  const coreRequest = async ({ url, ...options }: ISPRequestOptions): Promise<KyResponse<any>> => {
    options.throwHttpErrors = true;
    options.headers = options.headers || {};

    options.headers = Object.assign(
      {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      },
      options.headers
    );

    const additionalHeadersStr: string = process.env['_sp_request_headers'];
    if (additionalHeadersStr) {
      Object.assign(options.headers, JSON.parse(additionalHeadersStr));
    }
    options = Object.assign<ISPRequestOptions, ISPRequestOptions>(
      {
        responseType: 'json',
        resolveBodyOnly: false,
        // rejectUnauthorized: false,
        // retry: 0
      },
      options
    );

    const data = await spauth.getAuth(url, credentials);
    Object.assign(options.headers, data.headers);
    Object.assign(options, data.options);

    return await request(url, options);
    // if (options.resolveBodyOnly) {
    //   if (options.responseType === 'json') {
    //     return await request(url, options).json();
    //     // options.json = options.body as any;
    //     // options.body = undefined;
    //   }
    //   else if (options.responseType === 'buffer') {
    //     return await request(url, options).arrayBuffer();
    //   }

    //   return await request(url, options).text();
    // } else {
    //   const kyResponse = await request(url, options);
    //   return {
    //     body: options.responseType === 'json'
    //       ? await kyResponse.json()
    //       : options.responseType === 'buffer'
    //         ? await kyResponse.arrayBuffer()
    //         : await kyResponse.text(),
    //     ...kyResponse
    //   };
    // }
  };

  const spRequestFunc: SPRequestMethod = ((url: string | ISPRequestOptions, options?: ISPRequestOptions) => {
    if (typeof url === 'string') {
      options = {
        url,
        ...options,
      };
    } else {
      options = {
        ...url,
        ...options,
      };
    }

    if (!options.method) {
      options.method = 'get';
    }

    return coreRequest(options);
  }) as SPRequestMethod;

  (spRequestFunc as ISPRequest).requestDigest = async (siteUrl: string): Promise<string> => {
    const url: string = siteUrl.replace(/\/$/, '');
    const cacheKey: string = crypto
      .createHash('md5')
      .update(util.format('%s@%s', url, JSON.stringify(credentials)))
      .digest('hex');
    const cachedDigest: string = requestDigestCache.get<string>(cacheKey);

    if (cachedDigest) {
      return cachedDigest;
    }

    const response = await (spRequestFunc as ISPRequest).post<any>(`${url}/_api/contextinfo`, { responseType: 'json' });
    const data = await response.json();
    const digest: string = data.d.GetContextWebInformation.FormDigestValue;
    const timeout: number = parseInt(data.d.GetContextWebInformation.FormDigestTimeoutSeconds, 10);
    requestDigestCache.set(cacheKey, digest, timeout - 30);
    return digest;
  };

  ['get', 'post', 'put', 'patch', 'head', 'delete'].forEach((method: string) => {
    spRequestFunc[method] = (
      url: string | ISPRequestOptions,
      options?: ISPRequestOptions
    ): ReturnType<typeof spRequestFunc> => spRequestFunc(url as any, { ...options, method } as any);
  });

  return spRequestFunc as ISPRequest;
}
