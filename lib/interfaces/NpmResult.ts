export interface NpmResult {
  readonly deprecated?: string;
  readonly repository?: Repository;
}

interface Repository {
  readonly type?: string;
  readonly url?: string;
  readonly directory?: string;
}
