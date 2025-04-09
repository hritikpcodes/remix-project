import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { AdCampaign, addCampaign, campaigns } from "data";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const name = formData.get("name") as string;
  const daily_budget = parseFloat(formData.get('daily_budget') as string);

  if (!name || !daily_budget) {
    Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const newCampaign = {
    id: Date.now(),
    name,
    daily_budget,
    keywords: [],
  };

  // const existingUser = findUserByEmailPassword(email, password)
  const campaign = newCampaign;

  if (campaign) addCampaign(campaign);

  return Response.json({ campaign }, { status: 200 });
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const [campaignsArr, setCampaignsArr] = useState<AdCampaign[]>(campaigns);

  useEffect(() => {
    if (actionData?.campaign) {
      setCampaignsArr([...campaignsArr, actionData.campaign]);
    } else {
      console.log("error");
    }
  }, [actionData]);
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
                  {campaign.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 border-b">
                  
                  
                     campaign.daily_budget
                    
                </td>
                <td className="px-6 py-4 border-b">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog>
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
                />
              </div>
            </div>
            <DialogFooter>
              <div className="flex">
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-900 self-center"
                >
                  Save
                </button>
              </div>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
