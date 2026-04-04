import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import CreatorCard from "../components/CreatorCard.jsx";
import InsightPanel from "../components/InsightPanel.jsx";
import ReportList from "../components/ReportList.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ChatbotWidget from "../components/ChatbotWidget.jsx";

const mockCreators = [
	{
		id: "mrbeast",
		name: "MrBeast",
		niche: "Entertainment",
		authenticityScore: 98,
		insights: "Massive reach for philanthropic campaigns.",
		avatarUrl: "/logo.png",
		platforms: [
			{ platform: "instagram", followers: 18_900_000, avgLikes: 820_000, growthRate: 4.3 },
			{ platform: "youtube", followers: 246_000_000, avgLikes: 2_400_000, growthRate: 5.9 },
		],
	},
	{
		id: "mkbhd",
		name: "Marques Brownlee",
		niche: "Tech",
		authenticityScore: 96,
		insights: "Best for premium consumer tech launches.",
		avatarUrl: "/logo.png",
		platforms: [
			{ platform: "instagram", followers: 4_600_000, avgLikes: 210_000, growthRate: 3.1 },
			{ platform: "youtube", followers: 19_600_000, avgLikes: 740_000, growthRate: 2.6 },
		],
	},
	{
		id: "emmalue",
		name: "Emma Louise",
		niche: "Lifestyle",
		authenticityScore: 93,
		insights: "Strong engagement in wellness and beauty.",
		avatarUrl: "/logo.png",
		platforms: [
			{ platform: "instagram", followers: 1_200_000, avgLikes: 64_000, growthRate: 2.4 },
			{ platform: "youtube", followers: 780_000, avgLikes: 38_000, growthRate: 1.8 },
		],
	},
	{
		id: "carry",
		name: "CarryMinati",
		niche: "Gaming",
		authenticityScore: 91,
		insights: "High energy gaming collabs; strong Gen Z reach.",
		avatarUrl: "/logo.png",
		platforms: [
			{ platform: "instagram", followers: 3_800_000, avgLikes: 190_000, growthRate: 4.0 },
			{ platform: "youtube", followers: 42_000_000, avgLikes: 1_100_000, growthRate: 3.4 },
		],
	},
];

const mockReports = [
	{
		_id: "rep-1",
		creator: { name: "MrBeast" },
		title: "YouTube + Shorts performance report",
		status: "completed",
	},
	{
		_id: "rep-2",
		creator: { name: "AestheticAnna" },
		title: "Instagram engagement deep dive",
		status: "processing",
	},
	{
		_id: "rep-3",
		creator: { name: "Marques Brownlee" },
		title: "Creator authenticity snapshot",
		status: "completed",
	},
	{
		_id: "rep-4",
		creator: { name: "Jesse" },
		title: "Launch campaign overview",
		status: "new",
	},
];

export default function Dashboard() {
	const [selectedCreator, setSelectedCreator] = useState(mockCreators[0]);
	const [query, setQuery] = useState("");
	const [insightStatus, setInsightStatus] = useState("idle");
	const [insightError, setInsightError] = useState("");
	const [sessionId, setSessionId] = useState("");

	const filteredCreators = mockCreators.filter((creator) =>
		creator.name.toLowerCase().includes(query.toLowerCase())
	);

	const handleSearch = async (value) => {
		const trimmed = value.trim();
		if (!trimmed) {
			setInsightStatus("idle");
			setInsightError("");
			return;
		}

		setInsightStatus("loading");
		setInsightError("");

		try {
			const response = await fetch("http://localhost:8000/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					creators: [{ insta_username: trimmed, yt_channel_name: trimmed }],
				}),
			});

			if (!response.ok) {
				throw new Error(`AI service error (${response.status})`);
			}

			const data = await response.json();
			setSessionId(data?.session_id || "");
			const analyzedCreator = data?.analyzed_creators?.[0];
			const instagramScores = analyzedCreator?.instagram_insights?.scores;
			const youtubeScores = analyzedCreator?.youtube_insights?.scores;
			const mappedCreator = {
				id: analyzedCreator?.insta_username || trimmed,
				name: analyzedCreator?.insta_username || analyzedCreator?.yt_channel_name || trimmed,
				niche: analyzedCreator?.instagram_insights?.decision?.campaign_fit || "",
				authenticityScore: instagramScores?.total ?? youtubeScores?.total,
				insights: analyzedCreator?.instagram_insights?.decision?.trust_level || "",
				aiSummary: data?.message || "",
				avatarUrl: "/logo.png",
				decision: {
					trustLevel: analyzedCreator?.instagram_insights?.decision?.trust_level,
					audienceType: analyzedCreator?.instagram_insights?.decision?.audience_type,
					campaignFit: analyzedCreator?.instagram_insights?.decision?.campaign_fit,
					roiLevel: analyzedCreator?.instagram_insights?.decision?.roi_level,
					confidence: analyzedCreator?.instagram_insights?.decision?.confidence,
				},
				instagramMetrics: analyzedCreator?.instagram_insights?.metrics,
				youtubeMetrics: analyzedCreator?.youtube_insights?.metrics,
				flags: analyzedCreator?.instagram_insights?.flags || analyzedCreator?.youtube_insights?.flags || [],
			};

			setSelectedCreator(mappedCreator);
			setInsightStatus("idle");
		} catch (error) {
			setInsightStatus("error");
			setInsightError(error?.message || "Unable to fetch insights.");
		}
	};

	return (
		<>
			<div className="min-h-screen bg-slate-50">
				<Navbar />
				<main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
					<section className="rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 p-8 text-white shadow-xl">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-purple-100">Analyze influencers</p>
								<h1 className="mt-3 text-3xl font-semibold md:text-4xl">With One Click!</h1>
								<p className="mt-3 max-w-xl text-sm text-purple-100">
									Discover top creators across YouTube, Instagram, News, and Snapchat. Build smarter partnerships.
								</p>
							</div>
							<div className="flex gap-3">
								<button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-purple-600">Find Creators</button>
								<button className="rounded-full border border-white/50 px-5 py-2 text-sm font-semibold text-white">View Reports</button>
							</div>
						</div>
					</section>

					<section className="mt-8 grid gap-4 md:grid-cols-4">
						<MetricCard label="Tracked Creators" value="2.4K" delta="+12% this week" tone="text-emerald-500" />
						<MetricCard label="Reports Generated" value="128" delta="+5 today" tone="text-emerald-500" />
						<MetricCard label="Active Campaigns" value="17" delta="+3 new" tone="text-emerald-500" />
						<MetricCard label="Avg. Engagement" value="5.1%" delta="-0.2% vs last wk" tone="text-rose-500" />
					</section>

					<section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
						<div className="rounded-3xl bg-white/90 p-6 shadow-lg shadow-purple-100/60">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="text-lg font-semibold text-slate-800">Top Creators</h2>
								<button className="text-sm font-semibold text-purple-500">View all →</button>
							</div>
							<SearchBar
								placeholder="Search creators..."
								value={query}
								onChange={setQuery}
								onSearch={handleSearch}
								isLoading={insightStatus === "loading"}
							/>
							<div className="mt-4 grid gap-4">
								{filteredCreators.map((creator) => (
									<CreatorCard key={creator.id} creator={creator} onSelect={setSelectedCreator} />
								))}
							</div>
						</div>

						<InsightPanel creator={selectedCreator} status={insightStatus} error={insightError} />
					</section>

					<section className="mt-8">
						<ReportList reports={mockReports} />
					</section>
				</main>
			</div>
			<ChatbotWidget sessionId={sessionId} />
		</>
	);
}

function MetricCard({ label, value, delta, tone }) {
	return (
		<div className="rounded-3xl bg-white/90 p-5 shadow-lg shadow-purple-100/50">
			<p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
			<p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
			<p className={`mt-2 text-xs font-semibold ${tone}`}>{delta}</p>
		</div>
	);
}









