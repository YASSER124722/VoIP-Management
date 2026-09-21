import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.FREEPBX_URL;
    const clientId = process.env.FREEPBX_CLIENT_ID;
    const clientSecret = process.env.FREEPBX_CLIENT_SECRET;

    // Use local server date instead of UTC
    const today = new Date();

    const endDate = today.toLocaleDateString("en-CA");

    const start = new Date(today);
    start.setDate(start.getDate() - 7);

    const startDate = start.toLocaleDateString("en-CA");

    const tokenResponse = await fetch(
      `${baseUrl}/admin/api/api/token`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: "gql:cdr",
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to authenticate with FreePBX",
        },
        { status: 500 }
      );
    }

    const graphqlResponse = await fetch(
      `${baseUrl}/admin/api/api/gql`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              fetchAllCdrs(
                startDate: "${startDate}"
                endDate: "${endDate}"
                first: 1000
                after: 0
              ) {
                cdrs {
                  id
                  uniqueid
                  calldate
                  src
                  dst
                  duration
                  billsec
                  disposition
                }
                totalCount
                status
                message
              }
            }
          `,
        }),
      }
    );

    const graphqlData = await graphqlResponse.json();

    if (graphqlData.errors) {
      return NextResponse.json(
        {
          success: false,
          message:
            graphqlData.errors[0]?.message || "FreePBX API error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(graphqlData);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}