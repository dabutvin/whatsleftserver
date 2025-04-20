import { NextRequest, NextResponse } from "next/server";
import { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products } from "plaid";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || '';
const PLAID_SECRET = process.env.PLAID_SECRET || '';
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';


//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || 'https://whatsleftserver.netlify.app/plaid';


// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string | [string] }> },
) {
  const { slug } = await params;
  // return NextResponse.json({slug});

  if (slug[0] == ".well-known" && slug[1] == "apple-app-site-association") {
    return appSiteAssociation();
  }

  if (slug[0] == "api" && slug[1] == "linktoken") {
    return NextResponse.json(await createLinkToken())
  }
}

async function createLinkToken() {
  const configs: LinkTokenCreateRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'user-id',
    },
    client_name: 'Plaid Quickstart',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    redirect_uri: PLAID_REDIRECT_URI,
    language: 'en',
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(configs);
    return createTokenResponse.data;
  } catch (error) {
    console.error('Error creating link token:', error);
    return { error: 'Failed to create link token' };
  }
}

function appSiteAssociation() {
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
