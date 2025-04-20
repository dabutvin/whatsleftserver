import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    "applinks": {
      "details": [
        {
          "appIDs": ["65Q5A45BS7.dabutvin.WhatsLeft"],
          "components": [
            {
              "/": "/plaid/*",
              "comment": "Matches any URL path whose path starts with /plaid/"
            }
          ]
        }
      ]
    }
  });
}