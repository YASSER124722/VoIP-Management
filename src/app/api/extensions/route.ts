import { NextResponse } from "next/server";

export async function GET() {
  const tokenResponse = await fetch(
    `${process.env.FREEPBX_URL}/admin/api/api/token`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.FREEPBX_CLIENT_ID}:${process.env.FREEPBX_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "gql:core",
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
    `${process.env.FREEPBX_URL}/admin/api/api/gql`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
 query: `
  query {
    fetchAllExtensions {
      status
      message
      totalCount
      count
      extension {
        extensionId
        tech
        user {
          name
        }
      }
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
      message: graphqlData.errors[0]?.message || "FreePBX API error",
    },
    { status: 500 }
  );
}

  return NextResponse.json(graphqlData);
}

export async function POST(request: Request) {
  const data = await request.json();

  const tokenResponse = await fetch(
    `${process.env.FREEPBX_URL}/admin/api/api/token`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.FREEPBX_CLIENT_ID}:${process.env.FREEPBX_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "gql:core",
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  const graphqlResponse = await fetch(
  `${process.env.FREEPBX_URL}/admin/api/api/gql`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  query: `
    mutation {
      addExtension(
        input: {
          extensionId: ${data.extension}
          name: "${data.name}"
          tech: "pjsip"
          email: "${data.email}"
          umEnable: false
        }
      ) {
        status
        message
      }
    }
  `,
}),
  }
);
const graphqlData = await graphqlResponse.json();

console.log("FreePBX extensions:", graphqlData);

  console.log("FreePBX token response:", tokenData);

 if (graphqlData.errors) {
  return NextResponse.json(
    {
      success: false,
      message: graphqlData.errors[0]?.message || "Failed to create extension",
    },
    { status: 400 }
  );
}

return NextResponse.json({
  success: true,
  message:
    graphqlData.data?.addExtension?.message ||
    "Extension created successfully",
});
}

export async function DELETE(request: Request) {
  const { extensionId } = await request.json();

  const tokenResponse = await fetch(
    `${process.env.FREEPBX_URL}/admin/api/api/token`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.FREEPBX_CLIENT_ID}:${process.env.FREEPBX_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "gql:core",
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  const graphqlResponse = await fetch(
    `${process.env.FREEPBX_URL}/admin/api/api/gql`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            deleteExtension(
              input: {
                extensionId: ${extensionId}
              }
            ) {
              status
              message
            }
          }
        `,
      }),
    }
  );

  const graphqlData = await graphqlResponse.json();

  return NextResponse.json(graphqlData);
}

export async function PUT(request: Request) {
  const data = await request.json();

  const tokenResponse = await fetch(
    `${process.env.FREEPBX_URL}/admin/api/api/token`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.FREEPBX_CLIENT_ID}:${process.env.FREEPBX_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "gql:core",
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  const graphqlResponse = await fetch(
    `${process.env.FREEPBX_URL}/admin/api/api/gql`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            updateExtension(
              input: {
                extensionId: ${data.extensionId}
                name: "${data.name}"
                email: "${data.email}"
                ${data.extPassword ? `extPassword: "${data.extPassword}"` : ""}
              }
            ) {
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
          graphqlData.errors[0]?.message || "Failed to update extension",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message:
      graphqlData.data?.updateExtension?.message ||
      "Extension updated successfully",
  });
}