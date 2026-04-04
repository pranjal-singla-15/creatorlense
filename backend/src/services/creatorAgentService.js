import axios from "axios";
import { randomUUID } from "crypto";
import creatorCatalog from "../data/creatorCatalog.js";

const EXTERNAL_AGENT_URL = process.env.AGENT_API_URL || "http://127.0.0.1:8000";
const EXTERNAL_TIMEOUT_MS = 3500;

const sessions = new Map();

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function toPercent(value) {
  return `${Number(value).toFixed(1)}%`;
}

function scoreCreator(creator) {
  const authenticity = creator.authenticityScore;
  const engagement = creator.engagementRate * 8;
  const growth = creator.growthRate * 10;
  const safety = creator.brandSafety === "High" ? 7 : creator.brandSafety === "Medium" ? 4 : 1;
  const scale = Math.min(12, Math.log10(Math.max(creator.platforms?.[1]?.followers || 1, 1)) * 2);

  return Math.round(authenticity * 0.38 + engagement * 0.22 + growth * 0.17 + safety * 1.25 + scale * 1.2);
}

function buildInsight(creator, source = "local-engine") {
  const score = scoreCreator(creator);
  const headline =
    score >= 90
      ? `Top-tier fit for ${creator.bestFor}`
      : score >= 80
        ? `Strong fit for ${creator.bestFor}`
        : `Selective fit for ${creator.bestFor}`;

  return {
    creatorId: creator.id,
    creatorName: creator.name,
    niche: creator.niche,
    audience: creator.audience,
    authenticityScore: creator.authenticityScore,
    engagementRate: creator.engagementRate,
    growthRate: creator.growthRate,
    brandSafety: creator.brandSafety,
    fitScore: score,
    headline,
    summary: creator.summary,
    strengths: creator.strengths,
    risks: creator.risks,
    collaborationAngles: creator.collaborationAngles,
    bestFor: creator.bestFor,
    metrics: [
      { label: "Authenticity", value: toPercent(creator.authenticityScore) },
      { label: "Engagement", value: toPercent(creator.engagementRate) },
      { label: "Growth", value: toPercent(creator.growthRate) },
      { label: "Brand safety", value: creator.brandSafety },
    ],
    platformSnapshot: creator.platforms.map((platform) => ({
      platform: platform.platform,
      followers: formatNumber(platform.followers),
      avgLikes: formatNumber(platform.avgLikes),
      growthRate: toPercent(platform.growthRate),
    })),
    source,
  };
}

function getCreatorsByIds(creatorIds = []) {
  const ids = creatorIds.map(normalize).filter(Boolean);
  const filtered = creatorCatalog.filter((creator) => ids.includes(normalize(creator.id)));

  return filtered.length ? filtered : creatorCatalog.slice(0, 2);
}

function findCreator(query) {
  const normalized = normalize(query);
  if (!normalized) {
    return null;
  }

  return (
    creatorCatalog.find((creator) => normalize(creator.id) === normalized) ||
    creatorCatalog.find((creator) => normalize(creator.name) === normalized) ||
    creatorCatalog.find(
      (creator) =>
        normalize(creator.name).includes(normalized) ||
        normalize(creator.id).includes(normalized) ||
        normalize(creator.insta_username).includes(normalized) ||
        normalize(creator.yt_channel_name).includes(normalized)
    ) ||
    null
  );
}

function rankCreators(creators) {
  return [...creators]
    .map((creator) => {
      const insight = buildInsight(creator);
      return {
        creatorId: creator.id,
        creatorName: creator.name,
        score: insight.fitScore,
        authenticityScore: creator.authenticityScore,
        engagementRate: creator.engagementRate,
        growthRate: creator.growthRate,
        brandSafety: creator.brandSafety,
        niche: creator.niche,
        bestFor: creator.bestFor,
        summary: creator.summary,
        reason: `${creator.name} combines ${creator.brandSafety.toLowerCase()} brand safety with ${creator.engagementRate.toFixed(1)}% engagement and a strong ${creator.niche.toLowerCase()} audience.`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function buildComparisonSummary(ranking) {
  if (!ranking.length) {
    return "No creators were selected for comparison.";
  }

  const winner = ranking[0];
  const runnerUp = ranking[1];
  const gap = runnerUp ? winner.score - runnerUp.score : 0;

  return runnerUp
    ? `${winner.creatorName} edges ahead with the strongest all-round fit, beating ${runnerUp.creatorName} by ${gap} points.`
    : `${winner.creatorName} is the strongest choice in the current set.`;
}

function buildLocalChatResponse(message, selectedCreators, history) {
  const normalized = normalize(message);
  const mainCreator = selectedCreators[0];
  const comparison = rankCreators(selectedCreators);

  if (normalized.includes("compare")) {
    return `${buildComparisonSummary(comparison)} ${comparison
      .slice(0, 3)
      .map((entry) => `${entry.creatorName} (${entry.score})`)
      .join(" | ")}`;
  }

  if (normalized.includes("best") || normalized.includes("recommend")) {
    return `For this brief, ${comparison[0].creatorName} is the safest recommendation. It pairs ${comparison[0].brandSafety.toLowerCase()} brand safety with a strong ${comparison[0].niche.toLowerCase()} audience and ${comparison[0].engagementRate.toFixed(1)}% engagement.`;
  }

  if (mainCreator) {
    return `${mainCreator.name} is a ${mainCreator.niche.toLowerCase()} creator with ${mainCreator.authenticityScore}% authenticity, ${mainCreator.engagementRate.toFixed(1)}% engagement, and a good fit for ${mainCreator.bestFor}. ${history.length ? "I can refine this with your recent context." : ""}`.trim();
  }

  return "Share one or more creators and I will build a fit analysis, comparison, or campaign recommendation.";
}

async function externalHealthCheck() {
  try {
    const response = await axios.get(`${EXTERNAL_AGENT_URL.replace(/\/$/, "")}/health`, {
      timeout: EXTERNAL_TIMEOUT_MS,
    });

    return response.status >= 200 && response.status < 300;
  } catch (_error) {
    return false;
  }
}

export async function isExternalAgentAvailable() {
  return externalHealthCheck();
}

async function withExternalAgent(fn) {
  if (!(await externalHealthCheck())) {
    return null;
  }

  try {
    return await fn();
  } catch (_error) {
    return null;
  }
}

async function startExternalSession(creators) {
  return withExternalAgent(async () => {
    const payload = {
      creators: creators.map((creator) => ({
        insta_username: creator.insta_username,
        yt_channel_name: creator.yt_channel_name,
      })),
    };

    const response = await axios.post(`${EXTERNAL_AGENT_URL.replace(/\/$/, "")}/start`, payload, {
      timeout: EXTERNAL_TIMEOUT_MS * 3,
    });

    return response.data;
  });
}

async function askExternalSession(sessionId, message) {
  return withExternalAgent(async () => {
    const response = await axios.post(
      `${EXTERNAL_AGENT_URL.replace(/\/$/, "")}/ask`,
      { session_id: sessionId, message },
      { timeout: EXTERNAL_TIMEOUT_MS * 3 }
    );

    return response.data;
  });
}

async function endExternalSession(sessionId) {
  return withExternalAgent(async () => {
    const response = await axios.post(
      `${EXTERNAL_AGENT_URL.replace(/\/$/, "")}/end`,
      { session_id: sessionId },
      { timeout: EXTERNAL_TIMEOUT_MS }
    );

    return response.data;
  });
}

function getSession(sessionId = null) {
  const key = sessionId || randomUUID().slice(0, 8);

  if (!sessions.has(key)) {
    sessions.set(key, {
      sessionId: key,
      createdAt: new Date().toISOString(),
      selectedCreatorIds: [],
      messages: [],
      externalSessionId: null,
      source: "local-engine",
    });
  }

  return sessions.get(key);
}

export function searchCatalog(query = "") {
  const normalized = normalize(query);
  if (!normalized) {
    return creatorCatalog;
  }

  return creatorCatalog.filter((creator) =>
    [creator.name, creator.id, creator.niche, creator.insta_username, creator.yt_channel_name, creator.bestFor]
      .some((value) => normalize(value).includes(normalized))
  );
}

export function getCatalog() {
  return creatorCatalog;
}

export async function getInsight({ creatorId }) {
  const creator = findCreator(creatorId);

  if (!creator) {
    const error = new Error("Creator not found");
    error.statusCode = 404;
    throw error;
  }

  const external = await startExternalSession([creator]);
  const rawResult = external?.analyzed_creators?.[0] || null;
  if (external?.session_id) {
    await endExternalSession(external.session_id);
  }

  return {
    creator,
    analysis: buildInsight(creator, external ? "python-agent" : "local-engine"),
    raw: rawResult,
    source: external ? "python-agent" : "local-engine",
  };
}

export async function compareCreators({ creatorIds = [] }) {
  const creators = getCreatorsByIds(creatorIds);
  const ranking = rankCreators(creators);
  const external = await startExternalSession(creators);
  let narrative = buildComparisonSummary(ranking);

  if (external?.session_id) {
    const compareMessage = `Compare the following creators for brand partnership fit: ${creators
      .map((creator) => creator.name)
      .join(", ")}. Give a clear recommendation.`;
    const response = await askExternalSession(external.session_id, compareMessage);
    narrative = response?.response || narrative;
    await endExternalSession(external.session_id);
  }

  return {
    creators,
    ranking,
    summary: narrative,
    source: external ? "python-agent" : "local-engine",
  };
}

export async function chatWithAgent({ sessionId, message, selectedCreatorIds = [] }) {
  const session = getSession(sessionId);
  const nextCreatorIds =
    selectedCreatorIds.length > 0 ? selectedCreatorIds : session.selectedCreatorIds.length ? session.selectedCreatorIds : creatorCatalog.slice(0, 2).map((creator) => creator.id);

  session.selectedCreatorIds = nextCreatorIds;

  const selectedCreators = getCreatorsByIds(nextCreatorIds);
  const externalEnabled = await externalHealthCheck();

  let responseText = buildLocalChatResponse(message, selectedCreators, session.messages);
  let source = "local-engine";
  let externalSessionId = session.externalSessionId;

  if (externalEnabled) {
    if (!externalSessionId) {
      const externalSession = await startExternalSession(selectedCreators);
      externalSessionId = externalSession?.session_id || null;
      session.externalSessionId = externalSessionId;
    }

    if (externalSessionId) {
      const externalResponse = await askExternalSession(externalSessionId, message);
      responseText = externalResponse?.response || responseText;
      source = "python-agent";
    }
  }

  session.messages.push({ role: "user", content: message });
  session.messages.push({ role: "assistant", content: responseText });

  return {
    sessionId: session.sessionId,
    response: responseText,
    selectedCreators,
    source,
  };
}

export async function resetSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) {
    return false;
  }

  if (session.externalSessionId) {
    await endExternalSession(session.externalSessionId);
  }

  sessions.delete(sessionId);
  return true;
}
