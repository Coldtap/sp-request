import { KyInstance, Options, ResponsePromise } from 'ky';

type HTTPAlias = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete';
type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;
type Merge<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;

declare type OptionsOfTextResponseBody = Merge<
  ISPRequestOptions,
  {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType: 'text';
  }
>;
declare type OptionsOfJSONResponseBody = Merge<
  ISPRequestOptions,
  {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType: 'json';
  }
>;
declare type OptionsOfBufferResponseBody = Merge<
  ISPRequestOptions,
  {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType: 'buffer';
  }
>;
declare type ResponseBodyOnly = {
  resolveBodyOnly: true;
};

export interface SPRequestMethod {
  <T = any>(url: string | OptionsOfJSONResponseBody, options?: OptionsOfJSONResponseBody): ResponsePromise<T>;
  (url: string | OptionsOfTextResponseBody, options?: OptionsOfTextResponseBody): ResponsePromise<string>;
  (url: string | OptionsOfBufferResponseBody, options?: OptionsOfBufferResponseBody): ResponsePromise<Buffer>;
  <T = any>(
    url: string | Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>,
    options?: Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>
  ): ResponsePromise<T>;
  (
    url: string | Merge<OptionsOfTextResponseBody, ResponseBodyOnly>,
    options?: Merge<OptionsOfTextResponseBody, ResponseBodyOnly>
  ): ResponsePromise<string>;
  (
    url: string | Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>,
    options?: Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>
  ): ResponsePromise<Buffer>;
  <T = any>(
    url: string | Merge<ISPRequestOptions, { body?: any; resolveBodyOnly: true }>,
    options?: Merge<ISPRequestOptions, { body?: any; resolveBodyOnly: true }>
  ): ResponsePromise<T>;
  <T = any>(
    url: string | Merge<ISPRequestOptions, { body?: any }>,
    options?: Merge<ISPRequestOptions, { body?: any }>
  ): ResponsePromise<T>;
}

export interface ISPRequest extends KyInstance {
  requestDigest: (url: string) => Promise<string>;
}

export interface ISPRequestOptions extends Options {
  url?: string;
  responseType?: string;
  resolveBodyOnly?: boolean;
}
