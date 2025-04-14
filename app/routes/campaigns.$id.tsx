import { useParams, Link } from "@remix-run/react";
import { campaigns, deleteKeyword, addKeyword, Keyword } from "data";
import { useState } from "react";

export default function CampaignDetails() {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === Number(id));
  const [keywords, setKeywords] = useState<Keyword[]>(campaign?.keywords || []);
  const [newKeyword, setNewKeyword] = useState("");
  const [bid, setBid] = useState(1);
  const [matchType, setMatchType] = useState<"exact" | "phrase" | "broad">("broad");

  if (!campaign) return <div>Campaign not found.</div>;

  const handleAddKeyword = () => {
    if(!newKeyword && !bid) return;
    const newKw: Keyword = {
      id: Date.now(),
      campaignId: campaign.id,
      text: newKeyword,
      bid,
      match_type: matchType,
      state: "enabled"
    };
    addKeyword(campaign.id, newKw);
    // setKeywords(prev => [...prev, newKw]);
    setNewKeyword("");
    setBid(0);
    setMatchType("broad");
  };

  const handleDeleteKeyword = (id: number) => {
    deleteKeyword(campaign.id, id);
    setKeywords(prev => prev.filter(k => k.id !== id));
  };

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← Back to all campaigns
      </Link>

      <h2 className="text-2xl font-bold mb-2">{campaign.name}</h2>
      <p className="mb-4 text-gray-600">Daily Budget: ${campaign.daily_budget}</p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Keyword</h3>
        <div className="flex gap-2 items-end">
          <input
            type="text"
            placeholder="Keyword text"
             className=" px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
          />
          <input
            type="number"
            placeholder="Bid"
            className=" px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"

            value={bid}
            onChange={(e) => setBid(parseFloat(e.target.value))}
          />
          <select
                        className=" px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"

            value={matchType}
            onChange={(e) => setMatchType(e.target.value as Keyword["match_type"])}
          >
            <option value="exact">Exact</option>
            <option value="phrase">Phrase</option>
            <option value="broad">Broad</option>
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleAddKeyword}
          >
            Add
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Keyword</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Bid</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Match Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium">State</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {keywords.map(k => (
            <tr key={k.id}>
              <td className="px-4 py-2">{k.text}</td>
              <td className="px-4 py-2">${k.bid}</td>
              <td className="px-4 py-2 capitalize">{k.match_type}</td>
              <td className="px-4 py-2 capitalize">{k.state}</td>
              <td className="px-4 py-2">
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDeleteKeyword(k.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
