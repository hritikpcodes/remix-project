import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import {
  AdCampaign,
  addCampaign,
  campaigns,
  deleteCampaign,
  editCampaign,
} from "data";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type ActionData = {
  error?: string;
  campaign?: AdCampaign;
};

export const meta: MetaFunction = () => [
  { title: "Campaign Manager" },
  { name: "description", content: "Manage your ad campaigns" },
];

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name") as string;
  const daily_budget = parseFloat(formData.get("daily_budget") as string);

  if (!name || isNaN(daily_budget)) {
    return Response.json(
      { error: "Name and daily budget are required" },
      { status: 400 }
    );
  }

  const isEdit = !!id;
  const campaign: AdCampaign = {
    id: isEdit ? Number(id) : Date.now(),
    name,
    daily_budget,
    keywords: [],
  };

  isEdit ? editCampaign(campaign) : addCampaign(campaign);
  return Response.json({ campaign }, { status: 200 });
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const [campaignsArr, setCampaignsArr] = useState<AdCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [budgetInput, setBudgetInput] = useState<number | null>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const allColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "daily_budget", label: "Daily Budget" },
    { key: "actions", label: "Actions" },
  ];

  const [columnOrder, setColumnOrder] = useState<string[]>(["name", "daily_budget", "actions", "id"]);

  const handleEditPress = (campaign: AdCampaign) => {
    setSelectedCampaign(campaign);
    setNameInput(campaign.name);
    setBudgetInput(campaign.daily_budget);
    setIsDialogOpen(true);
  };

  const handleDeletePress = (campaign: AdCampaign) => {
    deleteCampaign(campaign.id);
    setCampaignsArr((prev) => prev.filter((c) => c.id !== campaign.id));
  };

  useEffect(() => {
    setCampaignsArr(campaigns);
  }, []);
  useEffect(() => {
    if (actionData?.campaign) {
      const exists = campaignsArr.some((c) => c.id === actionData.campaign!.id);
      if (exists) {
        // setCampaignsArr((prev) => prev.map((c) => (c.id === actionData.campaign!.id ? actionData.campaign! : c)));
        editCampaign(actionData?.campaign)
      } else {
        // setCampaignsArr((prev) => [...prev, actionData.campaign!]);
        addCampaign(actionData?.campaign)
      }
      setSelectedCampaign(null);
      setNameInput("");
      setBudgetInput(0);
      setIsDialogOpen(false);
    }
  }, [actionData]);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          
            <button
              onClick={() => {
                setSelectedCampaign(null);
                setNameInput("");
                setBudgetInput(0);
                setIsDialogOpen(true);
              }}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-900"
            >
              + Add Campaign
            </button>
          {/* </DialogTrigger> */}
        </div>

        <div className="flex gap-4 mb-4 flex-wrap">
          {columnOrder.map((colKey, index) => (
            <div key={colKey}>
              <label className="text-sm block font-medium mb-1">
                Position {index + 1}
              </label>
              <select
                value={colKey}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const newOrder = [...columnOrder];
                  const fromIndex = columnOrder.indexOf(newKey);
                  [newOrder[index], newOrder[fromIndex]] = [newOrder[fromIndex], newOrder[index]];
                  setColumnOrder(newOrder);
                }}
                className=" px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"

              >
                {allColumns.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {columnOrder.map((key) => {
                const label = allColumns.find((col) => col.key === key)?.label;
                return (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {campaignsArr.map((campaign, index) => (
              <tr key={campaign.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {columnOrder.map((key) => {
                  if (key === "id") {
                    return <td key="id" className="px-6 py-4 text-sm text-gray-900 border-b">{campaign.id}</td>;
                  } else if (key === "name") {
                    return (
                      <td key="name" className="px-6 py-4 text-sm text-blue-600 underline border-b">
                        <Link to={`/campaigns/${campaign.id}`}>{campaign.name}</Link>
                      </td>
                    );
                  } else if (key === "daily_budget") {
                    return (
                      <td key="daily_budget" className="px-6 py-4 text-sm text-gray-900 border-b">
                        ${Number.isInteger(campaign.daily_budget)
                          ? campaign.daily_budget
                          : campaign.daily_budget.toFixed(2)}
                      </td>
                    );
                  } else if (key === "actions") {
                    return (
                      <td key="actions" className="px-6 py-4 border-b">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPress(campaign)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePress(campaign)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    );
                  }
                  return null;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCampaign ? "Edit Campaign" : "Add Campaign"}
            </DialogTitle>
          </DialogHeader>
          <Form method="post" className="space-y-6">
            {selectedCampaign && (
              <input type="hidden" name="id" value={selectedCampaign.id} />
            )}
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="Enter campaign name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="daily_budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Budget
                </label>
                <input
                  type="number"
                  name="daily_budget"
                  id="daily_budget"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="Enter daily budget"
                  value={budgetInput || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setBudgetInput(null); // temporarily empty
                    } else {
                      setBudgetInput(+e.target.value)
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                >
                  {selectedCampaign ? "Save Changes" : "Save"}
                </button>
              </DialogClose>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}