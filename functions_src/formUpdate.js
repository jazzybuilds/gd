const axios = require("axios")

exports.handler = async function (event) {
  const payload = JSON.parse(event.body)

  if (!payload.formId || !payload.sessionId || !payload.referenceId || !payload.type || !payload.status) {
    return {
      statusCode: 422,
      body: "Invalid form payload"
    }
  }

  try {
    const response = await axios.post(`${process.env.SITECORE_ORIGIN}/api/forms/updateformdata`, {
      "FormId": payload.formId,
      "SitecoreFormSessionId": payload.sessionId,
      "Status": payload.status,
      "PaymentMethod": payload.type,
      "WebsiteReferenceID": payload.referenceId
    }, {
      headers: {
        "Authorization": `Basic ${process.env.SITECORE_PROXY_BASIC_AUTH}`
      }
    })
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log({error})
    return {
      statusCode: 502,
      body: "Unable to update form"
    };
  }
};

