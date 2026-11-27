import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';

dotenv.config();

interface SubscriberRecord {
  email: string;
  sourcePage: string;
  subscribedAt: string;
}

interface ArticleRecord {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage?: string;
  coverCaption?: string;
  readTime: string;
  author: string;
  publishedAt: string;
}

interface PodcastRecord {
  id: string;
  videoId: string;
  youtubeUrl: string;
  title: string;
  topic: string;
  description: string;
  duration: string;
  publishedAt: string;
}

interface AuthorAuthRecord {
  salt: string;
  hash: string;
  createdAt: string;
}

interface ResumeMetaRecord {
  originalName: string;
  storedName: 'resume-uploaded.pdf' | 'resume-uploaded.docx';
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const PUBLIC_DATA_DIR = path.resolve(process.cwd(), 'public', 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'newsletter-subscribers.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const PUBLIC_ARTICLES_FILE = path.join(PUBLIC_DATA_DIR, 'articles.json');
const PODCASTS_FILE = path.join(DATA_DIR, 'podcasts.json');
const PUBLIC_PODCASTS_FILE = path.join(PUBLIC_DATA_DIR, 'podcasts.json');
const AUTHOR_AUTH_FILE = path.join(DATA_DIR, 'author-auth.json');
const RESUME_META_FILE = path.join(DATA_DIR, 'resume-meta.json');
const MAX_RESUME_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_STR_LEN = 1_500_000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{4,64}$/;
const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const SAFE_DATA_IMAGE_REGEX = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i;
const ALLOWED_YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
]);

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 10;

const activeSessions = new Map<string, number>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

let subscriberWriteQueue: Promise<void> = Promise.resolve();
let articleWriteQueue: Promise<void> = Promise.resolve();
let podcastWriteQueue: Promise<void> = Promise.resolve();
let authSetupQueue: Promise<void> = Promise.resolve();
let resumeWriteQueue: Promise<void> = Promise.resolve();

const SEED_ARTICLES: ArticleRecord[] = [
  {
    id: 'seed-agentic-ai-telecom-noc',
    title: 'From Heuristic Rules to Agentic AI in Autonomous Telecom NOCs',
    category: 'Agentic AI',
    summary:
      'Why static correlation rules break down across disaggregated 5G cores and how multi-agent LLM orchestrators reduce Mean Time To Repair by over 65%.',
    coverImage: 'assets/images/telecom_5g_hero_1786021255925.jpg',
    coverCaption: 'Multi-agent NOC orchestration bridging 5G telemetry streams and closed-loop RCA automation.',
    content:
      'Legacy Network Operations Centers rely heavily on brittle, static threshold rules and manual runbooks. As operators transition to cloud-native 5G Standalone cores and multi-vendor Open RAN topologies, alarm volume grows exponentially while root causes span radio, transport, and Kubernetes infrastructure simultaneously.\n\n## Multi-Agent Telemetry & Reasoning Pipeline\n\nAn Agentic AI architecture pairs streaming telemetry ingestion (Kafka and Prometheus) with specialized reasoning agents: a Topology Correlation Agent, a 3GPP Specification Retrieval Agent backed by RAG, and a Policy-Checked Remediation Agent.\n\n[IMAGE_PLACEHOLDER: Multi-Agent Telecom NOC Reference Architecture | Replace with final sequence diagram illustrating Kafka telemetry ingestion -> RAG 3GPP Agent -> Closed-Loop NETCONF Remediation]\n\n## Closed-Loop Guardrails & Production Impact\n\nInstead of flooding Tier-2 engineers with thousands of raw syslog events, the orchestrator synthesizes a grounded Root Cause Analysis brief with exact 3GPP clause citations and executes pre-approved closed-loop actions via NETCONF/YANG under strict human-in-the-loop guardrails.',
    tags: ['Agentic AI', 'NOC Automation', 'RAG', '3GPP'],
    readTime: '6 min read',
    author: 'Pradeep Dhote',
    publishedAt: '2026-10-18T14:30:00.000Z',
  },
  {
    id: 'seed-private-5g-urllc-blueprint',
    title: 'Architecting Enterprise Private 5G Standalone with URLLC Network Slicing',
    category: 'Private 5G',
    summary:
      'A practical execution framework for CBRS spectrum planning, deterministic sub-5ms slicing, and Zero-Trust SIM security across automated manufacturing sites.',
    coverImage: 'assets/images/telecom_5g_hero_1786021255925.jpg',
    coverCaption: 'Industrial Private 5G SA deployment topology with local edge UPF breakout.',
    content:
      'Industrial automation demands deterministic wireless connectivity that Wi-Fi often struggles to sustain under high RF interference and rapid mobility. Private 5G Standalone (SA) solves this through dedicated gNodeB scheduling, local User Plane Function (UPF) breakout, and end-to-end network slicing.\n\n[IMAGE: assets/images/telecom_5g_hero_1786021255925.jpg | Reference Topology: Enterprise Private 5G Standalone Edge UPF & RAN Slicing]\n\n## Three Core Architecture Pillars\n\nKey architectural pillars include: 1) RF propagation modeling for indoor metal-dense environments using CBRS Band 48; 2) Deploying edge UPF nodes on-premises to keep latency under 5 milliseconds for AGVs and robotic arms; and 3) Enforcing Zero-Trust device identity using eSIM / physical UICC authentication tied directly to enterprise IAM.\n\n[IMAGE_PLACEHOLDER: Sub-5ms URLLC Slice Latency Benchmark Chart | Reference placeholder for plant floor RF coverage & packet delay budget comparison]\n\nWhen governed under a hybrid PMP and SAFe delivery cadence, multi-site enterprise rollouts achieve predictable capex predictability and seamless IT/OT convergence.',
    tags: ['Private 5G', 'URLLC', 'CBRS', 'Edge UPF'],
    readTime: '5 min read',
    author: 'Pradeep Dhote',
    publishedAt: '2026-09-29T10:15:00.000Z',
  },
  {
    id: 'seed-oran-near-rt-ric-energy',
    title: 'Open RAN Near-RT RIC: Custom xApps for Dynamic Cell Energy Optimization',
    category: 'Open RAN',
    summary:
      'Designing E2-interface connected xApps that forecast regional traffic dips and safely orchestrate carrier sleep states without degrading KPI SLAs.',
    content:
      'Radio Access Networks account for over 70% of a mobile operator energy footprint. Within the O-RAN Alliance architecture, the Near-Real-Time RAN Intelligent Controller (Near-RT RIC) opens a standardized E2 control loop operating between 10ms and 1s.\n\n[IMAGE_PLACEHOLDER: O-RAN Near-RT RIC E2 Control Loop Diagram | Reference placeholder illustrating Non-RT RIC rApp policy -> Near-RT RIC Energy Saving xApp -> O-DU / O-RU sleep control]\n\n## Forecasting Load & Policy Guardrails\n\nBy training lightweight time-series forecasting models on PRB utilization and handover telemetry, a custom Energy Saving xApp can identify low-traffic corridors during off-peak hours and selectively place MIMO layers or secondary carriers into micro-sleep states.\n\nCrucially, policy guardrails ensure immediate wake-up triggers whenever active UE throughput or RACH load crosses safety thresholds, achieving 18% to 24% RAN power savings with zero measurable drop in call setup success rate.',
    tags: ['O-RAN', 'Near-RT RIC', 'xApps', 'Green 5G'],
    readTime: '5 min read',
    author: 'Pradeep Dhote',
    publishedAt: '2026-08-14T16:00:00.000Z',
  },
];

function getEnvAuthorPasscode(): string {
  return (process.env.AUTHOR_PASSCODE || '').trim();
}

function sha256Buffer(value: string): Buffer {
  return crypto.createHash('sha256').update(value, 'utf8').digest();
}

function hashPasscodeScrypt(passcode: string, salt: string): Buffer {
  return crypto.scryptSync(passcode, salt, 64);
}

async function readAuthorAuth(): Promise<AuthorAuthRecord | null> {
  try {
    const raw = await fs.readFile(AUTHOR_AUTH_FILE, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as AuthorAuthRecord).salt === 'string' &&
      typeof (parsed as AuthorAuthRecord).hash === 'string'
    ) {
      return parsed as AuthorAuthRecord;
    }
    return null;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

function issueSessionToken(): { token: string; expiresInSeconds: number } {
  const now = Date.now();
  for (const [existingToken, expiry] of activeSessions.entries()) {
    if (expiry <= now) {
      activeSessions.delete(existingToken);
    }
  }
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, now + SESSION_TTL_MS);
  return { token, expiresInSeconds: Math.floor(SESSION_TTL_MS / 1000) };
}

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : null;
}

function requireAuthorAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Author authentication is required for this action.' });
    return;
  }
  const expiry = activeSessions.get(token);
  if (!expiry || expiry <= Date.now()) {
    activeSessions.delete(token);
    res.status(401).json({ error: 'Author session expired. Please unlock Author Studio again.' });
    return;
  }
  next();
}

function getClientIpKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function checkLoginRateLimit(ipKey: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ipKey);
  if (!entry || entry.resetAt <= now) {
    return true;
  }
  return entry.count < MAX_LOGIN_FAILURES;
}

function recordLoginFailure(ipKey: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ipKey);
  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(ipKey, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearLoginFailures(ipKey: string): void {
  loginAttempts.delete(ipKey);
}

async function readJsonArrayFile<T>(filePath: string): Promise<T[] | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

async function writeJsonAtomic(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempFile = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tempFile, filePath);
}

function sanitizeArticleImageUrl(rawValue: unknown): string | undefined {
  if (typeof rawValue !== 'string') return undefined;
  const trimmed = rawValue.trim();
  if (!trimmed || trimmed.length > MAX_IMAGE_STR_LEN) return undefined;

  if (SAFE_DATA_IMAGE_REGEX.test(trimmed)) {
    return trimmed;
  }
  if (/^(assets\/images\/|\/assets\/images\/)[a-zA-Z0-9._/-]+$/.test(trimmed)) {
    return trimmed.replace(/^\//, '');
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    return undefined;
  }
  return undefined;
}

async function readSubscribers(): Promise<SubscriberRecord[]> {
  const records = await readJsonArrayFile<SubscriberRecord>(SUBSCRIBERS_FILE);
  if (!records) return [];
  return records.filter(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.email === 'string' &&
      typeof item.subscribedAt === 'string'
  );
}

async function persistSubscriber(
  email: string,
  sourcePage: string
): Promise<{ status: 'subscribed' | 'already_subscribed' }> {
  let resultStatus: 'subscribed' | 'already_subscribed' = 'subscribed';

  const task = subscriberWriteQueue.then(async () => {
    const existing = await readSubscribers();
    const alreadyExists = existing.some((record) => record.email.toLowerCase() === email);

    if (alreadyExists) {
      resultStatus = 'already_subscribed';
      return;
    }

    const updated: SubscriberRecord[] = [
      ...existing,
      {
        email,
        sourcePage,
        subscribedAt: new Date().toISOString(),
      },
    ];

    await writeJsonAtomic(SUBSCRIBERS_FILE, updated);
    resultStatus = 'subscribed';
  });

  subscriberWriteQueue = task.catch(() => undefined);
  await task;
  return { status: resultStatus };
}

async function syncPublicArticles(list: ArticleRecord[]): Promise<void> {
  await writeJsonAtomic(PUBLIC_ARTICLES_FILE, list).catch(() => undefined);
}

async function syncPublicPodcasts(list: PodcastRecord[]): Promise<void> {
  await writeJsonAtomic(PUBLIC_PODCASTS_FILE, list).catch(() => undefined);
}

async function getArticles(): Promise<ArticleRecord[]> {
  const existing = await readJsonArrayFile<ArticleRecord>(ARTICLES_FILE);
  if (existing === null) {
    const task = articleWriteQueue.then(async () => {
      const checkAgain = await readJsonArrayFile<ArticleRecord>(ARTICLES_FILE);
      if (checkAgain === null) {
        await writeJsonAtomic(ARTICLES_FILE, SEED_ARTICLES);
        await syncPublicArticles(SEED_ARTICLES);
      }
    });
    articleWriteQueue = task.catch(() => undefined);
    await task;
    return [...SEED_ARTICLES].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
  return [...existing].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function createArticle(input: {
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage?: string;
  coverCaption?: string;
}): Promise<ArticleRecord> {
  const wordCount = input.content
    .replace(/\[IMAGE(?:_PLACEHOLDER)?:[^\]]+\]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  const newArticle: ArticleRecord = {
    id: `art_${crypto.randomUUID()}`,
    title: input.title,
    category: input.category,
    summary: input.summary,
    content: input.content,
    tags: input.tags,
    ...(input.coverImage ? { coverImage: input.coverImage } : {}),
    ...(input.coverCaption ? { coverCaption: input.coverCaption } : {}),
    readTime: `${minutes} min read`,
    author: 'Pradeep Dhote',
    publishedAt: new Date().toISOString(),
  };

  const task = articleWriteQueue.then(async () => {
    const current = await getArticles();
    const updated = [newArticle, ...current];
    await writeJsonAtomic(ARTICLES_FILE, updated);
    await syncPublicArticles(updated);
  });

  articleWriteQueue = task.catch(() => undefined);
  await task;
  return newArticle;
}

async function deleteArticleById(id: string): Promise<boolean> {
  let deleted = false;
  const task = articleWriteQueue.then(async () => {
    const current = await getArticles();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length !== current.length) {
      await writeJsonAtomic(ARTICLES_FILE, filtered);
      await syncPublicArticles(filtered);
      deleted = true;
    }
  });

  articleWriteQueue = task.catch(() => undefined);
  await task;
  return deleted;
}

function extractYouTubeVideoId(rawUrl: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_YOUTUBE_HOSTS.has(host)) {
    return null;
  }

  let candidateId: string | null = null;

  if (host === 'youtu.be') {
    const segment = parsed.pathname.split('/').filter(Boolean)[0];
    candidateId = segment || null;
  } else {
    const vParam = parsed.searchParams.get('v');
    if (vParam) {
      candidateId = vParam;
    } else {
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (
        segments.length >= 2 &&
        (segments[0] === 'embed' || segments[0] === 'shorts' || segments[0] === 'live')
      ) {
        candidateId = segments[1];
      }
    }
  }

  if (!candidateId || !YOUTUBE_VIDEO_ID_REGEX.test(candidateId)) {
    return null;
  }

  return candidateId;
}

async function getPodcasts(): Promise<PodcastRecord[]> {
  const existing = await readJsonArrayFile<PodcastRecord>(PODCASTS_FILE);
  if (existing === null) {
    return [];
  }
  return [...existing].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function createPodcast(input: {
  videoId: string;
  title: string;
  topic: string;
  description: string;
  duration: string;
}): Promise<PodcastRecord> {
  const newPodcast: PodcastRecord = {
    id: `pod_${crypto.randomUUID()}`,
    videoId: input.videoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${input.videoId}`,
    title: input.title,
    topic: input.topic,
    description: input.description,
    duration: input.duration || 'Video Episode',
    publishedAt: new Date().toISOString(),
  };

  const task = podcastWriteQueue.then(async () => {
    const current = await getPodcasts();
    const updated = [newPodcast, ...current];
    await writeJsonAtomic(PODCASTS_FILE, updated);
    await syncPublicPodcasts(updated);
  });

  podcastWriteQueue = task.catch(() => undefined);
  await task;
  return newPodcast;
}

async function deletePodcastById(id: string): Promise<boolean> {
  let deleted = false;
  const task = podcastWriteQueue.then(async () => {
    const current = await getPodcasts();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length !== current.length) {
      await writeJsonAtomic(PODCASTS_FILE, filtered);
      await syncPublicPodcasts(filtered);
      deleted = true;
    }
  });

  podcastWriteQueue = task.catch(() => undefined);
  await task;
  return deleted;
}

function sanitizeResumeDisplayName(rawHeader: unknown, fallbackExt: '.pdf' | '.docx'): string {
  let decoded = '';
  if (typeof rawHeader === 'string' && rawHeader.trim().length > 0) {
    try {
      decoded = decodeURIComponent(rawHeader.trim());
    } catch {
      decoded = rawHeader.trim();
    }
  }
  const base = path.basename(decoded).replace(/[^a-zA-Z0-9._ -]/g, '_').trim();
  const stem = base.replace(/\.(pdf|docx)$/i, '').replace(/^[._-]+|[._-]+$/g, '').slice(0, 90);
  return `${stem || 'Pradeep_Dhote_Executive_Resume'}${fallbackExt}`;
}

function detectAllowedResumeFormat(
  buf: Buffer,
  rawName: string
): { storedName: 'resume-uploaded.pdf' | 'resume-uploaded.docx'; ext: '.pdf' | '.docx'; mimeType: string } | null {
  if (buf.length < 5 || buf.length > MAX_RESUME_BYTES) return null;

  // PDF magic bytes: %PDF-
  if (buf.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    return {
      storedName: 'resume-uploaded.pdf',
      ext: '.pdf',
      mimeType: 'application/pdf',
    };
  }

  // DOCX magic bytes: PK\x03\x04 and .docx extension
  const isZipHeader = buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04;
  if (isZipHeader && /\.docx$/i.test(rawName)) {
    return {
      storedName: 'resume-uploaded.docx',
      ext: '.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }

  return null;
}

async function readResumeMeta(): Promise<ResumeMetaRecord | null> {
  try {
    const raw = await fs.readFile(RESUME_META_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ResumeMetaRecord> | null;
    if (
      !parsed ||
      (parsed.storedName !== 'resume-uploaded.pdf' && parsed.storedName !== 'resume-uploaded.docx') ||
      typeof parsed.originalName !== 'string' ||
      typeof parsed.mimeType !== 'string' ||
      typeof parsed.sizeBytes !== 'number'
    ) {
      return null;
    }

    const filePath = path.join(DATA_DIR, parsed.storedName);
    try {
      await fs.access(filePath);
    } catch {
      return null;
    }

    return {
      originalName: parsed.originalName,
      storedName: parsed.storedName,
      mimeType: parsed.mimeType,
      sizeBytes: parsed.sizeBytes,
      uploadedAt: typeof parsed.uploadedAt === 'string' ? parsed.uploadedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function saveUploadedResume(
  fileBuffer: Buffer,
  rawName: string,
  format: { storedName: 'resume-uploaded.pdf' | 'resume-uploaded.docx'; ext: '.pdf' | '.docx'; mimeType: string }
): Promise<ResumeMetaRecord> {
  const safeOriginalName = sanitizeResumeDisplayName(rawName, format.ext);
  const record: ResumeMetaRecord = {
    originalName: safeOriginalName,
    storedName: format.storedName,
    mimeType: format.mimeType,
    sizeBytes: fileBuffer.length,
    uploadedAt: new Date().toISOString(),
  };

  const task = resumeWriteQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const targetPath = path.join(DATA_DIR, format.storedName);
    const tmpFilePath = `${targetPath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
    await fs.writeFile(tmpFilePath, fileBuffer);
    await fs.rename(tmpFilePath, targetPath);

    const otherStoredName =
      format.storedName === 'resume-uploaded.pdf' ? 'resume-uploaded.docx' : 'resume-uploaded.pdf';
    await fs.unlink(path.join(DATA_DIR, otherStoredName)).catch(() => undefined);
    await writeJsonAtomic(RESUME_META_FILE, record);
  });

  resumeWriteQueue = task.catch(() => undefined);
  await task;
  return record;
}

async function deleteUploadedResume(): Promise<boolean> {
  let deleted = false;
  const task = resumeWriteQueue.then(async () => {
    const existing = await readResumeMeta();
    if (existing) deleted = true;
    await fs.unlink(path.join(DATA_DIR, 'resume-uploaded.pdf')).catch(() => undefined);
    await fs.unlink(path.join(DATA_DIR, 'resume-uploaded.docx')).catch(() => undefined);
    await fs.unlink(RESUME_META_FILE).catch(() => undefined);
  });

  resumeWriteQueue = task.catch(() => undefined);
  await task;
  return deleted;
}

async function startServer(): Promise<void> {
  const app = express();
  const smallJsonParser = express.json({ limit: '64kb' });
  const articleJsonParser = express.json({ limit: '3mb' });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/articles' && req.method === 'POST') {
      articleJsonParser(req, res, next);
      return;
    }
    smallJsonParser(req, res, next);
  });

  /* ---------- Newsletter Subscription ---------- */
  app.post('/api/newsletter/subscribe', async (req: Request, res: Response) => {
    const body = req.body as { email?: unknown; sourcePage?: unknown } | undefined;

    if (!body || typeof body.email !== 'string') {
      res.status(400).json({
        error: 'Please enter a valid work or corporate email address.',
      });
      return;
    }

    const normalizedEmail = body.email.trim().toLowerCase();
    if (
      normalizedEmail.length === 0 ||
      normalizedEmail.length > 254 ||
      !EMAIL_REGEX.test(normalizedEmail)
    ) {
      res.status(400).json({
        error: 'Please enter a valid work or corporate email address.',
      });
      return;
    }

    const sourcePage =
      typeof body.sourcePage === 'string' && body.sourcePage.trim().length > 0
        ? body.sourcePage.trim().slice(0, 120)
        : '/';

    try {
      const result = await persistSubscriber(normalizedEmail, sourcePage);
      if (result.status === 'already_subscribed') {
        res.status(200).json({
          status: 'already_subscribed',
          message: 'You are already subscribed to Executive Insights whitepaper releases.',
        });
        return;
      }

      res.status(201).json({
        status: 'subscribed',
        message:
          'Subscribed. Upcoming Telecom AI & Private 5G whitepapers will be sent to your inbox.',
      });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({
        error: 'Unable to save your subscription right now. Please try again shortly.',
      });
    }
  });

  /* ---------- Author Studio Authentication ---------- */
  app.get('/api/author/status', async (req: Request, res: Response) => {
    const envPasscode = getEnvAuthorPasscode();
    const storedAuth = envPasscode ? null : await readAuthorAuth();
    const token = extractBearerToken(req);
    const expiry = token ? activeSessions.get(token) : undefined;
    const authenticated = Boolean(expiry && expiry > Date.now());

    res.json({
      configured: Boolean(envPasscode) || Boolean(storedAuth),
      envManaged: Boolean(envPasscode),
      authenticated,
    });
  });

  app.post('/api/author/setup', async (req: Request, res: Response) => {
    const envPasscode = getEnvAuthorPasscode();
    if (envPasscode) {
      res.status(409).json({
        error: 'Author passcode is already configured in environment settings. Please sign in.',
      });
      return;
    }

    const body = req.body as { passcode?: unknown } | undefined;
    if (!body || typeof body.passcode !== 'string') {
      res.status(400).json({ error: 'Please provide a passcode (at least 6 characters).' });
      return;
    }

    const passcode = body.passcode.trim();
    if (passcode.length < 6 || passcode.length > 128) {
      res.status(400).json({ error: 'Passcode must be between 6 and 128 characters.' });
      return;
    }

    let setupConflict = false;

    const task = authSetupQueue.then(async () => {
      const existing = await readAuthorAuth();
      if (existing) {
        setupConflict = true;
        return;
      }

      await fs.mkdir(DATA_DIR, { recursive: true });
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashPasscodeScrypt(passcode, salt).toString('hex');
      const record: AuthorAuthRecord = {
        salt,
        hash,
        createdAt: new Date().toISOString(),
      };

      try {
        await fs.writeFile(AUTHOR_AUTH_FILE, JSON.stringify(record, null, 2), {
          encoding: 'utf8',
          flag: 'wx',
        });
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
          setupConflict = true;
          return;
        }
        throw err;
      }
    });

    authSetupQueue = task.catch(() => undefined);
    await task;

    if (setupConflict) {
      res.status(409).json({
        error: 'Author passcode has already been set. Please sign in instead.',
      });
      return;
    }

    const session = issueSessionToken();
    res.status(201).json(session);
  });

  app.post('/api/author/login', async (req: Request, res: Response) => {
    const ipKey = getClientIpKey(req);
    if (!checkLoginRateLimit(ipKey)) {
      res.status(429).json({
        error: 'Too many failed attempts. Please wait 15 minutes and try again.',
      });
      return;
    }

    const body = req.body as { passcode?: unknown } | undefined;
    if (!body || typeof body.passcode !== 'string') {
      res.status(400).json({ error: 'Please enter your author passcode.' });
      return;
    }

    const passcode = body.passcode.trim();
    if (passcode.length === 0 || passcode.length > 128) {
      res.status(400).json({ error: 'Invalid author passcode.' });
      return;
    }

    const envPasscode = getEnvAuthorPasscode();
    let verified = false;

    if (envPasscode) {
      verified = crypto.timingSafeEqual(
        sha256Buffer(passcode),
        sha256Buffer(envPasscode)
      );
    } else {
      const storedAuth = await readAuthorAuth();
      if (!storedAuth) {
        res.status(404).json({
          error: 'No author passcode has been created yet. Set one to unlock Author Studio.',
        });
        return;
      }

      const candidateHash = hashPasscodeScrypt(passcode, storedAuth.salt);
      const expectedHash = Buffer.from(storedAuth.hash, 'hex');
      if (candidateHash.length === expectedHash.length) {
        verified = crypto.timingSafeEqual(candidateHash, expectedHash);
      }
    }

    if (!verified) {
      recordLoginFailure(ipKey);
      res.status(401).json({ error: 'Incorrect author passcode.' });
      return;
    }

    clearLoginFailures(ipKey);
    const session = issueSessionToken();
    res.json(session);
  });

  app.post('/api/author/logout', (req: Request, res: Response) => {
    const token = extractBearerToken(req);
    if (token) {
      activeSessions.delete(token);
    }
    res.json({ ok: true });
  });

  /* ---------- Articles / Blogs CRUD ---------- */
  app.get('/api/articles', async (_req: Request, res: Response) => {
    try {
      const articles = await getArticles();
      res.json({ articles });
    } catch (error) {
      console.error('Failed to read articles:', error);
      res.status(500).json({ error: 'Unable to load articles right now.' });
    }
  });

  app.post('/api/articles', requireAuthorAuth, async (req: Request, res: Response) => {
    const body = req.body as
      | {
          title?: unknown;
          category?: unknown;
          summary?: unknown;
          content?: unknown;
          tags?: unknown;
          coverImage?: unknown;
          coverCaption?: unknown;
        }
      | undefined;

    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const category = typeof body?.category === 'string' ? body.category.trim() : '';
    const summary = typeof body?.summary === 'string' ? body.summary.trim() : '';
    const content = typeof body?.content === 'string' ? body.content.trim() : '';
    const coverImage = sanitizeArticleImageUrl(body?.coverImage);
    const coverCaption =
      typeof body?.coverCaption === 'string' ? body.coverCaption.trim().slice(0, 220) : '';

    if (typeof body?.coverImage === 'string' && body.coverImage.trim().length > 0 && !coverImage) {
      res.status(400).json({
        error: 'Cover image must be a valid https:// URL, assets/images/ path, or PNG/JPG/WebP image under 1.5 MB.',
      });
      return;
    }

    if (title.length < 3 || title.length > 160) {
      res.status(400).json({ error: 'Title must be between 3 and 160 characters.' });
      return;
    }
    if (category.length < 2 || category.length > 50) {
      res.status(400).json({ error: 'Category must be between 2 and 50 characters.' });
      return;
    }
    if (summary.length < 10 || summary.length > 320) {
      res.status(400).json({ error: 'Summary must be between 10 and 320 characters.' });
      return;
    }
    if (content.length < 20 || content.length > 500000) {
      res.status(400).json({ error: 'Article content must be between 20 and 500,000 characters.' });
      return;
    }

    let tags: string[] = [];
    if (Array.isArray(body?.tags)) {
      tags = body.tags
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item.length <= 30)
        .slice(0, 6);
    }

    try {
      const article = await createArticle({
        title,
        category,
        summary,
        content,
        tags,
        coverImage,
        coverCaption,
      });
      res.status(201).json({ article });
    } catch (error) {
      console.error('Failed to create article:', error);
      res.status(500).json({ error: 'Unable to publish article right now.' });
    }
  });

  app.delete('/api/articles/:id', requireAuthorAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === 'string' ? req.params.id.trim() : '';
    if (!SAFE_ID_REGEX.test(id)) {
      res.status(400).json({ error: 'Invalid article identifier.' });
      return;
    }

    try {
      const deleted = await deleteArticleById(id);
      if (!deleted) {
        res.status(404).json({ error: 'Article not found.' });
        return;
      }
      res.json({ deleted: true, id });
    } catch (error) {
      console.error('Failed to delete article:', error);
      res.status(500).json({ error: 'Unable to delete article right now.' });
    }
  });

  /* ---------- Podcasts & YouTube Videos CRUD ---------- */
  app.get('/api/podcasts', async (_req: Request, res: Response) => {
    try {
      const podcasts = await getPodcasts();
      res.json({ podcasts });
    } catch (error) {
      console.error('Failed to read podcasts:', error);
      res.status(500).json({ error: 'Unable to load podcast videos right now.' });
    }
  });

  app.post('/api/podcasts', requireAuthorAuth, async (req: Request, res: Response) => {
    const body = req.body as
      | {
          title?: unknown;
          youtubeUrl?: unknown;
          topic?: unknown;
          description?: unknown;
          duration?: unknown;
        }
      | undefined;

    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const rawYoutubeUrl = typeof body?.youtubeUrl === 'string' ? body.youtubeUrl.trim() : '';
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
    const description = typeof body?.description === 'string' ? body.description.trim() : '';
    const duration = typeof body?.duration === 'string' ? body.duration.trim().slice(0, 20) : '';

    const videoId = extractYouTubeVideoId(rawYoutubeUrl);
    if (!videoId) {
      res.status(400).json({
        error: 'Please enter a valid YouTube video URL (youtube.com/watch?v=... or youtu.be/...).',
      });
      return;
    }

    if (title.length < 3 || title.length > 160) {
      res.status(400).json({ error: 'Video title must be between 3 and 160 characters.' });
      return;
    }
    if (topic.length < 2 || topic.length > 50) {
      res.status(400).json({ error: 'Topic must be between 2 and 50 characters.' });
      return;
    }
    if (description.length < 10 || description.length > 600) {
      res.status(400).json({ error: 'Description must be between 10 and 600 characters.' });
      return;
    }

    try {
      const podcast = await createPodcast({
        videoId,
        title,
        topic,
        description,
        duration,
      });
      res.status(201).json({ podcast });
    } catch (error) {
      console.error('Failed to add podcast video:', error);
      res.status(500).json({ error: 'Unable to add YouTube episode right now.' });
    }
  });

  app.delete('/api/podcasts/:id', requireAuthorAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === 'string' ? req.params.id.trim() : '';
    if (!SAFE_ID_REGEX.test(id)) {
      res.status(400).json({ error: 'Invalid podcast identifier.' });
      return;
    }

    try {
      const deleted = await deletePodcastById(id);
      if (!deleted) {
        res.status(404).json({ error: 'Podcast episode not found.' });
        return;
      }
      res.json({ deleted: true, id });
    } catch (error) {
      console.error('Failed to delete podcast video:', error);
      res.status(500).json({ error: 'Unable to delete podcast episode right now.' });
    }
  });

  /* ---------- Executive Resume Upload / Download API ---------- */
  app.get('/api/resume/status', async (_req: Request, res: Response) => {
    const meta = await readResumeMeta();
    if (!meta) {
      res.json({ uploaded: false });
      return;
    }
    res.json({
      uploaded: true,
      resume: {
        originalName: meta.originalName,
        mimeType: meta.mimeType,
        sizeBytes: meta.sizeBytes,
        uploadedAt: meta.uploadedAt,
      },
    });
  });

  app.get('/api/resume/download', async (_req: Request, res: Response) => {
    const meta = await readResumeMeta();
    if (!meta) {
      res.status(404).json({ error: 'No resume file has been uploaded yet.' });
      return;
    }

    const filePath = path.join(DATA_DIR, meta.storedName);
    try {
      const fileData = await fs.readFile(filePath);
      const safeHeaderFilename = meta.originalName.replace(/["\r\n]/g, '_');
      res.setHeader('Content-Type', meta.mimeType);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', `attachment; filename="${safeHeaderFilename}"`);
      res.setHeader('Content-Length', String(fileData.length));
      res.send(fileData);
    } catch {
      res.status(404).json({ error: 'Uploaded resume file could not be found.' });
    }
  });

  app.post(
    '/api/resume',
    requireAuthorAuth,
    express.raw({
      type: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/octet-stream',
      ],
      limit: '8mb',
    }),
    async (req: Request, res: Response) => {
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        res.status(400).json({
          error: 'Please select a valid PDF or DOCX resume file (up to 8 MB).',
        });
        return;
      }

      const rawNameHeader = req.get('x-resume-filename') || 'resume.pdf';
      let decodedName = rawNameHeader;
      try {
        decodedName = decodeURIComponent(rawNameHeader);
      } catch {
        decodedName = rawNameHeader;
      }

      const detected = detectAllowedResumeFormat(req.body, decodedName);
      if (!detected) {
        res.status(400).json({
          error: 'Unsupported file format. Please upload a valid PDF (.pdf) or Word (.docx) file up to 8 MB.',
        });
        return;
      }

      try {
        const saved = await saveUploadedResume(req.body, decodedName, detected);
        res.status(201).json({
          uploaded: true,
          resume: {
            originalName: saved.originalName,
            mimeType: saved.mimeType,
            sizeBytes: saved.sizeBytes,
            uploadedAt: saved.uploadedAt,
          },
        });
      } catch (error) {
        console.error('Failed to save uploaded resume:', error);
        res.status(500).json({ error: 'Unable to save resume right now. Please try again.' });
      }
    }
  );

  app.delete('/api/resume', requireAuthorAuth, async (_req: Request, res: Response) => {
    try {
      const deleted = await deleteUploadedResume();
      res.json({ deleted });
    } catch (error) {
      console.error('Failed to delete uploaded resume:', error);
      res.status(500).json({ error: 'Unable to delete uploaded resume right now.' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'mpa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
