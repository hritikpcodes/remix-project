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
  DialogTrigger,
} from "~/components/ui/dialog";

type ActionData = {
  error?: string;
  campaign?: AdCampaign;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const id = formData.get("id"); 
  const name = formData.get("name") as string;
  const daily_budget = parseFloat(formData.get("daily_budget") as string);

  if (!name && !daily_budget) {
   return Response.json(
      { error: "Name and daily budget are required" },
      { status: 400 }
    );
  }

 
  const isEdit = !!id;

  const campaign = {
    id: isEdit ? Number(id) : Date.now(),
    name,
    daily_budget,
    keywords: [],
  };

  if (isEdit) {
    editCampaign(campaign);
  } else {
    addCampaign(campaign);
  }

  // const existingUser = findUserByEmailPassword(email, password)


  return Response.json({ campaign }, { status: 200 });
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const [campaignsArr, setCampaignsArr] = useState<AdCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(
    null
  );
  const [nameInput, setNameInput] = useState("");
  const [budgetInput, setBudgetInput] = useState<number>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditPress = (campaign: AdCampaign) => {
    setSelectedCampaign(campaign);
    selectedCampaign && setNameInput(selectedCampaign.name);
    selectedCampaign && setBudgetInput(selectedCampaign.daily_budget);
    setIsDialogOpen(true);
  };
  const handleDeletePress = (campaign: AdCampaign) => {
    deleteCampaign(campaign.id);
    setCampaignsArr((prev) => prev.filter((c) => c.id !== campaign.id));
  };

  useEffect(() => {
    if (actionData?.campaign) {
      const exists = campaignsArr.some(c => c.id === actionData.campaign!.id);
      if (exists) {
        // Update existing campaign in list
        setCampaignsArr(prev =>
          prev.map(c => c.id === actionData.campaign!.id ? actionData.campaign! : c)
        );
      } else {
        // Add new
        setCampaignsArr(prev => [...prev, actionData.campaign!]);
      }
  
      // Clear form and dialog state
      setSelectedCampaign(null);
      setNameInput("");
      setBudgetInput(0);
      setIsDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  useEffect(() => {
    setCampaignsArr(campaigns);
  }, []);
  console.log(campaignsArr);
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Daily Budget
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {campaignsArr.map((campaign, index) => (
              <tr
                key={campaign.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 text-sm text-gray-900 border-b">
                <Link to={`/campaigns/${campaign.id}`}>{campaign.name}</Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 border-b">
                  {campaign.daily_budget}
                </td>
                <td className="px-6 py-4 border-b">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex">
            <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-900 self-center">
              Add Campaign
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Campaign</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <Form method="post" className="space-y-6">
          {selectedCampaign && (
    <input type="hidden" name="id" value={selectedCampaign.id} />
  )}
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="Enter your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="daily_budget"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Daily Bugdet
                </label>
                <input
                  type="number"
                  name="daily_budget"
                  id="daily_budget"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="Enter your daily budget"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(+e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <div className="flex">
                  {!selectedCampaign ? (
                    <button
                      // type="submit"
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-900 self-center"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="submit"
                      
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-900 self-center"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </DialogClose>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
